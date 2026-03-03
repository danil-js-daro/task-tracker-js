export function parseId(args: string[]): number | null {
  const id = args[0]?.trim()
  if (!id) return null

  const numId = Number(id)

  if (!Number.isInteger(numId) || numId <= 0) {
    return null
  }

  return numId
}
