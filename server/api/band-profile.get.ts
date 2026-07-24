import { getDb } from '../database/db'
import { memoryStore } from '../database/schema'

export default defineEventHandler(async () => {
  const sql = getDb()
  if (!sql) return memoryStore.bandProfile

  const [profile] = await sql`SELECT * FROM band_profiles WHERE id = 1`
  return profile || memoryStore.bandProfile
})
