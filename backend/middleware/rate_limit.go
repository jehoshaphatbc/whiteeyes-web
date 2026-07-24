package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type rateLimitEntry struct {
	count    int
	resetAt  time.Time
}

type RateLimiter struct {
	mu       sync.Mutex
	entries  map[string]*rateLimitEntry
	limit    int
	window   time.Duration
}

func NewRateLimiter(limit int, window time.Duration) *RateLimiter {
	rl := &RateLimiter{
		entries: make(map[string]*rateLimitEntry),
		limit:   limit,
		window:  window,
	}
	// Cleanup goroutine
	go func() {
		ticker := time.NewTicker(window)
		for range ticker.C {
			rl.mu.Lock()
			now := time.Now()
			for ip, e := range rl.entries {
				if now.After(e.resetAt) {
					delete(rl.entries, ip)
				}
			}
			rl.mu.Unlock()
		}
	}()
	return rl
}

func (rl *RateLimiter) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()

		rl.mu.Lock()
		entry, exists := rl.entries[ip]
		if !exists || time.Now().After(entry.resetAt) {
			rl.entries[ip] = &rateLimitEntry{
				count:   1,
				resetAt: time.Now().Add(rl.window),
			}
			rl.mu.Unlock()
			c.Next()
			return
		}
		entry.count++
		if entry.count > rl.limit {
			rl.mu.Unlock()
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error": "too many requests — try again later",
			})
			return
		}
		rl.mu.Unlock()
		c.Next()
	}
}

// LoginRateLimiter is a pre-built limiter for auth endpoints: 10 req/min per IP
var LoginRateLimiter = NewRateLimiter(10, time.Minute)
