<script setup lang="ts">
import type { ArtworkItem } from '~/types/content'

definePageMeta({ layout: 'admin' })

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
    items.value = await $fetch<ArtworkItem[]>('/api/artwork')
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
      await $fetch(`/api/admin/artwork/${form.value.id}`, {
        method: 'PUT',
        body: form.value,
      })
      toast.value = { show: true, message: 'Artwork item updated', type: 'success' }
    } else {
      await $fetch('/api/admin/artwork', {
        method: 'POST',
        body: form.value,
      })
      toast.value = { show: true, message: 'Artwork item created', type: 'success' }
    }
    showModal.value = false
    await fetchItems()
  } catch (err: any) {
    toast.value = { show: true, message: err.data?.statusMessage || 'Failed to save artwork', type: 'error' }
  }
}

const confirmDelete = (id: number) => {
  deletingId.value = id
  showConfirm.value = true
}

const executeDelete = async () => {
  if (!deletingId.value) return
  try {
    await $fetch(`/api/admin/artwork/${deletingId.value}`, { method: 'DELETE' })
    toast.value = { show: true, message: 'Artwork item deleted', type: 'success' }
    showConfirm.value = false
    deletingId.value = null
    await fetchItems()
  } catch (err: any) {
    toast.value = { show: true, message: err.data?.statusMessage || 'Failed to delete artwork', type: 'error' }
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span class="font-mono text-xs text-blood tracking-widest uppercase">// MODULE 05</span>
        <h1 class="font-display text-4xl text-white uppercase tracking-wider">ARTWORK ARCHIVE MASONRY</h1>
        <p class="font-mono text-xs text-ash tracking-widest uppercase mt-1">MANAGE POSTERS, ALBUM ART, FLYERS, AND MERCH PRINTS</p>
      </div>
      <button
        @click="openCreateModal"
        class="btn-brutal-primary text-xs py-3 px-6 shrink-0"
      >
        + ADD ARTWORK ↗
      </button>
    </div>

    <div v-if="loading" class="font-mono text-xs text-ash tracking-widest uppercase">LOADING ARTWORK...</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="item in items"
        :key="item.id"
        class="bg-void-charcoal border border-void-border overflow-hidden flex flex-col justify-between group"
      >
        <div class="relative aspect-square bg-void">
          <img :src="item.image_url" :alt="item.title" class="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500" />
          <div class="absolute top-2 right-2 bg-void/90 border border-void-border px-2 py-1 font-mono text-[10px] text-blood uppercase">
            {{ item.category }}
          </div>
        </div>

        <div class="p-4 flex items-center justify-between border-t border-void-border">
          <div>
            <h3 class="font-display text-lg text-white uppercase tracking-wider">{{ item.title }}</h3>
          </div>
          <div class="space-x-3 font-mono text-xs">
            <button @click="openEditModal(item)" class="text-offwhite hover:text-blood">EDIT</button>
            <button @click="confirmDelete(item.id)" class="text-ash hover:text-blood">DELETE</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit/Create Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
        <div class="bg-void-charcoal border border-void-border p-6 max-w-lg w-full space-y-4 font-sans">
          <div class="flex items-center justify-between border-b border-void-border pb-3">
            <h3 class="font-display text-2xl text-white uppercase tracking-wider">{{ form.id ? 'EDIT ARTWORK' : 'ADD ARTWORK' }}</h3>
            <button @click="showModal = false" class="text-ash hover:text-white">✕</button>
          </div>

          <form @submit.prevent="save" class="space-y-4">
            <AdminImageUpload v-model="form.image_url" label="ARTWORK IMAGE" />

            <div>
              <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-1">TITLE</label>
              <input v-model="form.title" type="text" required class="w-full bg-void border border-void-border px-3 py-2 text-sm text-offwhite focus:border-blood focus:outline-none" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-1">CATEGORY</label>
                <select v-model="form.category" class="w-full bg-void border border-void-border px-3 py-2 font-mono text-xs text-offwhite focus:border-blood focus:outline-none">
                  <option value="Album Art">Album Art</option>
                  <option value="Poster">Poster</option>
                  <option value="Flyer">Flyer</option>
                  <option value="Merch Art">Merch Art</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-1">ALT TEXT</label>
                <input v-model="form.alt_text" type="text" class="w-full bg-void border border-void-border px-3 py-2 text-sm text-offwhite focus:border-blood focus:outline-none" />
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-void-border">
              <button type="button" @click="showModal = false" class="btn-brutal text-xs py-2 px-4">CANCEL</button>
              <button type="submit" class="btn-brutal-primary text-xs py-2 px-5">SAVE ARTWORK ↗</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <AdminConfirmModal :show="showConfirm" message="Are you sure you want to delete this artwork?" @confirm="executeDelete" @cancel="showConfirm = false" />
    <AdminToastNotification :show="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
  </div>
</template>
