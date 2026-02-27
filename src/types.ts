export type TaskStatus = 'TODO' | 'DONE'

export interface Task {
  id: number
  description: string
  status: TaskStatus
  createdAt: string // ISO строка
  completedAt?: string
}
