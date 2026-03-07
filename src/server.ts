import 'dotenv/config'
import Fastify from 'fastify'
import { createPool } from './db.js'
import { TaskRepository } from './repositories/taskRepo.js'
import { TaskService } from './services/taskService.js'
import { registerTaskRoutes } from './routes/tasks.js'
import { ValidationError, AppError } from './errors.js'

function hasStatusCode(error: unknown): error is { statusCode: number; message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    'message' in error &&
    typeof error.statusCode === 'number' &&
    typeof error.message === 'string'
  )
}

async function start() {
  try {
    const pool = createPool()
    const repo = new TaskRepository(pool)
    const service = new TaskService(repo)
    const PORT = Number(process.env.PORT) || 3000

    const fastify = Fastify({
      logger: true
    })

    fastify.setErrorHandler((error, request, reply) => {
      if (error instanceof ValidationError) {
        return reply.code(400).send({ error: error.message })
      }

      if (error instanceof AppError) {
        request.log.error(error)
        return reply.code(500).send({ error: error.message })
      }

      if (hasStatusCode(error)) {
        request.log.error(error)
        return reply.code(error.statusCode).send({ error: error.message })
      }

      request.log.error(error)
      return reply.code(500).send({ error: 'Internal server error' })
    })

    registerTaskRoutes(fastify, service)

    await fastify.listen({
      port: PORT,
      host: '0.0.0.0'
    })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()
