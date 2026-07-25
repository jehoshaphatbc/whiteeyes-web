<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

const editorRef = ref<HTMLDivElement | null>(null)
const isFocused = ref(false)

// Sync modelValue changes to editor innerHTML
watch(() => props.modelValue, (newVal) => {
  if (editorRef.value && editorRef.value.innerHTML !== newVal) {
    editorRef.value.innerHTML = newVal || ''
  }
}, { immediate: false })

onMounted(() => {
  if (editorRef.value) {
    editorRef.value.innerHTML = props.modelValue || ''
  }
})

const onInput = () => {
  if (editorRef.value) {
    emit('update:modelValue', editorRef.value.innerHTML)
  }
}

const execCommand = (command: string, value: string | undefined = undefined) => {
  document.execCommand(command, false, value)
  if (editorRef.value) {
    editorRef.value.focus()
    emit('update:modelValue', editorRef.value.innerHTML)
  }
}

const insertLink = () => {
  const url = prompt('Enter link URL (e.g. https://spotify.com):')
  if (url) {
    execCommand('createLink', url)
  }
}
</script>

<template>
  <div 
    class="bg-void border rounded-lg overflow-hidden transition-colors font-sans"
    :class="isFocused ? 'border-red-600' : 'border-void-border'"
  >
    <!-- Formatting Toolbar -->
    <div class="bg-void-charcoal border-b border-void-border p-2 flex flex-wrap items-center gap-1 text-xs">
      <!-- Headings -->
      <button
        type="button"
        @click="execCommand('formatBlock', '<h2>')"
        class="px-2.5 py-1 font-mono text-[11px] text-gray-300 hover:text-white bg-void hover:bg-void-border border border-void-border rounded transition-colors"
        title="Heading 2"
      >
        H2
      </button>

      <button
        type="button"
        @click="execCommand('formatBlock', '<h3>')"
        class="px-2.5 py-1 font-mono text-[11px] text-gray-300 hover:text-white bg-void hover:bg-void-border border border-void-border rounded transition-colors"
        title="Heading 3"
      >
        H3
      </button>

      <button
        type="button"
        @click="execCommand('formatBlock', '<p>')"
        class="px-2.5 py-1 font-mono text-[11px] text-gray-300 hover:text-white bg-void hover:bg-void-border border border-void-border rounded transition-colors"
        title="Paragraph"
      >
        P
      </button>

      <div class="w-px h-4 bg-void-border mx-1"></div>

      <!-- Inline Styles -->
      <button
        type="button"
        @click="execCommand('bold')"
        class="px-2.5 py-1 font-bold text-gray-300 hover:text-white bg-void hover:bg-void-border border border-void-border rounded transition-colors"
        title="Bold"
      >
        B
      </button>

      <button
        type="button"
        @click="execCommand('italic')"
        class="px-2.5 py-1 italic text-gray-300 hover:text-white bg-void hover:bg-void-border border border-void-border rounded transition-colors"
        title="Italic"
      >
        I
      </button>

      <button
        type="button"
        @click="execCommand('underline')"
        class="px-2.5 py-1 underline text-gray-300 hover:text-white bg-void hover:bg-void-border border border-void-border rounded transition-colors"
        title="Underline"
      >
        U
      </button>

      <button
        type="button"
        @click="execCommand('strikeThrough')"
        class="px-2.5 py-1 line-through text-gray-300 hover:text-white bg-void hover:bg-void-border border border-void-border rounded transition-colors"
        title="Strikethrough"
      >
        S
      </button>

      <div class="w-px h-4 bg-void-border mx-1"></div>

      <!-- Lists -->
      <button
        type="button"
        @click="execCommand('insertUnorderedList')"
        class="px-2.5 py-1 font-mono text-gray-300 hover:text-white bg-void hover:bg-void-border border border-void-border rounded transition-colors"
        title="Bullet List"
      >
        • List
      </button>

      <button
        type="button"
        @click="execCommand('insertOrderedList')"
        class="px-2.5 py-1 font-mono text-gray-300 hover:text-white bg-void hover:bg-void-border border border-void-border rounded transition-colors"
        title="Numbered List"
      >
        1. List
      </button>

      <button
        type="button"
        @click="execCommand('formatBlock', '<blockquote>')"
        class="px-2.5 py-1 font-mono text-gray-300 hover:text-white bg-void hover:bg-void-border border border-void-border rounded transition-colors"
        title="Blockquote"
      >
        " Quote
      </button>

      <div class="w-px h-4 bg-void-border mx-1"></div>

      <!-- Link & Extras -->
      <button
        type="button"
        @click="insertLink"
        class="px-2.5 py-1 font-mono text-red-400 hover:text-white bg-void hover:bg-void-border border border-void-border rounded transition-colors"
        title="Insert Link"
      >
        🔗 Link
      </button>

      <button
        type="button"
        @click="execCommand('removeFormat')"
        class="px-2.5 py-1 font-mono text-gray-400 hover:text-white bg-void hover:bg-void-border border border-void-border rounded transition-colors"
        title="Clear Formatting"
      >
        🧹 Clear
      </button>

      <div class="w-px h-4 bg-void-border mx-1"></div>

      <!-- Undo / Redo -->
      <button
        type="button"
        @click="execCommand('undo')"
        class="px-2 py-1 font-mono text-gray-400 hover:text-white bg-void hover:bg-void-border border border-void-border rounded transition-colors"
        title="Undo"
      >
        ↶
      </button>

      <button
        type="button"
        @click="execCommand('redo')"
        class="px-2 py-1 font-mono text-gray-400 hover:text-white bg-void hover:bg-void-border border border-void-border rounded transition-colors"
        title="Redo"
      >
        ↷
      </button>
    </div>

    <!-- Editable Content Area -->
    <div
      ref="editorRef"
      contenteditable="true"
      @input="onInput"
      @focus="isFocused = true"
      @blur="isFocused = false"
      class="p-4 min-h-[240px] max-h-[500px] overflow-y-auto text-white font-sans text-sm focus:outline-none leading-relaxed prose prose-invert max-w-none"
      :data-placeholder="placeholder || 'Type post content here...'"
    ></div>
  </div>
</template>

<style scoped>
[contenteditable=true]:empty:before {
  content: attr(data-placeholder);
  color: #6b7280;
  pointer-events: none;
  display: block;
}
</style>
