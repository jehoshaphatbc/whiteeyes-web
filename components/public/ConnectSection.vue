<script setup lang="ts">
import type { SocialLinks } from '~/types/content'

defineProps<{
  socialLinks?: SocialLinks
}>()
</script>

<template>
  <section id="connect" class="py-32 bg-void-charcoal border-t border-void-border relative overflow-hidden text-center">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <UiRevealOnScroll>
        <span class="font-mono text-xs text-blood tracking-widest uppercase">// 08 ENTER THE ABYSS</span>

        <h2 class="font-display text-5xl sm:text-7xl md:text-8xl text-white uppercase tracking-tighter my-8 text-glitch">
          {{ socialLinks?.closing_headline || 'JOIN THE ABYSS' }}
        </h2>

        <p class="font-mono text-ash text-sm md:text-base tracking-widest uppercase mb-12 max-w-xl mx-auto">
          FOLLOW THE PROPAGANDA. STREAM THE SONIC WARFARE. SUPPORT THE UNDERGROUND.
        </p>

        <!-- 3 Text-Only Platform Cards: Spotify, Instagram, YouTube -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <!-- Spotify -->
          <a
            :href="socialLinks?.spotify_url || '#'"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-brutal py-8 flex flex-col items-center justify-center gap-2 group transition-all duration-300 border-void-border hover:border-green-500/80 hover:shadow-[0_0_25px_rgba(34,197,94,0.25)] bg-void/50 hover:bg-void"
          >
            <span class="font-display text-2xl sm:text-3xl tracking-widest text-white block group-hover:text-green-400 transition-colors">
              SPOTIFY
            </span>
            <span class="font-mono text-xs text-ash group-hover:text-white font-semibold tracking-widest uppercase">
              STREAM MUSIC ↗
            </span>
          </a>

          <!-- Instagram -->
          <a
            :href="socialLinks?.instagram_url || '#'"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-brutal py-8 flex flex-col items-center justify-center gap-2 group transition-all duration-300 border-void-border hover:border-pink-500/80 hover:shadow-[0_0_25px_rgba(236,72,153,0.25)] bg-void/50 hover:bg-void"
          >
            <span class="font-display text-2xl sm:text-3xl tracking-widest text-white block group-hover:text-pink-400 transition-colors">
              INSTAGRAM
            </span>
            <span class="font-mono text-xs text-ash group-hover:text-white font-semibold tracking-widest uppercase">
              FOLLOW BAND ↗
            </span>
          </a>

          <!-- YouTube -->
          <a
            :href="socialLinks?.youtube_url || '#'"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-brutal py-8 flex flex-col items-center justify-center gap-2 group transition-all duration-300 border-void-border hover:border-red-600/80 hover:shadow-[0_0_25px_rgba(239,68,68,0.25)] bg-void/50 hover:bg-void"
          >
            <span class="font-display text-2xl sm:text-3xl tracking-widest text-white block group-hover:text-red-500 transition-colors">
              YOUTUBE
            </span>
            <span class="font-mono text-xs text-ash group-hover:text-white font-semibold tracking-widest uppercase">
              WATCH VIDEOS ↗
            </span>
          </a>
        </div>
      </UiRevealOnScroll>
    </div>
  </section>
</template>
