<script setup lang="ts">
import type { PressRelease } from '~/types/content'

const { pageContent, fetchPageContent } = usePageContent()
await fetchPageContent()

const releases = ref<PressRelease[]>([])
const loading = ref(true)
const searchQuery = ref('')

useSeoMeta({
  title: 'Press Releases & Release Manifestos | WHITEEYES — Extreme Death Metal',
  description: 'Official press releases, single manifestations, LP announcements, and media statements from WHITEEYES.',
  ogTitle: 'Press Releases | WHITEEYES — Extreme Death Metal',
  ogDescription: 'Official press releases and release statements from WHITEEYES.',
  ogImage: '/favicon.png',
})

const fetchReleases = async () => {
  loading.value = true
  try {
    const data = await $fetch<PressRelease[]>('/api/press-releases')
    releases.value = data || []
  } catch (err) {
    console.error('Failed to fetch press releases:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchReleases()
})

const filteredReleases = computed(() => {
  if (!searchQuery.value.trim()) return releases.value
  const q = searchQuery.value.toLowerCase()
  return releases.value.filter(
    (r) => r.title.toLowerCase().includes(q) || (r.subtitle && r.subtitle.toLowerCase().includes(q)) || (r.intro_headline && r.intro_headline.toLowerCase().includes(q))
  )
})
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
            <span class="font-mono text-xs text-blood tracking-widest uppercase">// OFFICIAL MEDIA TRANSMISSIONS</span>
            <h1 class="font-display text-5xl sm:text-7xl text-white uppercase tracking-tighter text-glitch">
              PRESS RELEASES
            </h1>
            <p class="font-mono text-ash text-xs sm:text-sm tracking-widest uppercase">
              OFFICIAL RELEASE MANIFESTOS, SINGLE STATEMENTS, & SONIC DOCUMENTATION
            </p>
          </div>
        </UiRevealOnScroll>

        <!-- Search Bar -->
        <div class="bg-void-charcoal border border-void-border p-4 md:p-6 rounded-xl flex items-center justify-between gap-4 max-w-2xl mx-auto">
          <div class="relative w-full">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search press releases by title, song, or statement..."
              class="w-full bg-void border border-void-border rounded-lg pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder-gray-500 focus:border-blood focus:outline-none"
            />
            <svg class="w-4 h-4 text-gray-500 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Press Releases Grid -->
        <div v-if="loading" class="py-24 text-center text-gray-400 font-mono text-sm">
          <div class="inline-block animate-spin w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full mb-4"></div>
          <p>LOADING PRESS RELEASE TRANSMISSIONS...</p>
        </div>

        <div v-else-if="filteredReleases.length === 0" class="py-24 text-center text-ash font-mono text-sm border border-dashed border-void-border p-12">
          NO PRESS RELEASES FOUND MATCHING YOUR CRITERIA.
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <article
            v-for="pr in filteredReleases"
            :key="pr.id"
            class="bg-void-charcoal border border-void-border hover:border-blood/80 transition-all duration-300 rounded-xl overflow-hidden flex flex-col group shadow-xl hover:shadow-[0_0_25px_rgba(255,51,51,0.15)]"
          >
            <!-- Cover Photo Banner -->
            <NuxtLink :to="`/press-release/${pr.slug}`" class="relative aspect-[21/9] bg-black overflow-hidden block">
              <img
                v-if="pr.cover_image_url || pr.hero_bg_url"
                :src="pr.cover_image_url || pr.hero_bg_url"
                :alt="pr.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter grayscale contrast-125 group-hover:grayscale-0"
              />
              <div v-else class="w-full h-full bg-void flex items-center justify-center text-ash font-mono text-xs">
                NO COVER ARTWORK
              </div>

              <div class="absolute top-3 left-3 bg-blood/90 text-white border border-blood px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded">
                {{ pr.subtitle || 'RELEASE STATEMENT' }}
              </div>
            </NuxtLink>

            <!-- Body -->
            <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div class="space-y-2">
                <div class="flex items-center justify-between text-[11px] font-mono text-ash">
                  <span>{{ pr.release_date || 'MAY 2024' }}</span>
                  <span class="text-red-400 font-bold uppercase">{{ pr.genre || 'Extreme Death Metal' }}</span>
                </div>

                <NuxtLink :to="`/press-release/${pr.slug}`" class="block group-hover:text-blood transition-colors">
                  <h2 class="font-display text-3xl text-white uppercase tracking-wider line-clamp-1 leading-tight">
                    {{ pr.title }}
                  </h2>
                </NuxtLink>

                <p v-if="pr.intro_headline" class="font-mono text-xs text-gray-300 line-clamp-1 uppercase">
                  "{{ pr.intro_headline }}"
                </p>

                <p v-if="pr.intro_body" class="font-sans text-ash text-sm line-clamp-2 leading-relaxed">
                  {{ pr.intro_body }}
                </p>
              </div>

              <div class="pt-4 border-t border-void-border/50 flex items-center justify-between">
                <NuxtLink
                  :to="`/press-release/${pr.slug}`"
                  class="inline-flex items-center gap-2 font-mono text-xs text-blood hover:text-white uppercase tracking-widest font-semibold transition-colors"
                >
                  <span>READ PRESS STATEMENT</span>
                  <span>↗</span>
                </NuxtLink>

                <span class="text-[10px] font-mono text-gray-500 uppercase">{{ pr.label || 'Iron Tomb Records' }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>

    <PublicTheFooter :band-profile="pageContent?.band_profile" />
  </div>
</template>
