<script setup lang="ts">
import type { Video } from '~/types/content'

const props = defineProps<{
  videos?: Video[]
  youtubeUrl?: string
}>()

const featuredVideo = computed(() => props.videos?.find((v) => v.is_featured) || props.videos?.[0])
const otherVideos = computed(() => props.videos?.filter((v) => v.id !== featuredVideo.value?.id) || [])

const getYouTubeEmbedUrl = (youtubeId: string) => {
  return `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`
}

const getYouTubeWatchUrl = (youtubeId: string) => {
  return `https://www.youtube.com/watch?v=${youtubeId}`
}
</script>

<template>
  <section id="videos" class="py-28 bg-void-charcoal border-t border-void-border relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <UiRevealOnScroll>
        <div class="flex items-center gap-4 mb-16">
          <span class="font-mono text-xs text-blood tracking-widest uppercase">// 05 TRANSMISSIONS</span>
          <h2 class="font-display text-4xl sm:text-6xl text-white uppercase tracking-wider">VISUAL TRANSMISSIONS</h2>
        </div>

        <div v-if="featuredVideo" class="mb-16 bg-void border border-void-border p-4 md:p-8">
          <div class="relative aspect-video border border-void-border bg-black overflow-hidden group">
            <iframe
              :src="getYouTubeEmbedUrl(featuredVideo.youtube_id)"
              :title="featuredVideo.title"
              class="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>

          <div class="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span class="font-mono text-xs text-blood tracking-widest uppercase">FEATURED TRANSMISSION</span>
              <h3 class="font-display text-3xl text-white uppercase tracking-wider mt-1">{{ featuredVideo.title }}</h3>
              <p v-if="featuredVideo.description" class="font-sans text-ash text-sm mt-2 max-w-2xl">
                {{ featuredVideo.description }}
              </p>
            </div>

            <a
              :href="getYouTubeWatchUrl(featuredVideo.youtube_id)"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-brutal text-xs py-3 px-6 shrink-0"
            >
              WATCH ON YOUTUBE ↗
            </a>
          </div>
        </div>

        <div v-if="otherVideos.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="v in otherVideos"
            :key="v.id"
            class="bg-void border border-void-border hover:border-blood transition-colors p-4 group"
          >
            <div class="relative aspect-video bg-black border border-void-border overflow-hidden mb-4">
              <iframe
                :src="getYouTubeEmbedUrl(v.youtube_id)"
                :title="v.title"
                class="w-full h-full border-0"
                allowfullscreen
              ></iframe>
            </div>

            <h4 class="font-display text-xl text-white uppercase tracking-wider group-hover:text-blood transition-colors">
              {{ v.title }}
            </h4>
            <a
              :href="getYouTubeWatchUrl(v.youtube_id)"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block font-mono text-[11px] text-blood hover:text-white uppercase tracking-widest mt-2"
            >
              WATCH DIRECTLY ↗
            </a>
          </div>
        </div>

        <!-- YouTube Channel Archive CTA Button -->
        <div class="mt-16 text-center">
          <a
            :href="youtubeUrl || 'https://youtube.com/@whiteeyesmetal'"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-brutal-primary inline-flex items-center justify-center gap-3 text-sm py-4 px-8 tracking-widest shadow-[0_0_25px_rgba(255,51,51,0.3)] hover:scale-105 transition-transform"
          >
            <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.898.502 5.786a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.898 24 12 24 12s0-3.898-.502-5.786zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>EXPLORE FULL YOUTUBE ARCHIVE ↗</span>
          </a>
        </div>
      </UiRevealOnScroll>
    </div>
  </section>
</template>
