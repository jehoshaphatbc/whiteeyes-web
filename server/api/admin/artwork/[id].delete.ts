import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const sql = getDb()

  if (!sql) {
    memoryStore.artwork = memoryStore.artwork.filter((a) => a.id !== id)
    return { message: 'artwork item deleted' }
  }

  await sql`DELETE FROM artwork_items WHERE id = ${id}`
  return { message: 'artwork item deleted' }
})
