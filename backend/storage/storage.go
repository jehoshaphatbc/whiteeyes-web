package storage

import "mime/multipart"

// Storage defines the interface for file storage backends.
// Swap implementations (local, S3, MinIO) without touching handler code.
type Storage interface {
	// Upload stores a file and returns its public URL
	Upload(file *multipart.FileHeader, subfolder string) (string, error)
	// Delete removes a file by its public URL
	Delete(url string) error
}
