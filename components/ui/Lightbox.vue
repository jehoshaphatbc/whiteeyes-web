<script setup lang="ts">
const props = defineProps<{
  show: boolean
  imageUrl: string
  title?: string
  category?: string
  altText?: string
}>()

const emit = defineEmits(['close'])

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
        @click.self="emit('close')"
      >
        <button
          @click="emit('close')"
          class="absolute top-6 right-6 z-10 p-2 text-offwhite hover:text-blood transition-colors focus:outline-none"
          aria-label="Close modal"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="max-w-5xl max-h-[90vh] flex flex-col items-center justify-center">
          <img
            :src="imageUrl"
            :alt="altText || title || 'Artwork preview'"
            class="max-w-full max-h-[75vh] object-contain border border-void-border shadow-[0_0_50px_rgba(0,0,0,0.9)]"
          />

          <div v-if="title || category" class="mt-4 text-center">
            <p v-if="category" class="font-mono text-xs text-blood tracking-widest uppercase mb-1">{{ category }}</p>
            <h3 v-if="title" class="font-display text-2xl md:text-3xl tracking-wider text-white uppercase">{{ title }}</h3>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
