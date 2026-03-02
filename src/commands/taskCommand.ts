import { showHelp } from '../ui/help.js'
import type { TaskRepository } from '../repositories/taskRepo.js'
import { formatCompleted } from '../ui/formatters.js'
import { parseId } from '../ui/validators.js'
import type { TaskStatus } from '../types.js'

export class TaskCommands {
  #repo: TaskRepository
  constructor(repo: TaskRepository) {
    this.#repo = repo
  }
  async add(args: string[]): Promise<void> {
    const description = args.join(' ').trim()
    if (!description) {
      showHelp()
      return
    }
    const task = await this.#repo.createTask(description)
    console.log(`Добавлено: ${task.id} ${task.description}`)
  }

  async remove(args: string[]): Promise<void> {
    const numId = parseId(args)
    if (numId === null) {
      console.log('Id должен быть положительным числом')
      return
    }
    const ok = await this.#repo.deleteTask(numId)
    if (!ok) {
      console.log(`Задача #${numId} не найдена`)
      return
    }
    console.log(`Задача #${numId} успешно удалена`)
  }

  async done(args: string[]): Promise<void> {
    const numId = parseId(args)
    if (numId === null) {
      console.log('Id должен быть положительным числом')
      return
    }
    const res = await this.#repo.markDone(numId)

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

  async list(args: string[]): Promise<void> {
    const filter = args[0]?.toLowerCase()
    let status: TaskStatus | undefined

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

    const tasks = await this.#repo.getTasksByStatus(status)

    if (tasks.length === 0) {
      console.log('Список пуст')
      return
    }

    tasks.forEach((task) => console.log(`#${task.id} [${task.status}] ${task.description}`))
  }
}
