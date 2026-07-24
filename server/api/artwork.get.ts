import { getDb } from '../database/db'
import { memoryStore } from '../database/schema'

export default defineEventHandler(async () => {
  const sql = getDb()
  if (!sql) return memoryStore.artwork
  return await sql`SELECT * FROM artwork_items ORDER BY sort_order ASC, id DESC`
})
