<script setup lang="ts">
const { user, logout } = useAuth()
</script>

<template>
  <header class="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between text-slate-300">
    <div class="flex items-center gap-2">
      <span class="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
      <span class="text-xs font-mono text-slate-400">ADMIN API ONLINE</span>
    </div>

    <div class="flex items-center gap-4">
      <span class="text-sm text-slate-300">{{ user?.email || 'admin@whiteeyes.metal' }}</span>
      <button
        @click="logout"
        class="text-xs font-medium px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
      >
        LOGOUT
      </button>
    </div>
  </header>
</template>
