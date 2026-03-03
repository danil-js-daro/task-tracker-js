// taskRepo.ts
import type { Pool } from 'pg'
import type { Task, TaskStatus, MarkDoneResult } from '../types.js'
import { DbError } from '../errors.js'

type TaskRow = {
  id: number
  description: string
  status: TaskStatus
  created_at: string | Date
  completed_at: string | Date | null
}

function toIso(value: string | Date): string {
  if (value instanceof Date) return value.toISOString()
  return new Date(value).toISOString()
}

function mapRow(row: TaskRow): Task {
  return {
    id: row.id,
    description: row.description,
    status: row.status,
    createdAt: toIso(row.created_at),
    ...(row.completed_at ? { completedAt: toIso(row.completed_at) } : {})
  }
}

export class TaskRepository {
  #pool!: Pool
  constructor(pool: Pool) {
    this.#pool = pool
  }

  async createTask(description: string): Promise<Task> {
    const sql = `
    INSERT INTO tasks (description, status)
    VALUES ($1, 'TODO')
    RETURNING id, description, status, created_at, completed_at
  `
    try {
      const result = await this.#pool.query<TaskRow>(sql, [description])

      const row = result.rows[0]
      if (!row) throw new DbError('Insert returned no row"')

      return mapRow(row)
    } catch (err) {
      if (err instanceof DbError) {
        throw err
      } else {
        throw new DbError('Failed to create task', err)
      }
    }
  }

  async markDone(id: number): Promise<MarkDoneResult> {
    const existing = await this.getTaskById(id)

    if (existing === null) {
      return {
        kind: 'not_found'
      }
    }
    if (existing.status === 'DONE') {
      return { kind: 'already_done', task: existing }
    }

    const sql = `
  UPDATE tasks
  SET
    status = 'DONE',
    completed_at = COALESCE(completed_at, NOW())
  WHERE id = $1
  RETURNING id, description, status, created_at, completed_at
  `
    try {
      const result = await this.#pool.query<TaskRow>(sql, [id])
      const row = result.rows[0]

      if (!row) {
        return { kind: 'not_found' }
      }

      const updatedTask = mapRow(row)

      return { kind: 'updated', task: updatedTask }
    } catch (err) {
      if (err instanceof DbError) {
        throw err
      } else {
        throw new DbError('Failed to mark task as done', err)
      }
    }
  }

  async deleteTask(id: number): Promise<boolean> {
    const sql = `
  DELETE FROM tasks WHERE id = $1
  `
    try {
      const result = await this.#pool.query(sql, [id])

      return (result.rowCount ?? 0) > 0
    } catch (err) {
      if (err instanceof DbError) {
        throw err
      } else {
        throw new DbError('Failed to delete task from database', err)
      }
    }
  }

  async getTasksByStatus(status?: TaskStatus): Promise<Task[]> {
    let sql = `
  SELECT id, description, status, created_at, completed_at
    FROM tasks
    ORDER BY id ASC
    `
    let params: Array<string> = []

    if (status) {
      sql = `
    SELECT id, description, status, created_at, completed_at
    FROM tasks
    WHERE status = $1
    ORDER BY id ASC
    `
      params = [status]
    }

    try {
      const result = await this.#pool.query<TaskRow>(sql, params)

      return result.rows.map(mapRow)
    } catch (err) {
      if (err instanceof DbError) {
        throw err
      } else {
        throw new DbError('Failed to fetch tasks', err)
      }
    }
  }

  async getTaskById(id: number): Promise<Task | null> {
    const sql = `
  SELECT id, description, status, created_at, completed_at
    FROM tasks
    WHERE id = $1
    `
    try {
      const result = await this.#pool.query<TaskRow>(sql, [id])

      const row = result.rows[0]

      if (!row) {
        return null
      }
      return mapRow(row)
    } catch (err) {
      if (err instanceof DbError) {
        throw err
      } else {
        throw new DbError('Failed to fetch task by id', err)
      }
    }
  }
}
