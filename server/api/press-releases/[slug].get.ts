import { getDb } from '../../database/db'
import { memoryStore } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }

  const sql = getDb()

  if (!sql) {
    const item = memoryStore.pressReleases.find((pr: any) => pr.slug === slug && pr.is_published)
    if (!item) {
      throw createError({ statusCode: 404, statusMessage: 'Press release transmission not found' })
    }
    return item
  }

  const [item] = await sql`
    SELECT * FROM press_releases 
    WHERE slug = ${slug} AND is_published = TRUE
    LIMIT 1
  `

  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'Press release transmission not found' })
  }

  return item
})
