import type { Task } from '../types.js'

export function formatCompleted(task: Task): string {
  if (!task.completedAt) {
    return ''
  }
  const date = new Date(task.completedAt)
  return `(completed: ${date.toLocaleString()})`
}
