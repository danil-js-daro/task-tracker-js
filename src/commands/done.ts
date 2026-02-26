import { showHelp } from '../ui/help.js'
import { markDone } from '../repositories/taskRepo.js'

export async function done(args: string[]): Promise<void> {
  const id = args[0]
  if (!id) {
    showHelp()
    return
  }
  const numId = Number(id)
  if (isNaN(numId)) {
    console.log('Id должен быть числом')
    return
  }
  const task = await markDone(numId)

  if (task === null) {
    console.log(`Задача #${numId} не найдена`)
    return
  }

  console.log(`DONE: #${task.id} ${task.desc}`)
  return
}
