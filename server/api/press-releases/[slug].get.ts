import { getDb } from '../../database/db'
import { memoryStore } from '../../database/schema'

function parseJsonField(field: any) {
  if (!field) return []
  if (typeof field === 'string') {
    try {
      return JSON.parse(field)
    } catch {
      return []
    }
  }
  return field
}

function normalizePressRelease(item: any) {
  if (!item) return item
  return {
    ...item,
    personnel_members: parseJsonField(item.personnel_members),
    music_credits: parseJsonField(item.music_credits),
    feature_points: parseJsonField(item.feature_points),
    legacy_points: parseJsonField(item.legacy_points),
    current_points: parseJsonField(item.current_points),
  }
}

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
    return normalizePressRelease(item)
  }

  const [item] = await sql`
    SELECT * FROM press_releases 
    WHERE slug = ${slug} AND is_published = TRUE
    LIMIT 1
  `

  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'Press release transmission not found' })
  }

  return normalizePressRelease(item)
})
