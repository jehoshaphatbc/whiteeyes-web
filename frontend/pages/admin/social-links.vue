<script setup lang="ts">
import type { SocialLinks } from '~/types/content'

definePageMeta({ layout: 'admin' })

const config = useRuntimeConfig()
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
    const data = await $fetch<SocialLinks>(`${config.public.apiBase}/social-links`)
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
    const res = await $fetch<SocialLinks>(`${config.public.apiBase}/admin/social-links`, {
      method: 'PUT',
      body: form.value,
    })
    form.value = res
    toast.value = { show: true, message: 'Social links saved successfully', type: 'success' }
  } catch (err: any) {
    toast.value = { show: true, message: err.data?.error || 'Failed to save social links', type: 'error' }
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-white">SOCIAL & CONNECT LINKS</h1>
        <p class="text-xs text-slate-400">Edit external platform URLs and closing headline</p>
      </div>
      <button
        @click="save"
        :disabled="saving || loading"
        class="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors shadow"
      >
        {{ saving ? 'SAVING...' : 'SAVE CHANGES' }}
      </button>
    </div>

    <div v-if="loading" class="text-slate-400 text-sm">Loading social links...</div>

    <form v-else @submit.prevent="save" class="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1">CLOSING SECTION HEADLINE</label>
        <input
          v-model="form.closing_headline"
          type="text"
          placeholder="e.g. JOIN THE ABYSS"
          class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">SPOTIFY ARTIST URL</label>
          <input
            v-model="form.spotify_url"
            type="url"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">YOUTUBE CHANNEL URL</label>
          <input
            v-model="form.youtube_url"
            type="url"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">INSTAGRAM PROFILE URL</label>
          <input
            v-model="form.instagram_url"
            type="url"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">FACEBOOK PAGE URL</label>
          <input
            v-model="form.facebook_url"
            type="url"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1">BAND WHATSAPP NUMBER (COUNTRY CODE NO '+', E.G. 6281234567890)</label>
        <input
          v-model="form.whatsapp_number"
          type="text"
          placeholder="6281234567890"
          class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
        />
        <p class="text-xs text-slate-500 mt-1">Used for merch orders and direct connection CTA.</p>
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
