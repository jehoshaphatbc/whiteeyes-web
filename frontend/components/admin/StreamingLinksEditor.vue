<script setup lang="ts">
import type { StreamingLink } from '~/types/content'

const props = defineProps<{
  modelValue: StreamingLink[]
}>()

const emit = defineEmits(['update:modelValue'])

const links = ref<StreamingLink[]>([...(props.modelValue || [])])

watch(() => props.modelValue, (val) => {
  links.value = [...(val || [])]
}, { deep: true })

const addLink = () => {
  links.value.push({ label: 'Spotify', url: '', sort_order: links.value.length })
  emit('update:modelValue', links.value)
}

const removeLink = (index: number) => {
  links.value.splice(index, 1)
  emit('update:modelValue', links.value)
}

const updateLinks = () => {
  emit('update:modelValue', links.value)
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <label class="block text-sm font-medium text-slate-300">STREAMING & STORE LINKS</label>
      <button
        type="button"
        @click="addLink"
        class="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
      >
        + Add Platform
      </button>
    </div>

    <div v-if="!links.length" class="text-xs text-slate-500 italic">No links added yet.</div>

    <div v-for="(link, index) in links" :key="index" class="flex items-center gap-3">
      <input
        v-model="link.label"
        @input="updateLinks"
        type="text"
        placeholder="Label (e.g. Spotify)"
        class="w-1/3 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
      />
      <input
        v-model="link.url"
        @input="updateLinks"
        type="url"
        placeholder="https://..."
        class="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
      />
      <button
        type="button"
        @click="removeLink(index)"
        class="text-slate-500 hover:text-red-400 text-xs px-2 py-1"
      >
        ✕
      </button>
    </div>
  </div>
</template>
