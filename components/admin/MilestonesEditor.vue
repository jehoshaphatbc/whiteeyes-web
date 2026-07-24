<script setup lang="ts">
import type { Milestone } from '~/types/content'

const props = defineProps<{
  modelValue: Milestone[]
}>()

const emit = defineEmits(['update:modelValue'])

const milestones = ref<Milestone[]>([...(props.modelValue || [])])

watch(() => props.modelValue, (val) => {
  milestones.value = [...(val || [])]
}, { deep: true })

const addMilestone = () => {
  milestones.value.push({ year: new Date().getFullYear(), text: '', sort_order: milestones.value.length })
  emit('update:modelValue', milestones.value)
}

const removeMilestone = (index: number) => {
  milestones.value.splice(index, 1)
  emit('update:modelValue', milestones.value)
}

const updateMilestones = () => {
  emit('update:modelValue', milestones.value)
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <label class="block font-mono text-xs text-ash tracking-widest uppercase">BAND CHRONOLOGY / MILESTONES</label>
      <button
        type="button"
        @click="addMilestone"
        class="font-mono text-xs text-blood hover:text-white uppercase font-bold"
      >
        + ADD MILESTONE
      </button>
    </div>

    <div v-if="!milestones.length" class="font-mono text-xs text-ash/60 italic">NO MILESTONES ADDED.</div>

    <div v-for="(m, index) in milestones" :key="index" class="flex items-center gap-3">
      <input
        v-model.number="m.year"
        @input="updateMilestones"
        type="number"
        placeholder="Year"
        class="w-24 bg-void border border-void-border px-3 py-2 font-mono text-xs text-offwhite focus:border-blood focus:outline-none"
      />
      <input
        v-model="m.text"
        @input="updateMilestones"
        type="text"
        placeholder="Milestone description..."
        class="flex-1 bg-void border border-void-border px-3 py-2 font-mono text-xs text-offwhite focus:border-blood focus:outline-none"
      />
      <button
        type="button"
        @click="removeMilestone(index)"
        class="text-ash hover:text-blood font-mono text-xs px-2 py-1"
      >
        ✕
      </button>
    </div>
  </div>
</template>
