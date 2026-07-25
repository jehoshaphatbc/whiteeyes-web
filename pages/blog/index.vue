<script setup lang="ts">
import type { BlogPost } from '~/types/content'

const { pageContent, fetchPageContent } = usePageContent()
await fetchPageContent()

const posts = ref<BlogPost[]>([])
const loading = ref(true)
const selectedCategory = ref('All')
const searchQuery = ref('')

useSeoMeta({
  title: 'Blog & Dispatches | WHITEEYES — Extreme Death Metal',
  description: 'Official blog, subterranean studio reports, release manifests, and tour announcements from WHITEEYES.',
  ogTitle: 'Blog & Dispatches | WHITEEYES — Extreme Death Metal',
  ogDescription: 'Official dispatches, news, and studio reports from WHITEEYES.',
  ogImage: '/favicon.png',
})

const fetchedCategories = ref<{ name: string }[]>([])

const fetchPosts = async () => {
  loading.value = true
  try {
    const [postsData, catsData] = await Promise.all([
      $fetch<BlogPost[]>('/api/posts'),
      $fetch<{ name: string }[]>('/api/categories'),
    ])
    posts.value = postsData || []
    fetchedCategories.value = catsData || []
  } catch (err) {
    console.error('Failed to fetch blog data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPosts()
})

const categories = computed(() => {
  const cats = new Set<string>()
  cats.add('All')
  fetchedCategories.value.forEach((c) => {
    if (c.name) cats.add(c.name)
  })
  posts.value.forEach((p) => {
    if (p.category) cats.add(p.category)
  })
  return Array.from(cats)
})

const filteredPosts = computed(() => {
  return posts.value.filter((p) => {
    const matchesCategory = selectedCategory.value === 'All' || p.category === selectedCategory.value
    const matchesSearch = !searchQuery.value.trim() || 
      p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
      p.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (_) {
    return dateStr
  }
}
</script>

<template>
  <div class="relative bg-void text-offwhite min-h-screen flex flex-col font-sans antialiased">
    <UiGrainOverlay />
    <PublicTheHeader :band-profile="pageContent?.band_profile" />

    <main class="flex-1 pt-32 pb-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <!-- Header Banner -->
        <UiRevealOnScroll>
          <div class="text-center max-w-3xl mx-auto space-y-4">
            <span class="font-mono text-xs text-blood tracking-widest uppercase">// CHRONICLES & DISPATCHES</span>
            <h1 class="font-display text-5xl sm:text-7xl text-white uppercase tracking-tighter text-glitch">
              SUBTERRANEAN BLOG
            </h1>
            <p class="font-mono text-ash text-xs sm:text-sm tracking-widest uppercase">
              OFFICIAL NEWS, STUDIO REPORTS, RELEASE MANIFESTS, & SONIC ANNOUNCEMENTS
            </p>
          </div>
        </UiRevealOnScroll>

        <!-- Filters & Search Bar -->
        <div class="bg-void-charcoal border border-void-border p-4 md:p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Category Pills -->
          <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <button
              v-for="cat in categories"
              :key="cat"
              @click="selectedCategory = cat"
              class="px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-md border transition-all shrink-0"
              :class="selectedCategory === cat
                ? 'bg-blood text-white border-blood font-bold shadow-[0_0_10px_rgba(255,51,51,0.3)]'
                : 'bg-void text-gray-400 border-void-border hover:text-white hover:border-gray-600'"
            >
              {{ cat }}
            </button>
          </div>

          <!-- Search Bar -->
          <div class="relative w-full md:w-72">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search dispatches..."
              class="w-full bg-void border border-void-border rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-gray-500 focus:border-blood focus:outline-none"
            />
            <svg class="w-4 h-4 text-gray-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Posts Grid -->
        <div v-if="loading" class="py-24 text-center text-gray-400 font-mono text-sm">
          <div class="inline-block animate-spin w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full mb-4"></div>
          <p>LOADING SUBTERRANEAN DISPATCHES...</p>
        </div>

        <div v-else-if="filteredPosts.length === 0" class="py-24 text-center text-ash font-mono text-sm border border-dashed border-void-border p-12">
          NO DISPATCHES FOUND MATCHING YOUR CRITERIA.
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="post in filteredPosts"
            :key="post.id"
            class="bg-void-charcoal border border-void-border hover:border-blood/80 transition-all duration-300 rounded-xl overflow-hidden flex flex-col group shadow-xl hover:shadow-[0_0_25px_rgba(255,51,51,0.15)]"
          >
            <!-- Cover Art / Thumbnail -->
            <NuxtLink :to="`/blog/${post.slug}`" class="relative aspect-[16/9] bg-black overflow-hidden block">
              <img
                v-if="post.cover_image_url"
                :src="post.cover_image_url"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter grayscale contrast-125 group-hover:grayscale-0"
              />
              <div v-else class="w-full h-full bg-void flex items-center justify-center text-ash font-mono text-xs">
                NO COVER IMAGE
              </div>

              <div class="absolute top-3 left-3 bg-void/90 backdrop-blur-sm border border-void-border px-2.5 py-1 text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider rounded">
                {{ post.category }}
              </div>
            </NuxtLink>

            <!-- Body -->
            <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div class="space-y-2">
                <div class="flex items-center justify-between text-[11px] font-mono text-ash">
                  <span>{{ formatDate(post.created_at) }}</span>
                  <span>BY {{ post.author || 'WHITEEYES' }}</span>
                </div>

                <NuxtLink :to="`/blog/${post.slug}`" class="block group-hover:text-blood transition-colors">
                  <h2 class="font-display text-2xl text-white uppercase tracking-wider line-clamp-2 leading-tight">
                    {{ post.title }}
                  </h2>
                </NuxtLink>

                <p v-if="post.excerpt" class="font-sans text-ash text-sm line-clamp-3 leading-relaxed">
                  {{ post.excerpt }}
                </p>
              </div>

              <div class="pt-4 border-t border-void-border/50">
                <NuxtLink
                  :to="`/blog/${post.slug}`"
                  class="inline-flex items-center gap-2 font-mono text-xs text-blood hover:text-white uppercase tracking-widest font-semibold transition-colors"
                >
                  <span>READ TRANSMISSION</span>
                  <span>↗</span>
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>

    <PublicTheFooter :band-profile="pageContent?.band_profile" />
  </div>
</template>
