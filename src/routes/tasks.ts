import type { TaskStatus } from '../types.js'
import type { FastifyInstance } from 'fastify'
import type { TaskService } from '../services/taskService.js'
import { parseRouteId } from '../ui/validators.js'

type TasksQuery = { status?: string }
type CreateTaskBody = { description: string }
type TaskIdParams = { id: string }

const createTaskBodySchema = {
  type: 'object',
  required: ['description'],
  additionalProperties: false,
  properties: {
    description: {
      type: 'string'
    }
  }
}

const tasksQuerySchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    status: {
      type: 'string',
      enum: ['done', 'todo', 'all']
    }
  }
}

const taskIdParamsSchema = {
  type: 'object',
  required: ['id'],
  additionalProperties: false,
  properties: {
    id: {
      type: 'string'
    }
  }
}

export function registerTaskRoutes(fastify: FastifyInstance, service: TaskService) {
  fastify.get<{ Querystring: TasksQuery }>(
    '/tasks',
    { schema: { querystring: tasksQuerySchema } },
    async (request, reply) => {
      let status: TaskStatus | undefined
      const statusParam = request.query.status?.toLowerCase()

      if (statusParam === 'done') {
        status = 'DONE'
      } else if (statusParam === 'todo') {
        status = 'TODO'
      }

      const tasks = await service.list(status)

      return tasks
    }
  )

  fastify.post<{ Body: CreateTaskBody }>(
    '/tasks',
    { schema: { body: createTaskBodySchema } },
    async (request, reply) => {
      const description = request.body.description.trim()

      if (description === '') {
        reply.code(400)
        return { error: 'Bad request' }
      }

      const task = await service.create(description)
      reply.code(201)
      return task
    }
  )

  fastify.post<{ Params: TaskIdParams }>(
    '/tasks/:id/done',
    { schema: { params: taskIdParamsSchema } },
    async (request, reply) => {
      const id = parseRouteId(request.params.id)

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
    }
  )

  fastify.delete<{ Params: TaskIdParams }>(
    '/tasks/:id',
    { schema: { params: taskIdParamsSchema } },
    async (request, reply) => {
      const id = parseRouteId(request.params.id)

      const ok = await service.delete(id)

      if (!ok) {
        reply.code(404)
        return { error: 'Not found' }
      }
      return reply.code(204).send()
    }
  )
}
