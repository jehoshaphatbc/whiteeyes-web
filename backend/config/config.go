package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	// Server
	Port string
	Env  string

	// Database
	DatabaseURL     string
	DatabaseDriver  string // "sqlite" or "postgres"

	// JWT
	JWTSecret          string
	JWTExpiryHours     int
	JWTRefreshHours    int

	// CORS
	CORSOrigin string

	// Storage
	StorageBackend string // "local" or "s3"
	UploadDir      string
	UploadBaseURL  string

	// S3/MinIO (optional)
	S3Endpoint  string
	S3Bucket    string
	S3AccessKey string
	S3SecretKey string
	S3Region    string
	S3UseSSL    bool
}

var App *Config

func Load() {
	// Load .env file (ignore error in production where env vars are set directly)
	_ = godotenv.Load()

	jwtExpiry, _ := strconv.Atoi(getEnv("JWT_EXPIRY_HOURS", "24"))
	jwtRefresh, _ := strconv.Atoi(getEnv("JWT_REFRESH_HOURS", "168"))
	s3SSL, _ := strconv.ParseBool(getEnv("S3_USE_SSL", "false"))

	dbURL := getEnv("DATABASE_URL", "")
	if dbURL == "" {
		dbURL = getEnv("POSTGRES_URL", "whiteeyes.db")
	}

	dbDriver := getEnv("DATABASE_DRIVER", "")
	if dbDriver == "" {
		if dbURL != "whiteeyes.db" && (len(dbURL) > 8 && (dbURL[:8] == "postgres" || dbURL[:10] == "postgresql")) {
			dbDriver = "postgres"
		} else {
			dbDriver = "sqlite"
		}
	}

	App = &Config{
		Port:            getEnv("PORT", "8080"),
		Env:             getEnv("APP_ENV", "development"),
		DatabaseURL:     dbURL,
		DatabaseDriver:  dbDriver,
		JWTSecret:       requireEnv("JWT_SECRET"),
		JWTExpiryHours:  jwtExpiry,
		JWTRefreshHours: jwtRefresh,
		CORSOrigin:      getEnv("CORS_ORIGIN", "*"),
		StorageBackend:  getEnv("STORAGE_BACKEND", "local"),
		UploadDir:       getEnv("UPLOAD_DIR", "./uploads"),
		UploadBaseURL:   getEnv("UPLOAD_BASE_URL", "http://localhost:8080/uploads"),
		S3Endpoint:      getEnv("S3_ENDPOINT", ""),
		S3Bucket:        getEnv("S3_BUCKET", ""),
		S3AccessKey:     getEnv("S3_ACCESS_KEY", ""),
		S3SecretKey:     getEnv("S3_SECRET_KEY", ""),
		S3Region:        getEnv("S3_REGION", "us-east-1"),
		S3UseSSL:        s3SSL,
	}
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}

func requireEnv(key string) string {
	val := os.Getenv(key)
	if val == "" {
		// Use a safe default in development only
		if os.Getenv("APP_ENV") == "production" {
			log.Fatalf("Required environment variable %s is not set", key)
		}
		return "whiteeyes-dev-secret-change-in-production-please"
	}
	return val
}
