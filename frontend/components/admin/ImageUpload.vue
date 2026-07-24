<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
  label?: string
  subfolder?: string
}>()

const emit = defineEmits(['update:modelValue'])

const { upload, uploading, error } = useImageUpload()
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const url = await upload(file, props.subfolder || 'general')
    if (url) {
      emit('update:modelValue', url)
    }
  }
}

const handleDrop = async (e: DragEvent) => {
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    const file = e.dataTransfer.files[0]
    const url = await upload(file, props.subfolder || 'general')
    if (url) {
      emit('update:modelValue', url)
    }
  }
}
</script>

<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-medium text-slate-300">{{ label }}</label>

    <div class="flex items-start gap-4">
      <!-- Live Preview -->
      <div v-if="modelValue" class="relative group w-28 h-28 shrink-0 border border-slate-700 rounded-lg overflow-hidden bg-slate-900">
        <img :src="modelValue" alt="Preview" class="w-full h-full object-cover" />
        <button
          type="button"
          @click="emit('update:modelValue', '')"
          class="absolute top-1 right-1 bg-red-600 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
        >
          ✕
        </button>
      </div>

      <!-- Drag & Drop Zone / Input -->
      <div class="flex-1 space-y-2">
        <div
          @dragover.prevent
          @drop.prevent="handleDrop"
          @click="fileInput?.click()"
          class="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-lg p-4 text-center cursor-pointer transition-colors bg-slate-900/50"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileChange"
          />
          <p class="text-xs text-slate-400">
            <span v-if="uploading" class="text-indigo-400">Uploading...</span>
            <span v-else>Drag & drop an image here, or <span class="text-indigo-400 font-medium">browse</span></span>
          </p>
          <p class="text-[10px] text-slate-500 mt-1">JPG, PNG, WEBP, GIF up to 10MB</p>
        </div>

        <!-- Manual URL Input -->
        <input
          :value="modelValue"
          @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          type="url"
          placeholder="Or paste external image URL..."
          class="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
        />

        <p v-if="error" class="text-xs text-red-400">{{ error }}</p>
      </div>
    </div>
  </div>
</template>
