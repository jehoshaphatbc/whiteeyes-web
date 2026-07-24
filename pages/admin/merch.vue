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
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span class="font-mono text-xs text-blood tracking-widest uppercase">// MODULE 07</span>
        <h1 class="font-display text-4xl text-white uppercase tracking-wider">MERCHANDISE DROPS</h1>
        <p class="font-mono text-xs text-ash tracking-widest uppercase mt-1">MANAGE APPAREL, VINYLS, TAPES, AND ACCESSORIES (WHATSAPP ORDERING)</p>
      </div>
      <button
        @click="openCreateModal"
        class="btn-brutal-primary text-xs py-3 px-6 shrink-0"
      >
        + ADD MERCH ITEM ↗
      </button>
    </div>

    <div v-if="loading" class="font-mono text-xs text-ash tracking-widest uppercase">LOADING MERCH...</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="item in items"
        :key="item.id"
        class="bg-void-charcoal border border-void-border overflow-hidden flex flex-col justify-between group"
      >
        <div>
          <div class="relative aspect-square bg-void border-b border-void-border">
            <img :src="item.image_url" :alt="item.name" class="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500" />
            <div v-if="item.price" class="absolute bottom-2 right-2 bg-blood text-white font-mono font-bold text-xs px-2.5 py-1">
              {{ item.price }}
            </div>
          </div>
          <div class="p-5 space-y-2">
            <h3 class="font-display text-xl text-white uppercase tracking-wider group-hover:text-blood transition-colors">{{ item.name }}</h3>
            <p class="font-sans text-xs text-ash line-clamp-2 leading-relaxed">{{ item.description }}</p>
          </div>
        </div>

        <div class="p-4 border-t border-void-border flex items-center justify-between font-mono text-xs">
          <span class="text-[10px] text-blood uppercase">WHATSAPP DIRECT</span>
          <div class="space-x-3">
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
            <h3 class="font-display text-2xl text-white uppercase tracking-wider">{{ form.id ? 'EDIT MERCH ITEM' : 'ADD MERCH ITEM' }}</h3>
            <button @click="showModal = false" class="text-ash hover:text-white">✕</button>
          </div>

          <form @submit.prevent="save" class="space-y-4">
            <AdminImageUpload v-model="form.image_url" label="PRODUCT IMAGE" />

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-1">PRODUCT NAME</label>
                <input v-model="form.name" type="text" required class="w-full bg-void border border-void-border px-3 py-2 text-sm text-offwhite focus:border-blood focus:outline-none" />
              </div>
              <div>
                <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-1">PRICE (TEXT E.G. $25)</label>
                <input v-model="form.price" type="text" class="w-full bg-void border border-void-border px-3 py-2 font-mono text-xs text-offwhite focus:border-blood focus:outline-none" />
              </div>
            </div>

            <div>
              <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-1">DESCRIPTION</label>
              <textarea v-model="form.description" rows="2" class="w-full bg-void border border-void-border px-3 py-2 text-sm text-offwhite focus:border-blood focus:outline-none"></textarea>
            </div>

            <div>
              <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-1">WHATSAPP NUMBER (OVERRIDE GLOBAL IF SET)</label>
              <input v-model="form.whatsapp_number" type="text" placeholder="e.g. 6281234567890" class="w-full bg-void border border-void-border px-3 py-2 font-mono text-xs text-offwhite focus:border-blood focus:outline-none" />
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-void-border">
              <button type="button" @click="showModal = false" class="btn-brutal text-xs py-2 px-4">CANCEL</button>
              <button type="submit" class="btn-brutal-primary text-xs py-2 px-5">SAVE ITEM ↗</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <AdminConfirmModal :show="showConfirm" message="Are you sure you want to delete this merchandise item?" @confirm="executeDelete" @cancel="showConfirm = false" />
    <AdminToastNotification :show="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
  </div>
</template>
