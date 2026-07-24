<script setup lang="ts">
const { user, logout } = useAuth()
</script>

<template>
  <header class="h-16 bg-void-charcoal border-b border-void-border px-6 flex items-center justify-between text-offwhite">
    <!-- Left side clean (NUXT 3 NITRO CMS ONLINE removed) -->
    <div>
      <span class="font-sans text-xs font-semibold text-white tracking-wide">CMS DASHBOARD</span>
    </div>

    <div class="flex items-center gap-6 font-sans text-xs">
      <span class="text-gray-300 font-medium">{{ user?.email || 'admin@whiteeyes.metal' }}</span>
      <button
        @click="logout"
        class="btn-brutal text-xs py-1.5 px-4"
      >
        LOGOUT
      </button>
    </div>
  </header>
</template>
