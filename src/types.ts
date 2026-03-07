export type TaskStatus = 'TODO' | 'DONE'

export interface Task {
  id: number
  description: string
  status: TaskStatus
  createdAt: string // ISO строка
  completedAt?: string
}

export type MarkDoneResult =
  | { kind: 'not_found' }
  | { kind: 'already_done'; task: Task }
  | { kind: 'updated'; task: Task }

