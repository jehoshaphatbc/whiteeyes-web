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
  { title: 'SEO & Meta Tags', path: '/admin/seo', desc: 'Dynamic page title, meta description, keywords, Open Graph image & canonical URL', count: '1 Singleton' },
  { title: 'Band Profile', path: '/admin/band-profile', desc: 'Hero branding, logo, taglines, and global streaming links', count: '1 Singleton' },
  { title: 'About / Biography', path: '/admin/about', desc: 'Biography narrative, formation stats, photo & timeline', count: '1 Singleton' },
  { title: 'Featured Release', path: '/admin/latest-release', desc: 'Spotlighted album/EP featured in section 02', count: '1 Singleton' },
  { title: 'Discography Catalog', path: '/admin/discography', desc: 'Full catalog of LPs, EPs, singles, and demos with links', key: 'discography' },
  { title: 'Artwork Gallery', path: '/admin/artwork', desc: 'Masonry gallery of cover arts, flyers, posters, and prints', key: 'artwork' },
  { title: 'Videos', path: '/admin/videos', desc: 'YouTube music videos, live performances, and studio sessions', key: 'videos' },
  { title: 'Merchandise Drops', path: '/admin/merch', desc: 'Apparel, vinyls, tapes, and direct WhatsApp ordering', key: 'merch' },
  { title: 'Social & Connect', path: '/admin/social-links', desc: 'Social profiles, WhatsApp contact, and section 07 headline', count: '1 Singleton' },
]
</script>

<template>
  <div class="space-y-8 font-sans">
    <div>
      <span class="text-xs font-semibold text-red-400 uppercase tracking-widest">// Dashboard</span>
      <h1 class="font-display text-4xl text-white uppercase tracking-wider mt-1">CMS Control Center</h1>
      <p class="text-xs text-gray-400 font-medium mt-1">Select a module below to edit website content sections and SEO settings</p>
    </div>

    <div v-if="loading" class="text-xs text-gray-400 font-medium">Loading status...</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="s in sections"
        :key="s.path"
        :to="s.path"
        class="bg-void-charcoal border border-void-border hover:border-red-500 rounded-xl p-6 transition-all duration-300 group flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-[11px] font-bold text-red-400 uppercase tracking-wider">
              {{ s.count || `${pageContent?.[s.key || '']?.length || 0} Registered` }}
            </span>
            <span class="text-xs text-gray-400 group-hover:text-red-400 transition-colors">↗</span>
          </div>

          <h3 class="font-display text-2xl text-white uppercase tracking-wider group-hover:text-red-400 transition-colors">
            {{ s.title }}
          </h3>

          <p class="text-xs text-gray-400 mt-2 leading-relaxed font-normal">
            {{ s.desc }}
          </p>
        </div>

        <div class="mt-6 pt-4 border-t border-void-border/60 flex items-center justify-between text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
          <span>Edit Content</span>
          <span class="text-red-400 font-bold group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
