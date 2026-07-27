<script setup lang="ts">
import type { PressRelease } from '~/types/content'

const releases = ref<PressRelease[]>([])
const loading = ref(true)
const currentIndex = ref(0)

const fetchReleases = async () => {
  loading.value = true
  try {
    const data = await $fetch<PressRelease[]>('/api/press-releases')
    releases.value = data || []
  } catch (err) {
    console.error('Failed to load homepage press releases:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchReleases()
})

const nextSlide = () => {
  if (releases.value.length > 0) {
    currentIndex.value = (currentIndex.value + 1) % releases.value.length
  }
}

const prevSlide = () => {
  if (releases.value.length > 0) {
    currentIndex.value = (currentIndex.value - 1 + releases.value.length) % releases.value.length
  }
}
</script>

<template>
  <section id="press-release" class="py-28 bg-void-charcoal relative overflow-hidden border-t border-void-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <UiRevealOnScroll>
        <!-- Section Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span class="font-mono text-xs text-blood tracking-widest uppercase">// 09 PRESS RELEASE / MANIFESTO</span>
            <h2 class="font-display text-4xl sm:text-6xl text-white uppercase tracking-wider mt-2">
              PRESS RELEASE TRANSMISSIONS
            </h2>
          </div>

          <!-- Carousel Controls -->
          <div v-if="releases.length > 1" class="flex items-center gap-3 shrink-0 self-start md:self-auto">
            <button
              @click="prevSlide"
              class="w-10 h-10 rounded-lg bg-void border border-void-border hover:border-blood text-gray-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
              title="Previous Press Release"
            >
              ←
            </button>
            <span class="font-mono text-xs text-ash">
              {{ currentIndex + 1 }} / {{ releases.length }}
            </span>
            <button
              @click="nextSlide"
              class="w-10 h-10 rounded-lg bg-void border border-void-border hover:border-blood text-gray-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
              title="Next Press Release"
            >
              →
            </button>
          </div>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="loading" class="bg-void border border-void-border rounded-xl p-8 h-96 animate-pulse"></div>

        <!-- Empty State -->
        <div v-else-if="releases.length === 0" class="text-center py-16 font-mono text-xs text-ash border border-dashed border-void-border">
          NO PRESS RELEASES PUBLISHED YET.
        </div>

        <!-- Interactive Carousel / Featured Card -->
        <div v-else class="relative">
          <div
            v-for="(pr, index) in releases"
            :key="pr.id"
            v-show="index === currentIndex"
            class="bg-void border border-void-border hover:border-blood/80 transition-all duration-500 rounded-xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0"
          >
            <!-- Cover Art / Image Column -->
            <div class="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto bg-black overflow-hidden">
              <img
                v-if="pr.cover_image_url || pr.hero_bg_url"
                :src="pr.cover_image_url || pr.hero_bg_url"
                :alt="pr.title"
                class="w-full h-full object-cover filter grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
              />
              <div v-else class="w-full h-full bg-void-charcoal flex items-center justify-center text-ash font-mono text-xs">
                NO COVER ARTWORK
              </div>

              <div class="absolute top-4 left-4 bg-blood text-white border border-blood px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded">
                {{ pr.subtitle || 'RELEASE STATEMENT' }}
              </div>
            </div>

            <!-- Content Details Column -->
            <div class="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between text-xs font-mono text-ash border-b border-void-border/60 pb-3">
                  <span>RELEASE DATE: <strong class="text-white">{{ pr.release_date || 'MAY 2024' }}</strong></span>
                  <span class="text-red-400 font-bold uppercase">{{ pr.genre || 'Extreme Death Metal' }}</span>
                </div>

                <NuxtLink :to="`/press-release/${pr.slug}`" class="block group">
                  <h3 class="font-display text-4xl sm:text-6xl text-white uppercase tracking-wider group-hover:text-blood transition-colors leading-none">
                    {{ pr.title }}
                  </h3>
                </NuxtLink>

                <p v-if="pr.intro_headline" class="font-mono text-sm text-gray-300 font-bold uppercase tracking-wide">
                  "{{ pr.intro_headline }}"
                </p>

                <p v-if="pr.intro_body" class="font-sans text-ash text-sm sm:text-base line-clamp-3 leading-relaxed">
                  {{ pr.intro_body }}
                </p>
              </div>

              <!-- Action Links -->
              <div class="pt-6 border-t border-void-border/60 flex flex-wrap items-center justify-between gap-4">
                <NuxtLink
                  :to="`/press-release/${pr.slug}`"
                  class="btn-brutal-primary text-xs py-3 px-6 uppercase tracking-widest font-semibold flex items-center gap-2"
                >
                  <span>READ FULL PRESS RELEASE</span>
                  <span>↗</span>
                </NuxtLink>

                <div class="flex items-center gap-3 font-mono text-xs">
                  <a v-if="pr.listen_url" :href="pr.listen_url" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white underline">
                    Listen ↗
                  </a>
                  <a v-if="pr.press_kit_url" :href="pr.press_kit_url" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white underline">
                    Press Kit 📥
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Prominent Bottom CTA Button -->
        <div class="mt-16 text-center">
          <NuxtLink
            to="/press-release"
            class="btn-brutal inline-flex items-center justify-center gap-3 text-xs py-4 px-8 tracking-widest uppercase hover:border-blood hover:text-blood transition-colors"
          >
            <span>EXPLORE ALL PRESS RELEASES</span>
            <span>↗</span>
          </NuxtLink>
        </div>
      </UiRevealOnScroll>
    </div>
  </section>
</template>
