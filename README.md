# WHITEEYES — Death Metal Band Website + Admin CMS

A premium, dark, brutal, atmospheric single-page band profile website with an admin CMS dashboard for subterranean Extreme Death Metal band **WHITEEYES**.

*Branch Workflow: `main` (default / production) | `dev` (development)*

## 🛠 Tech Stack

- **Frontend**: Nuxt 3 (Vue 3, TypeScript, `<script setup>`), Tailwind CSS (Custom Dark Void Theme), Pinia, VueUse, Nuxt Image
- **Backend**: Go 1.22+, Gin HTTP Framework, GORM (SQLite for local dev, PostgreSQL for production), JWT Auth with httpOnly cookies, bcrypt, Local Storage with MinIO/S3 interface abstraction
- **Infrastructure**: Docker & Docker Compose

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js 18+ & npm
- Go 1.22+

### 1. Run Backend API
```bash
cd backend
go run main.go
```
The Go API starts at `http://localhost:8080` and auto-populates SQLite with realistic demo band content on first launch.

### 2. Run Frontend Nuxt App
```bash
cd frontend
npm install
npm run dev
```
The Nuxt 3 app starts at `http://localhost:3000`.

---

## 🔐 Admin CMS Access

Navigate to `http://localhost:3000/admin/login`

**Default Demo Credentials (populated by seed):**
- **Email**: `admin@whiteeyes.metal`
- **Password**: `Whiteeyes2026!`

The CMS allows editing:
1. **Band Profile**: Band logo, hero background, taglines, Spotify/YouTube links
2. **About / Bio**: Biography text (Markdown), formation stats, photo, milestone timeline
3. **Featured Release**: Spotlight cover art, description, and streaming links
4. **Discography**: CRUD albums/EPs/singles/demos, set featured release
5. **Artwork Vault**: CRUD posters, flyers, merch art, album art with lightbox viewer
6. **Videos**: CRUD YouTube embeds and featured video
7. **Merchandise**: CRUD apparel/vinyl drops with direct WhatsApp order URLs
8. **Social Links**: External platform URLs and closing headline

---

## 🐳 Docker Deployment (Production)

To run PostgreSQL, Go API, and Nuxt 3 in containerized production mode:

```bash
docker-compose up -d --build
```

- Public Website: `http://localhost:3000`
- API Backend: `http://localhost:8080`
- PostgreSQL: `localhost:5432`

---

## 🧪 Testing

### Backend Unit & Integration Tests
```bash
cd backend
go test ./tests/... -v
```

---

## 📁 Repository Structure

```
.
├── backend/                # Go REST API (Gin + GORM + JWT + SQLite/Postgres)
│   ├── config/             # Environment configuration
│   ├── database/           # GORM connection & auto-migrations
│   ├── handlers/           # HTTP handlers (auth, content, upload, page_content)
│   ├── middleware/         # JWT auth, CORS, rate limiting
│   ├── migrations/         # SQL migration files
│   ├── models/             # GORM database structs
│   ├── seed/               # Demo seed script for WHITEEYES
│   ├── storage/            # File upload interface (local + S3 stub)
│   ├── tests/              # Go tests
│   ├── main.go             # Server entrypoint
│   └── Dockerfile
├── frontend/               # Nuxt 3 Web Application
│   ├── assets/css/         # Custom main.css (grain, glitch, brutalist styling)
│   ├── components/
│   │   ├── admin/          # CMS editor components
│   │   ├── public/         # Public one-page site sections
│   │   └── ui/             # Reusable UI (Lightbox, GrainOverlay, GlitchText)
│   ├── composables/        # useAuth, usePageContent, useActiveSection, useImageUpload
│   ├── layouts/            # default.vue (public), admin.vue (CMS)
│   ├── pages/              # Single-page index.vue & admin routes
│   ├── server/api/         # Nitro server route proxies for httpOnly cookies
│   ├── stores/             # Pinia stores (auth, content)
│   ├── types/              # TypeScript interfaces
│   ├── nuxt.config.ts
│   ├── tailwind.config.ts
│   └── Dockerfile
├── docker-compose.yml      # Local/production Docker setup
└── README.md
```
