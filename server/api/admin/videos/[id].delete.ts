import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const sql = getDb()

  if (!sql) {
    memoryStore.videos = memoryStore.videos.filter((v) => v.id !== id)
    return { message: 'video deleted' }
  }

  await sql`DELETE FROM videos WHERE id = ${id}`
  return { message: 'video deleted' }
})
