import { getDb } from '../../../database/db'
import { memoryStore, ensureDbSchema } from '../../../database/schema'

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

function parseJsonField(field: any) {
  if (!field) return []
  if (typeof field === 'string') {
    try {
      return JSON.parse(field)
    } catch {
      return []
    }
  }
  return field
}

function normalizePressRelease(item: any) {
  if (!item) return item
  return {
    ...item,
    personnel_members: parseJsonField(item.personnel_members),
    music_credits: parseJsonField(item.music_credits),
    feature_points: parseJsonField(item.feature_points),
    legacy_points: parseJsonField(item.legacy_points),
    current_points: parseJsonField(item.current_points),
  }
}

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')
  const targetId = Number(idParam)

  if (!targetId || isNaN(targetId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const body = await readBody(event)
  const sql = getDb()

  if (sql) {
    await ensureDbSchema()

    const [existing] = await sql`SELECT * FROM press_releases WHERE id = ${targetId}`
    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: 'Press release not found' })
    }

    let cleanSlug = existing.slug
    if (body.slug) {
      cleanSlug = slugify(body.slug)
    } else if (body.title) {
      cleanSlug = slugify(body.title)
    }

    const featurePoints = body.feature_points !== undefined 
      ? (Array.isArray(body.feature_points) ? body.feature_points : [])
      : parseJsonField(existing.feature_points)

    const legacyPoints = body.legacy_points !== undefined 
      ? (Array.isArray(body.legacy_points) ? body.legacy_points : [])
      : parseJsonField(existing.legacy_points)

    const currentPoints = body.current_points !== undefined 
      ? (Array.isArray(body.current_points) ? body.current_points : [])
      : parseJsonField(existing.current_points)

    const personnelMembers = body.personnel_members !== undefined 
      ? (Array.isArray(body.personnel_members) ? body.personnel_members : [])
      : parseJsonField(existing.personnel_members)

    const musicCredits = body.music_credits !== undefined 
      ? (Array.isArray(body.music_credits) ? body.music_credits : [])
      : parseJsonField(existing.music_credits)

    const [updated] = await sql`
      UPDATE press_releases SET
        title = ${body.title !== undefined ? body.title : existing.title},
        subtitle = ${body.subtitle !== undefined ? body.subtitle : existing.subtitle},
        slug = ${cleanSlug},
        cover_image_url = ${body.cover_image_url !== undefined ? body.cover_image_url : existing.cover_image_url},
        hero_bg_url = ${body.hero_bg_url !== undefined ? body.hero_bg_url : existing.hero_bg_url},
        release_date = ${body.release_date !== undefined ? body.release_date : existing.release_date},
        genre = ${body.genre !== undefined ? body.genre : existing.genre},
        producer = ${body.producer !== undefined ? body.producer : existing.producer},
        label = ${body.label !== undefined ? body.label : existing.label},
        listen_url = ${body.listen_url !== undefined ? body.listen_url : existing.listen_url},
        video_url = ${body.video_url !== undefined ? body.video_url : existing.video_url},
        press_kit_url = ${body.press_kit_url !== undefined ? body.press_kit_url : existing.press_kit_url},
        intro_headline = ${body.intro_headline !== undefined ? body.intro_headline : existing.intro_headline},
        intro_body = ${body.intro_body !== undefined ? body.intro_body : existing.intro_body},
        highlight_title = ${body.highlight_title !== undefined ? body.highlight_title : existing.highlight_title},
        highlight_body = ${body.highlight_body !== undefined ? body.highlight_body : existing.highlight_body},
        feature_title = ${body.feature_title !== undefined ? body.feature_title : existing.feature_title},
        feature_body = ${body.feature_body !== undefined ? body.feature_body : existing.feature_body},
        feature_image_url = ${body.feature_image_url !== undefined ? body.feature_image_url : existing.feature_image_url},
        feature_points = ${sql.json(featurePoints)},
        legacy_title = ${body.legacy_title !== undefined ? body.legacy_title : existing.legacy_title},
        legacy_points = ${sql.json(legacyPoints)},
        current_title = ${body.current_title !== undefined ? body.current_title : existing.current_title},
        current_points = ${sql.json(currentPoints)},
        sound_character = ${body.sound_character !== undefined ? body.sound_character : existing.sound_character},
        quote_text = ${body.quote_text !== undefined ? body.quote_text : existing.quote_text},
        quote_author = ${body.quote_author !== undefined ? body.quote_author : existing.quote_author},
        personnel_body = ${body.personnel_body !== undefined ? body.personnel_body : existing.personnel_body},
        personnel_members = ${sql.json(personnelMembers)},
        contact_phone = ${body.contact_phone !== undefined ? body.contact_phone : existing.contact_phone},
        social_instagram = ${body.social_instagram !== undefined ? body.social_instagram : existing.social_instagram},
        social_facebook = ${body.social_facebook !== undefined ? body.social_facebook : existing.social_facebook},
        social_youtube = ${body.social_youtube !== undefined ? body.social_youtube : existing.social_youtube},
        discography_summary = ${body.discography_summary !== undefined ? body.discography_summary : existing.discography_summary},
        music_credits = ${sql.json(musicCredits)},
        lyrics = ${body.lyrics !== undefined ? body.lyrics : existing.lyrics},
        video_embed_url = ${body.video_embed_url !== undefined ? body.video_embed_url : existing.video_embed_url},
        tracklist_info = ${body.tracklist_info !== undefined ? body.tracklist_info : existing.tracklist_info},
        press_email = ${body.press_email !== undefined ? body.press_email : existing.press_email},
        meta_title = ${body.meta_title !== undefined ? body.meta_title : existing.meta_title},
        meta_description = ${body.meta_description !== undefined ? body.meta_description : existing.meta_description},
        meta_keywords = ${body.meta_keywords !== undefined ? body.meta_keywords : existing.meta_keywords},
        is_published = ${body.is_published !== undefined ? body.is_published : existing.is_published},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${targetId}
      RETURNING *
    `
    return normalizePressRelease(updated)
  }

  // Memory store fallback
  const idx = memoryStore.pressReleases.findIndex((p: any) => p.id === targetId)
  if (idx === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Press release not found' })
  }

  const current = memoryStore.pressReleases[idx]
  memoryStore.pressReleases[idx] = {
    ...current,
    ...body,
    slug: body.slug ? slugify(body.slug) : current.slug,
    updated_at: new Date().toISOString(),
  }

  return normalizePressRelease(memoryStore.pressReleases[idx])
})
