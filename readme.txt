Task Tracker (TypeScript + PostgreSQL + Fastify)

Проект для управления задачами с двумя интерфейсами:
1. CLI
2. REST API

Данные хранятся в PostgreSQL, локально удобно запускать через Docker Compose.

Технологии
1. Node.js + TypeScript
2. PostgreSQL (`pg`)
3. Fastify
4. Docker Compose
5. dotenv

Функциональность
1. Создание задачи
2. Получение списка задач (все / `TODO` / `DONE`)
3. Завершение задачи (`done`)
4. Удаление задачи

Статусы задач
1. `TODO`
2. `DONE`

Подготовка
1. Установить зависимости:
`npm install`
2. Поднять базу:
`docker compose up -d`
3. Создать `.env` в корне проекта:
`DATABASE_URL=postgres://tasktracker:tasktracker@localhost:5432/tasktracker`

База и схема
1. Контейнер БД описан в `compose.yml`.
2. Инициализация таблицы выполняется из `sql/init.sql` при первом старте контейнера с пустым volume.

CLI запуск
Скрипт:
`npm run dev:cli -- <command>`

Команды:
1. Добавить:
`npm run dev:cli -- add "Описание задачи"`
2. Список всех:
`npm run dev:cli -- list`
3. Список DONE:
`npm run dev:cli -- list done`
4. Список TODO:
`npm run dev:cli -- list todo`
5. Завершить:
`npm run dev:cli -- done 1`
6. Удалить:
`npm run dev:cli -- delete 1`

REST API запуск
Скрипт разработки:
`npm run dev:server`

По умолчанию сервер стартует на порту `3000` (или `PORT` из окружения).

REST API endpoints
1. `GET /tasks?status=all|todo|done`
2. `POST /tasks`
Body:
`{ "description": "Купить молоко" }`
3. `POST /tasks/:id/done`
4. `DELETE /tasks/:id`

Примеры curl
1. Создать задачу:
`curl -X POST http://localhost:3000/tasks -H "content-type: application/json" -d '{"description":"Купить молоко"}'`
2. Получить список:
`curl "http://localhost:3000/tasks?status=all"`
3. Завершить задачу:
`curl -X POST http://localhost:3000/tasks/1/done`
4. Удалить задачу:
`curl -X DELETE http://localhost:3000/tasks/1`

Структура проекта
`src/tasks.ts` - entrypoint CLI  
`src/server.ts` - entrypoint HTTP API  
`src/commands/` - обработчики CLI-команд  
`src/routes/` - HTTP-роуты Fastify  
`src/services/` - service-слой  
`src/repositories/` - работа с БД  
`src/ui/` - валидация/форматирование для CLI и роутов  
`src/types.ts` - типы домена  
`src/errors.ts` - доменные ошибки  
`src/db.ts` - создание пула PostgreSQL  
`sql/init.sql` - инициализация таблицы `tasks`
