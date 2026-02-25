const fs = require('fs')
const path = require('path')
const { filePath } = require('./config')

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
  console.log('Сохраняем', tasks.length, 'задачи')
}

module.exports = { loadTasks, saveTasks }
