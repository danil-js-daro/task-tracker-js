import 'dotenv/config'
import { showHelp } from './ui/help.js'
import { add } from './commands/add.js'
import { list } from './commands/list.js'
import { done } from './commands/done.js'
import { remove } from './commands/delete.js'

const action = process.argv[2]
const args = process.argv.slice(3)

const commands = {
  add,
  list,
  done,
  delete: remove
}

if (!action || !(action in commands)) {
  showHelp()
  process.exit(1)
}

type CommandName = keyof typeof commands
const command = commands[action as CommandName]

async function main() {
  try {
    await command(args)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Ошибка:', message)
    process.exit(1)
  }
}

main()
