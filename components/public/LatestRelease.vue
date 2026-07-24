<script setup lang="ts">
import type { Release } from '~/types/content'

defineProps<{
  release?: Release
}>()
</script>

<template>
  <section id="latest-release" class="py-28 bg-void border-t border-void-border relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <UiRevealOnScroll>
        <div class="flex items-center gap-4 mb-16">
          <span class="font-mono text-xs text-blood tracking-widest uppercase">// 02 FEATURED RELEASE</span>
          <h2 class="font-display text-4xl sm:text-6xl text-white uppercase tracking-wider">LATEST PROPAGANDA</h2>
        </div>

        <div v-if="release" class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-void-charcoal border border-void-border p-8 md:p-12 relative">
          <div class="absolute top-0 right-0 bg-blood text-white font-mono text-[10px] tracking-widest px-4 py-1 uppercase">
            {{ release.release_type }} — {{ release.release_date }}
          </div>

          <div class="lg:col-span-5 relative group">
            <div class="relative overflow-hidden aspect-square border border-void-border shadow-[0_0_40px_rgba(0,0,0,0.8)]">
              <img
                :src="release.cover_art_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'"
                :alt="release.title"
                class="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>

          <div class="lg:col-span-7 space-y-6">
            <div>
              <p class="font-mono text-xs text-blood tracking-widest uppercase mb-2">OUT NOW ON ALL PLATFORMS</p>
              <h3 class="font-display text-4xl sm:text-6xl text-white uppercase tracking-wider leading-none text-glitch">
                {{ release.title }}
              </h3>
            </div>

            <p class="font-sans text-ash text-base leading-relaxed max-w-xl">
              {{ release.description }}
            </p>

            <div v-if="release.streaming_links && release.streaming_links.length" class="pt-6 border-t border-void-border">
              <p class="font-mono text-xs text-ash/60 tracking-widest uppercase mb-4">STREAM / ORDER DIRECTLY:</p>
              <div class="flex flex-wrap gap-4">
                <a
                  v-for="link in release.streaming_links"
                  :key="link.id"
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-brutal text-xs py-3 px-5 flex items-center gap-2"
                >
                  <span>{{ link.label }}</span>
                  <span class="text-blood font-bold">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </UiRevealOnScroll>
    </div>
  </section>
</template>
