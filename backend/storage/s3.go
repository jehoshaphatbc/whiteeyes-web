package storage

import (
	"fmt"
	"mime/multipart"
)

// S3Storage is a stub implementing the Storage interface for S3/MinIO.
// Wire in a real S3 client (e.g. aws-sdk-go-v2 or minio-go) here.
type S3Storage struct {
	endpoint  string
	bucket    string
	accessKey string
	secretKey string
	region    string
	useSSL    bool
	baseURL   string
}

func NewS3Storage(endpoint, bucket, accessKey, secretKey, region string, useSSL bool, baseURL string) *S3Storage {
	return &S3Storage{
		endpoint:  endpoint,
		bucket:    bucket,
		accessKey: accessKey,
		secretKey: secretKey,
		region:    region,
		useSSL:    useSSL,
		baseURL:   baseURL,
	}
}

func (s *S3Storage) Upload(file *multipart.FileHeader, subfolder string) (string, error) {
	// TODO: implement with minio-go or aws-sdk-go-v2
	return "", fmt.Errorf("S3 storage not yet implemented — use STORAGE_BACKEND=local")
}

func (s *S3Storage) Delete(url string) error {
	// TODO: implement with minio-go or aws-sdk-go-v2
	return fmt.Errorf("S3 storage not yet implemented — use STORAGE_BACKEND=local")
}
