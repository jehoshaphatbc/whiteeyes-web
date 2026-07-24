package seed

import (
	"log"

	"whiteeyes-api/database"
	"whiteeyes-api/handlers"
	"whiteeyes-api/models"
)

func Seed() {
	// 1. Admin User
	var count int64
	database.DB.Model(&models.AdminUser{}).Count(&count)
	if count == 0 {
		hash, err := handlers.HashPassword("Whiteeyes2026!")
		if err != nil {
			log.Fatalf("Failed to hash seed password: %v", err)
		}
		admin := models.AdminUser{
			Email:        "admin@whiteeyes.metal",
			PasswordHash: hash,
			Role:         "admin",
		}
		database.DB.Create(&admin)
		log.Println("[SEED] Created admin user: admin@whiteeyes.metal / Whiteeyes2026!")
	}

	// 2. Band Profile
	database.DB.Model(&models.BandProfile{}).Count(&count)
	if count == 0 {
		profile := models.BandProfile{
			ID:             1,
			BandName:       "WHITEEYES",
			GenreLabel:     "Extreme Death Metal",
			HeroTagline:    "CHRONICLES OF VISCERAL DECAY AND DISSOLUTION",
			HeroBgImageURL: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1920&auto=format&fit=crop",
			SpotifyURL:     "https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02",
			YouTubeURL:     "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		}
		database.DB.Create(&profile)
		log.Println("[SEED] Created band profile for WHITEEYES")
	}

	// 3. About
	database.DB.Model(&models.About{}).Count(&count)
	if count == 0 {
		about := models.About{
			ID:               1,
			Biography:        "Forged in the subterranean damp of Jakarta's underground, **WHITEEYES** executes uncompromising, blastbeat-driven Death Metal steeped in dissonant atmospheric dread. Drawing influence from early Scandinavian brutality and modern avant-garde extreme metal, the quartet crafts sonic monoliths dedicated to existential horror, bodily decay, and primordial darkness.",
			FormedYear:       2019,
			Origin:           "Jakarta, Indonesia",
			Genre:            "Death Metal",
			StyleDescription: "Dissonant / Atmospheric / Brutal",
			SectionPhotoURL:  "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop",
			Milestones: []models.Milestone{
				{Year: 2019, Text: "Band formed in Jakarta subterranean rehearsal space", SortOrder: 0},
				{Year: 2021, Text: "Released self-titled debut demo EP 'Void of Sight'", SortOrder: 1},
				{Year: 2023, Text: "Headlined Southeast Asian Underground Metal Summit", SortOrder: 2},
				{Year: 2024, Text: "Unveiled sophomore LP 'Chronicles of Decay' via Iron Tomb Records", SortOrder: 3},
			},
		}
		database.DB.Create(&about)
		log.Println("[SEED] Created about section")
	}

	// 4. Releases
	database.DB.Model(&models.Release{}).Count(&count)
	if count == 0 {
		rel1 := models.Release{
			Title:       "CHRONICLES OF DECAY",
			ReleaseType: "Full-Length Album",
			ReleaseDate: "2024",
			Description: "Eight tracks of relentless sonic warfare exploring the collapse of physical and metaphysical consciousness.",
			CoverArtURL: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
			IsFeatured:  true,
			SortOrder:   0,
			StreamingLinks: []models.StreamingLink{
				{Label: "Spotify", URL: "https://open.spotify.com", SortOrder: 0},
				{Label: "Apple Music", URL: "https://music.apple.com", SortOrder: 1},
				{Label: "Bandcamp", URL: "https://bandcamp.com", SortOrder: 2},
			},
		}
		database.DB.Create(&rel1)

		rel2 := models.Release{
			Title:       "MONOLITH OF FILTH",
			ReleaseType: "EP",
			ReleaseDate: "2022",
			Description: "A frantic, 19-minute assault of cavernous riffs and suffocating vocal terror.",
			CoverArtURL: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop",
			IsFeatured:  false,
			SortOrder:   1,
			StreamingLinks: []models.StreamingLink{
				{Label: "Spotify", URL: "https://open.spotify.com", SortOrder: 0},
				{Label: "Bandcamp", URL: "https://bandcamp.com", SortOrder: 1},
			},
		}
		database.DB.Create(&rel2)

		rel3 := models.Release{
			Title:       "VOID OF SIGHT",
			ReleaseType: "Demo",
			ReleaseDate: "2021",
			Description: "Raw, unrefined 4-track cassette recording that birthed the band's signature atmospheric violence.",
			CoverArtURL: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop",
			IsFeatured:  false,
			SortOrder:   2,
			StreamingLinks: []models.StreamingLink{
				{Label: "Bandcamp", URL: "https://bandcamp.com", SortOrder: 0},
			},
		}
		database.DB.Create(&rel3)
		log.Println("[SEED] Created releases & streaming links")
	}

	// 5. Artwork
	database.DB.Model(&models.ArtworkItem{}).Count(&count)
	if count == 0 {
		artworks := []models.ArtworkItem{
			{Title: "Chronicles Cover Art", AltText: "Album cover art showing visceral abstract horror", Category: "Album Art", ImageURL: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop", SortOrder: 0},
			{Title: "Tour Flyer 2024", AltText: "Black and white underground metal tour flyer", Category: "Flyer", ImageURL: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop", SortOrder: 1},
			{Title: "Monolith Artwork", AltText: "Dark abstract ink artwork", Category: "Album Art", ImageURL: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop", SortOrder: 2},
			{Title: "Decay Tee Print", AltText: "Distressed skull and barbed wire print design", Category: "Merch Art", ImageURL: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop", SortOrder: 3},
			{Title: "Subterranean Ritual Poster", AltText: "Concert poster for live show in Jakarta", Category: "Poster", ImageURL: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop", SortOrder: 4},
		}
		for _, art := range artworks {
			database.DB.Create(&art)
		}
		log.Println("[SEED] Created artwork items")
	}

	// 6. Videos
	database.DB.Model(&models.Video{}).Count(&count)
	if count == 0 {
		videos := []models.Video{
			{Title: "Chronicles of Decay (Official Video)", Description: "Official music video directed by Void Visuals. Shot on 16mm film.", YouTubeID: "L_LUpnjgPso", IsFeatured: true, SortOrder: 0},
			{Title: "Live at Hammersonic Underground 2023", Description: "Full set performance live at Hammersonic Underground stage.", YouTubeID: "dQw4w9WgXcQ", IsFeatured: false, SortOrder: 1},
			{Title: "Monolith of Filth (Live Rehearsal)", Description: "Raw multi-cam studio session recorded live in Jakarta.", YouTubeID: "3JZ_D3ELwOQ", IsFeatured: false, SortOrder: 2},
		}
		for _, v := range videos {
			database.DB.Create(&v)
		}
		log.Println("[SEED] Created video items")
	}

	// 7. Merch
	database.DB.Model(&models.MerchItem{}).Count(&count)
	if count == 0 {
		merch := []models.MerchItem{
			{Name: "CHRONICLES TEE (V1)", Description: "Heavyweight 220gsm black cotton tee with screenprinted album artwork front and back tracklist.", Price: "$25", ImageURL: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop", SortOrder: 0},
			{Name: "VOID ARCHIVE HOODIE", Description: "Ultra-heavy 400gsm fleece hoodie with embroidered chest logo and distressed sleeve prints.", Price: "$55", ImageURL: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop", SortOrder: 1},
			{Name: "LIMITED VINYL LP - BLOOD SMOKE", Description: "180g blood splatter vinyl limited to 300 hand-numbered copies worldwide.", Price: "$30", ImageURL: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop", SortOrder: 2},
		}
		for _, m := range merch {
			database.DB.Create(&m)
		}
		log.Println("[SEED] Created merch items")
	}

	// 8. Social Links
	database.DB.Model(&models.SocialLinks{}).Count(&count)
	if count == 0 {
		socials := models.SocialLinks{
			ID:              1,
			InstagramURL:    "https://instagram.com/whiteeyes.official",
			SpotifyURL:      "https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02",
			YouTubeURL:      "https://youtube.com/@whiteeyesmetal",
			FacebookURL:     "https://facebook.com/whiteeyesband",
			WhatsAppNumber:  "6281234567890",
			ClosingHeadline: "JOIN THE ABYSS",
		}
		database.DB.Create(&socials)
		log.Println("[SEED] Created social links")
	}
}
