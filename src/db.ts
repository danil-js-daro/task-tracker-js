import { Pool } from 'pg'
import { AppError } from './errors.js'

export function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new AppError('DATABASE_URL is required', 'CONFIG_ERROR')
  }

  const pool = new Pool({ connectionString })
  return pool
}
