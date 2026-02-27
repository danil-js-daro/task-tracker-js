📝 Task Tracker

Небольшой backend-проект на TypeScript с хранением данных в PostgreSQL (через Docker).

Проект реализует полноценный CRUD для задач:
	•	add
	•	list (с фильтрацией)
	•	done
	•	delete

🏗 Архитектура разделена на слои
	•	CLI (commands)
	•	Repository (работа с БД)
	•	DB layer (pool)
	•	UI-форматирование
	•	Types

⸻

🚀 Технологии
	•	Node.js
	•	TypeScript
	•	PostgreSQL
	•	Docker
	•	dotenv
	•	Repository pattern
	•	Discriminated union (для markDone)

⸻

📦 Установка

1. Клонировать проект
git clone <repo-url>
cd task-tracker-js

2. Установить зависимости
npm install

3. Создать .env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/tasktracker

🐳 Запуск PostgreSQL через Docker
docker compose up -d

Проверить подключение можно через:
npx tsx src/scripts/pingDb.ts

🗄 Структура таблицы
CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'TODO',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

🖥 CLI команды

➕ Добавить задачу
npm run dev -- add "Описание задачи"

📋 Список задач

Все задачи:
npm run dev -- list

Только DONE:
npm run dev -- list done

Только TODO:
npm run dev -- list todo

✅ Завершить задачу
npm run dev -- done <id>

Поведение:
	•	если не существует → “не найдена”
	•	если уже DONE → “уже DONE”
	•	если TODO → обновляется статус + completed_at

❌ Удалить задачу
npm run dev -- delete <id>

🏗 Архитектура
src/
  commands/        # CLI команды
  repositories/    # SQL логика
  ui/              # форматирование вывода
  db.ts            # подключение к БД
  types.ts         # общие типы
  tasks.ts         # entry point

  📚 Что реализовано
	•	TypeScript без any
	•	PostgreSQL через Docker
	•	Repository pattern
	•	Discriminated unions
	•	completed_at логика с COALESCE
	•	Разделение слоёв
	•	Централизованная обработка ошибок
	•	Форматирование вывода через UI-слой

⸻

🎯 Планы
	•	REST API поверх текущей логики
	•	Тестирование через Bruno
	•	Frontend интерфейс

⸻

🧠 Цель проекта

Проект создан для изучения:
	•	TypeScript
	•	PostgreSQL
	•	Backend архитектуры
	•	Разделения слоёв
	•	Async / Await
	•	Работа с Docker
