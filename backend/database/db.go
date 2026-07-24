package database

import (
	"log"

	"whiteeyes-api/config"
	"whiteeyes-api/models"

	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Connect() {
	var err error
	var dialector gorm.Dialector

	cfg := config.App
	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	}

	switch cfg.DatabaseDriver {
	case "postgres":
		dialector = postgres.Open(cfg.DatabaseURL)
	default:
		dialector = sqlite.Open(cfg.DatabaseURL)
	}

	DB, err = gorm.Open(dialector, gormConfig)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Printf("Database connected (%s)", cfg.DatabaseDriver)
	Migrate()
}

func Migrate() {
	err := DB.AutoMigrate(
		&models.AdminUser{},
		&models.BandProfile{},
		&models.About{},
		&models.Milestone{},
		&models.Release{},
		&models.StreamingLink{},
		&models.ArtworkItem{},
		&models.Video{},
		&models.MerchItem{},
		&models.SocialLinks{},
	)
	if err != nil {
		log.Fatalf("Database migration failed: %v", err)
	}
	log.Println("Database migrated")
}
