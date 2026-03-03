import 'dotenv/config'
import { createPool } from './db.js'
import { showHelp } from './ui/help.js'
import { TaskRepository } from './repositories/taskRepo.js'
import { TaskCommands } from './commands/taskCommand.js'
import { TaskService } from './services/taskService.js'
import { AppError } from './errors.js'

type Action = 'add' | 'list' | 'done' | 'delete'

function isAction(value: string | undefined): value is Action {
  return value === 'add' || value === 'list' || value === 'done' || value === 'delete'
}

async function main() {
  const actionRaw = process.argv[2]
  const args = process.argv.slice(3)

  // 1) Сначала проверяем команду. Никакой БД до валидации.
  if (!isAction(actionRaw)) {
    showHelp()
    process.exit(1)
  }

  // 2) Команда валидна → теперь можно поднимать зависимости.
  const pool = createPool()
  const repo = new TaskRepository(pool)
  const service = new TaskService(repo)
  const commands = new TaskCommands(service)

  // 3) Хэндлеры строим после создания commands (иначе будет ReferenceError).
  const handlers: Record<Action, (a: string[]) => Promise<void>> = {
    add: (a) => commands.add(a),
    list: (a) => commands.list(a),
    done: (a) => commands.done(a),
    delete: (a) => commands.remove(a)
  }

  try {
    await handlers[actionRaw](args)
  } catch (err) {
    if (err instanceof AppError) {
      console.error(`Ошибка [${err.code}]: ${err.message}`)
      if (err.cause) console.error('Cause:', err.cause)
    } else {
      console.error('Unexpected error:', err)
    }
    process.exit(1)
  } finally {
    // 4) Красиво закрываем пул, чтобы не висел процесс.
    await pool.end().catch(() => {})
  }
}

main()
