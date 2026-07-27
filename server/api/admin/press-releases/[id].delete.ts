import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')
  const targetId = Number(idParam)

  if (!targetId || isNaN(targetId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const sql = getDb()

  if (sql) {
    const [existing] = await sql`SELECT id FROM press_releases WHERE id = ${targetId}`
    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: 'Press release not found' })
    }

    await sql`DELETE FROM press_releases WHERE id = ${targetId}`
    return { success: true, message: 'Press release deleted successfully' }
  }

  // Memory store fallback
  const idx = memoryStore.pressReleases.findIndex((p: any) => p.id === targetId)
  if (idx === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Press release not found' })
  }

  memoryStore.pressReleases.splice(idx, 1)
  return { success: true, message: 'Press release deleted successfully' }
})
