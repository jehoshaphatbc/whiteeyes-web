import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const sql = getDb()

  if (!sql) {
    if (body.is_featured) {
      memoryStore.videos.forEach((v) => { v.is_featured = false })
    }
    const newItem = { id: Date.now(), ...body }
    memoryStore.videos.push(newItem)
    return newItem
  }

  if (body.is_featured) {
    await sql`UPDATE videos SET is_featured = FALSE`
  }

  const [inserted] = await sql`
    INSERT INTO videos (title, description, youtube_id, is_featured, sort_order)
    VALUES (${body.title}, ${body.description || ''}, ${body.youtube_id}, ${!!body.is_featured}, ${body.sort_order || 0})
    RETURNING *
  `
  return inserted
})
