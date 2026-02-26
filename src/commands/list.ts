import { getTasks } from '../repositories/taskRepo.js'

export async function list(_args: string[]): Promise<void> {
  const tasks = await getTasks()
  if (tasks.length === 0) {
    console.log('Список пуст')
    return
  }
  tasks.forEach((task) => console.log(`#${task.id} [${task.status}] ${task.desc}`))
}
