-- =================================================================
-- WHITEEYES EXTREME DEATH METAL — NEON POSTGRESQL SCHEMA & DEMO SEED
-- Paste and run this script in Neon Console (console.neon.tech) SQL Editor
-- =================================================================

-- 1. DROP EXISTING TABLES (IF RE-SEEDING)
DROP TABLE IF EXISTS streaming_links CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS releases CASCADE;
DROP TABLE IF EXISTS artwork_items CASCADE;
DROP TABLE IF EXISTS videos CASCADE;
DROP TABLE IF EXISTS merch_items CASCADE;
DROP TABLE IF EXISTS social_links CASCADE;
DROP TABLE IF EXISTS seo_settings CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS abouts CASCADE;
DROP TABLE IF EXISTS band_profiles CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- 2. CREATE SCHEMAS
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE band_profiles (
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

CREATE TABLE abouts (
    id SERIAL PRIMARY KEY,
    biography TEXT,
    formed_year INT,
    origin VARCHAR(255),
    genre VARCHAR(255),
    style_description VARCHAR(255),
    section_photo_url TEXT
);

CREATE TABLE milestones (
    id SERIAL PRIMARY KEY,
    about_id INT REFERENCES abouts(id) ON DELETE CASCADE,
    year INT,
    text TEXT,
    sort_order INT DEFAULT 0
);

CREATE TABLE releases (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_type VARCHAR(100),
    release_date VARCHAR(100),
    description TEXT,
    cover_art_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0
);

CREATE TABLE streaming_links (
    id SERIAL PRIMARY KEY,
    release_id INT REFERENCES releases(id) ON DELETE CASCADE,
    label VARCHAR(100),
    url TEXT,
    sort_order INT DEFAULT 0
);

CREATE TABLE artwork_items (
    id SERIAL PRIMARY KEY,
    image_url TEXT,
    title VARCHAR(255),
    alt_text TEXT,
    category VARCHAR(100),
    sort_order INT DEFAULT 0
);

CREATE TABLE videos (
    id SERIAL PRIMARY KEY,
    youtube_id VARCHAR(100),
    title VARCHAR(255),
    description TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0
);

CREATE TABLE merch_items (
    id SERIAL PRIMARY KEY,
    image_url TEXT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price VARCHAR(100),
    whatsapp_number VARCHAR(100),
    sort_order INT DEFAULT 0
);

CREATE TABLE social_links (
    id SERIAL PRIMARY KEY,
    instagram_url TEXT,
    spotify_url TEXT,
    youtube_url TEXT,
    facebook_url TEXT,
    whatsapp_number VARCHAR(100),
    closing_headline TEXT
);

CREATE TABLE seo_settings (
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

CREATE TABLE blog_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blog_posts (
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

-- =================================================================
-- 3. INSERT DEMO SEED DATA
-- =================================================================

-- Admin User: admin@whiteeyes.metal / Whiteeyes2026!
INSERT INTO admin_users (email, password_hash, role) VALUES 
('admin@whiteeyes.metal', '$2a$10$jPkEiU0QgyGItNwX1YBYmuR/Ph0D4Rd/YKwuSR4BaH.tGip/Cuufq', 'superadmin');

-- Band Profile (Hero Section)
INSERT INTO band_profiles (id, band_name, logo_url, genre_label, hero_tagline, hero_bg_image_url, spotify_url, youtube_url) VALUES 
(1, 'WHITEEYES', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop', 'Extreme Death Metal', 'CHRONICLES OF VISCERAL DECAY AND DISSOLUTION', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1920&auto=format&fit=crop', 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');

-- About Section
INSERT INTO abouts (id, biography, formed_year, origin, genre, style_description, section_photo_url) VALUES 
(1, 'Forged in the subterranean damp of Jakarta''s underground, WHITEEYES executes uncompromising, blastbeat-driven Death Metal steeped in dissonant atmospheric dread. Drawing influence from early Scandinavian brutality and modern avant-garde extreme metal, the quartet crafts sonic monoliths dedicated to existential horror, bodily decay, and primordial darkness.', 2019, 'Jakarta, Indonesia', 'Death Metal', 'Dissonant / Atmospheric / Brutal', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop');

-- Timeline Milestones
INSERT INTO milestones (about_id, year, text, sort_order) VALUES 
(1, 2019, 'Band formed in Jakarta subterranean rehearsal space', 0),
(1, 2021, 'Released self-titled debut demo EP "Void of Sight"', 1),
(1, 2023, 'Headlined Southeast Asian Underground Metal Summit', 2),
(1, 2024, 'Unveiled sophomore LP "Chronicles of Decay" via Iron Tomb Records', 3);

-- Releases & Discography
INSERT INTO releases (id, title, release_type, release_date, description, cover_art_url, is_featured, sort_order) VALUES 
(1, 'CHRONICLES OF DECAY', 'Full-Length Album', '2024', 'Eight tracks of relentless sonic warfare exploring the collapse of physical and metaphysical consciousness.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', TRUE, 0),
(2, 'MONOLITH OF FILTH', 'EP', '2022', 'A frantic, 19-minute assault of cavernous riffs and suffocating vocal terror.', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop', FALSE, 1),
(3, 'VOID OF SIGHT', 'Demo', '2021', 'Raw, unrefined 4-track cassette recording that birthed the band''s signature atmospheric violence.', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop', FALSE, 2);

-- Streaming Links
INSERT INTO streaming_links (release_id, label, url, sort_order) VALUES 
(1, 'Spotify', 'https://open.spotify.com', 0),
(1, 'Apple Music', 'https://music.apple.com', 1),
(1, 'Bandcamp', 'https://bandcamp.com', 2),
(2, 'Spotify', 'https://open.spotify.com', 0),
(2, 'Bandcamp', 'https://bandcamp.com', 1),
(3, 'Bandcamp', 'https://bandcamp.com', 0);

-- Artwork Archive
INSERT INTO artwork_items (title, alt_text, category, image_url, sort_order) VALUES 
('Chronicles Cover Art', 'Album cover art showing visceral abstract horror', 'Album Art', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', 0),
('Tour Flyer 2024', 'Black and white underground metal tour flyer', 'Flyer', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop', 1),
('Monolith Artwork', 'Dark abstract ink artwork', 'Album Art', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop', 2),
('Decay Tee Print', 'Distressed skull and barbed wire print design', 'Merch Art', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop', 3),
('Subterranean Ritual Poster', 'Concert poster for live show in Jakarta', 'Poster', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop', 4);

-- Videos
INSERT INTO videos (youtube_id, title, description, is_featured, sort_order) VALUES 
('L_LUpnjgPso', 'Chronicles of Decay (Official Video)', 'Official music video directed by Void Visuals. Shot on 16mm film.', TRUE, 0),
('dQw4w9WgXcQ', 'Live at Hammersonic Underground 2023', 'Full set performance live at Hammersonic Underground stage.', FALSE, 1),
('3JZ_D3ELwOQ', 'Monolith of Filth (Live Rehearsal)', 'Raw multi-cam studio session recorded live in Jakarta.', FALSE, 2);

-- Merch Items
INSERT INTO merch_items (name, description, price, image_url, sort_order) VALUES 
('CHRONICLES TEE (V1)', 'Heavyweight 220gsm black cotton tee with screenprinted album artwork front and back tracklist.', '$25', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop', 0),
('VOID ARCHIVE HOODIE', 'Ultra-heavy 400gsm fleece hoodie with embroidered chest logo and distressed sleeve prints.', '$55', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop', 1),
('LIMITED VINYL LP - BLOOD SMOKE', '180g blood splatter vinyl limited to 300 hand-numbered copies worldwide.', '$30', 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop', 2);

-- Social Links
INSERT INTO social_links (id, instagram_url, spotify_url, youtube_url, facebook_url, whatsapp_number, closing_headline) VALUES 
(1, 'https://instagram.com/whiteeyes.official', 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02', 'https://youtube.com/@whiteeyesmetal', 'https://facebook.com/whiteeyesband', '6281234567890', 'JOIN THE ABYSS');

-- SEO Settings
INSERT INTO seo_settings (id, meta_title, meta_description, meta_keywords, og_title, og_description, og_image_url, twitter_card_type, canonical_url) VALUES 
(1, 'WHITEEYES — Extreme Death Metal', 'Official portal of subterranean Extreme Death Metal band WHITEEYES from Jakarta. Stream discography, view artwork, watch live transmissions, and order official merchandise.', 'WHITEEYES, Death Metal, Extreme Metal, Jakarta Death Metal, Underground Metal, Chronicles of Decay', 'WHITEEYES — Extreme Death Metal', 'Official portal of WHITEEYES. Underground Death Metal from Jakarta.', '/favicon.png', 'summary_large_image', 'https://whiteeyes-web.vercel.app');

-- Blog Posts
INSERT INTO blog_posts (id, title, slug, excerpt, content, cover_image_url, author, category, meta_title, meta_description, meta_keywords, is_published) VALUES
(1, 'Chronicles of Decay LP Official Release & Tour Manifest', 'chronicles-of-decay-release-and-tour-manifest', 'The subterranean sonic warfare is unleashed. Read the official release statement and upcoming tour locations across Southeast Asia.', 'Forged in the cavernous underground rehearsals of Jakarta, our sophomore full-length album "CHRONICLES OF DECAY" is officially available worldwide.\n\nRecorded on analog tape and engineered to deliver suffocating dissonance, eight monolithic tracks explore bodily decay and metaphysical dissolution.\n\nPhysical merchandise and vinyl pressings are now shipping globally via Iron Tomb Records. Prepare for the upcoming tour transmissions across Indonesia, Malaysia, and Singapore.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop', 'WHITEEYES', 'Announcement', 'Chronicles of Decay LP Release & Tour | WHITEEYES', 'Official release announcement for Chronicles of Decay LP and Southeast Asian tour manifest by WHITEEYES.', 'WHITEEYES, Chronicles of Decay, Death Metal Tour, LP Release', TRUE),
(2, 'Subterranean Studio Transmissions: Recording Monolith of Filth', 'subterranean-studio-transmissions-recording-monolith-of-filth', 'An exclusive look inside our raw analog studio sessions during the creation of the cavernous EP Monolith of Filth.', 'During the damp mid-monsoon months of 2022, WHITEEYES isolated inside a subterranean rehearsal bunker to capture the suffocating energy of "Monolith of Filth".\n\nRejecting digital quantisation and modern sterile drum replacement, every track was captured live in single takes with vintage valve microphones.\n\nVisual archives and studio photo documentation can be explored in our Artwork Gallery section.', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop', 'WHITEEYES', 'Studio Report', 'Inside Monolith of Filth Studio Sessions | WHITEEYES', 'Behind the scenes into the analog studio recording sessions of Monolith of Filth EP.', 'WHITEEYES, Studio Report, Monolith of Filth, Recording Death Metal', TRUE);

-- Blog Categories
INSERT INTO blog_categories (id, name, slug) VALUES
(1, 'Announcement', 'announcement'),
(2, 'Studio Report', 'studio-report'),
(3, 'Tour News', 'tour-news'),
(4, 'Merchandise', 'merchandise');

-- Adjust SERIAL Sequences
SELECT setval('admin_users_id_seq', (SELECT MAX(id) FROM admin_users));
SELECT setval('band_profiles_id_seq', (SELECT MAX(id) FROM band_profiles));
SELECT setval('abouts_id_seq', (SELECT MAX(id) FROM abouts));
SELECT setval('milestones_id_seq', (SELECT MAX(id) FROM milestones));
SELECT setval('releases_id_seq', (SELECT MAX(id) FROM releases));
SELECT setval('streaming_links_id_seq', (SELECT MAX(id) FROM streaming_links));
SELECT setval('artwork_items_id_seq', (SELECT MAX(id) FROM artwork_items));
SELECT setval('videos_id_seq', (SELECT MAX(id) FROM videos));
SELECT setval('merch_items_id_seq', (SELECT MAX(id) FROM merch_items));
SELECT setval('social_links_id_seq', (SELECT MAX(id) FROM social_links));
SELECT setval('seo_settings_id_seq', (SELECT MAX(id) FROM seo_settings));
SELECT setval('blog_posts_id_seq', (SELECT MAX(id) FROM blog_posts));
SELECT setval('blog_categories_id_seq', (SELECT MAX(id) FROM blog_categories));
