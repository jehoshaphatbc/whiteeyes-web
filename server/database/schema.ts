import bcrypt from 'bcryptjs'
import { getDb } from './db'

// Fallback Memory Store (used when DATABASE_URL is not set locally)
export const memoryStore = {
  adminUser: {
    id: 1,
    email: 'admin@whiteeyes.metal',
    passwordHash: bcrypt.hashSync('Whiteeyes2026!', 10),
    role: 'admin',
  },
  bandProfile: {
    id: 1,
    band_name: 'WHITEEYES',
    logo_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
    genre_label: 'Extreme Death Metal',
    hero_tagline: 'CHRONICLES OF VISCERAL DECAY AND DISSOLUTION',
    hero_bg_image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1920&auto=format&fit=crop',
    spotify_url: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  about: {
    id: 1,
    biography: 'Forged in the subterranean damp of Jakarta\'s underground, WHITEEYES executes uncompromising, blastbeat-driven Death Metal steeped in dissonant atmospheric dread. Drawing influence from early Scandinavian brutality and modern avant-garde extreme metal, the quartet crafts sonic monoliths dedicated to existential horror, bodily decay, and primordial darkness.',
    formed_year: 2019,
    origin: 'Jakarta, Indonesia',
    genre: 'Death Metal',
    style_description: 'Dissonant / Atmospheric / Brutal',
    section_photo_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop',
    milestones: [
      { id: 1, year: 2019, text: 'Band formed in Jakarta subterranean rehearsal space', sort_order: 0 },
      { id: 2, year: 2021, text: 'Released self-titled debut demo EP "Void of Sight"', sort_order: 1 },
      { id: 3, year: 2023, text: 'Headlined Southeast Asian Underground Metal Summit', sort_order: 2 },
      { id: 4, year: 2024, text: 'Unveiled sophomore LP "Chronicles of Decay" via Iron Tomb Records', sort_order: 3 },
    ],
  },
  latestRelease: {
    id: 1,
    title: 'CHRONICLES OF DECAY',
    release_type: 'Full-Length Album',
    release_date: '2024',
    description: 'Eight tracks of relentless sonic warfare exploring the collapse of physical and metaphysical consciousness.',
    cover_art_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    is_featured: true,
    sort_order: 0,
    streaming_links: [
      { id: 1, label: 'Spotify', url: 'https://open.spotify.com', sort_order: 0 },
      { id: 2, label: 'Apple Music', url: 'https://music.apple.com', sort_order: 1 },
      { id: 3, label: 'Bandcamp', url: 'https://bandcamp.com', sort_order: 2 },
    ],
  },
  discography: [
    {
      id: 1,
      title: 'CHRONICLES OF DECAY',
      release_type: 'Full-Length Album',
      release_date: '2024',
      description: 'Eight tracks of relentless sonic warfare exploring the collapse of physical and metaphysical consciousness.',
      cover_art_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      is_featured: true,
      sort_order: 0,
      streaming_links: [
        { id: 1, label: 'Spotify', url: 'https://open.spotify.com', sort_order: 0 },
        { id: 2, label: 'Apple Music', url: 'https://music.apple.com', sort_order: 1 },
        { id: 3, label: 'Bandcamp', url: 'https://bandcamp.com', sort_order: 2 },
      ],
    },
    {
      id: 2,
      title: 'MONOLITH OF FILTH',
      release_type: 'EP',
      release_date: '2022',
      description: 'A frantic, 19-minute assault of cavernous riffs and suffocating vocal terror.',
      cover_art_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop',
      is_featured: false,
      sort_order: 1,
      streaming_links: [
        { id: 4, label: 'Spotify', url: 'https://open.spotify.com', sort_order: 0 },
        { id: 5, label: 'Bandcamp', url: 'https://bandcamp.com', sort_order: 1 },
      ],
    },
    {
      id: 3,
      title: 'VOID OF SIGHT',
      release_type: 'Demo',
      release_date: '2021',
      description: 'Raw, unrefined 4-track cassette recording that birthed the band\'s signature atmospheric violence.',
      cover_art_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop',
      is_featured: false,
      sort_order: 2,
      streaming_links: [
        { id: 6, label: 'Bandcamp', url: 'https://bandcamp.com', sort_order: 0 },
      ],
    },
  ],
  artwork: [
    { id: 1, title: 'Chronicles Cover Art', alt_text: 'Album cover art showing visceral abstract horror', category: 'Album Art', image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', sort_order: 0 },
    { id: 2, title: 'Tour Flyer 2024', alt_text: 'Black and white underground metal tour flyer', category: 'Flyer', image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop', sort_order: 1 },
    { id: 3, title: 'Monolith Artwork', alt_text: 'Dark abstract ink artwork', category: 'Album Art', image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop', sort_order: 2 },
    { id: 4, title: 'Decay Tee Print', alt_text: 'Distressed skull and barbed wire print design', category: 'Merch Art', image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop', sort_order: 3 },
    { id: 5, title: 'Subterranean Ritual Poster', alt_text: 'Concert poster for live show in Jakarta', category: 'Poster', image_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop', sort_order: 4 },
  ],
  videos: [
    { id: 1, title: 'Chronicles of Decay (Official Video)', description: 'Official music video directed by Void Visuals. Shot on 16mm film.', youtube_id: 'L_LUpnjgPso', is_featured: true, sort_order: 0 },
    { id: 2, title: 'Live at Hammersonic Underground 2023', description: 'Full set performance live at Hammersonic Underground stage.', youtube_id: 'dQw4w9WgXcQ', is_featured: false, sort_order: 1 },
    { id: 3, title: 'Monolith of Filth (Live Rehearsal)', description: 'Raw multi-cam studio session recorded live in Jakarta.', youtube_id: '3JZ_D3ELwOQ', is_featured: false, sort_order: 2 },
  ],
  merch: [
    { id: 1, name: 'CHRONICLES TEE (V1)', description: 'Heavyweight 220gsm black cotton tee with screenprinted album artwork front and back tracklist.', price: '$25', image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop', sort_order: 0 },
    { id: 2, name: 'VOID ARCHIVE HOODIE', description: 'Ultra-heavy 400gsm fleece hoodie with embroidered chest logo and distressed sleeve prints.', price: '$55', image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop', sort_order: 1 },
    { id: 3, name: 'LIMITED VINYL LP - BLOOD SMOKE', description: '180g blood splatter vinyl limited to 300 hand-numbered copies worldwide.', price: '$30', image_url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop', sort_order: 2 },
  ],
  socialLinks: {
    id: 1,
    instagram_url: 'https://instagram.com/whiteeyes.official',
    spotify_url: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02',
    youtube_url: 'https://youtube.com/@whiteeyesmetal',
    facebook_url: 'https://facebook.com/whiteeyesband',
    whatsapp_number: '6281234567890',
    closing_headline: 'JOIN THE ABYSS',
  },
}

export async function ensureDbSchema() {
  const sql = getDb()
  if (!sql) return

  try {
    // Create Tables
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS band_profiles (
        id SERIAL PRIMARY KEY,
        band_name VARCHAR(255) NOT NULL,
        logo_url TEXT,
        genre_label VARCHAR(255),
        hero_tagline TEXT,
        hero_bg_image_url TEXT,
        hero_bg_video_url TEXT,
        spotify_url TEXT,
        youtube_url TEXT
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS abouts (
        id SERIAL PRIMARY KEY,
        biography TEXT,
        formed_year INT,
        origin VARCHAR(255),
        genre VARCHAR(255),
        style_description VARCHAR(255),
        section_photo_url TEXT
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS milestones (
        id SERIAL PRIMARY KEY,
        about_id INT REFERENCES abouts(id) ON DELETE CASCADE,
        year INT,
        text TEXT,
        sort_order INT DEFAULT 0
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS releases (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        release_type VARCHAR(100),
        release_date VARCHAR(100),
        description TEXT,
        cover_art_url TEXT,
        is_featured BOOLEAN DEFAULT FALSE,
        sort_order INT DEFAULT 0
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS streaming_links (
        id SERIAL PRIMARY KEY,
        release_id INT REFERENCES releases(id) ON DELETE CASCADE,
        label VARCHAR(100),
        url TEXT,
        sort_order INT DEFAULT 0
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS artwork_items (
        id SERIAL PRIMARY KEY,
        image_url TEXT,
        title VARCHAR(255),
        alt_text TEXT,
        category VARCHAR(100),
        sort_order INT DEFAULT 0
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS videos (
        id SERIAL PRIMARY KEY,
        youtube_id VARCHAR(100),
        title VARCHAR(255),
        description TEXT,
        is_featured BOOLEAN DEFAULT FALSE,
        sort_order INT DEFAULT 0
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS merch_items (
        id SERIAL PRIMARY KEY,
        image_url TEXT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price VARCHAR(100),
        whatsapp_number VARCHAR(100),
        sort_order INT DEFAULT 0
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS social_links (
        id SERIAL PRIMARY KEY,
        instagram_url TEXT,
        spotify_url TEXT,
        youtube_url TEXT,
        facebook_url TEXT,
        whatsapp_number VARCHAR(100),
        closing_headline TEXT
      );
    `

    // Seed Admin User if missing
    const users = await sql`SELECT id FROM admin_users LIMIT 1`
    if (users.length === 0) {
      const hash = bcrypt.hashSync('Whiteeyes2026!', 10)
      await sql`INSERT INTO admin_users (email, password_hash, role) VALUES ('admin@whiteeyes.metal', ${hash}, 'admin')`
    }

    // Seed Band Profile if missing
    const profiles = await sql`SELECT id FROM band_profiles LIMIT 1`
    if (profiles.length === 0) {
      await sql`
        INSERT INTO band_profiles (id, band_name, genre_label, hero_tagline, hero_bg_image_url, spotify_url, youtube_url)
        VALUES (1, ${memoryStore.bandProfile.band_name}, ${memoryStore.bandProfile.genre_label}, ${memoryStore.bandProfile.hero_tagline}, ${memoryStore.bandProfile.hero_bg_image_url}, ${memoryStore.bandProfile.spotify_url}, ${memoryStore.bandProfile.youtube_url})
      `
    }

    // Seed About if missing
    const abouts = await sql`SELECT id FROM abouts LIMIT 1`
    if (abouts.length === 0) {
      await sql`
        INSERT INTO abouts (id, biography, formed_year, origin, genre, style_description, section_photo_url)
        VALUES (1, ${memoryStore.about.biography}, ${memoryStore.about.formed_year}, ${memoryStore.about.origin}, ${memoryStore.about.genre}, ${memoryStore.about.style_description}, ${memoryStore.about.section_photo_url})
      `
      for (const m of memoryStore.about.milestones) {
        await sql`INSERT INTO milestones (about_id, year, text, sort_order) VALUES (1, ${m.year}, ${m.text}, ${m.sort_order})`
      }
    }

    // Seed Releases if missing
    const rels = await sql`SELECT id FROM releases LIMIT 1`
    if (rels.length === 0) {
      for (const r of memoryStore.discography) {
        const [inserted] = await sql`
          INSERT INTO releases (title, release_type, release_date, description, cover_art_url, is_featured, sort_order)
          VALUES (${r.title}, ${r.release_type}, ${r.release_date}, ${r.description}, ${r.cover_art_url}, ${r.is_featured}, ${r.sort_order})
          RETURNING id
        `
        for (const l of r.streaming_links) {
          await sql`INSERT INTO streaming_links (release_id, label, url, sort_order) VALUES (${inserted.id}, ${l.label}, ${l.url}, ${l.sort_order})`
        }
      }
    }

    // Seed Artwork if missing
    const arts = await sql`SELECT id FROM artwork_items LIMIT 1`
    if (arts.length === 0) {
      for (const a of memoryStore.artwork) {
        await sql`INSERT INTO artwork_items (title, alt_text, category, image_url, sort_order) VALUES (${a.title}, ${a.alt_text}, ${a.category}, ${a.image_url}, ${a.sort_order})`
      }
    }

    // Seed Videos if missing
    const vids = await sql`SELECT id FROM videos LIMIT 1`
    if (vids.length === 0) {
      for (const v of memoryStore.videos) {
        await sql`INSERT INTO videos (title, description, youtube_id, is_featured, sort_order) VALUES (${v.title}, ${v.description}, ${v.youtube_id}, ${v.is_featured}, ${v.sort_order})`
      }
    }

    // Seed Merch if missing
    const merchs = await sql`SELECT id FROM merch_items LIMIT 1`
    if (merchs.length === 0) {
      for (const m of memoryStore.merch) {
        await sql`INSERT INTO merch_items (name, description, price, image_url, sort_order) VALUES (${m.name}, ${m.description}, ${m.price}, ${m.image_url}, ${m.sort_order})`
      }
    }

    // Seed Social Links if missing
    const socials = await sql`SELECT id FROM social_links LIMIT 1`
    if (socials.length === 0) {
      await sql`
        INSERT INTO social_links (id, instagram_url, spotify_url, youtube_url, facebook_url, whatsapp_number, closing_headline)
        VALUES (1, ${memoryStore.socialLinks.instagram_url}, ${memoryStore.socialLinks.spotify_url}, ${memoryStore.socialLinks.youtube_url}, ${memoryStore.socialLinks.facebook_url}, ${memoryStore.socialLinks.whatsapp_number}, ${memoryStore.socialLinks.closing_headline})
      `
    }
  } catch (err) {
    console.error('Error auto-migrating database schema:', err)
  }
}
