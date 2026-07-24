<script setup lang="ts">
const { user, logout } = useAuth()
</script>

<template>
  <header class="h-16 bg-void-charcoal border-b border-void-border px-6 flex items-center justify-between text-offwhite">
    <div class="flex items-center gap-3">
      <span class="inline-block w-2.5 h-2.5 rounded-full bg-blood animate-pulse"></span>
      <span class="font-mono text-xs text-ash tracking-widest uppercase">NUXT 3 NITRO CMS ONLINE</span>
    </div>

    <div class="flex items-center gap-6 font-mono text-xs">
      <span class="text-offwhite">{{ user?.email || 'admin@whiteeyes.metal' }}</span>
      <button
        @click="logout"
        class="btn-brutal text-[11px] py-1.5 px-4"
      >
        LOGOUT
      </button>
    </div>
  </header>
</template>
