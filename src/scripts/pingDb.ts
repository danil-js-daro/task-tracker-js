import 'dotenv/config'
import { getPool } from '../db.js'

async function pingDb() {
  const pool = getPool()
  const res = await pool.query('SELECT 1 as ok')
  console.log('DB OK:', res.rows[0]?.ok ?? 1)
  await pool.end()
}

pingDb().catch((err) => {
  console.error('DB ping failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
