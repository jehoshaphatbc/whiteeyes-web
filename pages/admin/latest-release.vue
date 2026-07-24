<script setup lang="ts">
import type { Release } from '~/types/content'

definePageMeta({ layout: 'admin' })

const form = ref<Release>({
  id: 0,
  title: '',
  release_type: 'Album',
  release_date: '',
  description: '',
  cover_art_url: '',
  is_featured: true,
  sort_order: 0,
  streaming_links: [],
})

const loading = ref(true)
const saving = ref(false)
const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' })

onMounted(async () => {
  try {
    const data = await $fetch<Release>('/api/latest-release')
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
    let res: Release
    if (form.value.id) {
      res = await $fetch<Release>(`/api/admin/discography/${form.value.id}`, {
        method: 'PUT',
        body: { ...form.value, is_featured: true },
      })
    } else {
      res = await $fetch<Release>('/api/admin/discography', {
        method: 'POST',
        body: { ...form.value, is_featured: true },
      })
    }
    form.value = res
    toast.value = { show: true, message: 'Featured release saved successfully', type: 'success' }
  } catch (err: any) {
    toast.value = { show: true, message: err.data?.statusMessage || 'Failed to save featured release', type: 'error' }
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span class="font-mono text-xs text-blood tracking-widest uppercase">// MODULE 03</span>
        <h1 class="font-display text-4xl text-white uppercase tracking-wider">FEATURED / LATEST RELEASE</h1>
        <p class="font-mono text-xs text-ash tracking-widest uppercase mt-1">EDIT THE RELEASE SPOTLIGHTED IN SECTION 02 ON THE FRONT PAGE</p>
      </div>
      <button
        @click="save"
        :disabled="saving || loading"
        class="btn-brutal-primary text-xs py-3 px-6 shrink-0"
      >
        {{ saving ? 'SAVING...' : 'SAVE CHANGES ↗' }}
      </button>
    </div>

    <div v-if="loading" class="font-mono text-xs text-ash tracking-widest uppercase">LOADING RELEASE DATA...</div>

    <form v-else @submit.prevent="save" class="bg-void-charcoal border border-void-border p-6 md:p-8 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2">
          <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-2">RELEASE TITLE</label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full bg-void border border-void-border px-4 py-3 font-display text-xl tracking-wider text-offwhite uppercase focus:border-blood focus:outline-none"
          />
        </div>

        <div>
          <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-2">RELEASE TYPE</label>
          <select
            v-model="form.release_type"
            class="w-full bg-void border border-void-border px-4 py-3 font-mono text-sm text-offwhite focus:border-blood focus:outline-none"
          >
            <option value="Full-Length Album">Full-Length Album</option>
            <option value="EP">EP</option>
            <option value="Single">Single</option>
            <option value="Demo">Demo</option>
            <option value="Split">Split</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-2">RELEASE DATE / YEAR</label>
          <input
            v-model="form.release_date"
            type="text"
            placeholder="e.g. 2024 or March 2024"
            class="w-full bg-void border border-void-border px-4 py-3 font-mono text-sm text-offwhite focus:border-blood focus:outline-none"
          />
        </div>

        <AdminImageUpload
          v-model="form.cover_art_url"
          label="COVER ARTWORK"
        />
      </div>

      <div>
        <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-2">DESCRIPTION NARRATIVE</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full bg-void border border-void-border px-4 py-3 text-sm text-offwhite focus:border-blood focus:outline-none leading-relaxed"
        ></textarea>
      </div>

      <div class="pt-6 border-t border-void-border">
        <AdminStreamingLinksEditor v-model="form.streaming_links" />
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
