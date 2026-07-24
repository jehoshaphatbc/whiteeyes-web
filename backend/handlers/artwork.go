package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"whiteeyes-api/database"
	"whiteeyes-api/models"
)

// GetArtwork returns all artwork items ordered by sort_order (public)
func GetArtwork(c *gin.Context) {
	var artwork []models.ArtworkItem
	if err := database.DB.Order("sort_order asc, id desc").Find(&artwork).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch artwork"})
		return
	}
	c.JSON(http.StatusOK, artwork)
}

// CreateArtwork creates a new artwork item (admin)
func CreateArtwork(c *gin.Context) {
	var item models.ArtworkItem
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create artwork item"})
		return
	}
	c.JSON(http.StatusCreated, item)
}

// UpdateArtwork updates an existing artwork item (admin)
func UpdateArtwork(c *gin.Context) {
	id := c.Param("id")
	var item models.ArtworkItem
	if err := database.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "artwork item not found"})
		return
	}

	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Save(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update artwork item"})
		return
	}
	c.JSON(http.StatusOK, item)
}

// DeleteArtwork deletes an artwork item (admin)
func DeleteArtwork(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&models.ArtworkItem{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete artwork item"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "artwork item deleted"})
}

// ReorderArtwork updates sort order of artwork items (admin)
func ReorderArtwork(c *gin.Context) {
	var items []reorderItem
	if err := c.ShouldBindJSON(&items); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for _, item := range items {
		database.DB.Model(&models.ArtworkItem{}).Where("id = ?", item.ID).Update("sort_order", item.SortOrder)
	}

	c.JSON(http.StatusOK, gin.H{"message": "reordered successfully"})
}
