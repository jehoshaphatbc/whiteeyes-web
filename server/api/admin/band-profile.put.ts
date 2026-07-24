import { getDb } from '../../database/db'
import { memoryStore } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const sql = getDb()

  if (!sql) {
    memoryStore.bandProfile = { ...memoryStore.bandProfile, ...body }
    return memoryStore.bandProfile
  }

  const [updated] = await sql`
    UPDATE band_profiles SET
      band_name = ${body.band_name},
      logo_url = ${body.logo_url},
      genre_label = ${body.genre_label},
      hero_tagline = ${body.hero_tagline},
      hero_bg_image_url = ${body.hero_bg_image_url},
      spotify_url = ${body.spotify_url},
      youtube_url = ${body.youtube_url}
    WHERE id = 1
    RETURNING *
  `

  return updated || body
})
