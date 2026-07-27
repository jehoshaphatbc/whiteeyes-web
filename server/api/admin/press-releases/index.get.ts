import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

export default defineEventHandler(async () => {
  const sql = getDb()

  if (!sql) {
    return memoryStore.pressReleases
  }

  const items = await sql`
    SELECT * FROM press_releases 
    ORDER BY created_at DESC
  `
  return items
})
