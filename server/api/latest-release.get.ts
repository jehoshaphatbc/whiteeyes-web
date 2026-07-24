import { getDb } from '../database/db'
import { memoryStore } from '../database/schema'

export default defineEventHandler(async () => {
  const sql = getDb()
  if (!sql) return memoryStore.latestRelease

  const [featured] = await sql`SELECT * FROM releases WHERE is_featured = TRUE LIMIT 1`
  const release = featured || (await sql`SELECT * FROM releases ORDER BY sort_order ASC, id DESC LIMIT 1`)[0]

  if (!release) return memoryStore.latestRelease

  const links = await sql`SELECT * FROM streaming_links WHERE release_id = ${release.id} ORDER BY sort_order ASC`
  return { ...release, streaming_links: links }
})
