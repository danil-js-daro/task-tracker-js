import { loadTasks } from '../storage.js'

function list() {
  const tasks = loadTasks()
  if (tasks.length === 0) {
    console.log('Список пуст')
    return
  }
  tasks.forEach((element) => {
    console.log(`#${element.id} [${element.status}] ${element.desc}`)
  })
}

export { list }
