package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"whiteeyes-api/storage"
)

var StorageBackend storage.Storage

func InitStorage() {
	StorageBackend = storage.NewLocalStorage()
}

// UploadImage handles file upload (admin)
func UploadImage(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file form field is required"})
		return
	}

	subfolder := c.DefaultPostForm("subfolder", "general")

	url, err := StorageBackend.Upload(file, subfolder)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"url":      url,
		"filename": file.Filename,
		"size":     file.Size,
	})
}
