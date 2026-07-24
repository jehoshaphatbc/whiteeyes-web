<script setup lang="ts">
defineProps<{
  show: boolean
  title?: string
  message?: string
  confirmText?: string
}>()

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        @click.self="emit('cancel')"
      >
        <div class="bg-void-charcoal border border-blood/60 p-6 max-w-sm w-full space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.9)]">
          <div class="space-y-2">
            <span class="font-mono text-[10px] text-blood tracking-widest uppercase">// WARNING</span>
            <h3 class="font-display text-2xl text-white uppercase tracking-wider">{{ title || 'CONFIRM DELETION' }}</h3>
            <p class="font-sans text-sm text-ash leading-relaxed">{{ message || 'Are you sure you want to proceed? This action cannot be undone.' }}</p>
          </div>

          <div class="flex items-center justify-end gap-4 pt-2 border-t border-void-border">
            <button
              @click="emit('cancel')"
              class="btn-brutal text-xs py-2 px-4"
            >
              CANCEL
            </button>
            <button
              @click="emit('confirm')"
              class="btn-brutal-primary text-xs py-2 px-4"
            >
              {{ confirmText || 'DELETE' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
