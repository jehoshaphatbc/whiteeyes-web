<script setup lang="ts">
import type { PressRelease, PressReleasePersonnel, PressReleaseCredit } from '~/types/content'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { pageContent, fetchPageContent } = usePageContent()
await fetchPageContent()

const { data: pr, error } = await useFetch<PressRelease>(`/api/press-releases/${slug.value}`)

if (error.value || !pr.value) {
  throw createError({ statusCode: 404, statusMessage: 'Press release transmission not found' })
}

const parseArray = <T = any>(field: any): T[] => {
  if (!field) return []
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return Array.isArray(field) ? field : []
}

const personnelMembers = computed<PressReleasePersonnel[]>(() => parseArray(pr.value?.personnel_members))
const musicCredits = computed<PressReleaseCredit[]>(() => parseArray(pr.value?.music_credits))
const featurePoints = computed<string[]>(() => parseArray(pr.value?.feature_points))
const legacyPoints = computed<string[]>(() => parseArray(pr.value?.legacy_points))
const currentPoints = computed<string[]>(() => parseArray(pr.value?.current_points))

// SEO Head injection
const siteUrl = 'https://whiteeyes-web.vercel.app'
const canonicalUrl = `${siteUrl}/press-release/${slug.value}`
const pageTitle = `${pr.value.title} ${pr.value.subtitle ? `— ${pr.value.subtitle}` : ''} | WHITEEYES Press Release`
const pageDesc = pr.value.intro_headline || pr.value.intro_body || `Official press release statement for ${pr.value.title}.`
const pageImg = pr.value.cover_image_url || pr.value.hero_bg_url || '/favicon.png'

useSeoMeta({
  title: pageTitle,
  description: pageDesc,
  keywords: pr.value.meta_keywords || 'WHITEEYES, Death Metal, Press Release, ANICONISM',
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
</script>

<template>
  <div class="relative bg-void text-offwhite min-h-screen flex flex-col font-sans antialiased">
    <UiGrainOverlay />
    <PublicTheHeader :band-profile="pageContent?.band_profile" />

    <main class="flex-1 pt-28 pb-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <!-- Top Back Link -->
        <div>
          <NuxtLink
            to="/press-release"
            class="inline-flex items-center gap-2 font-mono text-xs text-ash hover:text-blood uppercase tracking-widest transition-colors group"
          >
            <span class="group-hover:-translate-x-1 transition-transform">←</span>
            <span>BACK TO ALL PRESS RELEASES</span>
          </NuxtLink>
        </div>

        <!-- MAIN PDF PRESS RELEASE CONTAINER (2-COL LAYOUT) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <!-- LEFT SIDEBAR COLUMN (Artwork, Jenis Musik, Personil, Kontak, Sosial Media, Diskografi) -->
          <aside class="lg:col-span-4 bg-void-charcoal border border-void-border rounded-xl p-6 sm:p-8 space-y-8 shadow-2xl">
            <!-- Cover Image -->
            <div class="aspect-square bg-black rounded-lg overflow-hidden border border-void-border">
              <img
                v-if="pr.cover_image_url || pr.hero_bg_url"
                :src="pr.cover_image_url || pr.hero_bg_url"
                :alt="pr.title"
                class="w-full h-full object-cover filter contrast-125 grayscale hover:grayscale-0 transition-all duration-500"
              />
              <div v-else class="w-full h-full flex items-center justify-center font-mono text-xs text-ash">
                NO COVER ARTWORK
              </div>
            </div>

            <!-- JENIS MUSIK -->
            <div class="space-y-1 border-b border-void-border/60 pb-6">
              <h3 class="font-display text-lg text-white uppercase tracking-wider">JENIS MUSIK:</h3>
              <p class="font-mono text-sm text-red-400 font-bold uppercase">{{ pr.genre || 'Death Metal' }}</p>
            </div>

            <!-- PERSONIL -->
            <div class="space-y-2 border-b border-void-border/60 pb-6">
              <h3 class="font-display text-lg text-white uppercase tracking-wider">PERSONIL:</h3>
              <ul class="space-y-1 font-mono text-xs text-gray-300">
                <li v-for="(person, idx) in personnelMembers" :key="idx" class="flex items-center justify-between">
                  <span class="text-white font-medium">{{ person.name }}</span>
                  <span class="text-ash">({{ person.role }})</span>
                </li>
              </ul>
            </div>

            <!-- KONTAK -->
            <div class="space-y-2 border-b border-void-border/60 pb-6">
              <h3 class="font-display text-lg text-white uppercase tracking-wider">KONTAK:</h3>
              <div class="font-mono text-xs text-gray-300 space-y-1">
                <p v-if="pr.contact_phone" class="text-white font-medium">{{ pr.contact_phone }}</p>
                <p v-if="pr.press_email" class="text-red-400 font-bold underline">{{ pr.press_email }}</p>
              </div>
            </div>

            <!-- SOSIAL MEDIA -->
            <div v-if="pr.social_instagram || pr.social_facebook || pr.social_youtube" class="space-y-2 border-b border-void-border/60 pb-6">
              <h3 class="font-display text-lg text-white uppercase tracking-wider">SOSIAL MEDIA:</h3>
              <div class="font-mono text-xs text-ash space-y-1.5">
                <p v-if="pr.social_instagram"><strong class="text-white">Instagram:</strong> {{ pr.social_instagram }}</p>
                <p v-if="pr.social_facebook"><strong class="text-white">Facebook:</strong> {{ pr.social_facebook }}</p>
                <p v-if="pr.social_youtube"><strong class="text-white">Youtube:</strong> {{ pr.social_youtube }}</p>
              </div>
            </div>

            <!-- DISKOGRAFI SUMMARY -->
            <div v-if="pr.discography_summary" class="space-y-2">
              <h3 class="font-display text-lg text-white uppercase tracking-wider">DISKOGRAFI:</h3>
              <pre class="font-mono text-xs text-ash whitespace-pre-wrap leading-relaxed bg-void p-4 rounded border border-void-border/60">{{ pr.discography_summary }}</pre>
            </div>
          </aside>

          <!-- RIGHT MAIN NARRATIVE COLUMN -->
          <div class="lg:col-span-8 space-y-10">
            <!-- Headline / Title -->
            <div class="space-y-3">
              <span class="font-mono text-xs text-blood tracking-widest uppercase">// OFFICIAL PRESS RELEASE</span>
              <h1 class="font-display text-4xl sm:text-6xl text-white uppercase tracking-tight leading-tight">
                {{ pr.subtitle || pr.title }}
              </h1>
            </div>

            <!-- Main Narrative Body Paragraphs -->
            <div class="prose prose-invert max-w-none font-sans text-gray-300 text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-6" v-html="pr.intro_body">
            </div>

            <!-- Sound Character & Musical Direction -->
            <div v-if="pr.sound_character" class="bg-void-charcoal border border-void-border rounded-xl p-8 space-y-4">
              <span class="font-mono text-xs text-blood tracking-widest uppercase">// TATA SUARA & DIRECTION</span>
              <h3 class="font-display text-2xl text-white uppercase">TATA SUARA & CHARACTER</h3>
              <div class="font-sans text-ash text-base leading-relaxed" v-html="pr.sound_character">
              </div>
            </div>

            <!-- Featured Quote Callout Block -->
            <blockquote v-if="pr.quote_text" class="bg-gradient-to-r from-red-950/40 via-void-charcoal to-void-charcoal border-l-4 border-blood p-8 rounded-r-xl space-y-4">
              <p class="font-display text-2xl sm:text-3xl text-white uppercase tracking-wide leading-snug">
                "{{ pr.quote_text }}"
              </p>
              <cite v-if="pr.quote_author" class="font-mono text-xs text-ash uppercase tracking-widest block not-italic">
                — {{ pr.quote_author }}
              </cite>
            </blockquote>

            <!-- Environmental Destiny Highlight Box -->
            <div v-if="pr.highlight_title || pr.highlight_body" class="bg-void border border-void-border p-6 rounded-xl space-y-2">
              <h4 class="font-display text-xl text-white uppercase">{{ pr.highlight_title || 'ENVIRONMENTAL DESTINY' }}</h4>
              <p class="font-sans text-sm text-ash leading-relaxed">{{ pr.highlight_body }}</p>
            </div>
          </div>
        </div>

        <!-- FULL-WIDTH SECTION: MUSIC CREDIT & CREATIVE (PDF PAGE 4) -->
        <section v-if="musicCredits.length" class="bg-void-charcoal border border-void-border rounded-xl p-8 sm:p-12 space-y-8 shadow-2xl">
          <div class="text-center max-w-2xl mx-auto space-y-2 border-b border-void-border pb-6">
            <span class="font-mono text-xs text-blood tracking-widest uppercase">// PRODUCTION & CREATIVE TEAM</span>
            <h2 class="font-display text-4xl sm:text-5xl text-white uppercase tracking-wider">
              MUSIC CREDIT & CREATIVE
            </h2>
          </div>

          <div class="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs sm:text-sm">
            <div
              v-for="(credit, idx) in musicCredits"
              :key="idx"
              class="bg-void border border-void-border/80 p-4 rounded-lg flex items-center justify-between"
            >
              <span class="font-bold text-gray-400 uppercase tracking-wider">{{ credit.label }}</span>
              <span class="text-red-400 font-bold uppercase tracking-wide text-right">{{ credit.value }}</span>
            </div>
          </div>
        </section>

        <!-- FULL-WIDTH SECTION: SONG LYRICS (PDF PAGES 5 & 6) -->
        <section v-if="pr.lyrics" class="bg-void border border-void-border rounded-xl p-8 sm:p-16 text-center space-y-8 shadow-2xl relative overflow-hidden">
          <div class="max-w-2xl mx-auto space-y-3">
            <span class="font-mono text-xs text-blood tracking-widest uppercase">// SONG LYRICS TRANSMISSION</span>
            <h2 class="font-display text-4xl sm:text-6xl text-white uppercase tracking-wider">
              LIRIK "{{ pr.title }}"
            </h2>
          </div>

          <div class="max-w-2xl mx-auto font-mono text-sm sm:text-base text-gray-200 leading-relaxed whitespace-pre-line tracking-wide space-y-4" v-html="pr.lyrics">
          </div>

          <div class="pt-8 border-t border-void-border text-center">
            <p class="font-mono text-xs text-blood tracking-widest uppercase font-bold">
              Keep eyes and ears on it, Our Virus Still Deadly...!!!
            </p>
          </div>
        </section>

        <!-- BOTTOM ACTION BAR -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-void-border">
          <NuxtLink
            to="/press-release"
            class="btn-brutal text-xs py-3 px-6 uppercase tracking-wider"
          >
            ← ALL PRESS RELEASES
          </NuxtLink>

          <div class="flex items-center gap-3">
            <a
              v-if="pr.listen_url"
              :href="pr.listen_url"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-brutal-primary text-xs py-3 px-6 uppercase tracking-wider"
            >
              LISTEN NOW ↗
            </a>
          </div>
        </div>

      </div>
    </main>

    <PublicTheFooter :band-profile="pageContent?.band_profile" />
  </div>
</template>
