import { showHelp } from '../ui/help.js'
import { createTask } from '../repositories/taskRepo.js'

export async function add(args: string[]): Promise<void> {
  const desc = args.join(' ').trim()
  if (!desc) {
    showHelp()
    return
  }
  const task = await createTask(desc)
  console.log(`Добавлено: ${task.id} ${task.desc}`)
}
