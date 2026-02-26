import 'dotenv/config'
import { pool } from '../db.js'
import { getTasks } from '../repositories/taskRepo.js'

async function main() {
  const tasks = await getTasks()
  console.log(tasks)
}

main()
