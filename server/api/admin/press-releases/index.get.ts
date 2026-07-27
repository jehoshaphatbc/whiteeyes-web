import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

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

export default defineEventHandler(async () => {
  const sql = getDb()

  if (!sql) {
    return memoryStore.pressReleases.map(normalizePressRelease)
  }

  const items = await sql`
    SELECT * FROM press_releases 
    ORDER BY created_at DESC
  `
  return items.map(normalizePressRelease)
})
