<script setup lang="ts">
import type { BandProfile } from '~/types/content'

defineProps<{
  bandProfile?: BandProfile
}>()
</script>

<template>
  <section id="hero" class="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-28 sm:pb-36 overflow-hidden bg-void">
    <div class="absolute inset-0 z-0">
      <img
        :src="bandProfile?.hero_bg_image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1920&auto=format&fit=crop'"
        alt="Hero Background"
        class="w-full h-full object-cover object-center filter grayscale brightness-50 contrast-125 scale-105 transform transition-transform duration-1000"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-transparent"></div>
      <div class="absolute inset-0 bg-scanlines opacity-40"></div>
    </div>

    <div class="relative z-10 max-w-5xl mx-auto px-4 text-center py-10 sm:py-16 flex flex-col items-center justify-center my-auto">
      <div class="inline-block border border-blood/50 bg-blood/10 px-4 py-1 mb-6 sm:mb-8 backdrop-blur-sm animate-flicker">
        <span class="font-mono text-xs tracking-widest text-blood uppercase">
          {{ bandProfile?.genre_label || 'EXTREME DEATH METAL' }}
        </span>
      </div>

      <div class="mb-4 sm:mb-6">
        <img
          v-if="bandProfile?.logo_url"
          :src="bandProfile.logo_url"
          :alt="bandProfile.band_name || 'WHITEEYES'"
          class="max-h-28 sm:max-h-36 md:max-h-56 mx-auto object-contain filter grayscale contrast-200 drop-shadow-[0_0_35px_rgba(139,0,0,0.6)]"
        />
        <h1
          v-else
          class="font-display text-7xl sm:text-9xl md:text-[11rem] leading-none tracking-tighter text-white uppercase"
        >
          {{ bandProfile?.band_name || 'WHITEEYES' }}
        </h1>
      </div>

      <!-- Hero Statement -->
      <p class="max-w-3xl font-display text-lg sm:text-3xl md:text-4xl text-offwhite tracking-widest uppercase mb-8 sm:mb-12 leading-tight text-shadow">
        {{ bandProfile?.hero_tagline || 'CHRONICLES OF VISCERAL DECAY AND DISSOLUTION' }}
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md sm:max-w-none mb-12 sm:mb-0">
        <a
          :href="bandProfile?.spotify_url || 'https://spotify.com'"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-brutal-primary text-base px-8 py-4 w-full sm:w-auto"
        >
          LISTEN NOW
        </a>
        <a
          :href="bandProfile?.youtube_url || '#videos'"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-brutal text-base px-8 py-4 w-full sm:w-auto"
        >
          WATCH
        </a>
      </div>
    </div>

    <!-- Centered Scroll Down Anchor with Generous Spacing on Mobile -->
    <div class="absolute bottom-4 sm:bottom-8 inset-x-0 z-10 flex flex-col items-center justify-center text-center animate-bounce pointer-events-auto">
      <a href="#about" class="font-mono text-[10px] sm:text-xs tracking-widest text-ash/70 hover:text-blood uppercase transition-colors flex flex-col items-center py-2">
        <span>SCROLL DOWN</span>
        <span class="text-sm mt-1 font-bold">↓</span>
      </a>
    </div>
  </section>
</template>
