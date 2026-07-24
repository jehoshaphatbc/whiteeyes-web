<script setup lang="ts">
import type { About } from '~/types/content'

definePageMeta({ layout: 'admin' })

const form = ref<About>({
  id: 1,
  biography: '',
  formed_year: 2019,
  origin: '',
  genre: '',
  style_description: '',
  section_photo_url: '',
  milestones: [],
})

const loading = ref(true)
const saving = ref(false)
const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' })

onMounted(async () => {
  try {
    const data = await $fetch<About>('/api/about')
    if (data) form.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

const save = async () => {
  saving.value = true
  try {
    const res = await $fetch<About>('/api/admin/about', {
      method: 'PUT',
      body: form.value,
    })
    form.value = res
    toast.value = { show: true, message: 'About section saved successfully', type: 'success' }
  } catch (err: any) {
    toast.value = { show: true, message: err.data?.statusMessage || 'Failed to save about section', type: 'error' }
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span class="font-mono text-xs text-blood tracking-widest uppercase">// MODULE 02</span>
        <h1 class="font-display text-4xl text-white uppercase tracking-wider">ABOUT & BIOGRAPHY NARRATIVE</h1>
        <p class="font-mono text-xs text-ash tracking-widest uppercase mt-1">EDIT BAND BIOGRAPHY, FORMATION STATS, PHOTO, AND TIMELINE</p>
      </div>
      <button
        @click="save"
        :disabled="saving || loading"
        class="btn-brutal-primary text-xs py-3 px-6 shrink-0"
      >
        {{ saving ? 'SAVING...' : 'SAVE CHANGES ↗' }}
      </button>
    </div>

    <div v-if="loading" class="font-mono text-xs text-ash tracking-widest uppercase">LOADING BIOGRAPHY DATA...</div>

    <form v-else @submit.prevent="save" class="bg-void-charcoal border border-void-border p-6 md:p-8 space-y-6">
      <div>
        <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-2">BIOGRAPHY NARRATIVE</label>
        <textarea
          v-model="form.biography"
          rows="6"
          required
          class="w-full bg-void border border-void-border px-4 py-3 text-sm text-offwhite focus:border-blood focus:outline-none font-sans leading-relaxed"
        ></textarea>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-2">FORMED YEAR</label>
          <input
            v-model.number="form.formed_year"
            type="number"
            class="w-full bg-void border border-void-border px-4 py-2.5 font-mono text-sm text-offwhite focus:border-blood focus:outline-none"
          />
        </div>
        <div>
          <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-2">ORIGIN (CITY/COUNTRY)</label>
          <input
            v-model="form.origin"
            type="text"
            class="w-full bg-void border border-void-border px-4 py-2.5 font-mono text-sm text-offwhite focus:border-blood focus:outline-none"
          />
        </div>
        <div>
          <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-2">GENRE</label>
          <input
            v-model="form.genre"
            type="text"
            class="w-full bg-void border border-void-border px-4 py-2.5 font-mono text-sm text-offwhite focus:border-blood focus:outline-none"
          />
        </div>
        <div>
          <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-2">STYLE DESCRIPTION</label>
          <input
            v-model="form.style_description"
            type="text"
            class="w-full bg-void border border-void-border px-4 py-2.5 font-mono text-sm text-offwhite focus:border-blood focus:outline-none"
          />
        </div>
      </div>

      <AdminImageUpload
        v-model="form.section_photo_url"
        label="ABOUT SECTION BAND PHOTO"
      />

      <div class="pt-6 border-t border-void-border">
        <AdminMilestonesEditor v-model="form.milestones" />
      </div>
    </form>

    <AdminToastNotification
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
      @close="toast.show = false"
    />
  </div>
</template>
