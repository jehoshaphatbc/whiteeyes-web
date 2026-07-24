import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const sql = getDb()

  if (!sql) {
    const idx = memoryStore.discography.findIndex((r) => r.id === id)
    if (idx !== -1) {
      memoryStore.discography[idx] = { ...memoryStore.discography[idx], ...body }
      return memoryStore.discography[idx]
    }
    return body
  }

  if (body.is_featured) {
    await sql`UPDATE releases SET is_featured = FALSE`
  }

  const [updated] = await sql`
    UPDATE releases SET
      title = ${body.title},
      release_type = ${body.release_type},
      release_date = ${body.release_date},
      description = ${body.description},
      cover_art_url = ${body.cover_art_url},
      is_featured = ${!!body.is_featured},
      sort_order = ${body.sort_order || 0}
    WHERE id = ${id}
    RETURNING *
  `

  if (body.streaming_links && Array.isArray(body.streaming_links)) {
    await sql`DELETE FROM streaming_links WHERE release_id = ${id}`
    for (let i = 0; i < body.streaming_links.length; i++) {
      const l = body.streaming_links[i]
      await sql`INSERT INTO streaming_links (release_id, label, url, sort_order) VALUES (${id}, ${l.label}, ${l.url}, ${i})`
    }
  }

  const links = await sql`SELECT * FROM streaming_links WHERE release_id = ${id} ORDER BY sort_order ASC`
  return { ...updated, streaming_links: links }
})
