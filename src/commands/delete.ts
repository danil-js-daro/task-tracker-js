import { showHelp } from '../ui/help.js'
import { deleteTask } from '../repositories/taskRepo.js'

export async function remove(args: string[]): Promise<void> {
  const id = args[0]

  if (!id) {
    return showHelp()
  }

  const numId = Number(id)
  if (isNaN(numId)) {
    console.log('Id должен быть числом')
    return
  }
  const ok = await deleteTask(numId)
  if (!ok) {
    console.log(`Задача #${numId} не найдена`)
    return
  }
  console.log(`Задача #${numId} успешно удалена`)
  return
}
