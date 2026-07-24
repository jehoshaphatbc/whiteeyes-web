export interface BandProfile {
  id: number
  band_name: string
  logo_url: string
  genre_label: string
  hero_tagline: string
  hero_bg_image_url: string
  hero_bg_video_url: string
  spotify_url: string
  youtube_url: string
  created_at?: string
  updated_at?: string
}

export interface Milestone {
  id?: number
  about_id?: number
  year: number
  text: string
  sort_order: number
}

export interface About {
  id: number
  biography: string
  formed_year: number
  origin: string
  genre: string
  style_description: string
  section_photo_url: string
  milestones: Milestone[]
  created_at?: string
  updated_at?: string
}

export interface StreamingLink {
  id?: number
  release_id?: number
  label: string
  url: string
  sort_order: number
}

export interface Release {
  id: number
  title: string
  release_type: string
  release_date: string
  description: string
  cover_art_url: string
  is_featured: boolean
  sort_order: number
  streaming_links: StreamingLink[]
  created_at?: string
  updated_at?: string
}

export interface ArtworkItem {
  id: number
  image_url: string
  title: string
  alt_text: string
  category: string
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface Video {
  id: number
  youtube_id: string
  title: string
  description: string
  is_featured: boolean
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface MerchItem {
  id: number
  image_url: string
  name: string
  description: string
  price: string
  whatsapp_number: string
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface SocialLinks {
  id: number
  instagram_url: string
  spotify_url: string
  youtube_url: string
  facebook_url: string
  whatsapp_number: string
  closing_headline: string
  created_at?: string
  updated_at?: string
}

export interface PageContent {
  band_profile: BandProfile
  about: About
  latest_release: Release
  discography: Release[]
  artwork: ArtworkItem[]
  videos: Video[]
  merch: MerchItem[]
  social_links: SocialLinks
}

export interface AdminUser {
  id: number
  email: string
  role: string
  created_at?: string
  updated_at?: string
}
