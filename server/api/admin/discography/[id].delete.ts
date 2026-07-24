import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const sql = getDb()

  if (!sql) {
    memoryStore.discography = memoryStore.discography.filter((r) => r.id !== id)
    return { message: 'release deleted' }
  }

  await sql`DELETE FROM releases WHERE id = ${id}`
  return { message: 'release deleted' }
})
