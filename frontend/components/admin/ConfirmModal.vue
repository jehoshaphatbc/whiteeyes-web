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
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        @click.self="emit('cancel')"
      >
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
          <h3 class="text-lg font-bold text-white">{{ title || 'Confirm Action' }}</h3>
          <p class="text-sm text-slate-400">{{ message || 'Are you sure you want to proceed?' }}</p>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button
              @click="emit('cancel')"
              class="px-4 py-2 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="emit('confirm')"
              class="px-4 py-2 rounded text-xs font-medium bg-red-600 hover:bg-red-500 text-white transition-colors"
            >
              {{ confirmText || 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
