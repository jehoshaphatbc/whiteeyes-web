import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const sql = getDb()

  if (!sql) {
    if (body.is_featured) {
      memoryStore.videos.forEach((v) => { v.is_featured = false })
    }
    const idx = memoryStore.videos.findIndex((v) => v.id === id)
    if (idx !== -1) {
      memoryStore.videos[idx] = { ...memoryStore.videos[idx], ...body }
      return memoryStore.videos[idx]
    }
    return body
  }

  if (body.is_featured) {
    await sql`UPDATE videos SET is_featured = FALSE`
  }

  const [updated] = await sql`
    UPDATE videos SET
      title = ${body.title},
      description = ${body.description},
      youtube_id = ${body.youtube_id},
      is_featured = ${!!body.is_featured},
      sort_order = ${body.sort_order || 0}
    WHERE id = ${id}
    RETURNING *
  `
  return updated
})
