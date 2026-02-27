import { showHelp } from '../ui/help.js'
import { createTask } from '../repositories/taskRepo.js'

export async function add(args: string[]): Promise<void> {
  const description = args.join(' ').trim()
  if (!description) {
    showHelp()
    return
  }
  const task = await createTask(description)
  console.log(`Добавлено: ${task.id} ${task.description}`)
}
