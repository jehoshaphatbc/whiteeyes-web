package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"whiteeyes-api/database"
	"whiteeyes-api/models"
)

// GetBandProfile returns the singleton band profile (public)
func GetBandProfile(c *gin.Context) {
	var profile models.BandProfile
	if err := database.DB.First(&profile).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "band profile not found"})
		return
	}
	c.JSON(http.StatusOK, profile)
}

// UpdateBandProfile creates or updates the singleton band profile (admin)
func UpdateBandProfile(c *gin.Context) {
	var input models.BandProfile
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var profile models.BandProfile
	database.DB.First(&profile)

	if profile.ID == 0 {
		input.ID = 1
		if err := database.DB.Create(&input).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create band profile"})
			return
		}
		c.JSON(http.StatusCreated, input)
		return
	}

	if err := database.DB.Model(&profile).Updates(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update band profile"})
		return
	}
	database.DB.First(&profile)
	c.JSON(http.StatusOK, profile)
}
