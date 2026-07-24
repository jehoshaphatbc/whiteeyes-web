package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"whiteeyes-api/database"
	"whiteeyes-api/models"
)

// GetAbout returns the singleton about section (public)
func GetAbout(c *gin.Context) {
	var about models.About
	if err := database.DB.Preload("Milestones").First(&about).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "about not found"})
		return
	}
	c.JSON(http.StatusOK, about)
}

// UpdateAbout creates or updates the singleton about section (admin)
func UpdateAbout(c *gin.Context) {
	var input struct {
		Biography        string            `json:"biography"`
		FormedYear       int               `json:"formed_year"`
		Origin           string            `json:"origin"`
		Genre            string            `json:"genre"`
		StyleDescription string            `json:"style_description"`
		SectionPhotoURL  string            `json:"section_photo_url"`
		Milestones       []models.Milestone `json:"milestones"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var about models.About
	database.DB.Preload("Milestones").First(&about)

	if about.ID == 0 {
		about.ID = 1
	}

	about.Biography = input.Biography
	about.FormedYear = input.FormedYear
	about.Origin = input.Origin
	about.Genre = input.Genre
	about.StyleDescription = input.StyleDescription
	about.SectionPhotoURL = input.SectionPhotoURL

	if err := database.DB.Save(&about).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save about"})
		return
	}

	// Replace milestones
	database.DB.Where("about_id = ?", about.ID).Delete(&models.Milestone{})
	for i, m := range input.Milestones {
		m.AboutID = about.ID
		m.SortOrder = i
		database.DB.Create(&m)
	}

	database.DB.Preload("Milestones").First(&about)
	c.JSON(http.StatusOK, about)
}
