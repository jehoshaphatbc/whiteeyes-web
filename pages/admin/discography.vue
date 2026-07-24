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
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-white">DISCOGRAPHY ARCHIVE</h1>
        <p class="text-xs text-slate-400">Manage all albums, EPs, singles, and demos</p>
      </div>
      <button
        @click="openCreateModal"
        class="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors shadow"
      >
        + ADD NEW RELEASE
      </button>
    </div>

    <div v-if="loading" class="text-slate-400 text-sm">Loading discography...</div>

    <div v-else class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
      <table class="w-full text-left text-sm text-slate-300">
        <thead class="bg-slate-950 text-xs font-mono text-slate-400 border-b border-slate-800">
          <tr>
            <th class="p-4">COVER</th>
            <th class="p-4">TITLE</th>
            <th class="p-4">TYPE</th>
            <th class="p-4">YEAR</th>
            <th class="p-4">FEATURED</th>
            <th class="p-4 text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800">
          <tr v-for="item in releases" :key="item.id" class="hover:bg-slate-850 transition-colors">
            <td class="p-4">
              <img :src="item.cover_art_url" :alt="item.title" class="w-12 h-12 object-cover rounded border border-slate-700" />
            </td>
            <td class="p-4 font-bold text-white">{{ item.title }}</td>
            <td class="p-4 font-mono text-xs text-indigo-400">{{ item.release_type }}</td>
            <td class="p-4 font-mono text-xs">{{ item.release_date }}</td>
            <td class="p-4">
              <button
                @click="setFeatured(item.id)"
                class="px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-colors"
                :class="item.is_featured ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'"
              >
                {{ item.is_featured ? '★ FEATURED' : 'SET FEATURED' }}
              </button>
            </td>
            <td class="p-4 text-right space-x-2">
              <button @click="openEditModal(item)" class="text-xs text-indigo-400 hover:text-indigo-300">EDIT</button>
              <button @click="confirmDelete(item.id)" class="text-xs text-red-400 hover:text-red-300">DELETE</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit/Create Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-2xl w-full space-y-6 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 class="font-bold text-lg text-white">{{ form.id ? 'EDIT RELEASE' : 'ADD NEW RELEASE' }}</h3>
            <button @click="showModal = false" class="text-slate-400 hover:text-white">✕</button>
          </div>

          <form @submit.prevent="save" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-slate-300 mb-1">TITLE</label>
                <input v-model="form.title" type="text" required class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs text-slate-300 mb-1">RELEASE TYPE</label>
                <input v-model="form.release_type" type="text" placeholder="Album / EP / Single" class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-slate-300 mb-1">RELEASE DATE / YEAR</label>
                <input v-model="form.release_date" type="text" class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none" />
              </div>
              <AdminImageUpload v-model="form.cover_art_url" label="COVER ARTWORK" />
            </div>

            <div>
              <label class="block text-xs text-slate-300 mb-1">DESCRIPTION</label>
              <textarea v-model="form.description" rows="2" class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none"></textarea>
            </div>

            <AdminStreamingLinksEditor v-model="form.streaming_links" />

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" @click="showModal = false" class="px-4 py-2 text-xs bg-slate-800 text-slate-300 rounded">Cancel</button>
              <button type="submit" class="px-4 py-2 text-xs bg-indigo-600 text-white rounded font-medium">Save Release</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <AdminConfirmModal :show="showConfirm" message="Are you sure you want to delete this release?" @confirm="executeDelete" @cancel="showConfirm = false" />
    <AdminToastNotification :show="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
  </div>
</template>
