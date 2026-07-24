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
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-white">FEATURED / LATEST RELEASE</h1>
        <p class="text-xs text-slate-400">Edit the release spotlighted in section 02 on the front page</p>
      </div>
      <button
        @click="save"
        :disabled="saving || loading"
        class="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors shadow"
      >
        {{ saving ? 'SAVING...' : 'SAVE CHANGES' }}
      </button>
    </div>

    <div v-if="loading" class="text-slate-400 text-sm">Loading release data...</div>

    <form v-else @submit.prevent="save" class="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-slate-300 mb-1">RELEASE TITLE</label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">RELEASE TYPE</label>
          <select
            v-model="form.release_type"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
          <label class="block text-sm font-medium text-slate-300 mb-1">RELEASE DATE / YEAR</label>
          <input
            v-model="form.release_date"
            type="text"
            placeholder="e.g. 2024 or March 2024"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <AdminImageUpload
          v-model="form.cover_art_url"
          label="COVER ARTWORK"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1">SHORT DESCRIPTION</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        ></textarea>
      </div>

      <div class="pt-4 border-t border-slate-800">
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
