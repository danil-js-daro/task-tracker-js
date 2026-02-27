import { getTasks } from '../repositories/taskRepo.js'
import { getTasksByStatus } from '../repositories/taskRepo.js'
import { showHelp } from '../ui/help.js'

export async function list(args: string[]): Promise<void> {
  let filter: string | undefined = args[0]?.toLowerCase()
  let status: 'TODO' | 'DONE' | undefined

  if (!filter || filter === 'all') {
    status = undefined
  } else if (filter === 'done') {
    status = 'DONE'
  } else if (filter === 'todo') {
    status = 'TODO'
  } else {
    showHelp()
    return
  }

  const tasks = await getTasksByStatus(status)

  if (tasks.length === 0) {
    console.log('Список пуст')
    return
  }

  tasks.forEach((task) => console.log(`#${task.id} [${task.status}] ${task.description}`))
}
