import { showHelp } from '../ui/help.js'
import { formatCompleted } from '../ui/formatters.js'
import { parseId } from '../ui/validators.js'
import type { TaskStatus } from '../types.js'
import { TaskService } from '../services/taskService.js'

export class TaskCommands {
  #service: TaskService
  constructor(service: TaskService) {
    this.#service = service
  }
  async add(args: string[]): Promise<void> {
    const description = args.join(' ').trim()
    if (!description) {
      showHelp()
      return
    }
    const task = await this.#service.create(description)
    console.log(`Добавлено: ${task.id} ${task.description}`)
  }

  async remove(args: string[]): Promise<void> {
    const numId = parseId(args)
    if (numId === null) {
      console.log('Id должен быть положительным числом')
      return
    }
    const ok = await this.#service.delete(numId)
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
    const res = await this.#service.markDone(numId)

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

    const tasks = await this.#service.list(status)

    if (tasks.length === 0) {
      console.log('Список пуст')
      return
    }

    tasks.forEach((task) => console.log(`#${task.id} [${task.status}] ${task.description}`))
  }
}
