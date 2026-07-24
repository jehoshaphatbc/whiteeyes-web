import { getDb } from '../database/db'
import { memoryStore } from '../database/schema'

export default defineEventHandler(async () => {
  const sql = getDb()
  if (!sql) return memoryStore.socialLinks

  const [links] = await sql`SELECT * FROM social_links WHERE id = 1`
  return links || memoryStore.socialLinks
})
