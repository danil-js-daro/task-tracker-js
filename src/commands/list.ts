import { loadTasks } from '../storage.js'

function list(): void {
  const tasks = loadTasks()
  if (tasks.length === 0) {
    console.log('Список пуст')
    return
  }
  tasks.forEach((task) => console.log(`#${task.id} [${task.status}] ${task.desc}`))
}

export { list }
