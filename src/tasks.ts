import 'dotenv/config'
import { createPool } from './db.js'
import { showHelp } from './ui/help.js'
import { TaskRepository } from './repositories/taskRepo.js'
import { TaskCommands } from './commands/taskCommand.js'
import { AppError } from './errors.js'
import { error } from 'node:console'

const pool = createPool()

const repo = new TaskRepository(pool)
const commands = new TaskCommands(repo)

const action = process.argv[2]
const args = process.argv.slice(3)

const handlers = {
  add: (a: string[]) => commands.add(a),
  list: (a: string[]) => commands.list(a),
  done: (a: string[]) => commands.done(a),
  delete: (a: string[]) => commands.remove(a)
}

type CommandName = keyof typeof handlers

if (!action || !(action in handlers)) {
  showHelp()
  process.exit(1)
}

const handler = handlers[action as CommandName]

async function main() {
  try {
    await handler(args)
  } catch (err) {
    if (err instanceof AppError) {
      console.error(`Ошибка [${err.code}]: ${err.message}`)
    } else {
      console.error(`Unexpected error`, err)
    }
    process.exit(1)
  }
}

main()
