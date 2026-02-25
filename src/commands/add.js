import { loadTasks, saveTasks } from '../storage.js'

function add(args) {
  let desc = args.join(' ').trim()
  if (desc.length === 0) {
    showHelp()
    return
  }
  let tasks = loadTasks()

  //создаем newId для обновления его в desc
  let newId = null
  if (tasks.length === 0) {
    newId = 1
  } else {
    //находим максимальное значение id и создаем новый id max + 1
    let ids = tasks.map((n) => n.id)
    let maxId = ids.reduce((accumulator, currentValue) => Math.max(accumulator, currentValue))
    newId = maxId + 1
  }

  let date = new Date()

  const newTask = {
    id: newId,
    desc: desc,
    status: 'TODO',
    createdAt: date.toISOString()
  }

  tasks.push(newTask)
  saveTasks(tasks)
  console.log(`Добавлено: ${newId} ${desc}`)
}

export { add }
