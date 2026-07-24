<script setup lang="ts">
import type { ArtworkItem } from '~/types/content'

defineProps<{
  artwork?: ArtworkItem[]
}>()

const activeLightboxItem = ref<ArtworkItem | null>(null)

const openLightbox = (item: ArtworkItem) => {
  activeLightboxItem.value = item
}

const closeLightbox = () => {
  activeLightboxItem.value = null
}
</script>

<template>
  <section id="artwork" class="py-28 bg-void border-t border-void-border relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <UiRevealOnScroll>
        <div class="flex items-center gap-4 mb-16">
          <span class="font-mono text-xs text-blood tracking-widest uppercase">// 04 VISUAL VAULT</span>
          <h2 class="font-display text-4xl sm:text-6xl text-white uppercase tracking-wider">ARTWORK ARCHIVE</h2>
        </div>

        <div v-if="artwork && artwork.length" class="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <div
            v-for="item in artwork"
            :key="item.id"
            @click="openLightbox(item)"
            class="break-inside-avoid relative group cursor-pointer border border-void-border overflow-hidden bg-void-gray"
          >
            <img
              :src="item.image_url"
              :alt="item.alt_text || item.title"
              class="w-full h-auto object-cover filter grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
            />
            <!-- Overlay details on hover -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
              <span class="font-mono text-xs text-blood tracking-widest uppercase mb-1">{{ item.category }}</span>
              <h3 class="font-display text-xl text-white uppercase tracking-wider">{{ item.title }}</h3>
              <p class="font-mono text-[10px] text-ash/80 mt-1 uppercase">CLICK TO EXPAND ↗</p>
            </div>
          </div>
        </div>
      </UiRevealOnScroll>
    </div>

    <!-- Lightbox -->
    <UiLightbox
      :show="!!activeLightboxItem"
      :image-url="activeLightboxItem?.image_url || ''"
      :title="activeLightboxItem?.title"
      :category="activeLightboxItem?.category"
      :alt-text="activeLightboxItem?.alt_text"
      @close="closeLightbox"
    />
  </section>
</template>
