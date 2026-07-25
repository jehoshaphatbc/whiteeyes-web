import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

export default defineEventHandler(async () => {
  const sql = getDb()

  if (!sql) {
    return memoryStore.blogPosts
  }

  const posts = await sql`
    SELECT * FROM blog_posts 
    ORDER BY created_at DESC, id DESC
  `
  return posts
})
