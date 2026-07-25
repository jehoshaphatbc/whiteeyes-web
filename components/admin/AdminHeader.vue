<script setup lang="ts">
const { user, logout } = useAuth()
</script>

<template>
  <header class="h-16 bg-void-charcoal border-b border-void-border px-6 flex items-center justify-between text-offwhite relative z-20">
    <div class="flex items-center gap-3">
      <span class="font-sans text-xs font-semibold text-white tracking-widest uppercase">CMS DASHBOARD</span>
      <span 
        class="text-[10px] font-mono px-2 py-0.5 rounded border font-bold uppercase tracking-wider"
        :class="user?.role === 'superadmin' 
          ? 'bg-blood/20 text-red-400 border-red-500/40 shadow-[0_0_8px_rgba(255,51,51,0.3)]' 
          : 'bg-zinc-800 text-zinc-300 border-zinc-700'"
      >
        {{ user?.role || 'admin' }}
      </span>
    </div>

    <div class="flex items-center gap-4 font-sans text-xs">
      <NuxtLink 
        to="/admin/profile"
        class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors bg-void border border-void-border px-3 py-1.5 rounded-md hover:border-red-900/50"
      >
        <svg class="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="font-medium truncate max-w-[180px]">{{ user?.email || 'admin@whiteeyes.metal' }}</span>
      </NuxtLink>

      <button
        @click="logout"
        class="btn-brutal text-xs py-1.5 px-4"
      >
        LOGOUT
      </button>
    </div>
  </header>
</template>
