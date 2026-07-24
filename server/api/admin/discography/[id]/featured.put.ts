import { getDb } from '../../../../database/db'
import { memoryStore } from '../../../../database/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const sql = getDb()

  if (!sql) {
    memoryStore.discography.forEach((r) => {
      r.is_featured = r.id === id
    })
    return { message: 'featured release updated' }
  }

  await sql`UPDATE releases SET is_featured = FALSE`
  await sql`UPDATE releases SET is_featured = TRUE WHERE id = ${id}`
  return { message: 'featured release updated' }
})
