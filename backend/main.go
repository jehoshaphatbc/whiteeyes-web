package main

import (
	"context"

	"log"
	"net/http"
	"os"
	"os/signal"

	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"whiteeyes-api/config"
	"whiteeyes-api/database"
	"whiteeyes-api/handlers"
	"whiteeyes-api/middleware"
	"whiteeyes-api/seed"
)

func main() {
	// 1. Config
	config.Load()

	if config.App.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// 2. Database
	database.Connect()

	// 3. Seed demo data if DB is empty
	seed.Seed()

	// 4. Init storage
	handlers.InitStorage()

	// 5. Router
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(middleware.CORS())

	// Serve uploaded files static directory
	r.Static("/uploads", config.App.UploadDir)

	// API v1 group
	v1 := r.Group("/api/v1")
	{
		// --- Public Routes ---
		v1.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok", "app": "whiteeyes-api"})
		})
		v1.GET("/page-content", handlers.GetPageContent)
		v1.GET("/band-profile", handlers.GetBandProfile)
		v1.GET("/about", handlers.GetAbout)
		v1.GET("/latest-release", handlers.GetLatestRelease)
		v1.GET("/discography", handlers.GetDiscography)
		v1.GET("/discography/:id", handlers.GetReleaseByID)
		v1.GET("/artwork", handlers.GetArtwork)
		v1.GET("/videos", handlers.GetVideos)
		v1.GET("/merch", handlers.GetMerch)
		v1.GET("/social-links", handlers.GetSocialLinks)

		// --- Auth Routes ---
		authGroup := v1.Group("/auth")
		{
			authGroup.POST("/login", middleware.LoginRateLimiter.Middleware(), handlers.Login)
			authGroup.POST("/logout", handlers.Logout)
			authGroup.GET("/me", middleware.RequireAuth(), handlers.Me)
			authGroup.POST("/refresh", middleware.RequireAuth(), handlers.RefreshToken)
		}

		// --- Admin Protected Routes ---
		admin := v1.Group("/admin")
		admin.Use(middleware.RequireAuth())
		{
			// Upload
			admin.POST("/upload", handlers.UploadImage)

			// Singletons
			admin.PUT("/band-profile", handlers.UpdateBandProfile)
			admin.PUT("/about", handlers.UpdateAbout)
			admin.PUT("/social-links", handlers.UpdateSocialLinks)

			// Discography CRUD + Reorder + Set Featured
			admin.POST("/discography", handlers.CreateRelease)
			admin.PUT("/discography/:id", handlers.UpdateRelease)
			admin.DELETE("/discography/:id", handlers.DeleteRelease)
			admin.POST("/discography/reorder", handlers.ReorderDiscography)
			admin.PUT("/discography/:id/featured", handlers.SetFeaturedRelease)

			// Artwork CRUD + Reorder
			admin.POST("/artwork", handlers.CreateArtwork)
			admin.PUT("/artwork/:id", handlers.UpdateArtwork)
			admin.DELETE("/artwork/:id", handlers.DeleteArtwork)
			admin.POST("/artwork/reorder", handlers.ReorderArtwork)

			// Videos CRUD + Reorder
			admin.POST("/videos", handlers.CreateVideo)
			admin.PUT("/videos/:id", handlers.UpdateVideo)
			admin.DELETE("/videos/:id", handlers.DeleteVideo)
			admin.POST("/videos/reorder", handlers.ReorderVideos)

			// Merch CRUD + Reorder
			admin.POST("/merch", handlers.CreateMerch)
			admin.PUT("/merch/:id", handlers.UpdateMerch)
			admin.DELETE("/merch/:id", handlers.DeleteMerch)
			admin.POST("/merch/reorder", handlers.ReorderMerch)
		}
	}

	// 6. Graceful Shutdown
	srv := &http.Server{
		Addr:    ":" + config.App.Port,
		Handler: r,
	}

	go func() {
		log.Printf("⚡ WHITEEYES Go API listening on port %s", config.App.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server ListenAndServe error: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down API server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("API server stopped gracefully")
}
