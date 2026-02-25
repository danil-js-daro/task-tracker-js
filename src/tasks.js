const { showHelp } = require('./ui/help')
const { add } = require('./commands/add')
const { list } = require('./commands/list')
const { done } = require('./commands/done')
const { remove } = require('./commands/delete')

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
