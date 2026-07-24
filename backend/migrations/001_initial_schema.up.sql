-- 001_initial_schema.up.sql

CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS band_profiles (
    id SERIAL PRIMARY KEY,
    band_name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    genre_label VARCHAR(255),
    hero_tagline TEXT,
    hero_bg_image_url TEXT,
    hero_bg_video_url TEXT,
    spotify_url TEXT,
    youtube_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS abouts (
    id SERIAL PRIMARY KEY,
    biography TEXT,
    formed_year INT,
    origin VARCHAR(255),
    genre VARCHAR(255),
    style_description VARCHAR(255),
    section_photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS milestones (
    id SERIAL PRIMARY KEY,
    about_id INT REFERENCES abouts(id) ON DELETE CASCADE,
    year INT,
    text TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS releases (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_type VARCHAR(100),
    release_date VARCHAR(100),
    description TEXT,
    cover_art_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS streaming_links (
    id SERIAL PRIMARY KEY,
    release_id INT REFERENCES releases(id) ON DELETE CASCADE,
    label VARCHAR(100),
    url TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS artwork_items (
    id SERIAL PRIMARY KEY,
    image_url TEXT,
    title VARCHAR(255),
    alt_text TEXT,
    category VARCHAR(100),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS videos (
    id SERIAL PRIMARY KEY,
    youtube_id VARCHAR(100),
    title VARCHAR(255),
    description TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS merch_items (
    id SERIAL PRIMARY KEY,
    image_url TEXT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price VARCHAR(100),
    whatsapp_number VARCHAR(100),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS social_links (
    id SERIAL PRIMARY KEY,
    instagram_url TEXT,
    spotify_url TEXT,
    youtube_url TEXT,
    facebook_url TEXT,
    whatsapp_number VARCHAR(100),
    closing_headline TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
