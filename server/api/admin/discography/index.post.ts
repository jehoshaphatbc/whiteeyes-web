import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const sql = getDb()

  if (!sql) {
    const newItem = { id: Date.now(), ...body, streaming_links: body.streaming_links || [] }
    memoryStore.discography.push(newItem)
    return newItem
  }

  if (body.is_featured) {
    await sql`UPDATE releases SET is_featured = FALSE`
  }

  const [inserted] = await sql`
    INSERT INTO releases (title, release_type, release_date, description, cover_art_url, is_featured, sort_order)
    VALUES (${body.title}, ${body.release_type || 'Album'}, ${body.release_date || ''}, ${body.description || ''}, ${body.cover_art_url || ''}, ${!!body.is_featured}, ${body.sort_order || 0})
    RETURNING *
  `

  if (body.streaming_links && Array.isArray(body.streaming_links)) {
    for (let i = 0; i < body.streaming_links.length; i++) {
      const l = body.streaming_links[i]
      await sql`INSERT INTO streaming_links (release_id, label, url, sort_order) VALUES (${inserted.id}, ${l.label}, ${l.url}, ${i})`
    }
  }

  const links = await sql`SELECT * FROM streaming_links WHERE release_id = ${inserted.id} ORDER BY sort_order ASC`
  return { ...inserted, streaming_links: links }
})
