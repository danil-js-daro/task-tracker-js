// src/errors.ts
export class AppError extends Error {
  code: string

  constructor(message: string, code = 'APP_ERROR') {
    super(message)
    this.code = code
    this.name = this.constructor.name
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR')
  }
}

export class DbError extends AppError {
  constructor(message: string) {
    super(message, 'DB_ERROR')
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 'NOT_FOUND')
  }
}
