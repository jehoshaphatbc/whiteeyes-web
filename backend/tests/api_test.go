package tests

import (
	"bytes"

	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"whiteeyes-api/config"
	"whiteeyes-api/database"
	"whiteeyes-api/handlers"
	"whiteeyes-api/middleware"
	"whiteeyes-api/seed"
)

func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	config.App = &config.Config{
		DatabaseDriver: "sqlite",
		DatabaseURL:    ":memory:",
		JWTSecret:      "test-secret-key-12345",
		JWTExpiryHours: 1,
		CORSOrigin:     "*",
		UploadDir:      "./test_uploads",
		UploadBaseURL:  "http://localhost:8080/uploads",
	}

	database.Connect()
	seed.Seed()

	r := gin.New()
	v1 := r.Group("/api/v1")
	{
		v1.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok"})
		})
		v1.GET("/page-content", handlers.GetPageContent)
		v1.GET("/discography", handlers.GetDiscography)

		auth := v1.Group("/auth")
		{
			auth.POST("/login", handlers.Login)
			auth.GET("/me", middleware.RequireAuth(), handlers.Me)
		}

		admin := v1.Group("/admin")
		admin.Use(middleware.RequireAuth())
		{
			admin.POST("/discography", handlers.CreateRelease)
			admin.DELETE("/discography/:id", handlers.DeleteRelease)
		}
	}
	return r
}

func TestHealthCheck(t *testing.T) {
	r := setupTestRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/v1/health", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected 200 OK, got %d", w.Code)
	}
}

func TestLoginSuccess(t *testing.T) {
	r := setupTestRouter()

	body, _ := json.Marshal(map[string]string{
		"email":    "admin@whiteeyes.metal",
		"password": "Whiteeyes2026!",
	})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected 200 OK, got %d: %s", w.Code, w.Body.String())
	}

	var resp map[string]interface{}
	_ = json.Unmarshal(w.Body.Bytes(), &resp)
	if resp["token"] == nil || resp["token"] == "" {
		t.Fatalf("Expected token in response, got nil")
	}
}

func TestLoginInvalidPassword(t *testing.T) {
	r := setupTestRouter()

	body, _ := json.Marshal(map[string]string{
		"email":    "admin@whiteeyes.metal",
		"password": "WrongPassword123!",
	})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("Expected 401 Unauthorized, got %d", w.Code)
	}
}

func TestDiscographyPublicAndAdmin(t *testing.T) {
	r := setupTestRouter()

	// 1. Get public discography
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/v1/discography", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected 200 OK, got %d", w.Code)
	}

	// 2. Try unauthenticated create (should fail 401)
	createBody, _ := json.Marshal(map[string]interface{}{
		"title":        "Unauthorized EP",
		"release_type": "EP",
	})
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("POST", "/api/v1/admin/discography", bytes.NewBuffer(createBody))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("Expected 401 Unauthorized for admin create without token, got %d", w.Code)
	}
}
