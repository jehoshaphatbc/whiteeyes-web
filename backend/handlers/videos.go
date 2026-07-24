package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"whiteeyes-api/database"
	"whiteeyes-api/models"
)

// GetVideos returns all videos ordered by sort_order (public)
func GetVideos(c *gin.Context) {
	var videos []models.Video
	if err := database.DB.Order("is_featured desc, sort_order asc, id desc").Find(&videos).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch videos"})
		return
	}
	c.JSON(http.StatusOK, videos)
}

// CreateVideo creates a new video entry (admin)
func CreateVideo(c *gin.Context) {
	var video models.Video
	if err := c.ShouldBindJSON(&video); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if video.IsFeatured {
		database.DB.Model(&models.Video{}).Where("is_featured = ?", true).Update("is_featured", false)
	}

	if err := database.DB.Create(&video).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create video"})
		return
	}
	c.JSON(http.StatusCreated, video)
}

// UpdateVideo updates an existing video (admin)
func UpdateVideo(c *gin.Context) {
	id := c.Param("id")
	var video models.Video
	if err := database.DB.First(&video, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "video not found"})
		return
	}

	var input models.Video
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.IsFeatured && !video.IsFeatured {
		database.DB.Model(&models.Video{}).Where("is_featured = ?", true).Update("is_featured", false)
	}

	input.ID = video.ID
	if err := database.DB.Save(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update video"})
		return
	}
	c.JSON(http.StatusOK, input)
}

// DeleteVideo deletes a video (admin)
func DeleteVideo(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&models.Video{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete video"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "video deleted"})
}

// ReorderVideos updates the sort order of videos (admin)
func ReorderVideos(c *gin.Context) {
	var items []reorderItem
	if err := c.ShouldBindJSON(&items); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for _, item := range items {
		database.DB.Model(&models.Video{}).Where("id = ?", item.ID).Update("sort_order", item.SortOrder)
	}

	c.JSON(http.StatusOK, gin.H{"message": "reordered successfully"})
}
