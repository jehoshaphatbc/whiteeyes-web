package handler

import (
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"whiteeyes-api/config"
	"whiteeyes-api/database"
	"whiteeyes-api/handlers"
	"whiteeyes-api/middleware"
	"whiteeyes-api/seed"
)

var (
	app  *gin.Engine
	once sync.Once
)

func initApp() {
	config.Load()
	database.Connect()
	seed.Seed()
	handlers.InitStorage()

	gin.SetMode(gin.ReleaseMode)
	app = gin.New()
	app.Use(gin.Recovery())
	app.Use(middleware.CORS())

	v1 := app.Group("/api/v1")
	{
		v1.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok", "app": "whiteeyes-api-vercel-serverless"})
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

		authGroup := v1.Group("/auth")
		{
			authGroup.POST("/login", middleware.LoginRateLimiter.Middleware(), handlers.Login)
			authGroup.POST("/logout", handlers.Logout)
			authGroup.GET("/me", middleware.RequireAuth(), handlers.Me)
			authGroup.POST("/refresh", middleware.RequireAuth(), handlers.RefreshToken)
		}

		admin := v1.Group("/admin")
		admin.Use(middleware.RequireAuth())
		{
			admin.POST("/upload", handlers.UploadImage)
			admin.PUT("/band-profile", handlers.UpdateBandProfile)
			admin.PUT("/about", handlers.UpdateAbout)
			admin.PUT("/social-links", handlers.UpdateSocialLinks)
			admin.POST("/discography", handlers.CreateRelease)
			admin.PUT("/discography/:id", handlers.UpdateRelease)
			admin.DELETE("/discography/:id", handlers.DeleteRelease)
			admin.POST("/discography/reorder", handlers.ReorderDiscography)
			admin.PUT("/discography/:id/featured", handlers.SetFeaturedRelease)
			admin.POST("/artwork", handlers.CreateArtwork)
			admin.PUT("/artwork/:id", handlers.UpdateArtwork)
			admin.DELETE("/artwork/:id", handlers.DeleteArtwork)
			admin.POST("/artwork/reorder", handlers.ReorderArtwork)
			admin.POST("/videos", handlers.CreateVideo)
			admin.PUT("/videos/:id", handlers.UpdateVideo)
			admin.DELETE("/videos/:id", handlers.DeleteVideo)
			admin.POST("/videos/reorder", handlers.ReorderVideos)
			admin.POST("/merch", handlers.CreateMerch)
			admin.PUT("/merch/:id", handlers.UpdateMerch)
			admin.DELETE("/merch/:id", handlers.DeleteMerch)
			admin.POST("/merch/reorder", handlers.ReorderMerch)
		}
	}
}

// Handler is exported for Vercel Go Serverless Functions
func Handler(w http.ResponseWriter, r *http.Request) {
	once.Do(initApp)
	app.ServeHTTP(w, r)
}
