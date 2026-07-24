package storage

import (
	"fmt"
	"mime/multipart"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
	"whiteeyes-api/config"
)

// LocalStorage stores files on the local filesystem
type LocalStorage struct {
	uploadDir   string
	baseURL     string
}

func NewLocalStorage() *LocalStorage {
	dir := config.App.UploadDir
	if err := os.MkdirAll(dir, 0755); err != nil {
		panic(fmt.Sprintf("failed to create upload dir %s: %v", dir, err))
	}
	return &LocalStorage{
		uploadDir: dir,
		baseURL:   config.App.UploadBaseURL,
	}
}

func (s *LocalStorage) Upload(file *multipart.FileHeader, subfolder string) (string, error) {
	// Validate extension
	ext := strings.ToLower(filepath.Ext(file.Filename))
	allowed := map[string]bool{".jpg": true, ".jpeg": true, ".png": true, ".webp": true, ".gif": true, ".svg": true}
	if !allowed[ext] {
		return "", fmt.Errorf("file type %s not allowed", ext)
	}

	// Validate size (10 MB max)
	if file.Size > 10*1024*1024 {
		return "", fmt.Errorf("file size exceeds 10 MB limit")
	}

	// Build unique filename
	timestamp := time.Now().Format("20060102")
	filename := fmt.Sprintf("%s_%s%s", timestamp, uuid.New().String()[:8], ext)

	// Create subfolder if needed
	destDir := filepath.Join(s.uploadDir, subfolder)
	if err := os.MkdirAll(destDir, 0755); err != nil {
		return "", fmt.Errorf("failed to create directory: %w", err)
	}

	destPath := filepath.Join(destDir, filename)

	// Open source
	src, err := file.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open uploaded file: %w", err)
	}
	defer src.Close()

	// Write to disk
	dst, err := os.Create(destPath)
	if err != nil {
		return "", fmt.Errorf("failed to create destination file: %w", err)
	}
	defer dst.Close()

	buf := make([]byte, 32*1024)
	for {
		n, readErr := src.Read(buf)
		if n > 0 {
			if _, writeErr := dst.Write(buf[:n]); writeErr != nil {
				return "", fmt.Errorf("failed to write file: %w", writeErr)
			}
		}
		if readErr != nil {
			break
		}
	}

	// Build public URL
	publicURL := fmt.Sprintf("%s/%s/%s", strings.TrimRight(s.baseURL, "/"), subfolder, filename)
	return publicURL, nil
}

func (s *LocalStorage) Delete(publicURL string) error {
	baseURL := strings.TrimRight(s.baseURL, "/")
	if !strings.HasPrefix(publicURL, baseURL) {
		return nil // URL not managed by this storage
	}

	relative := strings.TrimPrefix(publicURL, baseURL)
	// Sanitize path traversal
	cleaned := filepath.Clean(relative)
	if strings.Contains(cleaned, "..") {
		return fmt.Errorf("invalid path")
	}

	fullPath := filepath.Join(s.uploadDir, cleaned)
	// Ignore not-found errors
	_ = os.Remove(fullPath)
	return nil
}

// URLToPath converts a public URL back to a filesystem path (for serving)
func URLToPath(publicURL, baseURL, uploadDir string) (string, error) {
	parsed, err := url.Parse(publicURL)
	if err != nil {
		return "", err
	}
	rel := parsed.Path
	baseParsed, _ := url.Parse(baseURL)
	rel = strings.TrimPrefix(rel, baseParsed.Path)
	return filepath.Join(uploadDir, rel), nil
}
