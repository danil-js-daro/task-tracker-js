import { loadTasks, saveTasks } from '../storage.js'
import { showHelp } from '../ui/help.js'

function done(args) {
  const id = args[0]
  if (!id) {
    return showHelp()
  }
  let numId = Number(id)
  if (isNaN(numId)) {
    console.log('Id должен быть числом')
    return
  }
  const tasks = loadTasks()
  let task = tasks.find((item) => item.id === numId)

  if (task === undefined) {
    console.log('Задача не найдена')
    return
  }

  if (task.status === 'DONE') {
    console.log('Статус уже DONE')
    return
  }

  task.status = 'DONE'
  saveTasks(tasks)
  console.log('Статус успешно изменен')

  console.log(`DONE: #${task.id} ${task.desc}`)
}

export { done }
