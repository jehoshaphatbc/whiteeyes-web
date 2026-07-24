import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const sql = getDb()

  if (!sql) {
    const newItem = { id: Date.now(), ...body }
    memoryStore.artwork.push(newItem)
    return newItem
  }

  const [inserted] = await sql`
    INSERT INTO artwork_items (title, alt_text, category, image_url, sort_order)
    VALUES (${body.title}, ${body.alt_text || ''}, ${body.category || 'Album Art'}, ${body.image_url || ''}, ${body.sort_order || 0})
    RETURNING *
  `
  return inserted
})
