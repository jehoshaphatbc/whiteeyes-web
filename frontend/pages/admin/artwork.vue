<script setup lang="ts">
import type { ArtworkItem } from '~/types/content'

definePageMeta({ layout: 'admin' })

const config = useRuntimeConfig()
const items = ref<ArtworkItem[]>([])
const loading = ref(true)
const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' })

const showModal = ref(false)
const showConfirm = ref(false)
const deletingId = ref<number | null>(null)

const defaultForm = (): ArtworkItem => ({
  id: 0,
  image_url: '',
  title: '',
  alt_text: '',
  category: 'Album Art',
  sort_order: 0,
})

const form = ref<ArtworkItem>(defaultForm())

const fetchItems = async () => {
  loading.value = true
  try {
    items.value = await $fetch<ArtworkItem[]>(`${config.public.apiBase}/artwork`)
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

const openEditModal = (item: ArtworkItem) => {
  form.value = JSON.parse(JSON.stringify(item))
  showModal.value = true
}

const save = async () => {
  try {
    if (form.value.id) {
      await $fetch(`${config.public.apiBase}/admin/artwork/${form.value.id}`, {
        method: 'PUT',
        body: form.value,
      })
      toast.value = { show: true, message: 'Artwork item updated', type: 'success' }
    } else {
      await $fetch(`${config.public.apiBase}/admin/artwork`, {
        method: 'POST',
        body: form.value,
      })
      toast.value = { show: true, message: 'Artwork item created', type: 'success' }
    }
    showModal.value = false
    await fetchItems()
  } catch (err: any) {
    toast.value = { show: true, message: err.data?.error || 'Failed to save artwork', type: 'error' }
  }
}

const confirmDelete = (id: number) => {
  deletingId.value = id
  showConfirm.value = true
}

const executeDelete = async () => {
  if (!deletingId.value) return
  try {
    await $fetch(`${config.public.apiBase}/admin/artwork/${deletingId.value}`, { method: 'DELETE' })
    toast.value = { show: true, message: 'Artwork item deleted', type: 'success' }
    showConfirm.value = false
    deletingId.value = null
    await fetchItems()
  } catch (err: any) {
    toast.value = { show: true, message: err.data?.error || 'Failed to delete artwork', type: 'error' }
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-white">ARTWORK ARCHIVE</h1>
        <p class="text-xs text-slate-400">Manage posters, album art, flyers, and merch illustrations</p>
      </div>
      <button
        @click="openCreateModal"
        class="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors shadow"
      >
        + ADD ARTWORK
      </button>
    </div>

    <div v-if="loading" class="text-slate-400 text-sm">Loading artwork...</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="item in items"
        :key="item.id"
        class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow flex flex-col justify-between"
      >
        <div class="relative aspect-square bg-slate-950">
          <img :src="item.image_url" :alt="item.title" class="w-full h-full object-cover" />
          <div class="absolute top-2 right-2 bg-slate-900/90 backdrop-blur-sm px-2 py-0.5 rounded font-mono text-[10px] text-indigo-400">
            {{ item.category }}
          </div>
        </div>

        <div class="p-4 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-sm text-white">{{ item.title }}</h3>
          </div>
          <div class="space-x-2">
            <button @click="openEditModal(item)" class="text-xs text-indigo-400 hover:text-indigo-300">EDIT</button>
            <button @click="confirmDelete(item.id)" class="text-xs text-red-400 hover:text-red-300">DELETE</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit/Create Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 class="font-bold text-lg text-white">{{ form.id ? 'EDIT ARTWORK' : 'ADD ARTWORK' }}</h3>
            <button @click="showModal = false" class="text-slate-400 hover:text-white">✕</button>
          </div>

          <form @submit.prevent="save" class="space-y-4">
            <AdminImageUpload v-model="form.image_url" label="ARTWORK IMAGE" subfolder="artwork" />

            <div>
              <label class="block text-xs text-slate-300 mb-1">TITLE</label>
              <input v-model="form.title" type="text" required class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-slate-300 mb-1">CATEGORY</label>
                <select v-model="form.category" class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none">
                  <option value="Album Art">Album Art</option>
                  <option value="Poster">Poster</option>
                  <option value="Flyer">Flyer</option>
                  <option value="Merch Art">Merch Art</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label class="block text-xs text-slate-300 mb-1">ALT TEXT (ACCESSIBILITY)</label>
                <input v-model="form.alt_text" type="text" class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none" />
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" @click="showModal = false" class="px-4 py-2 text-xs bg-slate-800 text-slate-300 rounded">Cancel</button>
              <button type="submit" class="px-4 py-2 text-xs bg-indigo-600 text-white rounded font-medium">Save Artwork</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <AdminConfirmModal :show="showConfirm" message="Are you sure you want to delete this artwork?" @confirm="executeDelete" @cancel="showConfirm = false" />
    <AdminToastNotification :show="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
  </div>
</template>
