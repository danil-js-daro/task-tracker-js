import { loadTasks, saveTasks } from '../storage.js'
import { showHelp } from '../ui/help.js'

function done(args: string[]): void {
  const id = args[0]
  if (!id) {
    return showHelp()
  }
  const numId = Number(id)
  if (isNaN(numId)) {
    console.log('Id должен быть числом')
    return
  }
  const tasks = loadTasks()
  const task = tasks.find((task) => task.id === numId)

  if (!task) {
    console.log('Задача не найдена')
    return
  }

  if (task.status === 'DONE') {
    console.log('Статус уже DONE')
    return
  }

  task.status = 'DONE'
  saveTasks(tasks)
  console.log(`DONE: #${task.id} ${task.desc}`)
}

export { done }
