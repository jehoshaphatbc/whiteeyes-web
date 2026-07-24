<script setup lang="ts">
import type { BandProfile } from '~/types/content'

defineProps<{
  bandProfile?: BandProfile
}>()

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-void border-t border-void-border py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-3">
        <span class="font-display text-2xl tracking-widest text-white">{{ bandProfile?.band_name || 'WHITEEYES' }}</span>
        <span class="font-mono text-xs text-ash/60">/ EXTREME DEATH METAL</span>
      </div>

      <p class="font-mono text-xs text-ash/60">
        © {{ currentYear }} {{ bandProfile?.band_name || 'WHITEEYES' }}. ALL RIGHTS RESERVED.
      </p>

      <div class="font-mono text-xs text-ash/60">
        <NuxtLink to="/admin/login" class="hover:text-blood transition-colors">
          ADMIN CMS PORTAL
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>
