import { getDb } from '../../database/db'
import { memoryStore } from '../../database/schema'

export default defineEventHandler(async () => {
  const sql = getDb()
  if (!sql) return memoryStore.discography

  const releases = await sql`SELECT * FROM releases ORDER BY sort_order ASC, id DESC`
  const links = await sql`SELECT * FROM streaming_links ORDER BY sort_order ASC`

  return releases.map((r) => ({
    ...r,
    streaming_links: links.filter((l) => l.release_id === r.id),
  }))
})
