package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"whiteeyes-api/config"
	"whiteeyes-api/database"
	"whiteeyes-api/middleware"
	"whiteeyes-api/models"
)

type loginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type authResponse struct {
	Token string           `json:"token"`
	User  models.AdminUser `json:"user"`
}

// Login handles admin authentication
func Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.AdminUser
	if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		// Constant-time failure to prevent user enumeration
		_ = bcrypt.CompareHashAndPassword([]byte("$2a$10$dummy"), []byte(req.Password))
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	token, err := generateSignedToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	// Set httpOnly cookie
	c.SetCookie(
		"auth_token",
		token,
		config.App.JWTExpiryHours*3600,
		"/",
		"",
		config.App.Env == "production",
		true,
	)

	c.JSON(http.StatusOK, authResponse{Token: token, User: user})
}

// Logout clears the auth cookie
func Logout(c *gin.Context) {
	c.SetCookie("auth_token", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "logged out"})
}

// Me returns the authenticated user's info
func Me(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var user models.AdminUser
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}

// RefreshToken issues a new token for an authenticated user
func RefreshToken(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var user models.AdminUser
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}
	token, err := generateSignedToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to refresh token"})
		return
	}
	c.SetCookie("auth_token", token, config.App.JWTExpiryHours*3600, "/", "", config.App.Env == "production", true)
	c.JSON(http.StatusOK, gin.H{"token": token})
}

func generateSignedToken(user models.AdminUser) (string, error) {
	claims := &middleware.Claims{
		UserID: user.ID,
		Email:  user.Email,
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(config.App.JWTExpiryHours) * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(config.App.JWTSecret))
}

// HashPassword hashes a plain-text password
func HashPassword(password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hashed), err
}
