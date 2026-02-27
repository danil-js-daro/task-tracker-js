// taskRepo.ts
import { getPool } from '../db.js'
import type { Task } from '../types.js'

type TaskRow = {
  id: number
  description: string
  status: 'TODO' | 'DONE'
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

export async function getTasks(): Promise<Task[]> {
  const sql = `
    SELECT id, description, status, created_at, completed_at
    FROM tasks
    ORDER BY id ASC
  `

  const pool = getPool()
  const result = await pool.query<TaskRow>(sql)

  return result.rows.map(mapRow)
}

export async function createTask(description: string): Promise<Task> {
  const sql = `
    INSERT INTO tasks (description, status)
    VALUES ($1, 'TODO')
    RETURNING id, description, status, created_at, completed_at
  `

  const pool = getPool()
  const result = await pool.query<TaskRow>(sql, [description])

  const row = result.rows[0]
  if (!row) throw new Error('Failed to create task')

  return mapRow(row)
}

export async function markDone(id: number): Promise<MarkDoneResult> {
  const existing = await getTaskById(id)

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

  const pool = getPool()
  const result = await pool.query<TaskRow>(sql, [id])
  const row = result.rows[0]

  if (!row) {
    throw new Error('Failed to update task')
  }
  const updatedTask = mapRow(row)

  return { kind: 'updated', task: updatedTask }
}

export async function deleteTask(id: number): Promise<boolean> {
  const sql = `
  DELETE FROM tasks WHERE id = $1
  `

  const pool = getPool()
  const result = await pool.query(sql, [id])

  return result.rowCount === 1
}

export async function getTasksByStatus(status?: 'TODO' | 'DONE'): Promise<Task[]> {
  let sql = `
  SELECT id, description, status, created_at, completed_at
    FROM tasks
    ORDER BY id ASC
    `
  let param: Array<string> = []

  if (status) {
    sql = `
    SELECT id, description, status, created_at, completed_at
    FROM tasks
    WHERE status = $1
    ORDER BY id ASC
    `
    param = [status]
  }

  const pool = getPool()
  const result = await pool.query<TaskRow>(sql, param)

  return result.rows.map(mapRow)
}

export async function getTaskById(id: number): Promise<Task | null> {
  const sql = `
  SELECT id, description, status, created_at, completed_at
    FROM tasks
    WHERE id = $1
    `

  const pool = getPool()
  const result = await pool.query<TaskRow>(sql, [id])

  const row = result.rows[0]

  if (!row) {
    return null
  }
  return mapRow(row)
}
