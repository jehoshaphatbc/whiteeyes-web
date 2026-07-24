<script setup lang="ts">
import type { SocialLinks } from '~/types/content'

definePageMeta({ layout: 'admin' })

const form = ref<SocialLinks>({
  id: 1,
  instagram_url: '',
  spotify_url: '',
  youtube_url: '',
  facebook_url: '',
  whatsapp_number: '',
  closing_headline: '',
})

const loading = ref(true)
const saving = ref(false)
const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' })

onMounted(async () => {
  try {
    const data = await $fetch<SocialLinks>('/api/social-links')
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
    const res = await $fetch<SocialLinks>('/api/admin/social-links', {
      method: 'PUT',
      body: form.value,
    })
    form.value = res
    toast.value = { show: true, message: 'Social links saved successfully', type: 'success' }
  } catch (err: any) {
    toast.value = { show: true, message: err.data?.statusMessage || 'Failed to save social links', type: 'error' }
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span class="font-mono text-xs text-blood tracking-widest uppercase">// MODULE 08</span>
        <h1 class="font-display text-4xl text-white uppercase tracking-wider">SOCIAL PROFILES & CONNECT</h1>
        <p class="font-mono text-xs text-ash tracking-widest uppercase mt-1">EDIT SOCIAL URLS, WHATSAPP ORDERING NUMBER, AND CLOSING HEADLINE</p>
      </div>
      <button
        @click="save"
        :disabled="saving || loading"
        class="btn-brutal-primary text-xs py-3 px-6 shrink-0"
      >
        {{ saving ? 'SAVING...' : 'SAVE CHANGES ↗' }}
      </button>
    </div>

    <div v-if="loading" class="font-mono text-xs text-ash tracking-widest uppercase">LOADING SOCIAL LINKS...</div>

    <form v-else @submit.prevent="save" class="bg-void-charcoal border border-void-border p-6 md:p-8 space-y-6">
      <div>
        <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-2">CLOSING HEADLINE (SECTION 07)</label>
        <input
          v-model="form.closing_headline"
          type="text"
          placeholder="e.g. JOIN THE ABYSS"
          class="w-full bg-void border border-void-border px-4 py-3 font-display text-2xl tracking-wider text-offwhite uppercase focus:border-blood focus:outline-none"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-2">SPOTIFY ARTIST URL</label>
          <input
            v-model="form.spotify_url"
            type="url"
            class="w-full bg-void border border-void-border px-4 py-3 font-mono text-xs text-offwhite focus:border-blood focus:outline-none"
          />
        </div>

        <div>
          <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-2">YOUTUBE CHANNEL URL</label>
          <input
            v-model="form.youtube_url"
            type="url"
            class="w-full bg-void border border-void-border px-4 py-3 font-mono text-xs text-offwhite focus:border-blood focus:outline-none"
          />
        </div>

        <div>
          <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-2">INSTAGRAM PROFILE URL</label>
          <input
            v-model="form.instagram_url"
            type="url"
            class="w-full bg-void border border-void-border px-4 py-3 font-mono text-xs text-offwhite focus:border-blood focus:outline-none"
          />
        </div>

        <div>
          <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-2">FACEBOOK PAGE URL</label>
          <input
            v-model="form.facebook_url"
            type="url"
            class="w-full bg-void border border-void-border px-4 py-3 font-mono text-xs text-offwhite focus:border-blood focus:outline-none"
          />
        </div>
      </div>

      <div class="pt-6 border-t border-void-border">
        <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-2">DEFAULT WHATSAPP NUMBER FOR ORDERS (COUNTRY CODE WITHOUT '+')</label>
        <input
          v-model="form.whatsapp_number"
          type="text"
          placeholder="e.g. 6281234567890"
          class="w-full max-w-md bg-void border border-void-border px-4 py-3 font-mono text-sm text-offwhite focus:border-blood focus:outline-none"
        />
        <p class="font-mono text-[10px] text-ash/60 mt-1 uppercase">USED WHEN FANS CLICK "ORDER VIA WHATSAPP" ON MERCH ITEMS WITHOUT SPECIFIC NUMBER.</p>
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
