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

const copied = ref(false)
const copyUrl = () => {
  if (process.client) {
    navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 3000)
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

// Split content by linebreaks into paragraphs
const paragraphs = computed(() => {
  if (!post.value?.content) return []
  return post.value.content.split('\n\n').filter(p => p.trim())
})
</script>

<template>
  <div class="relative bg-void text-offwhite min-h-screen flex flex-col font-sans antialiased">
    <UiGrainOverlay />
    <PublicTheHeader :band-profile="pageContent?.band_profile" />

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

        <!-- Article Content -->
        <div class="prose prose-invert max-w-none space-y-6 font-sans text-gray-200 text-base sm:text-lg leading-relaxed">
          <p v-for="(p, index) in paragraphs" :key="index" class="whitespace-pre-line">
            {{ p }}
          </p>
        </div>

        <!-- Social Share & Footer CTA -->
        <div class="border-t border-void-border pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-void-charcoal p-6 rounded-xl border">
          <div>
            <h4 class="font-display text-xl text-white uppercase tracking-wider">SHARE TRANSMISSION</h4>
            <p class="font-mono text-xs text-ash">Spread the sonic warfare across networks</p>
          </div>

          <div class="flex items-center gap-3">
            <button
              @click="copyUrl"
              class="btn-brutal text-xs py-2.5 px-4 font-mono uppercase"
            >
              {{ copied ? 'COPIED!' : 'COPY LINK 🔗' }}
            </button>
            <a
              :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(canonicalUrl)}`"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-brutal text-xs py-2.5 px-4 font-mono uppercase"
            >
              TWITTER / X ↗
            </a>
            <a
              :href="`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + canonicalUrl)}`"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-brutal-primary text-xs py-2.5 px-4 font-mono uppercase"
            >
              WHATSAPP ↗
            </a>
          </div>
        </div>
      </article>
    </main>

    <PublicTheFooter :band-profile="pageContent?.band_profile" />
  </div>
</template>
