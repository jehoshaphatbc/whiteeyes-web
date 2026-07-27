import bcrypt from 'bcryptjs'
import { getDb } from './db'

// Fallback Memory Store (used when DATABASE_URL is not set locally)
export const memoryStore = {
  adminUsers: [
    {
      id: 1,
      email: 'admin@whiteeyes.metal',
      passwordHash: bcrypt.hashSync('Whiteeyes2026!', 10),
      role: 'superadmin',
      created_at: new Date().toISOString(),
    },
  ],
  get adminUser() {
    return this.adminUsers[0]
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
  seoSettings: {
    id: 1,
    meta_title: 'WHITEEYES — Extreme Death Metal',
    meta_description: 'Official portal of subterranean Extreme Death Metal band WHITEEYES from Jakarta. Stream discography, view artwork, watch live transmissions, and order official merchandise.',
    meta_keywords: 'WHITEEYES, Death Metal, Extreme Metal, Jakarta Death Metal, Underground Metal, Chronicles of Decay',
    og_title: 'WHITEEYES — Extreme Death Metal',
    og_description: 'Official portal of WHITEEYES. Underground Death Metal from Jakarta.',
    og_image_url: '/favicon.png',
    twitter_card_type: 'summary_large_image',
    canonical_url: 'https://whiteeyes-web.vercel.app',
  },
  blogPosts: [
    {
      id: 1,
      title: 'Chronicles of Decay LP Official Release & Tour Manifest',
      slug: 'chronicles-of-decay-release-and-tour-manifest',
      excerpt: 'The subterranean sonic warfare is unleashed. Read the official release statement and upcoming tour locations across Southeast Asia.',
      content: 'Forged in the cavernous underground rehearsals of Jakarta, our sophomore full-length album "CHRONICLES OF DECAY" is officially available worldwide.\n\nRecorded on analog tape and engineered to deliver suffocating dissonance, eight monolithic tracks explore bodily decay and metaphysical dissolution.\n\nPhysical merchandise and vinyl pressings are now shipping globally via Iron Tomb Records. Prepare for the upcoming tour transmissions across Indonesia, Malaysia, and Singapore.',
      cover_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      author: 'WHITEEYES',
      category: 'Announcement',
      meta_title: 'Chronicles of Decay LP Release & Tour | WHITEEYES',
      meta_description: 'Official release announcement for Chronicles of Decay LP and Southeast Asian tour manifest by WHITEEYES.',
      meta_keywords: 'WHITEEYES, Chronicles of Decay, Death Metal Tour, LP Release',
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Subterranean Studio Transmissions: Recording Monolith of Filth',
      slug: 'subterranean-studio-transmissions-recording-monolith-of-filth',
      excerpt: 'An exclusive look inside our raw analog studio sessions during the creation of the cavernous EP Monolith of Filth.',
      content: 'During the damp mid-monsoon months of 2022, WHITEEYES isolated inside a subterranean rehearsal bunker to capture the suffocating energy of "Monolith of Filth".\n\nRejecting digital quantisation and modern sterile drum replacement, every track was captured live in single takes with vintage valve microphones.\n\nVisual archives and studio photo documentation can be explored in our Artwork Gallery section.',
      cover_image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
      author: 'WHITEEYES',
      category: 'Studio Report',
      meta_title: 'Inside Monolith of Filth Studio Sessions | WHITEEYES',
      meta_description: 'Behind the scenes into the analog studio recording sessions of Monolith of Filth EP.',
      meta_keywords: 'WHITEEYES, Studio Report, Monolith of Filth, Recording Death Metal',
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  blogCategories: [
    { id: 1, name: 'Announcement', slug: 'announcement', created_at: new Date().toISOString() },
    { id: 2, name: 'Studio Report', slug: 'studio-report', created_at: new Date().toISOString() },
    { id: 3, name: 'Tour News', slug: 'tour-news', created_at: new Date().toISOString() },
    { id: 4, name: 'Merchandise', slug: 'merchandise', created_at: new Date().toISOString() },
  ],
  pressReleases: [
    {
      id: 1,
      title: 'ANICONISM',
      subtitle: 'REPERTOAR "ANICONISM" BERTUTUR DALAM GAUNG PELESTARIAN',
      slug: 'aniconism',
      cover_image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
      hero_bg_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
      release_date: '2024',
      genre: 'Death Metal',
      producer: 'Trojan',
      label: 'Iron Tomb Records',
      listen_url: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02',
      video_url: 'https://youtube.com/@whiteeyesmetal',
      press_kit_url: 'https://drive.google.com',
      intro_headline: 'REPERTOAR "ANICONISM" BERTUTUR DALAM GAUNG PELESTARIAN',
      intro_body: 'Etalase jiwa untuk kehidupan manusia mendatang banyak tersedia melalui alih dalih kematian. Memberi kesempatan untuk lahir kembali ke dunia supaya mentolerir kehidupan yang lebih baik. Namun, pergeseran umat manusia begitu pesat dengan tumbuhnya metode baru, teknologi tampak bermunculan begitu masif. Sampai hingga merenggut keindahan semesta yang semestinya kita rawat dengan baik.\n\nBahkan bukan hanya semesta saja dirusak melainkan sesama umat manusia pun menjadi target liar dan buasnya. Implementasi buruk dengan reputasi yang sejak dulu tidak baik-baik saja, ruh-ruh yang ada di semesta semakin murka dan akan membuat sebuah kolom rencana yang semestinya sudah dilakukan sejak lama. Inilah yang sedang dilakukan oleh Trojan.\n\nMelalui bentuk visual audio yang bertajuk "Aniconism", unit kuintet death metal asal Bali ini, mengunggah sebuah representatifnya agar semua dalam ruang lingkup semesta ini menjadi lebih rukun lagi dan saling menghargai satu sama lain. Berkolaborasi dengan salah satu seniman tari tradisional, Komang Adi Pranata dari Manuaba Art, merefleksikan peradaban ini agar menjadi lebih beradab lagi daripada sebelumnya.',
      highlight_title: 'ENVIRONMENTAL DESTINY & ECOLOGICAL PRESERVATION',
      highlight_body: 'Lagu ini bercerita tentang bahwa sebuah praktik keyakinan yang mengucilkan makhluk Tuhan ini seperti tidak menghormati alam semestanya sendiri. Penyelewengan manusia terhadap aturan yang ditetapkan oleh Tuhan sudah dikatakan prematur sehingga sampai pada merusak makhluk Tuhan itu sendiri dan alam semesta. "Aniconism" ini sebagai jembatan awal untuk merangkum sebuah album penuh dari Trojan yang segera akan dirilisnya dalam waktu mendatang.',
      feature_title: 'THE ANICONIC RITUAL',
      feature_body: 'Menghantarkan karya ini untuk sebar secara masif, ada sedikit perubahan dalam tata suara yang dihasilkan. Album penuh "Archaic Dimension" membawa gaung Death Metal yang kental, meracik ramu sentuhan Djent pada beberapa ritme-ritme lagunya. Namun pada "Aniconism" sedikit berbeda.',
      feature_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      feature_points: ['01 - Destruction', '02 - Rebirth', '03 - Dissolution'],
      legacy_title: 'THE LEGACY',
      legacy_points: ['Death Metal Classic', 'High Tempo Tremolo', 'Archaic Dimension Era'],
      current_title: 'ANICONISM NOW',
      current_points: ['Low Tuning Resonance', 'Djent Rhythm Riffs', 'Cavernous Low End'],
      sound_character: 'Karakter tata suaranya masih sama, namun yang berbuat berbeda adalah sedikit lebih low daripada sebelumnya. Dominasi dimensi Djent begitu kental pada lagu ini. Walaupun tidak menghilangkan unsur Death Metalnya, sebuah cerita baru dari tubuh Trojan sedikit menggeser perjalanan mereka yang kental dengan Death Metal.',
      quote_text: 'Satu pesan moral yang ingin disampaikan dari video musik ini adalah bagaimana kita harus menyadari setiap langkah dan perbuatan di alam (Bumi) ini, yang bukan dimiliki oleh manusia semata saja. Sebagai makhluk yang paling beradab sudah seharusnya meredam hasrat dan ambisi untuk lebih pintar dalam berfikir, selalu menciptakan keindahan, sehingga tetap menjadi tempat tinggal yang damai.',
      quote_author: 'Agus Purnama, Vocalist',
      personnel_body: 'Kuintet Death Metal asal Bali.',
      personnel_members: [
        { name: 'Agus Purnama', role: 'Vokal' },
        { name: 'Reo Rasyidi', role: 'Gitar' },
        { name: 'Michael Perwira', role: 'Gitar' },
        { name: 'Adi Pratama', role: 'Bass' },
        { name: 'Agus Cahyadi', role: 'Drum' },
      ],
      contact_phone: '085737122722 (Prabu)',
      social_instagram: '@trojan_death',
      social_facebook: 'trojandeath',
      social_youtube: 'Trojan Death Bali',
      discography_summary: 'SINGLES:\n- Blackness Begins (2011)\n- Imaginarium of Murder (2017)\n- Release The Beast (2020 - Live Session)\n\nALBUMS:\n- Metamorphosis As The Phenomenon (2010)\n- Archaic Dimension (2015)',
      music_credits: [
        { label: 'JUDUL LAGU', value: 'Aniconism' },
        { label: 'EKSEKUTIF PRODUSER', value: 'Trojan' },
        { label: 'PENULIS', value: 'Trojan' },
        { label: 'PENCICTA', value: 'Trojan' },
        { label: 'MUSIK', value: 'Trojan' },
        { label: 'PRODUSER', value: 'Trojan' },
        { label: 'MIXING', value: 'Indra Komenk' },
        { label: 'MASTERING', value: 'Indra Komenk' },
        { label: 'FOTOGRAFER', value: 'Guzindra' },
        { label: 'VIDEOGRAFER', value: 'Guzindra' },
        { label: 'ARTWORKER', value: 'Reo Rasyidi' },
        { label: 'TALENT MV', value: 'Komang Adi Pranata' },
      ],
      lyrics: `In a world of power, where ego reigns pulling the strings.
Building towers of pride, reaching for the skies,
Blinded by control, we believe our own lies.

Can we truly fathom the consequence?
Of playing with life, disregarding our sense?

We alter the genes, manipulate the cells,
Unleashing a Pandora's Box, no one can tell.
Creating life in labs, trying to play divine,
But do we understand the limit and the line?

Nature's laws, they cannot be tamed,
For every action, there's a price to be paid.

The chaos and destruction!

Mother Earth, she's crying out in pain,
As we foolishly play this dangerous game.

It's time to reflect on the path we've taken,
To reassess our powers and awaken.

Respect the earth, and the sky!

We're just fragments in this cosmic play,
For power and control, as deadly display.

They play with lie!
Let us remember, we’re part of a whole!

In this world, where power reigns supreme,
Some humans chase the ultimate dream
Playing with fire
They seek control
Playing god
They aim to steal the role.`,
      video_embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      tracklist_info: 'Aniconism - Official Single Transmission',
      press_email: 'trojandeath79@gmail.com',
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
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

    await sql`
      CREATE TABLE IF NOT EXISTS seo_settings (
        id SERIAL PRIMARY KEY,
        meta_title TEXT,
        meta_description TEXT,
        meta_keywords TEXT,
        og_title TEXT,
        og_description TEXT,
        og_image_url TEXT,
        twitter_card_type VARCHAR(100),
        canonical_url TEXT
      );
    `

    // Seed Admin User if missing
    const users = await sql`SELECT id FROM admin_users LIMIT 1`
    if (users.length === 0) {
      const hash = bcrypt.hashSync('Whiteeyes2026!', 10)
      await sql`INSERT INTO admin_users (email, password_hash, role) VALUES ('admin@whiteeyes.metal', ${hash}, 'superadmin')`
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

    await sql`
      CREATE TABLE IF NOT EXISTS blog_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT,
        content TEXT,
        cover_image_url TEXT,
        author VARCHAR(100) DEFAULT 'WHITEEYES',
        category VARCHAR(100) DEFAULT 'News',
        meta_title VARCHAR(255),
        meta_description TEXT,
        meta_keywords VARCHAR(255),
        is_published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Seed SEO Settings if missing
    const seos = await sql`SELECT id FROM seo_settings LIMIT 1`
    if (seos.length === 0) {
      await sql`
        INSERT INTO seo_settings (id, meta_title, meta_description, meta_keywords, og_title, og_description, og_image_url, twitter_card_type, canonical_url)
        VALUES (1, ${memoryStore.seoSettings.meta_title}, ${memoryStore.seoSettings.meta_description}, ${memoryStore.seoSettings.meta_keywords}, ${memoryStore.seoSettings.og_title}, ${memoryStore.seoSettings.og_description}, ${memoryStore.seoSettings.og_image_url}, ${memoryStore.seoSettings.twitter_card_type}, ${memoryStore.seoSettings.canonical_url})
      `
    }

    // Seed Blog Posts if missing
    const posts = await sql`SELECT id FROM blog_posts LIMIT 1`
    if (posts.length === 0) {
      for (const p of memoryStore.blogPosts) {
        await sql`
          INSERT INTO blog_posts (title, slug, excerpt, content, cover_image_url, author, category, meta_title, meta_description, meta_keywords, is_published)
          VALUES (${p.title}, ${p.slug}, ${p.excerpt}, ${p.content}, ${p.cover_image_url}, ${p.author}, ${p.category}, ${p.meta_title}, ${p.meta_description}, ${p.meta_keywords}, ${p.is_published})
        `
      }
    }

    // Seed Blog Categories if missing
    const cats = await sql`SELECT id FROM blog_categories LIMIT 1`
    if (cats.length === 0) {
      for (const c of memoryStore.blogCategories) {
        await sql`INSERT INTO blog_categories (id, name, slug) VALUES (${c.id}, ${c.name}, ${c.slug})`
      }
    }

    // Create & Seed Press Releases table
    await sql`
      CREATE TABLE IF NOT EXISTS press_releases (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        slug VARCHAR(255) UNIQUE NOT NULL,
        cover_image_url TEXT,
        hero_bg_url TEXT,
        release_date VARCHAR(100),
        genre VARCHAR(100) DEFAULT 'Death Metal',
        producer VARCHAR(100) DEFAULT 'Trojan',
        label VARCHAR(100) DEFAULT 'Iron Tomb Records',
        listen_url TEXT,
        video_url TEXT,
        press_kit_url TEXT,
        intro_headline TEXT,
        intro_body TEXT,
        highlight_title VARCHAR(255),
        highlight_body TEXT,
        feature_title VARCHAR(255),
        feature_body TEXT,
        feature_image_url TEXT,
        feature_points JSONB,
        legacy_title VARCHAR(255),
        legacy_points JSONB,
        current_title VARCHAR(255),
        current_points JSONB,
        sound_character TEXT,
        quote_text TEXT,
        quote_author VARCHAR(255),
        personnel_body TEXT,
        personnel_members JSONB,
        contact_phone VARCHAR(255),
        social_instagram VARCHAR(255),
        social_facebook VARCHAR(255),
        social_youtube VARCHAR(255),
        discography_summary TEXT,
        music_credits JSONB,
        lyrics TEXT,
        video_embed_url TEXT,
        tracklist_info TEXT,
        press_email VARCHAR(255) DEFAULT 'trojandeath79@gmail.com',
        meta_title VARCHAR(255),
        meta_description TEXT,
        meta_keywords VARCHAR(255),
        is_published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `
    // Seed Press Releases if missing
    const prs = await sql`SELECT id FROM press_releases LIMIT 1`
    if (prs.length === 0) {
      for (const pr of memoryStore.pressReleases) {
        await sql`
          INSERT INTO press_releases (title, subtitle, slug, cover_image_url, hero_bg_url, release_date, genre, producer, label, listen_url, video_url, press_kit_url, intro_headline, intro_body, highlight_title, highlight_body, feature_title, feature_body, feature_image_url, feature_points, legacy_title, legacy_points, current_title, current_points, sound_character, quote_text, quote_author, personnel_body, personnel_members, contact_phone, social_instagram, social_facebook, social_youtube, discography_summary, music_credits, lyrics, video_embed_url, tracklist_info, press_email, is_published)
          VALUES (${pr.title}, ${pr.subtitle}, ${pr.slug}, ${pr.cover_image_url}, ${pr.hero_bg_url}, ${pr.release_date}, ${pr.genre}, ${pr.producer}, ${pr.label}, ${pr.listen_url}, ${pr.video_url}, ${pr.press_kit_url}, ${pr.intro_headline}, ${pr.intro_body}, ${pr.highlight_title}, ${pr.highlight_body}, ${pr.feature_title}, ${pr.feature_body}, ${pr.feature_image_url}, ${JSON.stringify(pr.feature_points)}, ${pr.legacy_title}, ${JSON.stringify(pr.legacy_points)}, ${pr.current_title}, ${JSON.stringify(pr.current_points)}, ${pr.sound_character}, ${pr.quote_text}, ${pr.quote_author}, ${pr.personnel_body}, ${JSON.stringify(pr.personnel_members)}, ${pr.contact_phone}, ${pr.social_instagram}, ${pr.social_facebook}, ${pr.social_youtube}, ${pr.discography_summary}, ${JSON.stringify(pr.music_credits)}, ${pr.lyrics}, ${pr.video_embed_url}, ${pr.tracklist_info}, ${pr.press_email}, ${pr.is_published})
        `
      }
    }
  } catch (err) {
    console.error('Error auto-migrating database schema:', err)
  }
}
