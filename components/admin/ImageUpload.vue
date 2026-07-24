<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
  label?: string
}>()

const emit = defineEmits(['update:modelValue'])

const { upload, uploading, error } = useImageUpload()
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const url = await upload(file)
    if (url) {
      emit('update:modelValue', url)
    }
  }
}

const handleDrop = async (e: DragEvent) => {
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    const file = e.dataTransfer.files[0]
    const url = await upload(file)
    if (url) {
      emit('update:modelValue', url)
    }
  }
}
</script>

<template>
  <div class="space-y-2">
    <label v-if="label" class="block font-mono text-xs text-ash tracking-widest uppercase mb-1">{{ label }}</label>

    <div class="flex items-start gap-4">
      <div v-if="modelValue" class="relative group w-28 h-28 shrink-0 border border-void-border overflow-hidden bg-void-gray">
        <img :src="modelValue" alt="Preview" class="w-full h-full object-cover filter grayscale contrast-125" />
        <button
          type="button"
          @click="emit('update:modelValue', '')"
          class="absolute top-1 right-1 bg-blood text-white p-1 font-mono text-xs hover:bg-blood-bright transition-colors"
        >
          ✕
        </button>
      </div>

      <div class="flex-1 space-y-2">
        <div
          @dragover.prevent
          @drop.prevent="handleDrop"
          @click="fileInput?.click()"
          class="border border-dashed border-void-border hover:border-blood bg-void-charcoal p-4 text-center cursor-pointer transition-colors"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileChange"
          />
          <p class="font-mono text-xs text-ash uppercase">
            <span v-if="uploading" class="text-blood font-bold">UPLOADING TO VERCEL BLOB...</span>
            <span v-else>DRAG & DROP IMAGE HERE, OR <span class="text-blood underline">BROWSE</span></span>
          </p>
          <p class="font-mono text-[10px] text-ash/60 mt-1 uppercase">VERCEL BLOB STORAGE (JPG, PNG, WEBP)</p>
        </div>

        <input
          :value="modelValue"
          @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          type="url"
          placeholder="OR PASTE EXTERNAL IMAGE URL..."
          class="w-full bg-void border border-void-border px-3 py-2 font-mono text-xs text-offwhite focus:border-blood focus:outline-none transition-colors"
        />

        <p v-if="error" class="font-mono text-xs text-blood">{{ error }}</p>
      </div>
    </div>
  </div>
</template>
