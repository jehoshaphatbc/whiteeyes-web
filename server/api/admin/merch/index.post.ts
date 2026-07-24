import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const sql = getDb()

  if (!sql) {
    const newItem = { id: Date.now(), ...body }
    memoryStore.merch.push(newItem)
    return newItem
  }

  const [inserted] = await sql`
    INSERT INTO merch_items (name, description, price, whatsapp_number, image_url, sort_order)
    VALUES (${body.name}, ${body.description || ''}, ${body.price || ''}, ${body.whatsapp_number || ''}, ${body.image_url || ''}, ${body.sort_order || 0})
    RETURNING *
  `
  return inserted
})
