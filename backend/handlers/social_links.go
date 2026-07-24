package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"whiteeyes-api/database"
	"whiteeyes-api/models"
)

// GetSocialLinks returns the singleton social links (public)
func GetSocialLinks(c *gin.Context) {
	var links models.SocialLinks
	if err := database.DB.First(&links).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "social links not found"})
		return
	}
	c.JSON(http.StatusOK, links)
}

// UpdateSocialLinks updates or creates the singleton social links (admin)
func UpdateSocialLinks(c *gin.Context) {
	var input models.SocialLinks
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var links models.SocialLinks
	database.DB.First(&links)

	if links.ID == 0 {
		input.ID = 1
		if err := database.DB.Create(&input).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create social links"})
			return
		}
		c.JSON(http.StatusCreated, input)
		return
	}

	if err := database.DB.Model(&links).Updates(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update social links"})
		return
	}
	database.DB.First(&links)
	c.JSON(http.StatusOK, links)
}
