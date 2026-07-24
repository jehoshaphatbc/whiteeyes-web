<script setup lang="ts">
import type { Video } from '~/types/content'

definePageMeta({ layout: 'admin' })

const config = useRuntimeConfig()
const items = ref<Video[]>([])
const loading = ref(true)
const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' })

const showModal = ref(false)
const showConfirm = ref(false)
const deletingId = ref<number | null>(null)

const defaultForm = (): Video => ({
  id: 0,
  youtube_id: '',
  title: '',
  description: '',
  is_featured: false,
  sort_order: 0,
})

const form = ref<Video>(defaultForm())

const fetchItems = async () => {
  loading.value = true
  try {
    items.value = await $fetch<Video[]>(`${config.public.apiBase}/videos`)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchItems)

const openCreateModal = () => {
  form.value = defaultForm()
  showModal.value = true
}

const openEditModal = (item: Video) => {
  form.value = JSON.parse(JSON.stringify(item))
  showModal.value = true
}

const extractYouTubeId = (urlOrId: string) => {
  if (!urlOrId) return ''
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = urlOrId.match(regExp)
  return (match && match[2].length === 11) ? match[2] : urlOrId
}

const save = async () => {
  form.value.youtube_id = extractYouTubeId(form.value.youtube_id)
  try {
    if (form.value.id) {
      await $fetch(`${config.public.apiBase}/admin/videos/${form.value.id}`, {
        method: 'PUT',
        body: form.value,
      })
      toast.value = { show: true, message: 'Video updated', type: 'success' }
    } else {
      await $fetch(`${config.public.apiBase}/admin/videos`, {
        method: 'POST',
        body: form.value,
      })
      toast.value = { show: true, message: 'Video created', type: 'success' }
    }
    showModal.value = false
    await fetchItems()
  } catch (err: any) {
    toast.value = { show: true, message: err.data?.error || 'Failed to save video', type: 'error' }
  }
}

const confirmDelete = (id: number) => {
  deletingId.value = id
  showConfirm.value = true
}

const executeDelete = async () => {
  if (!deletingId.value) return
  try {
    await $fetch(`${config.public.apiBase}/admin/videos/${deletingId.value}`, { method: 'DELETE' })
    toast.value = { show: true, message: 'Video deleted', type: 'success' }
    showConfirm.value = false
    deletingId.value = null
    await fetchItems()
  } catch (err: any) {
    toast.value = { show: true, message: err.data?.error || 'Failed to delete video', type: 'error' }
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-white">YOUTUBE VIDEOS</h1>
        <p class="text-xs text-slate-400">Manage music videos, live performances, and studio footage</p>
      </div>
      <button
        @click="openCreateModal"
        class="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors shadow"
      >
        + ADD VIDEO
      </button>
    </div>

    <div v-if="loading" class="text-slate-400 text-sm">Loading videos...</div>

    <div v-else class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
      <table class="w-full text-left text-sm text-slate-300">
        <thead class="bg-slate-950 text-xs font-mono text-slate-400 border-b border-slate-800">
          <tr>
            <th class="p-4">PREVIEW</th>
            <th class="p-4">TITLE</th>
            <th class="p-4">YOUTUBE ID</th>
            <th class="p-4">FEATURED</th>
            <th class="p-4 text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800">
          <tr v-for="item in items" :key="item.id" class="hover:bg-slate-850 transition-colors">
            <td class="p-4">
              <img :src="`https://img.youtube.com/vi/${item.youtube_id}/hqdefault.jpg`" class="w-16 h-10 object-cover rounded border border-slate-700" />
            </td>
            <td class="p-4 font-bold text-white">{{ item.title }}</td>
            <td class="p-4 font-mono text-xs text-slate-400">{{ item.youtube_id }}</td>
            <td class="p-4 font-mono text-xs">
              <span v-if="item.is_featured" class="text-amber-400 font-bold">★ FEATURED</span>
              <span v-else class="text-slate-500">—</span>
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
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 class="font-bold text-lg text-white">{{ form.id ? 'EDIT VIDEO' : 'ADD VIDEO' }}</h3>
            <button @click="showModal = false" class="text-slate-400 hover:text-white">✕</button>
          </div>

          <form @submit.prevent="save" class="space-y-4">
            <div>
              <label class="block text-xs text-slate-300 mb-1">TITLE</label>
              <input v-model="form.title" type="text" required class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none" />
            </div>

            <div>
              <label class="block text-xs text-slate-300 mb-1">YOUTUBE URL OR VIDEO ID</label>
              <input v-model="form.youtube_id" type="text" placeholder="https://www.youtube.com/watch?v=... or ID" required class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none font-mono" />
            </div>

            <div>
              <label class="block text-xs text-slate-300 mb-1">DESCRIPTION</label>
              <textarea v-model="form.description" rows="2" class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none"></textarea>
            </div>

            <div class="flex items-center gap-2">
              <input v-model="form.is_featured" type="checkbox" id="is_featured" class="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0" />
              <label for="is_featured" class="text-xs text-slate-300">FEATURE AS MAIN VIDEO EMBED</label>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" @click="showModal = false" class="px-4 py-2 text-xs bg-slate-800 text-slate-300 rounded">Cancel</button>
              <button type="submit" class="px-4 py-2 text-xs bg-indigo-600 text-white rounded font-medium">Save Video</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <AdminConfirmModal :show="showConfirm" message="Are you sure you want to delete this video?" @confirm="executeDelete" @cancel="showConfirm = false" />
    <AdminToastNotification :show="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
  </div>
</template>
