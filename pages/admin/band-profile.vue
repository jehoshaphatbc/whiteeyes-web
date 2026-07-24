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
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span class="font-mono text-xs text-blood tracking-widest uppercase">// MODULE 01</span>
        <h1 class="font-display text-4xl text-white uppercase tracking-wider">BAND PROFILE & HERO BRANDING</h1>
        <p class="font-mono text-xs text-ash tracking-widest uppercase mt-1">EDIT HERO BRANDING, LOGO, TAGLINES, AND GLOBAL LISTEN LINKS</p>
      </div>
      <button
        @click="save"
        :disabled="saving || loading"
        class="btn-brutal-primary text-xs py-3 px-6 shrink-0"
      >
        {{ saving ? 'SAVING...' : 'SAVE CHANGES ↗' }}
      </button>
    </div>

    <div v-if="loading" class="font-mono text-xs text-ash tracking-widest uppercase">LOADING PROFILE DATA...</div>

    <form v-else @submit.prevent="save" class="bg-void-charcoal border border-void-border p-6 md:p-8 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-2">BAND NAME</label>
          <input
            v-model="form.band_name"
            type="text"
            required
            class="w-full bg-void border border-void-border px-4 py-3 text-sm text-offwhite focus:border-blood focus:outline-none"
          />
        </div>

        <div>
          <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-2">GENRE LABEL</label>
          <input
            v-model="form.genre_label"
            type="text"
            placeholder="e.g. Extreme Death Metal"
            class="w-full bg-void border border-void-border px-4 py-3 text-sm text-offwhite focus:border-blood focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-2">HERO STATEMENT / TAGLINE</label>
        <textarea
          v-model="form.hero_tagline"
          rows="3"
          class="w-full bg-void border border-void-border px-4 py-3 font-display text-lg tracking-widest text-offwhite uppercase focus:border-blood focus:outline-none"
        ></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminImageUpload
          v-model="form.logo_url"
          label="BAND LOGO (DISPLAYED IN HEADER & HERO)"
        />

        <AdminImageUpload
          v-model="form.hero_bg_image_url"
          label="HERO BACKGROUND IMAGE"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-void-border">
        <div>
          <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-2">SPOTIFY ARTIST URL ("LISTEN NOW" CTA)</label>
          <input
            v-model="form.spotify_url"
            type="url"
            class="w-full bg-void border border-void-border px-4 py-3 text-sm font-mono text-offwhite focus:border-blood focus:outline-none"
          />
        </div>

        <div>
          <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-2">YOUTUBE CHANNEL URL ("WATCH" CTA)</label>
          <input
            v-model="form.youtube_url"
            type="url"
            class="w-full bg-void border border-void-border px-4 py-3 text-sm font-mono text-offwhite focus:border-blood focus:outline-none"
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
