# WHITEEYES — Nuxt 3 Full-Stack Web Application

Official website & Admin CMS portal for Extreme Death Metal band **WHITEEYES**. Built as a unified **Nuxt 3 Full-Stack application** powered by Vue 3, Tailwind CSS, Pinia, Nitro server routes, and Neon PostgreSQL.

## 🚀 Features

- **Brutal Atmospheric UI**: Custom dark void aesthetic (`#0a0a0a`), SVG analog noise grain overlay, VHS scanlines, and glitch effects.
- **Single-Repo Nuxt 3 Full-Stack**: Both frontend and backend API endpoints run together in Nitro. 1-click Vercel deployment!
- **Nitro Database & Auto-Seed**: Connects directly to Neon PostgreSQL with automatic schema migration and seed populating.
- **Admin CMS Dashboard**: Built-in `/admin` dashboard with JWT auth, password encryption (bcrypt), live image previews, drag-and-drop, and full collection CRUD.
- **WhatsApp Merch Ordering**: Fans can order merch directly via pre-filled WhatsApp messages.

---

## 🛠 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local dev server
npm run dev
```

Open `http://localhost:3000` to view the public site.
Access `http://localhost:3000/admin/login` for CMS:
- **Email**: `admin@whiteeyes.metal`
- **Password**: `Whiteeyes2026!`

---

## 🌐 1-Click Vercel Deployment

1. Push code to GitHub:
   ```bash
   git push origin main
   ```
2. Import project into **[Vercel](https://vercel.com)**.
3. In Vercel Project Settings → Environment Variables, set:
   - `DATABASE_URL`: `postgres://[user]:[password]@[ep-name].neon.tech/[dbname]?sslmode=require`
   - `JWT_SECRET`: `your-random-secret-key`
4. Click **Deploy**!
