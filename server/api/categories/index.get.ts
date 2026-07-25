import { getDb } from '../../database/db'
import { memoryStore } from '../../database/schema'

export default defineEventHandler(async () => {
  const sql = getDb()

  if (!sql) {
    return memoryStore.blogCategories
  }

  const categories = await sql`
    SELECT * FROM blog_categories 
    ORDER BY name ASC
  `
  return categories
})
