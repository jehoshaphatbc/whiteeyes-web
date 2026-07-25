// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-07-24',

  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Private server-side keys
    databaseUrl: process.env.DATABASE_URL || process.env.POSTGRES_URL || '',
    jwtSecret: process.env.JWT_SECRET || 'whiteeyes-dev-secret-change-in-production-please',
    jwtExpiryHours: 24,

    // Public keys exposed to client
    public: {
      apiBase: '/api',
    },
  },

  app: {
    head: {
      title: 'WHITEEYES — Extreme Death Metal',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Official website and music hub for subterranean Extreme Death Metal band WHITEEYES. Explore music, artwork, videos, and merchandise.' },
        { name: 'theme-color', content: '#0a0a0a' },
        { property: 'og:title', content: 'WHITEEYES — Extreme Death Metal' },
        { property: 'og:description', content: 'Official portal of WHITEEYES. Underground Death Metal from Jakarta.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/favicon.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'shortcut icon', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&display=swap' },
      ],
    },
  },
})
