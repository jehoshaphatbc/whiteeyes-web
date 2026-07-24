import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const sql = getDb()

  if (!sql) {
    const idx = memoryStore.artwork.findIndex((a) => a.id === id)
    if (idx !== -1) {
      memoryStore.artwork[idx] = { ...memoryStore.artwork[idx], ...body }
      return memoryStore.artwork[idx]
    }
    return body
  }

  const [updated] = await sql`
    UPDATE artwork_items SET
      title = ${body.title},
      alt_text = ${body.alt_text},
      category = ${body.category},
      image_url = ${body.image_url},
      sort_order = ${body.sort_order || 0}
    WHERE id = ${id}
    RETURNING *
  `
  return updated
})
