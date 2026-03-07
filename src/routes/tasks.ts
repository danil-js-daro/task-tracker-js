import type { TaskStatus } from '../types.js'
import type { FastifyInstance } from 'fastify'
import type { TaskService } from '../services/taskService.js'
import { parseRouteId } from '../ui/validators.js'

export function registerTaskRoutes(fastify: FastifyInstance, service: TaskService) {
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
    const id = parseRouteId(params.id)

    const res = await service.markDone(id)

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
    const id = parseRouteId(params.id)

    const ok = await service.delete(id)

    if (!ok) {
      reply.code(404)
      return { error: 'Not found' }
    }
    return reply.code(204).send()
  })
}
