// taskRepo.ts
import type { Pool } from 'pg'
import type { Task, TaskStatus } from '../types.js'

type TaskRow = {
  id: number
  description: string
  status: TaskStatus
  created_at: string | Date
  completed_at: string | Date | null
}

type MarkDoneResult =
  | { kind: 'not_found' }
  | { kind: 'already_done'; task: Task }
  | { kind: 'updated'; task: Task }

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

    const result = await this.#pool.query<TaskRow>(sql, [description])

    const row = result.rows[0]
    if (!row) throw new Error('Failed to create task')

    return mapRow(row)
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

    const result = await this.#pool.query<TaskRow>(sql, [id])
    const row = result.rows[0]

    if (!row) {
      throw new Error('Failed to update task')
    }
    const updatedTask = mapRow(row)

    return { kind: 'updated', task: updatedTask }
  }

  async deleteTask(id: number): Promise<boolean> {
    const sql = `
  DELETE FROM tasks WHERE id = $1
  `

    const result = await this.#pool.query(sql, [id])

    return (result.rowCount ?? 0) > 0
  }

  async getTasksByStatus(status?: TaskStatus): Promise<Task[]> {
    let sql = `
  SELECT id, description, status, created_at, completed_at
    FROM tasks
    ORDER BY id ASC
    `
    let param: unknown[] = []

    if (status) {
      sql = `
    SELECT id, description, status, created_at, completed_at
    FROM tasks
    WHERE status = $1
    ORDER BY id ASC
    `
      param = [status]
    }

    const result = await this.#pool.query<TaskRow>(sql, param)

    return result.rows.map(mapRow)
  }

  async getTaskById(id: number): Promise<Task | null> {
    const sql = `
  SELECT id, description, status, created_at, completed_at
    FROM tasks
    WHERE id = $1
    `

    const result = await this.#pool.query<TaskRow>(sql, [id])

    const row = result.rows[0]

    if (!row) {
      return null
    }
    return mapRow(row)
  }
}
