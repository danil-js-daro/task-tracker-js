const { loadTasks } = require('../storage')

function list() {
  const tasks = loadTasks()
  if (tasks.length === 0) {
    return console.log('Список пуст')
  }
  tasks.forEach((element) => {
    console.log(`#${element.id} [${element.status}] ${element.desc}`)
  })
}

module.exports = { list }
