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
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-sm font-medium text-white border"
        :class="[
          type === 'error' ? 'bg-red-900/90 border-red-700' : 'bg-emerald-900/90 border-emerald-700'
        ]"
      >
        <span>{{ message }}</span>
        <button @click="emit('close')" class="text-white/70 hover:text-white text-xs">✕</button>
      </div>
    </Transition>
  </Teleport>
</template>
