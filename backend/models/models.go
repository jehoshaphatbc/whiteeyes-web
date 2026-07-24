package models

import (
	"time"
)

// AdminUser represents an admin account
type AdminUser struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Email        string    `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash string    `gorm:"not null" json:"-"`
	Role         string    `gorm:"default:'admin'" json:"role"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// BandProfile is a singleton — always ID=1
type BandProfile struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	BandName        string    `gorm:"not null" json:"band_name"`
	LogoURL         string    `json:"logo_url"`
	GenreLabel      string    `json:"genre_label"`
	HeroTagline     string    `json:"hero_tagline"`
	HeroBgImageURL  string    `json:"hero_bg_image_url"`
	HeroBgVideoURL  string    `json:"hero_bg_video_url"`
	SpotifyURL      string    `json:"spotify_url"`
	YouTubeURL      string    `json:"youtube_url"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// About is a singleton — always ID=1
type About struct {
	ID              uint        `gorm:"primaryKey" json:"id"`
	Biography       string      `gorm:"type:text" json:"biography"`
	FormedYear      int         `json:"formed_year"`
	Origin          string      `json:"origin"`
	Genre           string      `json:"genre"`
	StyleDescription string     `json:"style_description"`
	SectionPhotoURL string      `json:"section_photo_url"`
	Milestones      []Milestone `gorm:"foreignKey:AboutID;constraint:OnDelete:CASCADE" json:"milestones"`
	CreatedAt       time.Time   `json:"created_at"`
	UpdatedAt       time.Time   `json:"updated_at"`
}

// Milestone is a line item in the About section timeline
type Milestone struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	AboutID   uint      `gorm:"not null" json:"about_id"`
	Year      int       `json:"year"`
	Text      string    `json:"text"`
	SortOrder int       `json:"sort_order"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Release represents both the featured release (is_featured=true) and discography entries
type Release struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	Title          string         `gorm:"not null" json:"title"`
	ReleaseType    string         `json:"release_type"` // Album, EP, Single, Demo
	ReleaseDate    string         `json:"release_date"` // stored as string for flexibility e.g. "2024", "March 2024"
	Description    string         `gorm:"type:text" json:"description"`
	CoverArtURL    string         `json:"cover_art_url"`
	IsFeatured     bool           `gorm:"default:false;index" json:"is_featured"`
	SortOrder      int            `json:"sort_order"`
	StreamingLinks []StreamingLink `gorm:"foreignKey:ReleaseID;constraint:OnDelete:CASCADE" json:"streaming_links"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
}

// StreamingLink is a label+URL pair attached to a release
type StreamingLink struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	ReleaseID uint      `gorm:"not null" json:"release_id"`
	Label     string    `json:"label"` // e.g. "Spotify", "Apple Music", "Bandcamp"
	URL       string    `json:"url"`
	SortOrder int       `json:"sort_order"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// ArtworkItem is a single artwork image entry
type ArtworkItem struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	ImageURL  string    `json:"image_url"`
	Title     string    `json:"title"`
	AltText   string    `json:"alt_text"`
	Category  string    `json:"category"` // Album Art, Poster, Flyer, Merch Art, Other
	SortOrder int       `json:"sort_order"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Video represents a YouTube video entry
type Video struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	YouTubeID   string    `json:"youtube_id"`
	Title       string    `json:"title"`
	Description string    `gorm:"type:text" json:"description"`
	IsFeatured  bool      `gorm:"default:false;index" json:"is_featured"`
	SortOrder   int       `json:"sort_order"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// MerchItem represents a merchandise product
type MerchItem struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	ImageURL         string    `json:"image_url"`
	Name             string    `gorm:"not null" json:"name"`
	Description      string    `gorm:"type:text" json:"description"`
	Price            string    `json:"price"` // flexible text: "$25", "USD 25", etc.
	WhatsAppNumber   string    `json:"whatsapp_number"` // overrides global if set
	SortOrder        int       `json:"sort_order"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

// SocialLinks is a singleton — always ID=1
type SocialLinks struct {
	ID                uint      `gorm:"primaryKey" json:"id"`
	InstagramURL      string    `json:"instagram_url"`
	SpotifyURL        string    `json:"spotify_url"`
	YouTubeURL        string    `json:"youtube_url"`
	FacebookURL       string    `json:"facebook_url"`
	WhatsAppNumber    string    `json:"whatsapp_number"`
	ClosingHeadline   string    `json:"closing_headline"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}
