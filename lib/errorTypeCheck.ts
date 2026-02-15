function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as Error).message)
  }
  return 'একটা অজানা সমস্যা হয়েছে'
}
export default getErrorMessage
