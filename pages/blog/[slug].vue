<script setup lang="ts">
import type { BlogPost } from '~/types/content'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { pageContent, fetchPageContent } = usePageContent()
await fetchPageContent()

// Fetch Post Server Side
const { data: post, error } = await useFetch<BlogPost>(`/api/posts/${slug.value}`)

if (error.value || !post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Blog post transmission not found' })
}

// Dynamic SEO Head injection
const siteUrl = 'https://whiteeyes-web.vercel.app'
const canonicalUrl = `${siteUrl}/blog/${slug.value}`
const pageTitle = post.value.meta_title || `${post.value.title} | WHITEEYES Blog`
const pageDesc = post.value.meta_description || post.value.excerpt || `Read ${post.value.title} from WHITEEYES.`
const pageImg = post.value.cover_image_url || '/favicon.png'

useSeoMeta({
  title: pageTitle,
  description: pageDesc,
  keywords: post.value.meta_keywords || 'WHITEEYES, Death Metal, Blog, Metal News',
  ogTitle: pageTitle,
  ogDescription: pageDesc,
  ogImage: pageImg,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: pageDesc,
  twitterImage: pageImg,
})

useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl }
  ]
})

const toastMessage = ref('')
const triggerToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 4000)
}

const copyUrl = (label: string = 'Link') => {
  if (process.client) {
    navigator.clipboard.writeText(window.location.href)
    triggerToast(`${label} copied to clipboard!`)
  }
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (_) {
    return dateStr
  }
}

const shareUrl = computed(() => {
  if (process.client) return window.location.href
  return canonicalUrl
})

const encodedShareUrl = computed(() => encodeURIComponent(shareUrl.value))
const encodedTitle = computed(() => encodeURIComponent(post.value?.title || 'WHITEEYES Post'))
</script>

<template>
  <div class="relative bg-void text-offwhite min-h-screen flex flex-col font-sans antialiased">
    <UiGrainOverlay />
    <PublicTheHeader :band-profile="pageContent?.band_profile" />

    <!-- Notification Toast -->
    <div 
      v-if="toastMessage"
      class="fixed bottom-6 right-6 z-50 bg-blood text-white font-mono text-xs px-5 py-3 rounded-lg shadow-2xl tracking-wider uppercase flex items-center gap-3 animate-bounce"
    >
      <span>{{ toastMessage }}</span>
      <button @click="toastMessage = ''" class="text-white/80 hover:text-white">✕</button>
    </div>

    <main class="flex-1 pt-32 pb-24">
      <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <!-- Navigation Back Button -->
        <NuxtLink
          to="/blog"
          class="inline-flex items-center gap-2 font-mono text-xs text-ash hover:text-blood uppercase tracking-widest transition-colors group"
        >
          <span class="group-hover:-translate-x-1 transition-transform">←</span>
          <span>BACK TO ALL DISPATCHES</span>
        </NuxtLink>

        <!-- Article Header -->
        <div class="space-y-4 border-b border-void-border pb-8">
          <div class="flex items-center gap-3">
            <span class="bg-blood/20 text-red-400 border border-red-500/40 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded">
              {{ post.category }}
            </span>
            <span class="font-mono text-xs text-ash">
              PUBLISHED {{ formatDate(post.created_at) }}
            </span>
          </div>

          <h1 class="font-display text-4xl sm:text-6xl text-white uppercase tracking-tight leading-tight">
            {{ post.title }}
          </h1>

          <div class="flex items-center gap-4 text-xs font-mono text-ash pt-2">
            <span>AUTHOR: <strong class="text-white">{{ post.author || 'WHITEEYES' }}</strong></span>
          </div>
        </div>

        <!-- Cover Image Banner -->
        <div v-if="post.cover_image_url" class="bg-void-charcoal border border-void-border rounded-xl overflow-hidden shadow-2xl">
          <img
            :src="post.cover_image_url"
            :alt="post.title"
            class="w-full max-h-[500px] object-cover filter contrast-125"
          />
        </div>

        <!-- Excerpt Callout -->
        <div v-if="post.excerpt" class="bg-void-charcoal border-l-4 border-blood p-6 rounded-r-xl font-mono text-sm text-gray-300 leading-relaxed uppercase tracking-wide">
          "{{ post.excerpt }}"
        </div>

        <!-- Rich WYSIWYG Article Body Content -->
        <div 
          class="prose prose-invert max-w-none font-sans text-gray-200 text-base sm:text-lg leading-relaxed space-y-4"
          v-html="post.content"
        ></div>

        <!-- Expanded Social Share Section -->
        <div class="border-t border-void-border pt-8 mt-12 bg-void-charcoal p-6 sm:p-8 rounded-xl border space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 class="font-display text-2xl text-white uppercase tracking-wider">SHARE TRANSMISSION</h4>
              <p class="font-mono text-xs text-ash mt-1">Spread the sonic warfare across social networks</p>
            </div>

            <!-- Social Media Buttons -->
            <div class="flex flex-wrap items-center gap-3">
              <!-- Facebook -->
              <a
                :href="`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-brutal text-xs py-2.5 px-3.5 flex items-center gap-2 hover:border-blue-500 hover:text-blue-400"
                title="Share to Facebook"
              >
                <svg class="w-4 h-4 fill-current text-blue-500" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>FACEBOOK</span>
              </a>

              <!-- X / Twitter -->
              <a
                :href="`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedShareUrl}`"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-brutal text-xs py-2.5 px-3.5 flex items-center gap-2 hover:border-zinc-400 hover:text-white"
                title="Share to X (Twitter)"
              >
                <svg class="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>X / TWITTER</span>
              </a>

              <!-- Instagram -->
              <button
                @click="copyUrl('Instagram post link')"
                class="btn-brutal text-xs py-2.5 px-3.5 flex items-center gap-2 hover:border-pink-500 hover:text-pink-400"
                title="Copy link for Instagram Story / Bio"
              >
                <svg class="w-4 h-4 fill-current text-pink-500" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>INSTAGRAM</span>
              </button>

              <!-- WhatsApp -->
              <a
                :href="`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedShareUrl}`"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-brutal text-xs py-2.5 px-3.5 flex items-center gap-2 hover:border-green-500 hover:text-green-400"
                title="Share to WhatsApp"
              >
                <svg class="w-4 h-4 fill-current text-green-500" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
                <span>WHATSAPP</span>
              </a>

              <!-- Copy Link -->
              <button
                @click="copyUrl('Article link')"
                class="btn-brutal-primary text-xs py-2.5 px-4 font-mono uppercase"
              >
                COPY LINK 🔗
              </button>
            </div>
          </div>
        </div>
      </article>
    </main>

    <PublicTheFooter :band-profile="pageContent?.band_profile" />
  </div>
</template>
