<script setup lang="ts">
const route = useRoute()

const links = [
  { path: '/admin', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { path: '/admin/seo', label: 'SEO & Meta Tags', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 0 0114 0z' },
  { path: '/admin/band-profile', label: 'Band Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { path: '/admin/about', label: 'About / Biography', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { path: '/admin/latest-release', label: 'Featured Release', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12 0c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
  { path: '/admin/discography', label: 'Discography', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { path: '/admin/artwork', label: 'Artwork Gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { path: '/admin/videos', label: 'Videos', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
  { path: '/admin/merch', label: 'Merchandise', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
  { path: '/admin/posts', label: 'Blog Posts', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  { path: '/admin/users', label: 'User Accounts', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { path: '/admin/profile', label: 'My Profile', icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
]
</script>

<template>
  <aside class="w-64 bg-void border-r border-void-border text-offwhite min-h-screen flex flex-col shrink-0">
    <div class="p-6 border-b border-void-border flex items-center justify-between">
      <div>
        <h1 class="font-display text-2xl tracking-widest text-white uppercase">WHITEEYES</h1>
        <p class="font-sans text-xs text-red-400 font-semibold tracking-wider uppercase">CMS PORTAL</p>
      </div>
      <NuxtLink to="/" target="_blank" class="font-sans text-xs text-gray-400 hover:text-red-400 transition-colors font-medium">
        Site ↗
      </NuxtLink>
    </div>

    <nav class="flex-1 p-3 space-y-1 font-sans text-sm font-medium">
      <NuxtLink
        v-for="link in links"
        :key="link.path"
        :to="link.path"
        class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg border border-transparent transition-all duration-200"
        :class="[
          route.path === link.path
            ? 'bg-blood text-white border-blood font-semibold shadow-[0_0_12px_rgba(255,51,51,0.4)]'
            : 'text-gray-300 hover:text-white hover:bg-void-charcoal hover:border-void-border'
        ]"
      >
        <svg class="w-4 h-4 shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="link.icon" />
        </svg>
        <span>{{ link.label }}</span>
      </NuxtLink>
    </nav>
  </aside>
</template>
