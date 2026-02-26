export type TaskStatus = 'TODO' | 'DONE'

export interface Task {
  id: number
  desc: string
  status: TaskStatus
  createdAt: string // ISO строка
}

export function isTaskArray(value: unknown): value is Task[] {
  if (!Array.isArray(value)) return false

  return value.every((item) => {
    return (
      typeof item === 'object' &&
      item !== null &&
      'id' in item &&
      typeof (item as any).id === 'number' &&
      'desc' in item &&
      typeof (item as any).desc === 'string' &&
      'status' in item &&
      ((item as any).status === 'TODO' || (item as any).status === 'DONE') &&
      'createdAt' in item &&
      typeof (item as any).createdAt === 'string'
    )
  })
}
