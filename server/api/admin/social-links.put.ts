import { getDb } from '../../database/db'
import { memoryStore } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const sql = getDb()

  if (!sql) {
    memoryStore.socialLinks = { ...memoryStore.socialLinks, ...body }
    return memoryStore.socialLinks
  }

  const [updated] = await sql`
    UPDATE social_links SET
      instagram_url = ${body.instagram_url},
      spotify_url = ${body.spotify_url},
      youtube_url = ${body.youtube_url},
      facebook_url = ${body.facebook_url},
      whatsapp_number = ${body.whatsapp_number},
      closing_headline = ${body.closing_headline}
    WHERE id = 1
    RETURNING *
  `
  return updated || body
})
