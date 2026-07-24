import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const sql = getDb()

  if (!sql) {
    const idx = memoryStore.merch.findIndex((m) => m.id === id)
    if (idx !== -1) {
      memoryStore.merch[idx] = { ...memoryStore.merch[idx], ...body }
      return memoryStore.merch[idx]
    }
    return body
  }

  const [updated] = await sql`
    UPDATE merch_items SET
      name = ${body.name},
      description = ${body.description},
      price = ${body.price},
      whatsapp_number = ${body.whatsapp_number},
      image_url = ${body.image_url},
      sort_order = ${body.sort_order || 0}
    WHERE id = ${id}
    RETURNING *
  `
  return updated
})
