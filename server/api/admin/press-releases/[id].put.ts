import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

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
    const [existing] = await sql`SELECT id FROM press_releases WHERE id = ${targetId}`
    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: 'Press release not found' })
    }

    let cleanSlug = undefined
    if (body.slug) {
      cleanSlug = slugify(body.slug)
    } else if (body.title) {
      cleanSlug = slugify(body.title)
    }

    const featurePoints = body.feature_points ? (Array.isArray(body.feature_points) ? body.feature_points : []) : null
    const legacyPoints = body.legacy_points ? (Array.isArray(body.legacy_points) ? body.legacy_points : []) : null
    const currentPoints = body.current_points ? (Array.isArray(body.current_points) ? body.current_points : []) : null
    const personnelMembers = body.personnel_members ? (Array.isArray(body.personnel_members) ? body.personnel_members : []) : null
    const musicCredits = body.music_credits ? (Array.isArray(body.music_credits) ? body.music_credits : []) : null

    const [updated] = await sql`
      UPDATE press_releases SET
        title = COALESCE(${body.title}, title),
        subtitle = COALESCE(${body.subtitle}, subtitle),
        slug = COALESCE(${cleanSlug}, slug),
        cover_image_url = COALESCE(${body.cover_image_url}, cover_image_url),
        hero_bg_url = COALESCE(${body.hero_bg_url}, hero_bg_url),
        release_date = COALESCE(${body.release_date}, release_date),
        genre = COALESCE(${body.genre}, genre),
        producer = COALESCE(${body.producer}, producer),
        label = COALESCE(${body.label}, label),
        listen_url = COALESCE(${body.listen_url}, listen_url),
        video_url = COALESCE(${body.video_url}, video_url),
        press_kit_url = COALESCE(${body.press_kit_url}, press_kit_url),
        intro_headline = COALESCE(${body.intro_headline}, intro_headline),
        intro_body = COALESCE(${body.intro_body}, intro_body),
        highlight_title = COALESCE(${body.highlight_title}, highlight_title),
        highlight_body = COALESCE(${body.highlight_body}, highlight_body),
        feature_title = COALESCE(${body.feature_title}, feature_title),
        feature_body = COALESCE(${body.feature_body}, feature_body),
        feature_image_url = COALESCE(${body.feature_image_url}, feature_image_url),
        feature_points = COALESCE(${featurePoints ? sql.json(featurePoints) : null}, feature_points),
        legacy_title = COALESCE(${body.legacy_title}, legacy_title),
        legacy_points = COALESCE(${legacyPoints ? sql.json(legacyPoints) : null}, legacy_points),
        current_title = COALESCE(${body.current_title}, current_title),
        current_points = COALESCE(${currentPoints ? sql.json(currentPoints) : null}, current_points),
        sound_character = COALESCE(${body.sound_character}, sound_character),
        quote_text = COALESCE(${body.quote_text}, quote_text),
        quote_author = COALESCE(${body.quote_author}, quote_author),
        personnel_body = COALESCE(${body.personnel_body}, personnel_body),
        personnel_members = COALESCE(${personnelMembers ? sql.json(personnelMembers) : null}, personnel_members),
        contact_phone = COALESCE(${body.contact_phone}, contact_phone),
        social_instagram = COALESCE(${body.social_instagram}, social_instagram),
        social_facebook = COALESCE(${body.social_facebook}, social_facebook),
        social_youtube = COALESCE(${body.social_youtube}, social_youtube),
        discography_summary = COALESCE(${body.discography_summary}, discography_summary),
        music_credits = COALESCE(${musicCredits ? sql.json(musicCredits) : null}, music_credits),
        lyrics = COALESCE(${body.lyrics}, lyrics),
        video_embed_url = COALESCE(${body.video_embed_url}, video_embed_url),
        tracklist_info = COALESCE(${body.tracklist_info}, tracklist_info),
        press_email = COALESCE(${body.press_email}, press_email),
        meta_title = COALESCE(${body.meta_title}, meta_title),
        meta_description = COALESCE(${body.meta_description}, meta_description),
        meta_keywords = COALESCE(${body.meta_keywords}, meta_keywords),
        is_published = COALESCE(${body.is_published}, is_published),
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
