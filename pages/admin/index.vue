<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const pageContent = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    pageContent.value = await $fetch('/api/page-content')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

const sections = [
  { title: 'Band Profile', path: '/admin/band-profile', desc: 'Hero branding, logo, taglines, and global streaming links', count: '1 Singleton' },
  { title: 'About / Bio', path: '/admin/about', desc: 'Biography narrative, formation stats, photo & chronology timeline', count: '1 Singleton' },
  { title: 'Featured Release', path: '/admin/latest-release', desc: 'Spotlighted album/EP featured in section 02', count: '1 Singleton' },
  { title: 'Discography Archive', path: '/admin/discography', desc: 'Full catalog of LPs, EPs, singles, and demos with streaming links', key: 'discography' },
  { title: 'Artwork Archive', path: '/admin/artwork', desc: 'Masonry gallery of cover arts, tour flyers, posters, and merch prints', key: 'artwork' },
  { title: 'Visual Transmissions', path: '/admin/videos', desc: 'YouTube music videos, live performances, and studio sessions', key: 'videos' },
  { title: 'Merchandise Drops', path: '/admin/merch', desc: 'Apparel, vinyls, tapes, and direct WhatsApp ordering', key: 'merch' },
  { title: 'Social & Connect', path: '/admin/social-links', desc: 'Social profiles, WhatsApp contact, and section 07 headline', count: '1 Singleton' },
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <span class="font-mono text-xs text-blood tracking-widest uppercase">// CMS OVERVIEW</span>
      <h1 class="font-display text-4xl text-white uppercase tracking-wider mt-1 text-glitch">CMS CONTROL CENTER</h1>
      <p class="font-mono text-xs text-ash tracking-widest uppercase mt-1">SELECT A CONTENT MODULE TO EDIT FRONT-PAGE SECTIONS</p>
    </div>

    <div v-if="loading" class="font-mono text-xs text-ash tracking-widest uppercase">LOADING CONTENT STATUS...</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <NuxtLink
        v-for="s in sections"
        :key="s.path"
        :to="s.path"
        class="bg-void-charcoal border border-void-border hover:border-blood p-6 transition-all duration-300 group flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="font-mono text-[10px] text-blood tracking-widest uppercase">
              {{ s.count || `${pageContent?.[s.key || '']?.length || 0} REGISTERED` }}
            </span>
            <span class="font-mono text-[10px] text-ash/40 group-hover:text-blood transition-colors">↗</span>
          </div>

          <h3 class="font-display text-2xl text-white uppercase tracking-wider group-hover:text-blood transition-colors">
            {{ s.title }}
          </h3>

          <p class="font-sans text-xs text-ash mt-2 leading-relaxed">
            {{ s.desc }}
          </p>
        </div>

        <div class="mt-6 pt-4 border-t border-void-border/60 flex items-center justify-between font-mono text-[11px] text-ash group-hover:text-white transition-colors">
          <span>EDIT CONTENT</span>
          <span class="text-blood font-bold group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
