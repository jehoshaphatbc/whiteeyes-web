<script setup lang="ts">
const props = defineProps<{
  show: boolean
  message: string
  type?: 'success' | 'error' | 'info'
}>()

const emit = defineEmits(['close'])

watch(() => props.show, (val) => {
  if (val) {
    setTimeout(() => {
      emit('close')
    }, 4000)
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-2 opacity-0"
    >
      <div
        v-if="show"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-4 px-6 py-4 border shadow-2xl font-mono text-xs uppercase tracking-wider text-white"
        :class="[
          type === 'error' ? 'bg-blood-dark/95 border-blood' : 'bg-void-charcoal/95 border-blood text-offwhite'
        ]"
      >
        <span>{{ message }}</span>
        <button @click="emit('close')" class="text-ash hover:text-white">✕</button>
      </div>
    </Transition>
  </Teleport>
</template>
