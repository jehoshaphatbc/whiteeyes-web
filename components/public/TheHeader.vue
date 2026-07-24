<script setup lang="ts">
import type { BandProfile } from '~/types/content'

const props = defineProps<{
  bandProfile?: BandProfile
  activeSection: string
}>()

const mobileMenuOpen = ref(false)

const navLinks = [
  { id: 'about', label: 'ABOUT' },
  { id: 'latest-release', label: 'MUSIC' },
  { id: 'artwork', label: 'ARTWORK' },
  { id: 'videos', label: 'VIDEOS' },
  { id: 'merch', label: 'MERCH' },
  { id: 'connect', label: 'CONNECT' },
]

const scrollToSection = (id: string) => {
  mobileMenuOpen.value = false
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-void/90 backdrop-blur-md border-b border-void-border/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <!-- Logo & Band Name -->
      <a href="#hero" @click.prevent="scrollToSection('hero')" class="flex items-center gap-3 group">
        <img
          v-if="bandProfile?.logo_url"
          :src="bandProfile.logo_url"
          :alt="bandProfile.band_name || 'WHITEEYES'"
          class="h-10 w-auto object-contain filter grayscale contrast-200 group-hover:brightness-125 transition-all"
        />
        <span class="font-display text-2xl tracking-widest text-offwhite group-hover:text-blood transition-colors">
          {{ bandProfile?.band_name || 'WHITEEYES' }}
        </span>
      </a>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-8 font-display tracking-widest text-sm">
        <a
          v-for="link in navLinks"
          :key="link.id"
          :href="`#${link.id}`"
          @click.prevent="scrollToSection(link.id)"
          class="transition-colors duration-200 py-1 border-b-2"
          :class="[
            activeSection === link.id
              ? 'text-blood border-blood font-bold'
              : 'text-ash border-transparent hover:text-offwhite'
          ]"
        >
          {{ link.label }}
        </a>
      </nav>

      <!-- Listen Now CTA -->
      <div class="hidden md:flex items-center gap-4">
        <a
          :href="bandProfile?.spotify_url || 'https://spotify.com'"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-brutal-primary text-xs px-4 py-2 flex items-center gap-2"
        >
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.18-.1.2-1.38-.361-.18-.6.36-1.2.96-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72.96.42 1.5-.3.54-.96.72-1.5.42z"/>
          </svg>
          LISTEN NOW
        </a>
      </div>

      <!-- Mobile Hamburger Button -->
      <button
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="md:hidden text-offwhite p-2 focus:outline-none"
        aria-label="Toggle Navigation Menu"
      >
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Mobile Menu Drawer -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden bg-void-charcoal border-b border-void-border px-6 py-6 space-y-4"
    >
      <a
        v-for="link in navLinks"
        :key="link.id"
        :href="`#${link.id}`"
        @click.prevent="scrollToSection(link.id)"
        class="block font-display text-xl tracking-widest py-2 border-b border-void-gray"
        :class="activeSection === link.id ? 'text-blood' : 'text-offwhite'"
      >
        {{ link.label }}
      </a>
      <a
        :href="bandProfile?.spotify_url || 'https://spotify.com'"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-brutal-primary w-full text-center mt-4"
      >
        LISTEN ON SPOTIFY
      </a>
    </div>
  </header>
</template>
