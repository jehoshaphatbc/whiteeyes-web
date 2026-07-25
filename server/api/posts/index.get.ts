import { getDb } from '../../database/db'
import { memoryStore } from '../../database/schema'

export default defineEventHandler(async () => {
  const sql = getDb()

  if (!sql) {
    return memoryStore.blogPosts.filter((p: any) => p.is_published)
  }

  const posts = await sql`
    SELECT id, title, slug, excerpt, cover_image_url, author, category, is_published, created_at
    FROM blog_posts
    WHERE is_published = TRUE
    ORDER BY created_at DESC, id DESC
  `
  return posts
})
