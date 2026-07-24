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
    apiBackendUrl: process.env.API_BACKEND_URL || 'http://localhost:8080',
    
    // Public keys exposed to client
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080/api/v1',
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
        { property: 'og:image', content: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;600;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap' },
      ],
    },
  },
})
