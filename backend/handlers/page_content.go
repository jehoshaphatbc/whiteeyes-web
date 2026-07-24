package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"whiteeyes-api/database"
	"whiteeyes-api/models"
)

type PageContentResponse struct {
	BandProfile   models.BandProfile   `json:"band_profile"`
	About         models.About         `json:"about"`
	LatestRelease models.Release       `json:"latest_release"`
	Discography   []models.Release     `json:"discography"`
	Artwork       []models.ArtworkItem `json:"artwork"`
	Videos        []models.Video       `json:"videos"`
	Merch         []models.MerchItem   `json:"merch"`
	SocialLinks   models.SocialLinks   `json:"social_links"`
}

// GetPageContent aggregates all front-page content in a single payload
func GetPageContent(c *gin.Context) {
	var resp PageContentResponse

	// Band profile
	database.DB.First(&resp.BandProfile)

	// About
	database.DB.Preload("Milestones").First(&resp.About)

	// Latest Release (featured or first in list)
	err := database.DB.Preload("StreamingLinks").Where("is_featured = ?", true).First(&resp.LatestRelease).Error
	if err != nil {
		database.DB.Preload("StreamingLinks").Order("sort_order asc, id desc").First(&resp.LatestRelease)
	}

	// Discography
	database.DB.Preload("StreamingLinks").Order("sort_order asc, id desc").Find(&resp.Discography)

	// Artwork
	database.DB.Order("sort_order asc, id desc").Find(&resp.Artwork)

	// Videos
	database.DB.Order("is_featured desc, sort_order asc, id desc").Find(&resp.Videos)

	// Merch
	database.DB.Order("sort_order asc, id desc").Find(&resp.Merch)

	// Social Links
	database.DB.First(&resp.SocialLinks)

	c.JSON(http.StatusOK, resp)
}
