import { loadTasks, saveTasks } from '../storage.js'
import { showHelp } from '../ui/help.js'
import type { Task } from '../types.js'

function add(args: string[]): void {
  const desc = args.join(' ').trim()
  if (!desc) {
    showHelp()
    return
  }
  const tasks = loadTasks()

  const maxId = tasks.reduce((max, task) => Math.max(max, task.id), 0)
  const newId = maxId + 1

  const newTask: Task = {
    id: newId,
    desc: desc,
    status: 'TODO',
    createdAt: new Date().toISOString()
  }

  tasks.push(newTask)
  saveTasks(tasks)
  console.log(`Добавлено: ${newId} ${desc}`)
}

export { add }
