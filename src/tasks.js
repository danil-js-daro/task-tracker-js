import { showHelp } from './ui/help.js'
import { add } from './commands/add.js'
import { list } from './commands/list.js'
import { done } from './commands/done.js'
import { remove } from './commands/delete.js'

let action = process.argv[2]
let args = process.argv.slice(3)

if (!action) {
  showHelp()
  process.exit(1)
}

switch (action) {
  case 'add':
    add(args)
    break
  case 'list':
    list()
    break
  case 'done':
    done(args)
    break
  case 'delete':
    remove(args)
    break
  default:
    showHelp()
}
