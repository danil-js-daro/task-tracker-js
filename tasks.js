const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'task.json')
let action = process.argv[2]
let args = process.argv.slice(3)

function showHelp() {
  console.log(`
    Использование:
    node tasks.js add "описание"
    node tasks.js list
    node tasks.js done <id>
    node tasks.js delete <id>
        `)
}

if (!action) {
  showHelp()
  process.exit(1)
}

switch (action) {
  case 'add':
    add()
    break
  case 'list':
    loadTasks()
    break
  case 'done':
    break
  case 'delete':
    break
  default:
    showHelp()
}

/* {
  "id": 1, // генерируешь последовательно
  "description": "Купить хлеб", // должен ввести пользователь
  "status": "todo", // по дефолту в TODO, метод done переводит в done
  "createdAt": "2023-10-27T10:00:00Z" // автоматически заполняет при добавлении задачи
} */

//1. валидное добавление json объектов в task.json, пока там мешанина
//2. автоматическая генерация id

function add() {
  let desc = args.join(' ').trim()
  if (desc.length === 0) {
    showHelp()
    return
  }
  let tasks = loadTasks()

  //создаем newId для обновления его в desc
  let newId = null
  if (tasks.length === 0) {
    newId = 1
  } else {
    //находим максимальное значение id и создаем новый id max + 1
    let ids = tasks.map((n) => n.id)
    let maxId = ids.reduce((accumulator, currentValue) => Math.max(accumulator, currentValue))
    newId = maxId + 1
  }

  let date = new Date()

  const newTask = {
    id: newId,
    desc: desc,
    status: 'TODO',
    createdAt: date.toISOString()
  }

  tasks.push(newTask)
  saveTasks(tasks)
  console.log('Добавлено: #id описание')
}

function loadTasks() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]')
    return []
  }
  try {
    const data = fs.readFileSync(filePath, 'utf-8')
    let task = JSON.parse(data)
    if (Array.isArray(task)) {
      return task
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
    return console.log('Error')
  }

  let task = JSON.stringify(tasks, null, 2)
  fs.filePath()
}
