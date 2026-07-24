<script setup lang="ts">
import type { Release } from '~/types/content'

definePageMeta({ layout: 'admin' })

const releases = ref<Release[]>([])
const loading = ref(true)
const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' })

const showModal = ref(false)
const showConfirm = ref(false)
const deletingId = ref<number | null>(null)

const defaultForm = (): Release => ({
  id: 0,
  title: '',
  release_type: 'Album',
  release_date: '',
  description: '',
  cover_art_url: '',
  is_featured: false,
  sort_order: 0,
  streaming_links: [],
})

const form = ref<Release>(defaultForm())

const fetchReleases = async () => {
  loading.value = true
  try {
    releases.value = await $fetch<Release[]>('/api/discography')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchReleases)

const openCreateModal = () => {
  form.value = defaultForm()
  showModal.value = true
}

const openEditModal = (item: Release) => {
  form.value = JSON.parse(JSON.stringify(item))
  showModal.value = true
}

const save = async () => {
  try {
    if (form.value.id) {
      await $fetch(`/api/admin/discography/${form.value.id}`, {
        method: 'PUT',
        body: form.value,
      })
      toast.value = { show: true, message: 'Release updated successfully', type: 'success' }
    } else {
      await $fetch('/api/admin/discography', {
        method: 'POST',
        body: form.value,
      })
      toast.value = { show: true, message: 'Release created successfully', type: 'success' }
    }
    showModal.value = false
    await fetchReleases()
  } catch (err: any) {
    toast.value = { show: true, message: err.data?.statusMessage || 'Failed to save release', type: 'error' }
  }
}

const confirmDelete = (id: number) => {
  deletingId.value = id
  showConfirm.value = true
}

const executeDelete = async () => {
  if (!deletingId.value) return
  try {
    await $fetch(`/api/admin/discography/${deletingId.value}`, { method: 'DELETE' })
    toast.value = { show: true, message: 'Release deleted', type: 'success' }
    showConfirm.value = false
    deletingId.value = null
    await fetchReleases()
  } catch (err: any) {
    toast.value = { show: true, message: err.data?.statusMessage || 'Failed to delete release', type: 'error' }
  }
}

const setFeatured = async (id: number) => {
  try {
    await $fetch(`/api/admin/discography/${id}/featured`, { method: 'PUT' })
    toast.value = { show: true, message: 'Set as featured release', type: 'success' }
    await fetchReleases()
  } catch (err: any) {
    toast.value = { show: true, message: err.data?.statusMessage || 'Failed to set featured', type: 'error' }
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span class="font-mono text-xs text-blood tracking-widest uppercase">// MODULE 04</span>
        <h1 class="font-display text-4xl text-white uppercase tracking-wider">DISCOGRAPHY CATALOG</h1>
        <p class="font-mono text-xs text-ash tracking-widest uppercase mt-1">MANAGE ALL ALBUMS, EPS, SINGLES, AND DEMOS</p>
      </div>
      <button
        @click="openCreateModal"
        class="btn-brutal-primary text-xs py-3 px-6 shrink-0"
      >
        + ADD NEW RELEASE ↗
      </button>
    </div>

    <div v-if="loading" class="font-mono text-xs text-ash tracking-widest uppercase">LOADING DISCOGRAPHY...</div>

    <div v-else class="bg-void-charcoal border border-void-border overflow-hidden">
      <table class="w-full text-left text-sm text-offwhite">
        <thead class="bg-void font-mono text-xs text-ash uppercase border-b border-void-border">
          <tr>
            <th class="p-4">COVER</th>
            <th class="p-4">TITLE</th>
            <th class="p-4">TYPE</th>
            <th class="p-4">YEAR</th>
            <th class="p-4">FEATURED</th>
            <th class="p-4 text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-void-border font-sans">
          <tr v-for="item in releases" :key="item.id" class="hover:bg-void transition-colors">
            <td class="p-4">
              <img :src="item.cover_art_url" :alt="item.title" class="w-12 h-12 object-cover border border-void-border filter grayscale contrast-125" />
            </td>
            <td class="p-4 font-display text-xl text-white uppercase tracking-wider">{{ item.title }}</td>
            <td class="p-4 font-mono text-xs text-blood uppercase">{{ item.release_type }}</td>
            <td class="p-4 font-mono text-xs text-ash">{{ item.release_date }}</td>
            <td class="p-4">
              <button
                @click="setFeatured(item.id)"
                class="font-mono text-[10px] uppercase py-1 px-3 border transition-colors"
                :class="item.is_featured ? 'bg-blood/20 text-white border-blood font-bold' : 'border-void-border text-ash hover:text-white'"
              >
                {{ item.is_featured ? '★ FEATURED' : 'SET FEATURED' }}
              </button>
            </td>
            <td class="p-4 text-right space-x-3 font-mono text-xs">
              <button @click="openEditModal(item)" class="text-offwhite hover:text-blood">EDIT</button>
              <button @click="confirmDelete(item.id)" class="text-ash hover:text-blood">DELETE</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit/Create Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
        <div class="bg-void-charcoal border border-void-border p-6 md:p-8 max-w-2xl w-full space-y-6 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between border-b border-void-border pb-4">
            <h3 class="font-display text-2xl text-white uppercase tracking-wider">{{ form.id ? 'EDIT RELEASE' : 'ADD NEW RELEASE' }}</h3>
            <button @click="showModal = false" class="text-ash hover:text-white">✕</button>
          </div>

          <form @submit.prevent="save" class="space-y-4 font-sans">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-1">TITLE</label>
                <input v-model="form.title" type="text" required class="w-full bg-void border border-void-border px-3 py-2 text-sm text-offwhite focus:border-blood focus:outline-none" />
              </div>
              <div>
                <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-1">RELEASE TYPE</label>
                <input v-model="form.release_type" type="text" placeholder="Album / EP / Single" class="w-full bg-void border border-void-border px-3 py-2 text-sm text-offwhite focus:border-blood focus:outline-none" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-1">RELEASE DATE / YEAR</label>
                <input v-model="form.release_date" type="text" class="w-full bg-void border border-void-border px-3 py-2 text-sm text-offwhite focus:border-blood focus:outline-none" />
              </div>
              <AdminImageUpload v-model="form.cover_art_url" label="COVER ARTWORK" />
            </div>

            <div>
              <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-1">DESCRIPTION</label>
              <textarea v-model="form.description" rows="2" class="w-full bg-void border border-void-border px-3 py-2 text-sm text-offwhite focus:border-blood focus:outline-none"></textarea>
            </div>

            <AdminStreamingLinksEditor v-model="form.streaming_links" />

            <div class="flex items-center justify-end gap-4 pt-4 border-t border-void-border">
              <button type="button" @click="showModal = false" class="btn-brutal text-xs py-2 px-4">CANCEL</button>
              <button type="submit" class="btn-brutal-primary text-xs py-2 px-5">SAVE RELEASE ↗</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <AdminConfirmModal :show="showConfirm" message="Are you sure you want to delete this release?" @confirm="executeDelete" @cancel="showConfirm = false" />
    <AdminToastNotification :show="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
  </div>
</template>
