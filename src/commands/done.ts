import { showHelp } from '../ui/help.js'
import { markDone } from '../repositories/taskRepo.js'
import type { Task } from '../types.js'
import { formatCompleted } from '../ui/formatters.js'

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
  const res = await markDone(numId)

  switch (res.kind) {
    case 'not_found':
      console.log(`Задача #${numId} не найдена`)
      break
    case 'already_done':
      console.log(`Уже DONE #${res.task.id} ${res.task.description} ${formatCompleted(res.task)}`)
      break
    case 'updated':
      console.log(`DONE #${res.task.id} ${res.task.description} ${formatCompleted(res.task)}`)
      break
  }
}
