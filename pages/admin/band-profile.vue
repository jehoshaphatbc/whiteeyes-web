<script setup lang="ts">
import type { BandProfile } from '~/types/content'

definePageMeta({ layout: 'admin' })

const form = ref<BandProfile>({
  id: 1,
  band_name: '',
  logo_url: '',
  genre_label: '',
  hero_tagline: '',
  hero_bg_image_url: '',
  hero_bg_video_url: '',
  spotify_url: '',
  youtube_url: '',
})

const loading = ref(true)
const saving = ref(false)
const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' })

onMounted(async () => {
  try {
    const data = await $fetch<BandProfile>('/api/band-profile')
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
    const res = await $fetch<BandProfile>('/api/admin/band-profile', {
      method: 'PUT',
      body: form.value,
    })
    form.value = res
    toast.value = { show: true, message: 'Band profile saved successfully', type: 'success' }
  } catch (err: any) {
    toast.value = { show: true, message: err.data?.statusMessage || 'Failed to save band profile', type: 'error' }
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-white">BAND PROFILE (HERO SECTION)</h1>
        <p class="text-xs text-slate-400">Edit hero branding, logo, taglines, and global listen links</p>
      </div>
      <button
        @click="save"
        :disabled="saving || loading"
        class="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors shadow"
      >
        {{ saving ? 'SAVING...' : 'SAVE CHANGES' }}
      </button>
    </div>

    <div v-if="loading" class="text-slate-400 text-sm">Loading profile data...</div>

    <form v-else @submit.prevent="save" class="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">BAND NAME</label>
          <input
            v-model="form.band_name"
            type="text"
            required
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">GENRE LABEL</label>
          <input
            v-model="form.genre_label"
            type="text"
            placeholder="e.g. Extreme Death Metal"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1">HERO TAGLINE / STATEMENT</label>
        <textarea
          v-model="form.hero_tagline"
          rows="2"
          class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        ></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminImageUpload
          v-model="form.logo_url"
          label="BAND LOGO (PNG/SVG PREFERRED)"
        />

        <AdminImageUpload
          v-model="form.hero_bg_image_url"
          label="HERO BACKGROUND IMAGE"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">SPOTIFY ARTIST URL ("LISTEN NOW" CTA)</label>
          <input
            v-model="form.spotify_url"
            type="url"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">YOUTUBE CHANNEL URL ("WATCH" CTA)</label>
          <input
            v-model="form.youtube_url"
            type="url"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
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
