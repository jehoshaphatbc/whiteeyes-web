import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')
  const targetId = Number(idParam)

  if (!targetId || isNaN(targetId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid post ID' })
  }

  const sql = getDb()

  if (sql) {
    const [existing] = await sql`SELECT id FROM blog_posts WHERE id = ${targetId}`
    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: 'Post not found' })
    }

    await sql`DELETE FROM blog_posts WHERE id = ${targetId}`
    return { success: true, message: 'Post deleted successfully' }
  }

  // Memory store fallback
  const postIdx = memoryStore.blogPosts.findIndex((p: any) => p.id === targetId)
  if (postIdx === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  }

  memoryStore.blogPosts.splice(postIdx, 1)
  return { success: true, message: 'Post deleted successfully' }
})
