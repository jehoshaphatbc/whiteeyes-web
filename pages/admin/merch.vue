<script setup lang="ts">
import type { MerchItem } from '~/types/content'

definePageMeta({ layout: 'admin' })

const items = ref<MerchItem[]>([])
const loading = ref(true)
const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' })

const showModal = ref(false)
const showConfirm = ref(false)
const deletingId = ref<number | null>(null)

const defaultForm = (): MerchItem => ({
  id: 0,
  image_url: '',
  name: '',
  description: '',
  price: '$25',
  whatsapp_number: '',
  sort_order: 0,
})

const form = ref<MerchItem>(defaultForm())

const fetchItems = async () => {
  loading.value = true
  try {
    items.value = await $fetch<MerchItem[]>('/api/merch')
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

const openEditModal = (item: MerchItem) => {
  form.value = JSON.parse(JSON.stringify(item))
  showModal.value = true
}

const save = async () => {
  try {
    if (form.value.id) {
      await $fetch(`/api/admin/merch/${form.value.id}`, {
        method: 'PUT',
        body: form.value,
      })
      toast.value = { show: true, message: 'Merchandise item updated', type: 'success' }
    } else {
      await $fetch('/api/admin/merch', {
        method: 'POST',
        body: form.value,
      })
      toast.value = { show: true, message: 'Merchandise item created', type: 'success' }
    }
    showModal.value = false
    await fetchItems()
  } catch (err: any) {
    toast.value = { show: true, message: err.data?.statusMessage || 'Failed to save merchandise item', type: 'error' }
  }
}

const confirmDelete = (id: number) => {
  deletingId.value = id
  showConfirm.value = true
}

const executeDelete = async () => {
  if (!deletingId.value) return
  try {
    await $fetch(`/api/admin/merch/${deletingId.value}`, { method: 'DELETE' })
    toast.value = { show: true, message: 'Merchandise item deleted', type: 'success' }
    showConfirm.value = false
    deletingId.value = null
    await fetchItems()
  } catch (err: any) {
    toast.value = { show: true, message: err.data?.statusMessage || 'Failed to delete merchandise item', type: 'error' }
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-white">MERCHANDISE DROPS</h1>
        <p class="text-xs text-slate-400">Manage apparel, vinyls, tapes, and accessories (Order via WhatsApp)</p>
      </div>
      <button
        @click="openCreateModal"
        class="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors shadow"
      >
        + ADD MERCH ITEM
      </button>
    </div>

    <div v-if="loading" class="text-slate-400 text-sm">Loading merch...</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="item in items"
        :key="item.id"
        class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow flex flex-col justify-between"
      >
        <div>
          <div class="relative aspect-square bg-slate-950">
            <img :src="item.image_url" :alt="item.name" class="w-full h-full object-cover" />
            <div class="absolute bottom-2 right-2 bg-emerald-600 text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
              {{ item.price }}
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-sm text-white">{{ item.name }}</h3>
            <p class="text-xs text-slate-400 mt-1 line-clamp-2">{{ item.description }}</p>
          </div>
        </div>

        <div class="p-4 border-t border-slate-800 flex items-center justify-between">
          <span class="text-[10px] font-mono text-slate-500">WHATSAPP DIRECT</span>
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
            <h3 class="font-bold text-lg text-white">{{ form.id ? 'EDIT MERCH ITEM' : 'ADD MERCH ITEM' }}</h3>
            <button @click="showModal = false" class="text-slate-400 hover:text-white">✕</button>
          </div>

          <form @submit.prevent="save" class="space-y-4">
            <AdminImageUpload v-model="form.image_url" label="PRODUCT IMAGE" />

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-slate-300 mb-1">PRODUCT NAME</label>
                <input v-model="form.name" type="text" required class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs text-slate-300 mb-1">PRICE (TEXT E.G. $25)</label>
                <input v-model="form.price" type="text" class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none" />
              </div>
            </div>

            <div>
              <label class="block text-xs text-slate-300 mb-1">DESCRIPTION</label>
              <textarea v-model="form.description" rows="2" class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none"></textarea>
            </div>

            <div>
              <label class="block text-xs text-slate-300 mb-1">WHATSAPP NUMBER (OVERRIDE GLOBAL IF SET)</label>
              <input v-model="form.whatsapp_number" type="text" placeholder="e.g. 6281234567890" class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none font-mono" />
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" @click="showModal = false" class="px-4 py-2 text-xs bg-slate-800 text-slate-300 rounded">Cancel</button>
              <button type="submit" class="px-4 py-2 text-xs bg-indigo-600 text-white rounded font-medium">Save Item</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <AdminConfirmModal :show="showConfirm" message="Are you sure you want to delete this merchandise item?" @confirm="executeDelete" @cancel="showConfirm = false" />
    <AdminToastNotification :show="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
  </div>
</template>
