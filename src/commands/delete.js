import { loadTasks, saveTasks } from '../storage.js'
import { showHelp } from '../ui/help.js'

function remove(args) {
  const id = args[0]

  if (!id) {
    return showHelp()
  }

  let numId = Number(id)
  if (isNaN(numId)) {
    console.log('id должен быть числом')
    return
  }
  const tasks = loadTasks()
  const newTasks = tasks.filter((task) => task.id !== numId)
  if (newTasks.length === tasks.length) {
    console.log(`Задача #${numId} не найдена`)
    return
  }
  saveTasks(newTasks)
  console.log(`Задача #${numId} успешно удалена`)
}

export { remove }
