<script setup lang="ts">
import type { Video } from '~/types/content'

const props = defineProps<{
  videos?: Video[]
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

        <!-- Featured Video Embed -->
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

        <!-- Additional Videos Grid -->
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
      </UiRevealOnScroll>
    </div>
  </section>
</template>
