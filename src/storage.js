import fs from 'node:fs'
import { filePath } from './config.js'

function loadTasks() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]')
    return []
  }
  try {
    const data = fs.readFileSync(filePath, 'utf-8')
    let tasks = JSON.parse(data)
    if (Array.isArray(tasks)) {
      return tasks
    }
    fs.writeFileSync(filePath, '[]')
    return []
  } catch (err) {
    console.log('Ошибка чтения или поврежденный JSON')
    fs.writeFileSync(filePath, '[]')
    return []
  }
}

function saveTasks(tasks) {
  if (!Array.isArray(tasks)) {
    return
  }

  const json = JSON.stringify(tasks, null, 2)
  fs.writeFileSync(filePath, json)
  if (tasks.length >= 2) {
    console.log('Сохраняем', tasks.length, 'задачи')
    return
  }
  console.log('Сохраняем', tasks.length, 'задачу')
}

export { loadTasks, saveTasks }
