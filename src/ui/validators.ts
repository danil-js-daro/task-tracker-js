import { ValidationError } from '../errors.js'

export function parseId(args: string[]): number | null {
  const id = args[0]?.trim()
  if (!id) return null

  const numId = Number(id)

  if (!Number.isInteger(numId) || numId <= 0) {
    return null
  }

  return numId
}

export function parseRouteId(id?: string): number {
  if (!id) throw new ValidationError('Invalid id')

  const numId = Number(id)

  if (!Number.isInteger(numId) || numId <= 0) {
    throw new ValidationError('Invalid id')
  }

  return numId
}
