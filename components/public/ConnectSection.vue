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

        <!-- 3 Primary Platforms: Spotify, Instagram, YouTube -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <!-- Spotify -->
          <a
            :href="socialLinks?.spotify_url || '#'"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-brutal py-6 flex flex-col items-center justify-center gap-3 group transition-all duration-300 border-void-border hover:border-green-500/80 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] bg-void/50 hover:bg-void"
          >
            <div class="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.48-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.281 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.3z"/>
              </svg>
            </div>
            <div>
              <span class="font-display text-xl tracking-widest text-white block">SPOTIFY</span>
              <span class="font-mono text-xs text-ash group-hover:text-green-400 font-semibold tracking-wider">STREAM MUSIC ↗</span>
            </div>
          </a>

          <!-- Instagram -->
          <a
            :href="socialLinks?.instagram_url || '#'"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-brutal py-6 flex flex-col items-center justify-center gap-3 group transition-all duration-300 border-void-border hover:border-pink-500/80 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] bg-void/50 hover:bg-void"
          >
            <div class="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div>
              <span class="font-display text-xl tracking-widest text-white block">INSTAGRAM</span>
              <span class="font-mono text-xs text-ash group-hover:text-pink-400 font-semibold tracking-wider">FOLLOW BAND ↗</span>
            </div>
          </a>

          <!-- YouTube -->
          <a
            :href="socialLinks?.youtube_url || '#'"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-brutal py-6 flex flex-col items-center justify-center gap-3 group transition-all duration-300 border-void-border hover:border-red-600/80 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] bg-void/50 hover:bg-void"
          >
            <div class="w-12 h-12 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.898.502 5.786a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.898 24 12 24 12s0-3.898-.502-5.786zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div>
              <span class="font-display text-xl tracking-widest text-white block">YOUTUBE</span>
              <span class="font-mono text-xs text-ash group-hover:text-red-500 font-semibold tracking-wider">WATCH VIDEOS ↗</span>
            </div>
          </a>
        </div>
      </UiRevealOnScroll>
    </div>
  </section>
</template>
