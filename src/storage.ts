import fs from 'node:fs'
import { filePath } from './config.js'
import type { Task } from './types.js'
import { isTaskArray } from './types.js'

function loadTasks(): Task[] {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]')
    return []
  }
  try {
    const data = fs.readFileSync(filePath, 'utf-8')
    const parsed: unknown = JSON.parse(data)
    if (isTaskArray(parsed)) {
      return parsed
    }
    resetFile()
    return []
  } catch (err) {
    console.log('Ошибка чтения или поврежденный JSON')
    resetFile()
    return []
  }
}

function saveTasks(tasks: Task[]): void {
  const json = JSON.stringify(tasks, null, 2)
  fs.writeFileSync(filePath, json)
  console.log(`Сохраняем ${tasks.length} ${getTaskWord(tasks.length)}`)
}

function resetFile(): void {
  fs.writeFileSync(filePath, '[]')
}

function getTaskWord(count: number): string {
  const mod100 = count % 100
  if (mod100 >= 11 && mod100 <= 14) {
    return 'задач'
  }
  const mod10 = count % 10
  if (mod10 === 1) {
    return 'задачу'
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return 'задачи'
  }
  return 'задач'
}

export { loadTasks, saveTasks }
