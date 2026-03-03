export class AppError extends Error {
  code: string
  override cause?: unknown

  constructor(message: string, code = 'APP_ERROR', cause?: unknown) {
    super(message)
    this.code = code
    this.name = this.constructor.name
    this.cause = cause
  }
}

export class ValidationError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, 'VALIDATION_ERROR', cause)
  }
}

export class DbError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, 'DB_ERROR', cause)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, 'NOT_FOUND', cause)
  }
}
