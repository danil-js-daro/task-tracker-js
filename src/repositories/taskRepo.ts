import { pool } from '../db.js'
import type { Task } from '../types.js'

type TaskRow = {
  id: number
  description: string
  status: 'TODO' | 'DONE'
  created_at: Date | string
}

export async function getTasks(): Promise<Task[]> {
  // 1) Напиши SQL, который выбирает нужные поля и сортирует по id
  const sql = `SELECT id, description, status, created_at FROM tasks ORDER BY id`

  // 2) Выполни запрос
  const result = await pool.query<TaskRow>(sql)

  // 3) Преврати строки из базы в твой Task[]
  return result.rows.map((row) => {
    // тут маппинг полей: description -> desc, created_at -> createdAt
    return {
      id: row.id,
      desc: row.description,
      status: row.status,
      createdAt:
        row.created_at instanceof Date
          ? row.created_at.toISOString()
          : new Date(row.created_at).toISOString()
    }
  })
}

export async function createTask(desc: string): Promise<Task> {
  const sql = `INSERT INTO tasks (description, status)
    VALUES ($1, 'TODO')
    RETURNING id, description, status, created_at`

  const result = await pool.query<TaskRow>(sql, [desc])

  const row = result.rows[0]

  if (!row) {
    throw new Error('Failed to create task')
  }
  return {
    id: row.id,
    desc: row.description,
    status: row.status,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : new Date(row.created_at).toISOString()
  }
}

export async function markDone(id: number): Promise<Task | null> {
  const sql = `UPDATE tasks
    SET status = 'DONE'
    WHERE id = $1
    RETURNING id, description, status, created_at`

  const result = await pool.query<TaskRow>(sql, [id])
  const row = result.rows[0]

  if (!row) {
    return null
  }
  return {
    id: row.id,
    desc: row.description,
    status: row.status,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : new Date(row.created_at).toISOString()
  }
}

export async function deleteTask(id: number): Promise<boolean> {
  const sql = `DELETE FROM tasks
    WHERE id = $1`

  const result = await pool.query(sql, [id])

  return result.rowCount === 1
}
