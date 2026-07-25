import { getDb } from '../../database/db'
import { memoryStore } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Post slug is required' })
  }

  const sql = getDb()

  if (!sql) {
    const post = memoryStore.blogPosts.find((p: any) => p.slug === slug && p.is_published)
    if (!post) {
      throw createError({ statusCode: 404, statusMessage: 'Blog post not found' })
    }
    return post
  }

  const [post] = await sql`
    SELECT * FROM blog_posts 
    WHERE slug = ${slug} AND is_published = TRUE
  `

  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Blog post not found' })
  }

  return post
})
