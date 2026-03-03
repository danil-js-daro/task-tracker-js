import { TaskRepository } from '../repositories/taskRepo.js'
import type { Task, TaskStatus, MarkDoneResult } from '../types.js'

export class TaskService {
  #repo: TaskRepository
  constructor(repo: TaskRepository) {
    this.#repo = repo
  }
  create(description: string): Promise<Task> {
    return this.#repo.createTask(description)
  }
  list(status?: TaskStatus): Promise<Task[]> {
    return this.#repo.getTasksByStatus(status)
  }
  markDone(id: number): Promise<MarkDoneResult> {
    return this.#repo.markDone(id)
  }
  delete(id: number): Promise<boolean> {
    return this.#repo.deleteTask(id)
  }
}
