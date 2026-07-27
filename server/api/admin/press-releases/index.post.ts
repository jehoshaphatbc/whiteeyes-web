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

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { title } = body

  if (!title || !title.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Title is required' })
  }

  const generatedSlug = body.slug ? slugify(body.slug) : slugify(title)
  const cleanSlug = generatedSlug || `release-${Date.now()}`

  const sql = getDb()

  if (sql) {
    const [existing] = await sql`SELECT id FROM press_releases WHERE slug = ${cleanSlug}`
    if (existing) {
      throw createError({ statusCode: 400, statusMessage: 'A press release with this slug already exists' })
    }

    const [newItem] = await sql`
      INSERT INTO press_releases (
        title, subtitle, slug, cover_image_url, hero_bg_url, release_date, genre, producer, label,
        listen_url, video_url, press_kit_url, intro_headline, intro_body, highlight_title, highlight_body,
        feature_title, feature_body, feature_image_url, feature_points, legacy_title, legacy_points,
        current_title, current_points, sound_character, quote_text, quote_author, personnel_body, personnel_members,
        contact_phone, social_instagram, social_facebook, social_youtube, discography_summary, music_credits, lyrics,
        video_embed_url, tracklist_info, press_email, meta_title, meta_description, meta_keywords, is_published
      ) VALUES (
        ${body.title}, ${body.subtitle || ''}, ${cleanSlug}, ${body.cover_image_url || ''}, ${body.hero_bg_url || ''},
        ${body.release_date || ''}, ${body.genre || 'Death Metal'}, ${body.producer || 'Trojan'}, ${body.label || 'Iron Tomb Records'},
        ${body.listen_url || ''}, ${body.video_url || ''}, ${body.press_kit_url || ''}, ${body.intro_headline || ''}, ${body.intro_body || ''},
        ${body.highlight_title || ''}, ${body.highlight_body || ''}, ${body.feature_title || ''}, ${body.feature_body || ''}, ${body.feature_image_url || ''},
        ${JSON.stringify(body.feature_points || [])}, ${body.legacy_title || ''}, ${JSON.stringify(body.legacy_points || [])},
        ${body.current_title || ''}, ${JSON.stringify(body.current_points || [])}, ${body.sound_character || ''}, ${body.quote_text || ''}, ${body.quote_author || ''},
        ${body.personnel_body || ''}, ${JSON.stringify(body.personnel_members || [])},
        ${body.contact_phone || ''}, ${body.social_instagram || ''}, ${body.social_facebook || ''}, ${body.social_youtube || ''},
        ${body.discography_summary || ''}, ${JSON.stringify(body.music_credits || [])}, ${body.lyrics || ''},
        ${body.video_embed_url || ''}, ${body.tracklist_info || ''},
        ${body.press_email || 'trojandeath79@gmail.com'}, ${body.meta_title || ''}, ${body.meta_description || ''}, ${body.meta_keywords || ''}, ${body.is_published !== false}
      )
      RETURNING *
    `
    return newItem
  }

  // Memory store fallback
  const existing = memoryStore.pressReleases.find((p: any) => p.slug === cleanSlug)
  if (existing) {
    throw createError({ statusCode: 400, statusMessage: 'A press release with this slug already exists' })
  }

  const newId = memoryStore.pressReleases.length > 0 
    ? Math.max(...memoryStore.pressReleases.map((p: any) => p.id)) + 1 
    : 1

  const newItem = {
    id: newId,
    title: body.title,
    subtitle: body.subtitle || '',
    slug: cleanSlug,
    cover_image_url: body.cover_image_url || '',
    hero_bg_url: body.hero_bg_url || '',
    release_date: body.release_date || '',
    genre: body.genre || 'Death Metal',
    producer: body.producer || 'Trojan',
    label: body.label || 'Iron Tomb Records',
    listen_url: body.listen_url || '',
    video_url: body.video_url || '',
    press_kit_url: body.press_kit_url || '',
    intro_headline: body.intro_headline || '',
    intro_body: body.intro_body || '',
    highlight_title: body.highlight_title || '',
    highlight_body: body.highlight_body || '',
    feature_title: body.feature_title || '',
    feature_body: body.feature_body || '',
    feature_image_url: body.feature_image_url || '',
    feature_points: body.feature_points || [],
    legacy_title: body.legacy_title || '',
    legacy_points: body.legacy_points || [],
    current_title: body.current_title || '',
    current_points: body.current_points || [],
    sound_character: body.sound_character || '',
    quote_text: body.quote_text || '',
    quote_author: body.quote_author || '',
    personnel_body: body.personnel_body || '',
    personnel_members: body.personnel_members || [],
    contact_phone: body.contact_phone || '',
    social_instagram: body.social_instagram || '',
    social_facebook: body.social_facebook || '',
    social_youtube: body.social_youtube || '',
    discography_summary: body.discography_summary || '',
    music_credits: body.music_credits || [],
    lyrics: body.lyrics || '',
    video_embed_url: body.video_embed_url || '',
    tracklist_info: body.tracklist_info || '',
    press_email: body.press_email || 'trojandeath79@gmail.com',
    meta_title: body.meta_title || '',
    meta_description: body.meta_description || '',
    meta_keywords: body.meta_keywords || '',
    is_published: body.is_published !== false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  memoryStore.pressReleases.unshift(newItem)
  return newItem
})
