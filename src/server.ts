import 'dotenv/config'
import Fastify from 'fastify'
import { createPool } from './db.js'
import { TaskRepository } from './repositories/taskRepo.js'
import { TaskService } from './services/taskService.js'
import type { TaskStatus } from './types.js'

const pool = createPool()
const repo = new TaskRepository(pool)
const service = new TaskService(repo)

const fastify = Fastify({
  logger: true
})

fastify.get('/tasks', async (request, reply) => {
  const query = request.query as { status?: string }
  let status: TaskStatus | undefined
  const statusParam = query.status?.toLowerCase()

  if (statusParam === 'done') {
    status = 'DONE'
  } else if (statusParam === 'todo') {
    status = 'TODO'
  } else if (statusParam === 'all' || !statusParam) {
    status = undefined
  } else {
    reply.code(400)
    return { error: 'Bad request' }
  }

  const tasks = await service.list(status)

  return tasks
})

fastify.post('/tasks', async (request, reply) => {
  const body = request.body as { description?: string }
  const description = body.description?.trim()

  if (typeof description !== 'string' || description === '') {
    reply.code(400)
    return { error: 'Bad request' }
  }

  const task = await service.create(description)
  reply.code(201)
  return task
})

fastify.post('/tasks/:id/done', async (request, reply) => {
  const params = request.params as { id?: string }
  const rawId = Number(params.id)

  if (!Number.isInteger(rawId) || rawId <= 0) {
    reply.code(400)
    return { error: 'Bad request' }
  }

  const res = await service.markDone(rawId)

  switch (res.kind) {
    case 'not_found':
      reply.code(404)
      return { error: 'Not found' }
    case 'already_done':
      return res
    case 'updated':
      return res
  }
})

fastify.delete('/tasks/:id', async (request, reply) => {
  const params = request.params as { id?: string }
  const id = Number(params.id)

  if (!Number.isInteger(id) || id <= 0) {
    reply.code(400)
    return { error: 'Bad request' }
  }

  const ok = await service.delete(id)

  if (!ok) {
    reply.code(404)
    return { error: 'Not found' }
  }
  reply.code(204).send()
})

await fastify.listen({
  port: 3000,
  host: '0.0.0.0'
})
