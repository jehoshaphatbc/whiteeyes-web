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
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-white">ABOUT / BIOGRAPHY</h1>
        <p class="text-xs text-slate-400">Edit band biography, formation stats, photo, and timeline</p>
      </div>
      <button
        @click="save"
        :disabled="saving || loading"
        class="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors shadow"
      >
        {{ saving ? 'SAVING...' : 'SAVE CHANGES' }}
      </button>
    </div>

    <div v-if="loading" class="text-slate-400 text-sm">Loading biography data...</div>

    <form v-else @submit.prevent="save" class="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1">BIOGRAPHY TEXT (MARKDOWN SUPPORTED)</label>
        <textarea
          v-model="form.biography"
          rows="6"
          required
          class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-sans leading-relaxed"
        ></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">FORMED YEAR</label>
          <input
            v-model.number="form.formed_year"
            type="number"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">ORIGIN (CITY/COUNTRY)</label>
          <input
            v-model="form.origin"
            type="text"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">GENRE</label>
          <input
            v-model="form.genre"
            type="text"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">STYLE DESCRIPTION</label>
          <input
            v-model="form.style_description"
            type="text"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <AdminImageUpload
        v-model="form.section_photo_url"
        label="ABOUT SECTION PHOTO / VISUAL"
      />

      <div class="pt-4 border-t border-slate-800">
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
