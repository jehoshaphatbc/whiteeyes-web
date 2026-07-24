import { getDb } from '../database/db'
import { ensureDbSchema, memoryStore } from '../database/schema'

export default defineEventHandler(async () => {
  const sql = getDb()

  if (!sql) {
    return {
      band_profile: memoryStore.bandProfile,
      about: memoryStore.about,
      latest_release: memoryStore.latestRelease,
      discography: memoryStore.discography,
      artwork: memoryStore.artwork,
      videos: memoryStore.videos,
      merch: memoryStore.merch,
      social_links: memoryStore.socialLinks,
    }
  }

  await ensureDbSchema()

  try {
    const [bandProfile] = await sql`SELECT * FROM band_profiles WHERE id = 1`
    const [about] = await sql`SELECT * FROM abouts WHERE id = 1`
    const milestones = await sql`SELECT * FROM milestones WHERE about_id = 1 ORDER BY sort_order ASC`
    const releases = await sql`SELECT * FROM releases ORDER BY sort_order ASC, id DESC`
    const links = await sql`SELECT * FROM streaming_links ORDER BY sort_order ASC`
    const artwork = await sql`SELECT * FROM artwork_items ORDER BY sort_order ASC, id DESC`
    const videos = await sql`SELECT * FROM videos ORDER BY is_featured DESC, sort_order ASC, id DESC`
    const merch = await sql`SELECT * FROM merch_items ORDER BY sort_order ASC, id DESC`
    const [socialLinks] = await sql`SELECT * FROM social_links WHERE id = 1`

    // Attach streaming links to releases
    const discography = releases.map((r) => ({
      ...r,
      streaming_links: links.filter((l) => l.release_id === r.id),
    }))

    const latestRelease = discography.find((r) => r.is_featured) || discography[0] || memoryStore.latestRelease

    return {
      band_profile: bandProfile || memoryStore.bandProfile,
      about: about ? { ...about, milestones } : memoryStore.about,
      latest_release: latestRelease,
      discography: discography.length ? discography : memoryStore.discography,
      artwork: artwork.length ? artwork : memoryStore.artwork,
      videos: videos.length ? videos : memoryStore.videos,
      merch: merch.length ? merch : memoryStore.merch,
      social_links: socialLinks || memoryStore.socialLinks,
    }
  } catch (err) {
    console.error('Error querying Neon postgres database:', err)
    return {
      band_profile: memoryStore.bandProfile,
      about: memoryStore.about,
      latest_release: memoryStore.latestRelease,
      discography: memoryStore.discography,
      artwork: memoryStore.artwork,
      videos: memoryStore.videos,
      merch: memoryStore.merch,
      social_links: memoryStore.socialLinks,
    }
  }
})
