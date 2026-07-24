<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const config = useRuntimeConfig()
const pageContent = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    pageContent.value = await $fetch(`${config.public.apiBase}/page-content`)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

const sections = [
  { title: 'Band Profile', path: '/admin/band-profile', count: '1 Singleton' },
  { title: 'About / Bio', path: '/admin/about', count: '1 Singleton' },
  { title: 'Featured Release', path: '/admin/latest-release', count: '1 Singleton' },
  { title: 'Discography', path: '/admin/discography', key: 'discography' },
  { title: 'Artwork Archive', path: '/admin/artwork', key: 'artwork' },
  { title: 'Videos', path: '/admin/videos', key: 'videos' },
  { title: 'Merchandise', path: '/admin/merch', key: 'merch' },
  { title: 'Social & Connect', path: '/admin/social-links', count: '1 Singleton' },
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold text-white">CMS DASHBOARD OVERVIEW</h1>
      <p class="text-xs text-slate-400 font-mono mt-1">SELECT A SECTION TO EDIT FRONT-PAGE CONTENT</p>
    </div>

    <div v-if="loading" class="text-slate-400 text-sm">Loading content overview...</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <NuxtLink
        v-for="s in sections"
        :key="s.path"
        :to="s.path"
        class="bg-slate-900 border border-slate-800 hover:border-indigo-500 rounded-xl p-6 transition-all hover:shadow-lg group flex flex-col justify-between"
      >
        <div>
          <h3 class="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">{{ s.title }}</h3>
          <p class="text-xs text-slate-400 mt-2 font-mono">
            {{ s.count || `${pageContent?.[s.key || '']?.length || 0} items registered` }}
          </p>
        </div>
        <div class="mt-6 flex items-center justify-end text-xs font-medium text-indigo-400 group-hover:translate-x-1 transition-transform">
          EDIT CONTENT →
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
