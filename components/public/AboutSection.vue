<script setup lang="ts">
import type { About } from '~/types/content'

defineProps<{
  about?: About
}>()
</script>

<template>
  <section id="about" class="py-28 bg-void-charcoal border-t border-void-border relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <UiRevealOnScroll>
        <div class="flex items-center gap-4 mb-16">
          <span class="font-mono text-xs text-blood tracking-widest uppercase">// 01 ARCHIVE</span>
          <h2 class="font-display text-4xl sm:text-6xl text-white uppercase tracking-wider">BIOGRAPHY</h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div class="lg:col-span-5 relative group">
            <div class="relative overflow-hidden border border-void-border bg-void-gray">
              <img
                :src="about?.section_photo_url || 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop'"
                alt="WHITEEYES Band Photo"
                class="w-full h-auto object-cover filter grayscale contrast-150 group-hover:scale-105 transition-transform duration-700"
              />
              <div class="absolute inset-0 bg-blood/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div class="mt-6 grid grid-cols-2 gap-4 font-mono text-xs border border-void-border p-4 bg-void">
              <div>
                <span class="text-ash/60 block mb-1 uppercase">FORMED</span>
                <span class="text-offwhite font-bold text-sm">{{ about?.formed_year || '2019' }}</span>
              </div>
              <div>
                <span class="text-ash/60 block mb-1 uppercase">ORIGIN</span>
                <span class="text-offwhite font-bold text-sm">{{ about?.origin || 'JAKARTA, ID' }}</span>
              </div>
              <div>
                <span class="text-ash/60 block mb-1 uppercase">GENRE</span>
                <span class="text-blood font-bold text-sm">{{ about?.genre || 'DEATH METAL' }}</span>
              </div>
              <div>
                <span class="text-ash/60 block mb-1 uppercase">STYLE</span>
                <span class="text-offwhite font-bold text-sm">{{ about?.style_description || 'DISSONANT / ATMOSPHERIC' }}</span>
              </div>
            </div>
          </div>

          <div class="lg:col-span-7 space-y-8">
            <div class="prose prose-invert max-w-none text-ash text-base leading-relaxed font-sans font-light">
              <p class="text-lg text-offwhite leading-relaxed font-normal">
                {{ about?.biography || 'Forged in subterranean rehearsal chambers, WHITEEYES crafts visceral, blastbeat-driven extreme metal.' }}
              </p>
            </div>

            <div v-if="about?.milestones && about.milestones.length" class="mt-12 pt-8 border-t border-void-border">
              <h3 class="font-display text-xl text-white uppercase tracking-wider mb-6">CHRONOLOGY</h3>
              <div class="space-y-4">
                <div
                  v-for="m in about.milestones"
                  :key="m.id"
                  class="flex items-start gap-4 font-mono text-sm border-l-2 border-void-border hover:border-blood pl-4 py-1 transition-colors"
                >
                  <span class="text-blood font-bold">{{ m.year }}</span>
                  <span class="text-ash">{{ m.text }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UiRevealOnScroll>
    </div>
  </section>
</template>
