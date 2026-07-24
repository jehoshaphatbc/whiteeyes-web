<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

const target = ref<HTMLElement | null>(null)
const isVisible = ref(false)

onMounted(() => {
  if (!target.value) return
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        isVisible.value = true
        stop()
      }
    },
    { threshold: 0.1 }
  )
})
</script>

<template>
  <div
    ref="target"
    class="transition-all duration-700 transform"
    :class="[
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    ]"
  >
    <slot />
  </div>
</template>
