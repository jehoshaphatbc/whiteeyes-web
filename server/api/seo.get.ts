import { getDb } from '../database/db'
import { memoryStore } from '../database/schema'

export default defineEventHandler(async () => {
  const sql = getDb()
  if (!sql) return memoryStore.seoSettings

  const [seo] = await sql`SELECT * FROM seo_settings WHERE id = 1`
  return seo || memoryStore.seoSettings
})
