package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"whiteeyes-api/database"
	"whiteeyes-api/models"
)

// GetLatestRelease returns the single featured release (public)
func GetLatestRelease(c *gin.Context) {
	var release models.Release
	err := database.DB.Preload("StreamingLinks").Where("is_featured = ?", true).First(&release).Error
	if err != nil {
		// Fallback to the latest release by date/id
		err = database.DB.Preload("StreamingLinks").Order("sort_order asc, id desc").First(&release).Error
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "no featured release found"})
			return
		}
	}
	c.JSON(http.StatusOK, release)
}

// GetDiscography returns all releases ordered by sort_order (public)
func GetDiscography(c *gin.Context) {
	var releases []models.Release
	if err := database.DB.Preload("StreamingLinks").Order("sort_order asc, id desc").Find(&releases).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch discography"})
		return
	}
	c.JSON(http.StatusOK, releases)
}

// GetReleaseByID returns a single release (public)
func GetReleaseByID(c *gin.Context) {
	id := c.Param("id")
	var release models.Release
	if err := database.DB.Preload("StreamingLinks").First(&release, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "release not found"})
		return
	}
	c.JSON(http.StatusOK, release)
}

type releaseInput struct {
	Title          string                 `json:"title" binding:"required"`
	ReleaseType    string                 `json:"release_type"`
	ReleaseDate    string                 `json:"release_date"`
	Description    string                 `json:"description"`
	CoverArtURL    string                 `json:"cover_art_url"`
	IsFeatured     bool                   `json:"is_featured"`
	SortOrder      int                    `json:"sort_order"`
	StreamingLinks []models.StreamingLink `json:"streaming_links"`
}

// CreateRelease creates a new release (admin)
func CreateRelease(c *gin.Context) {
	var input releaseInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.IsFeatured {
		// Clear existing featured release
		database.DB.Model(&models.Release{}).Where("is_featured = ?", true).Update("is_featured", false)
	}

	release := models.Release{
		Title:       input.Title,
		ReleaseType: input.ReleaseType,
		ReleaseDate: input.ReleaseDate,
		Description: input.Description,
		CoverArtURL: input.CoverArtURL,
		IsFeatured:  input.IsFeatured,
		SortOrder:   input.SortOrder,
	}

	if err := database.DB.Create(&release).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create release"})
		return
	}

	for i, link := range input.StreamingLinks {
		link.ReleaseID = release.ID
		link.SortOrder = i
		database.DB.Create(&link)
	}

	database.DB.Preload("StreamingLinks").First(&release, release.ID)
	c.JSON(http.StatusCreated, release)
}

// UpdateRelease updates an existing release (admin)
func UpdateRelease(c *gin.Context) {
	id := c.Param("id")
	var release models.Release
	if err := database.DB.First(&release, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "release not found"})
		return
	}

	var input releaseInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.IsFeatured && !release.IsFeatured {
		database.DB.Model(&models.Release{}).Where("is_featured = ?", true).Update("is_featured", false)
	}

	release.Title = input.Title
	release.ReleaseType = input.ReleaseType
	release.ReleaseDate = input.ReleaseDate
	release.Description = input.Description
	release.CoverArtURL = input.CoverArtURL
	release.IsFeatured = input.IsFeatured
	release.SortOrder = input.SortOrder

	if err := database.DB.Save(&release).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update release"})
		return
	}

	// Replace streaming links
	database.DB.Where("release_id = ?", release.ID).Delete(&models.StreamingLink{})
	for i, link := range input.StreamingLinks {
		link.ReleaseID = release.ID
		link.SortOrder = i
		database.DB.Create(&link)
	}

	database.DB.Preload("StreamingLinks").First(&release, release.ID)
	c.JSON(http.StatusOK, release)
}

// DeleteRelease deletes a release (admin)
func DeleteRelease(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&models.Release{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete release"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "release deleted"})
}

type reorderItem struct {
	ID        uint `json:"id"`
	SortOrder int  `json:"sort_order"`
}

// ReorderDiscography updates the sort order of discography items (admin)
func ReorderDiscography(c *gin.Context) {
	var items []reorderItem
	if err := c.ShouldBindJSON(&items); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for _, item := range items {
		database.DB.Model(&models.Release{}).Where("id = ?", item.ID).Update("sort_order", item.SortOrder)
	}

	c.JSON(http.StatusOK, gin.H{"message": "reordered successfully"})
}

// SetFeaturedRelease marks a release as the featured/latest release (admin)
func SetFeaturedRelease(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	database.DB.Model(&models.Release{}).Where("is_featured = ?", true).Update("is_featured", false)
	if err := database.DB.Model(&models.Release{}).Where("id = ?", id).Update("is_featured", true).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to set featured release"})
		return
	}

	var release models.Release
	database.DB.Preload("StreamingLinks").First(&release, id)
	c.JSON(http.StatusOK, release)
}
