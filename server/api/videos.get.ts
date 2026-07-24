import { getDb } from '../database/db'
import { memoryStore } from '../database/schema'

export default defineEventHandler(async () => {
  const sql = getDb()
  if (!sql) return memoryStore.videos
  return await sql`SELECT * FROM videos ORDER BY is_featured DESC, sort_order ASC, id DESC`
})
