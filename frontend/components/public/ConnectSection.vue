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
        <span class="font-mono text-xs text-blood tracking-widest uppercase">// 07 ENTER THE ABYSS</span>

        <h2 class="font-display text-5xl sm:text-7xl md:text-8xl text-white uppercase tracking-tighter my-8 text-glitch">
          {{ socialLinks?.closing_headline || 'JOIN THE ABYSS' }}
        </h2>

        <p class="font-mono text-ash text-sm md:text-base tracking-widest uppercase mb-12 max-w-xl mx-auto">
          FOLLOW THE PROPAGANDA. STREAM THE SONIC WARFARE. SUPPORT THE UNDERGROUND.
        </p>

        <!-- Social Platform Links -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
          <a
            v-if="socialLinks?.spotify_url"
            :href="socialLinks.spotify_url"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-brutal py-4 flex flex-col items-center gap-2 group"
          >
            <span class="font-display text-lg tracking-widest">SPOTIFY</span>
            <span class="font-mono text-[10px] text-ash group-hover:text-white">STREAM ↗</span>
          </a>

          <a
            v-if="socialLinks?.youtube_url"
            :href="socialLinks.youtube_url"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-brutal py-4 flex flex-col items-center gap-2 group"
          >
            <span class="font-display text-lg tracking-widest">YOUTUBE</span>
            <span class="font-mono text-[10px] text-ash group-hover:text-white">WATCH ↗</span>
          </a>

          <a
            v-if="socialLinks?.instagram_url"
            :href="socialLinks.instagram_url"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-brutal py-4 flex flex-col items-center gap-2 group"
          >
            <span class="font-display text-lg tracking-widest">INSTAGRAM</span>
            <span class="font-mono text-[10px] text-ash group-hover:text-white">FOLLOW ↗</span>
          </a>

          <a
            v-if="socialLinks?.facebook_url"
            :href="socialLinks.facebook_url"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-brutal py-4 flex flex-col items-center gap-2 group"
          >
            <span class="font-display text-lg tracking-widest">FACEBOOK</span>
            <span class="font-mono text-[10px] text-ash group-hover:text-white">COMMUNITY ↗</span>
          </a>

          <a
            v-if="socialLinks?.whatsapp_number"
            :href="`https://wa.me/${socialLinks.whatsapp_number}`"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-brutal py-4 flex flex-col items-center gap-2 group border-blood/60 bg-blood/10"
          >
            <span class="font-display text-lg tracking-widest text-white">WHATSAPP</span>
            <span class="font-mono text-[10px] text-blood group-hover:text-white">DIRECT ↗</span>
          </a>
        </div>
      </UiRevealOnScroll>
    </div>
  </section>
</template>
