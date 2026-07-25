<script setup lang="ts">
import type { SeoSettings } from '~/types/content'

definePageMeta({ layout: 'admin' })

const form = ref<SeoSettings>({
  id: 1,
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  og_title: '',
  og_description: '',
  og_image_url: '',
  twitter_card_type: 'summary_large_image',
  canonical_url: '',
})

const loading = ref(true)
const saving = ref(false)
const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' })

onMounted(async () => {
  try {
    const data = await $fetch<SeoSettings>('/api/seo')
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
    const res = await $fetch<SeoSettings>('/api/admin/seo', {
      method: 'PUT',
      body: form.value,
    })
    form.value = res
    toast.value = { show: true, message: 'SEO settings saved successfully', type: 'success' }
  } catch (err: any) {
    toast.value = { show: true, message: err.data?.statusMessage || 'Failed to save SEO settings', type: 'error' }
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6 font-sans">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span class="text-xs font-semibold text-red-400 uppercase tracking-widest">// MODULE 09</span>
        <h1 class="font-display text-4xl text-white uppercase tracking-wider">DYNAMIC SEO & META TAGS</h1>
        <p class="text-xs text-gray-400 font-medium mt-1">MANAGE PAGE TITLE, DESCRIPTION, OPEN GRAPH SOCIAL CARDS, KEYWORDS, AND CANONICAL URLS</p>
      </div>
      <button
        @click="save"
        :disabled="saving || loading"
        class="btn-brutal-primary text-xs py-3 px-6 shrink-0"
      >
        {{ saving ? 'SAVING...' : 'SAVE SEO SETTINGS ↗' }}
      </button>
    </div>

    <div v-if="loading" class="text-xs text-gray-400 font-medium">LOADING SEO DATA...</div>

    <form v-else @submit.prevent="save" class="bg-void-charcoal border border-void-border p-6 md:p-8 space-y-6">
      <div class="space-y-4">
        <h3 class="font-display text-2xl text-white uppercase tracking-wider border-b border-void-border pb-2">SEARCH ENGINE METADATA (GOOGLE / BING)</h3>

        <div>
          <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">META TITLE (PERFECT LENGTH: 50-60 CHARS)</label>
          <input
            v-model="form.meta_title"
            type="text"
            required
            placeholder="WHITEEYES — Extreme Death Metal"
            class="w-full bg-void border border-void-border px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none"
          />
          <p class="text-[11px] text-gray-400 mt-1">Character count: {{ form.meta_title.length }}</p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">META DESCRIPTION (PERFECT LENGTH: 150-160 CHARS)</label>
          <textarea
            v-model="form.meta_description"
            rows="3"
            required
            placeholder="Official portal of subterranean Extreme Death Metal band WHITEEYES from Jakarta..."
            class="w-full bg-void border border-void-border px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none leading-relaxed"
          ></textarea>
          <p class="text-[11px] text-gray-400 mt-1">Character count: {{ form.meta_description.length }}</p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">META KEYWORDS (COMMA SEPARATED)</label>
          <input
            v-model="form.meta_keywords"
            type="text"
            placeholder="WHITEEYES, Death Metal, Extreme Metal, Jakarta Metal, Chronicles of Decay"
            class="w-full bg-void border border-void-border px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">CANONICAL URL</label>
          <input
            v-model="form.canonical_url"
            type="url"
            placeholder="https://whiteeyes-web.vercel.app"
            class="w-full bg-void border border-void-border px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none font-mono"
          />
        </div>
      </div>

      <div class="space-y-4 pt-6 border-t border-void-border">
        <h3 class="font-display text-2xl text-white uppercase tracking-wider border-b border-void-border pb-2">SOCIAL PREVIEW (OPEN GRAPH & TWITTER CARDS)</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">OG TITLE (SOCIAL SHARE TITLE)</label>
            <input
              v-model="form.og_title"
              type="text"
              class="w-full bg-void border border-void-border px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">TWITTER CARD TYPE</label>
            <select
              v-model="form.twitter_card_type"
              class="w-full bg-void border border-void-border px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none"
            >
              <option value="summary_large_image">summary_large_image (Recommended)</option>
              <option value="summary">summary</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">OG DESCRIPTION (SOCIAL SHARE DESCRIPTION)</label>
          <textarea
            v-model="form.og_description"
            rows="2"
            class="w-full bg-void border border-void-border px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none leading-relaxed"
          ></textarea>
        </div>

        <AdminImageUpload
          v-model="form.og_image_url"
          label="OG IMAGE (IMAGE DISPLAYED WHEN SHARED ON WHATSAPP, TWITTER, FACEBOOK)"
        />
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
