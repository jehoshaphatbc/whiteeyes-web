import { getDb } from '../../database/db'
import { memoryStore } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const sql = getDb()

  if (!sql) {
    memoryStore.seoSettings = { ...memoryStore.seoSettings, ...body }
    return memoryStore.seoSettings
  }

  const [updated] = await sql`
    UPDATE seo_settings SET
      meta_title = ${body.meta_title},
      meta_description = ${body.meta_description},
      meta_keywords = ${body.meta_keywords},
      og_title = ${body.og_title},
      og_description = ${body.og_description},
      og_image_url = ${body.og_image_url},
      twitter_card_type = ${body.twitter_card_type},
      canonical_url = ${body.canonical_url}
    WHERE id = 1
    RETURNING *
  `
  return updated || body
})
