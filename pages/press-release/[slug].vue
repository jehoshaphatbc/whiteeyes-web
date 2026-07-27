<script setup lang="ts">
import type { PressRelease } from '~/types/content'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { pageContent, fetchPageContent } = usePageContent()
await fetchPageContent()

const { data: pr, error } = await useFetch<PressRelease>(`/api/press-releases/${slug.value}`)

if (error.value || !pr.value) {
  throw createError({ statusCode: 404, statusMessage: 'Press release transmission not found' })
}

// SEO Head injection
const siteUrl = 'https://whiteeyes-web.vercel.app'
const canonicalUrl = `${siteUrl}/press-release/${slug.value}`
const pageTitle = `${pr.value.title} ${pr.value.subtitle ? `— ${pr.value.subtitle}` : ''} | WHITEEYES Press Release`
const pageDesc = pr.value.intro_headline || pr.value.intro_body || `Official press release statement for ${pr.value.title} by WHITEEYES.`
const pageImg = pr.value.cover_image_url || pr.value.hero_bg_url || '/favicon.png'

useSeoMeta({
  title: pageTitle,
  description: pageDesc,
  keywords: pr.value.meta_keywords || 'WHITEEYES, Death Metal, Press Release, Statement',
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

    <main class="flex-1 pt-20">
      <!-- SECTION 1: HERO BANNER -->
      <section class="relative min-h-[80vh] flex flex-col justify-end pb-16 pt-24 overflow-hidden border-b border-void-border">
        <!-- Hero Background Image & Overlay -->
        <div class="absolute inset-0 z-0">
          <img
            v-if="pr.hero_bg_url || pr.cover_image_url"
            :src="pr.hero_bg_url || pr.cover_image_url"
            :alt="pr.title"
            class="w-full h-full object-cover filter grayscale contrast-150 brightness-50"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-void via-void/80 to-transparent"></div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full space-y-8">
          <NuxtLink
            to="/press-release"
            class="inline-flex items-center gap-2 font-mono text-xs text-ash hover:text-blood uppercase tracking-widest transition-colors group mb-4"
          >
            <span class="group-hover:-translate-x-1 transition-transform">←</span>
            <span>BACK TO ALL PRESS RELEASES</span>
          </NuxtLink>

          <!-- Release Title & Tag -->
          <div class="space-y-2">
            <span class="bg-blood text-white text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded inline-block">
              {{ pr.subtitle || 'RELEASE STATEMENT' }}
            </span>
            <h1 class="font-display text-6xl sm:text-8xl md:text-9xl text-white uppercase tracking-tighter leading-none text-glitch">
              {{ pr.title }}
            </h1>
          </div>

          <!-- Metadata Bar -->
          <div class="bg-void-charcoal/90 backdrop-blur-md border border-void-border rounded-xl p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span class="text-ash block uppercase text-[10px]">RELEASE DATE</span>
              <strong class="text-white text-sm uppercase">{{ pr.release_date || 'MAY 2024' }}</strong>
            </div>
            <div>
              <span class="text-ash block uppercase text-[10px]">GENRE</span>
              <strong class="text-red-400 text-sm uppercase">{{ pr.genre || 'Extreme Death Metal' }}</strong>
            </div>
            <div>
              <span class="text-ash block uppercase text-[10px]">PRODUCER</span>
              <strong class="text-white text-sm uppercase">{{ pr.producer || 'WHITEEYES' }}</strong>
            </div>
            <div>
              <span class="text-ash block uppercase text-[10px]">LABEL</span>
              <strong class="text-white text-sm uppercase">{{ pr.label || 'Iron Tomb Records' }}</strong>
            </div>
          </div>

          <!-- Hero Action CTAs -->
          <div class="flex flex-wrap items-center gap-4 pt-2">
            <a
              v-if="pr.listen_url"
              :href="pr.listen_url"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-brutal-primary text-xs py-3.5 px-6 uppercase tracking-wider"
            >
              LISTEN NOW ↗
            </a>
            <a
              v-if="pr.video_url"
              :href="pr.video_url"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-brutal text-xs py-3.5 px-6 uppercase tracking-wider"
            >
              WATCH VIDEO ↗
            </a>
            <a
              v-if="pr.press_kit_url"
              :href="pr.press_kit_url"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-brutal text-xs py-3.5 px-6 uppercase tracking-wider text-gray-300 hover:text-white"
            >
              DOWNLOAD PRESS KIT 📥
            </a>
          </div>
        </div>
      </section>

      <!-- SECTION 2: INTRO STATEMENT -->
      <section class="py-24 bg-void border-b border-void-border">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <!-- Statement Left Body -->
            <div class="lg:col-span-2 space-y-6">
              <h2 class="font-display text-4xl sm:text-6xl text-white uppercase tracking-tight leading-tight">
                {{ pr.intro_headline || "THE ECHOES OF CIVILIZATION'S DECAY." }}
              </h2>
              <p class="font-sans text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                {{ pr.intro_body || 'Forged in the cavernous rehearsal spaces of Jakarta, our latest release explores the inevitable collapse of anthropocentric arrogance.' }}
              </p>
            </div>

            <!-- Highlight Box Right -->
            <div v-if="pr.highlight_title || pr.highlight_body" class="bg-void-charcoal border border-void-border rounded-xl p-8 space-y-3 relative overflow-hidden">
              <span class="font-mono text-[10px] text-blood tracking-widest uppercase">// HIGHLIGHT MANIFESTO</span>
              <h3 class="font-display text-2xl text-white uppercase">
                {{ pr.highlight_title || 'ENVIRONMENTAL DESTINY' }}
              </h3>
              <p class="font-sans text-ash text-sm leading-relaxed">
                {{ pr.highlight_body }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 3: RITUAL FEATURE SECTION -->
      <section v-if="pr.feature_title || pr.feature_body" class="py-24 bg-void-charcoal border-b border-void-border">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <!-- Feature Image -->
            <div class="bg-void border border-void-border rounded-xl overflow-hidden shadow-2xl">
              <img
                :src="pr.feature_image_url || pr.cover_image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'"
                :alt="pr.feature_title || 'Ritual Feature'"
                class="w-full max-h-[450px] object-cover filter contrast-125 grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>

            <!-- Feature Text & Points -->
            <div class="space-y-6">
              <span class="font-mono text-xs text-blood tracking-widest uppercase">// CONCEPT & PROCESS</span>
              <h2 class="font-display text-4xl sm:text-5xl text-white uppercase tracking-wider">
                {{ pr.feature_title || 'THE ANICONIC RITUAL' }}
              </h2>
              <p class="font-sans text-gray-300 text-base leading-relaxed">
                {{ pr.feature_body }}
              </p>

              <!-- Points List -->
              <div v-if="pr.feature_points && pr.feature_points.length" class="space-y-2 pt-4 font-mono text-xs text-ash">
                <div v-for="(point, idx) in pr.feature_points" :key="idx" class="flex items-center gap-3 bg-void p-3 rounded border border-void-border">
                  <span class="text-blood font-bold">✓</span>
                  <span class="text-white uppercase">{{ point }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 4: MUSIC DIRECTION COMPARISON -->
      <section v-if="pr.legacy_points || pr.current_points" class="py-24 bg-void border-b border-void-border">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div class="text-center max-w-2xl mx-auto space-y-2">
            <span class="font-mono text-xs text-blood tracking-widest uppercase">// SONIC EVOLUTION</span>
            <h2 class="font-display text-4xl sm:text-5xl text-white uppercase">MUSIC DIRECTION</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Legacy -->
            <div class="bg-void-charcoal border border-void-border p-8 rounded-xl space-y-4">
              <div class="flex items-center justify-between border-b border-void-border pb-3">
                <h3 class="font-display text-2xl text-gray-400 uppercase">{{ pr.legacy_title || 'THE LEGACY' }}</h3>
                <span class="font-mono text-xs text-gray-500 uppercase">PREVIOUS</span>
              </div>
              <ul class="space-y-3 font-mono text-xs text-ash">
                <li v-for="(point, idx) in pr.legacy_points" :key="idx" class="flex items-center gap-2">
                  <span class="text-gray-600">•</span>
                  <span>{{ point }}</span>
                </li>
              </ul>
            </div>

            <!-- Current Now -->
            <div class="bg-void-charcoal border border-blood/60 p-8 rounded-xl space-y-4 shadow-[0_0_20px_rgba(255,51,51,0.15)]">
              <div class="flex items-center justify-between border-b border-void-border pb-3">
                <h3 class="font-display text-2xl text-white uppercase">{{ pr.current_title || 'ANICONISM NOW' }}</h3>
                <span class="font-mono text-xs text-blood font-bold uppercase">PRESENT</span>
              </div>
              <ul class="space-y-3 font-mono text-xs text-gray-200">
                <li v-for="(point, idx) in pr.current_points" :key="idx" class="flex items-center gap-2">
                  <span class="text-blood font-bold">✓</span>
                  <span>{{ point }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 5: QUOTE CALLOUT BLOCK -->
      <section v-if="pr.quote_text" class="py-24 bg-void-charcoal border-b border-void-border text-center relative overflow-hidden">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <span class="font-display text-8xl text-blood/40 block leading-none select-none">”</span>
          <blockquote class="font-display text-3xl sm:text-5xl text-white uppercase tracking-wide leading-tight">
            "{{ pr.quote_text }}"
          </blockquote>
          <cite v-if="pr.quote_author" class="font-mono text-xs text-ash uppercase tracking-widest block not-italic pt-4">
            — {{ pr.quote_author }}
          </cite>
        </div>
      </section>

      <!-- SECTION 6: BAND PERSONNEL GRID ("THE VIRUS") -->
      <section class="py-24 bg-void border-b border-void-border">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div class="space-y-4">
              <span class="font-mono text-xs text-blood tracking-widest uppercase">// PERSONNEL & WARRIORS</span>
              <h2 class="font-display text-4xl sm:text-5xl text-white uppercase">THE VIRUS</h2>
              <p class="font-sans text-ash text-sm leading-relaxed">
                {{ pr.personnel_body || 'The subterranean lineup responsible for executing sonic warfare and analog recording session transmissions.' }}
              </p>
            </div>

            <!-- Members List Grid -->
            <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div
                v-for="(member, idx) in (pr.personnel_members || [
                  { name: 'ARYS PRIHADI', role: 'Vocalist' },
                  { name: 'EKO RUSTON', role: 'Guitarist' },
                  { name: 'MICHAEL PRIHADI', role: 'Drums' },
                  { name: 'ARI PRATAMA', role: 'Bass' },
                  { name: 'AGUS FAUZI', role: 'Lead Guitar' }
                ])"
                :key="idx"
                class="bg-void-charcoal border border-void-border p-4 rounded-lg flex items-center justify-between"
              >
                <span class="font-bold text-white uppercase">{{ member.name }}</span>
                <span class="text-ash text-[10px] uppercase">{{ member.role }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 7: CHRONICLES DISCOGRAPHY showcase -->
      <section v-if="pageContent?.discography" class="py-24 bg-void-charcoal border-b border-void-border">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div class="flex items-center justify-between border-b border-void-border pb-4">
            <div>
              <span class="font-mono text-xs text-blood tracking-widest uppercase">// DISCOGRAPHY ARCHIVE</span>
              <h2 class="font-display text-4xl text-white uppercase">CHRONICLES</h2>
            </div>
            <NuxtLink to="/#discography" class="font-mono text-xs text-ash hover:text-white uppercase">EXPLORE ALL ↗</NuxtLink>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div v-for="rel in pageContent.discography.slice(0, 4)" :key="rel.id" class="bg-void border border-void-border rounded-lg overflow-hidden group">
              <div class="aspect-square bg-black overflow-hidden">
                <img :src="rel.cover_art_url" :alt="rel.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter grayscale group-hover:grayscale-0" />
              </div>
              <div class="p-3 font-mono text-xs">
                <h4 class="font-bold text-white line-clamp-1 uppercase">{{ rel.title }}</h4>
                <span class="text-[10px] text-ash uppercase">{{ rel.release_type }} • {{ rel.release_date }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 8 & 9: CONTACT & FOOTER STATEMENT -->
      <section class="py-24 bg-void text-center space-y-12">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span class="font-mono text-xs text-blood tracking-widest uppercase">// MEDIA & PRESS INQUIRIES</span>
          <h2 class="font-display text-4xl sm:text-6xl text-white uppercase">CONTACT PRESS OFFICERS</h2>
          <div class="bg-void-charcoal border border-void-border p-6 rounded-xl inline-block font-mono text-sm">
            <span class="text-ash block text-xs uppercase mb-1">FOR BOOKING / PRESS KIT / INTERVIEWS</span>
            <strong class="text-blood text-lg tracking-widest">{{ pr.press_email || 'WHITEEYES@GMAIL.COM' }}</strong>
          </div>
        </div>

        <div class="border-t border-void-border pt-12">
          <h3 class="font-display text-5xl sm:text-7xl text-white uppercase tracking-tighter text-glitch">
            OUR VIRUS STILL DEADLY...!!!
          </h3>
        </div>
      </section>
    </main>

    <PublicTheFooter :band-profile="pageContent?.band_profile" />
  </div>
</template>
