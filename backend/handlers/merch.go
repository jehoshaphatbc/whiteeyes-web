package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"whiteeyes-api/database"
	"whiteeyes-api/models"
)

// GetMerch returns all merch items ordered by sort_order (public)
func GetMerch(c *gin.Context) {
	var items []models.MerchItem
	if err := database.DB.Order("sort_order asc, id desc").Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch merchandise"})
		return
	}
	c.JSON(http.StatusOK, items)
}

// CreateMerch creates a new merch item (admin)
func CreateMerch(c *gin.Context) {
	var item models.MerchItem
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create merch item"})
		return
	}
	c.JSON(http.StatusCreated, item)
}

// UpdateMerch updates an existing merch item (admin)
func UpdateMerch(c *gin.Context) {
	id := c.Param("id")
	var item models.MerchItem
	if err := database.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "merch item not found"})
		return
	}

	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Save(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update merch item"})
		return
	}
	c.JSON(http.StatusOK, item)
}

// DeleteMerch deletes a merch item (admin)
func DeleteMerch(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&models.MerchItem{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete merch item"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "merch item deleted"})
}

// ReorderMerch updates the sort order of merch items (admin)
func ReorderMerch(c *gin.Context) {
	var items []reorderItem
	if err := c.ShouldBindJSON(&items); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for _, item := range items {
		database.DB.Model(&models.MerchItem{}).Where("id = ?", item.ID).Update("sort_order", item.SortOrder)
	}

	c.JSON(http.StatusOK, gin.H{"message": "reordered successfully"})
}
