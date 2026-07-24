<script setup lang="ts">
import type { Release } from '~/types/content'

defineProps<{
  releases?: Release[]
}>()
</script>

<template>
  <section id="discography" class="py-28 bg-void-charcoal border-t border-void-border relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <UiRevealOnScroll>
        <div class="flex items-center gap-4 mb-16">
          <span class="font-mono text-xs text-blood tracking-widest uppercase">// 03 ARCHIVE</span>
          <h2 class="font-display text-4xl sm:text-6xl text-white uppercase tracking-wider">DISCOGRAPHY</h2>
        </div>

        <div v-if="releases && releases.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="item in releases"
            :key="item.id"
            class="group bg-void border border-void-border hover:border-blood transition-all duration-300 flex flex-col"
          >
            <!-- Release Cover -->
            <div class="relative overflow-hidden aspect-square border-b border-void-border bg-void-gray">
              <img
                :src="item.cover_art_url || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop'"
                :alt="item.title"
                class="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500"
              />
              <div class="absolute top-3 left-3 bg-void/90 backdrop-blur-sm border border-void-border px-2 py-1 font-mono text-[10px] text-blood tracking-widest uppercase">
                {{ item.release_type }} ({{ item.release_date }})
              </div>
            </div>

            <!-- Content -->
            <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 class="font-display text-2xl text-white uppercase tracking-wider group-hover:text-blood transition-colors">
                  {{ item.title }}
                </h3>
                <p v-if="item.description" class="font-sans text-ash text-sm mt-2 line-clamp-2">
                  {{ item.description }}
                </p>
              </div>

              <!-- Streaming CTAs -->
              <div v-if="item.streaming_links && item.streaming_links.length" class="pt-4 border-t border-void-border/60 flex flex-wrap gap-2">
                <a
                  v-for="link in item.streaming_links"
                  :key="link.id"
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-mono text-[11px] text-offwhite hover:text-blood uppercase tracking-wider py-1 px-2 border border-void-border hover:border-blood transition-colors flex items-center gap-1"
                >
                  {{ link.label }} ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </UiRevealOnScroll>
    </div>
  </section>
</template>
