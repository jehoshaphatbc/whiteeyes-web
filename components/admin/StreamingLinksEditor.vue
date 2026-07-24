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
      <label class="block font-mono text-xs text-ash tracking-widest uppercase">STREAMING & STORE LINKS</label>
      <button
        type="button"
        @click="addLink"
        class="font-mono text-xs text-blood hover:text-white uppercase font-bold"
      >
        + ADD PLATFORM
      </button>
    </div>

    <div v-if="!links.length" class="font-mono text-xs text-ash/60 italic">NO PLATFORM LINKS ADDED.</div>

    <div v-for="(link, index) in links" :key="index" class="flex items-center gap-3">
      <input
        v-model="link.label"
        @input="updateLinks"
        type="text"
        placeholder="Platform Label (e.g. Spotify)"
        class="w-1/3 bg-void border border-void-border px-3 py-2 font-mono text-xs text-offwhite focus:border-blood focus:outline-none"
      />
      <input
        v-model="link.url"
        @input="updateLinks"
        type="url"
        placeholder="https://..."
        class="flex-1 bg-void border border-void-border px-3 py-2 font-mono text-xs text-offwhite focus:border-blood focus:outline-none"
      />
      <button
        type="button"
        @click="removeLink(index)"
        class="text-ash hover:text-blood font-mono text-xs px-2 py-1"
      >
        ✕
      </button>
    </div>
  </div>
</template>
