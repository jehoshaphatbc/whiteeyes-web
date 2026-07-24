import { getDb } from '../database/db'
import { memoryStore } from '../database/schema'

export default defineEventHandler(async () => {
  const sql = getDb()
  if (!sql) return memoryStore.about

  const [about] = await sql`SELECT * FROM abouts WHERE id = 1`
  if (!about) return memoryStore.about

  const milestones = await sql`SELECT * FROM milestones WHERE about_id = 1 ORDER BY sort_order ASC`
  return { ...about, milestones }
})
