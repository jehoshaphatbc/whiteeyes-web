import { getDb } from '../../database/db'
import { memoryStore } from '../../database/schema'

export default defineEventHandler(async () => {
  const sql = getDb()

  if (!sql) {
    return memoryStore.pressReleases.filter((pr: any) => pr.is_published)
  }

  const items = await sql`
    SELECT * FROM press_releases 
    WHERE is_published = TRUE
    ORDER BY created_at DESC
  `
  return items
})
