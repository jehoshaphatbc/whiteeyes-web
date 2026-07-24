import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const sql = getDb()

  if (!sql) {
    memoryStore.merch = memoryStore.merch.filter((m) => m.id !== id)
    return { message: 'merchandise item deleted' }
  }

  await sql`DELETE FROM merch_items WHERE id = ${id}`
  return { message: 'merchandise item deleted' }
})
