<script setup lang="ts">
defineProps<{
  text: string
  as?: string
}>()
</script>

<template>
  <component :is="as || 'h2'" class="relative inline-block hover-glitch group">
    <span class="relative z-10">{{ text }}</span>
  </component>
</template>
