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
      <label class="block text-sm font-medium text-slate-300">BAND CHRONOLOGY / MILESTONES</label>
      <button
        type="button"
        @click="addMilestone"
        class="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
      >
        + Add Milestone
      </button>
    </div>

    <div v-if="!milestones.length" class="text-xs text-slate-500 italic">No milestones added.</div>

    <div v-for="(m, index) in milestones" :key="index" class="flex items-center gap-3">
      <input
        v-model.number="m.year"
        @input="updateMilestones"
        type="number"
        placeholder="Year"
        class="w-24 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
      />
      <input
        v-model="m.text"
        @input="updateMilestones"
        type="text"
        placeholder="Milestone description..."
        class="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
      />
      <button
        type="button"
        @click="removeMilestone(index)"
        class="text-slate-500 hover:text-red-400 text-xs px-2 py-1"
      >
        ✕
      </button>
    </div>
  </div>
</template>
