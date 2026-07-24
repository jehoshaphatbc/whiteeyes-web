# Vercel Deployment Guide — WHITEEYES

This guide explains how to deploy the **WHITEEYES** application when connecting your GitHub repository (`https://github.com/jehoshaphatbc/whiteeyes-web.git`) to Vercel.

---

## 🚀 Step 1: Deploying the Nuxt 3 Frontend on Vercel

1. Log into your **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Click **"Add New..."** → **"Project"**.
3. Import your GitHub repository: `jehoshaphatbc/whiteeyes-web`.
4. In the **Configure Project** screen, configure the following settings:

### Project Settings
- **Framework Preset**: `Nuxt.js`
- **Root Directory**: Click **Edit** and select `frontend` (crucial since this is a monorepo).
- **Build Command**: `npm run build` (or leave default)
- **Output Directory**: `.output/public` (or leave default)

### Environment Variables on Vercel
Add the following Environment Variables in the Vercel project setup screen:

| Name | Value | Description |
|---|---|---|
| `NUXT_PUBLIC_API_BASE` | `https://your-backend-api.com/api/v1` | Public Go API URL |
| `API_BACKEND_URL` | `https://your-backend-api.com` | Internal Go API URL (used by Nitro server proxy for auth cookies) |

5. Click **Deploy**. Vercel will automatically build the Nuxt 3 frontend and deploy Nitro serverless functions.

---

## ⚡ Step 2: Deploying the Go Backend API

Because Vercel is designed primarily for serverless frontend applications, the Go API backend (`/backend`) should be hosted on a free/affordable cloud platform that supports persistent Go APIs and databases (SQLite or PostgreSQL):

### Recommended Free/Easy Options for Go API:
1. **[Render](https://render.com)** (Free Web Service tier + PostgreSQL)
   - Root Directory: `backend`
   - Build Command: `go build -o main main.go`
   - Start Command: `./main`
2. **[Railway](https://railway.app)**
   - Connect GitHub repo → select `backend` directory → deploy.
3. **[Koyeb](https://koyeb.com)** or **[Fly.io](https://fly.io)**

Once deployed, update the `NUXT_PUBLIC_API_BASE` & `API_BACKEND_URL` environment variables in Vercel to point to your live Go API URL.
