<script setup lang="ts">
import type { Video } from '~/types/content'

definePageMeta({ layout: 'admin' })

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
    items.value = await $fetch<Video[]>('/api/videos')
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
      await $fetch(`/api/admin/videos/${form.value.id}`, {
        method: 'PUT',
        body: form.value,
      })
      toast.value = { show: true, message: 'Video updated', type: 'success' }
    } else {
      await $fetch('/api/admin/videos', {
        method: 'POST',
        body: form.value,
      })
      toast.value = { show: true, message: 'Video created', type: 'success' }
    }
    showModal.value = false
    await fetchItems()
  } catch (err: any) {
    toast.value = { show: true, message: err.data?.statusMessage || 'Failed to save video', type: 'error' }
  }
}

const confirmDelete = (id: number) => {
  deletingId.value = id
  showConfirm.value = true
}

const executeDelete = async () => {
  if (!deletingId.value) return
  try {
    await $fetch(`/api/admin/videos/${deletingId.value}`, { method: 'DELETE' })
    toast.value = { show: true, message: 'Video deleted', type: 'success' }
    showConfirm.value = false
    deletingId.value = null
    await fetchItems()
  } catch (err: any) {
    toast.value = { show: true, message: err.data?.statusMessage || 'Failed to delete video', type: 'error' }
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span class="font-mono text-xs text-blood tracking-widest uppercase">// MODULE 06</span>
        <h1 class="font-display text-4xl text-white uppercase tracking-wider">YOUTUBE TRANSMISSIONS</h1>
        <p class="font-mono text-xs text-ash tracking-widest uppercase mt-1">MANAGE MUSIC VIDEOS, LIVE PERFORMANCES, AND STUDIO FOOTAGE</p>
      </div>
      <button
        @click="openCreateModal"
        class="btn-brutal-primary text-xs py-3 px-6 shrink-0"
      >
        + ADD VIDEO ↗
      </button>
    </div>

    <div v-if="loading" class="font-mono text-xs text-ash tracking-widest uppercase">LOADING VIDEOS...</div>

    <div v-else class="bg-void-charcoal border border-void-border overflow-hidden">
      <table class="w-full text-left text-sm text-offwhite">
        <thead class="bg-void font-mono text-xs text-ash uppercase border-b border-void-border">
          <tr>
            <th class="p-4">PREVIEW</th>
            <th class="p-4">TITLE</th>
            <th class="p-4">YOUTUBE ID</th>
            <th class="p-4">FEATURED</th>
            <th class="p-4 text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-void-border font-sans">
          <tr v-for="item in items" :key="item.id" class="hover:bg-void transition-colors">
            <td class="p-4">
              <img :src="`https://img.youtube.com/vi/${item.youtube_id}/hqdefault.jpg`" class="w-16 h-10 object-cover border border-void-border" />
            </td>
            <td class="p-4 font-display text-xl text-white uppercase tracking-wider">{{ item.title }}</td>
            <td class="p-4 font-mono text-xs text-ash">{{ item.youtube_id }}</td>
            <td class="p-4 font-mono text-xs">
              <span v-if="item.is_featured" class="text-blood font-bold">★ FEATURED</span>
              <span v-else class="text-ash/40">—</span>
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
        <div class="bg-void-charcoal border border-void-border p-6 max-w-lg w-full space-y-4 font-sans">
          <div class="flex items-center justify-between border-b border-void-border pb-3">
            <h3 class="font-display text-2xl text-white uppercase tracking-wider">{{ form.id ? 'EDIT VIDEO' : 'ADD VIDEO' }}</h3>
            <button @click="showModal = false" class="text-ash hover:text-white">✕</button>
          </div>

          <form @submit.prevent="save" class="space-y-4">
            <div>
              <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-1">TITLE</label>
              <input v-model="form.title" type="text" required class="w-full bg-void border border-void-border px-3 py-2 text-sm text-offwhite focus:border-blood focus:outline-none" />
            </div>

            <div>
              <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-1">YOUTUBE URL OR VIDEO ID</label>
              <input v-model="form.youtube_id" type="text" placeholder="https://www.youtube.com/watch?v=... or ID" required class="w-full bg-void border border-void-border px-3 py-2 font-mono text-xs text-offwhite focus:border-blood focus:outline-none" />
            </div>

            <div>
              <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-1">DESCRIPTION</label>
              <textarea v-model="form.description" rows="2" class="w-full bg-void border border-void-border px-3 py-2 text-sm text-offwhite focus:border-blood focus:outline-none"></textarea>
            </div>

            <div class="flex items-center gap-3">
              <input v-model="form.is_featured" type="checkbox" id="is_featured" class="bg-void border-void-border text-blood focus:ring-0 accent-blood" />
              <label for="is_featured" class="font-mono text-xs text-offwhite uppercase">FEATURE AS MAIN VIDEO EMBED IN SECTION 05</label>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-void-border">
              <button type="button" @click="showModal = false" class="btn-brutal text-xs py-2 px-4">CANCEL</button>
              <button type="submit" class="btn-brutal-primary text-xs py-2 px-5">SAVE VIDEO ↗</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <AdminConfirmModal :show="showConfirm" message="Are you sure you want to delete this video?" @confirm="executeDelete" @cancel="showConfirm = false" />
    <AdminToastNotification :show="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
  </div>
</template>
