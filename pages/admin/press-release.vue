<script setup lang="ts">
import type { PressRelease, PressReleasePersonnel } from '~/types/content'

definePageMeta({
  layout: 'admin',
})

const pressReleases = ref<PressRelease[]>([])
const loading = ref(true)
const searchQuery = ref('')
const activeTab = ref<'hero' | 'intro' | 'feature' | 'music' | 'quote' | 'personnel' | 'seo'>('hero')

const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'info',
})

const triggerToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
  toast.value = { show: true, message: msg, type }
}

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedItem = ref<PressRelease | null>(null)

const activeDropdownId = ref<number | null>(null)
const activeItemForMenu = ref<PressRelease | null>(null)
const dropdownPos = ref({ top: 0, left: 0 })

const closeDropdown = () => {
  activeDropdownId.value = null
  activeItemForMenu.value = null
}

const toggleDropdown = (item: PressRelease, event: MouseEvent) => {
  if (activeDropdownId.value === item.id) {
    closeDropdown()
    return
  }
  const buttonEl = event.currentTarget as HTMLElement
  const rect = buttonEl.getBoundingClientRect()
  dropdownPos.value = {
    top: rect.bottom + 6,
    left: Math.max(16, rect.right - 192),
  }
  activeItemForMenu.value = item
  activeDropdownId.value = item.id
}

onMounted(() => {
  if (process.client) {
    window.addEventListener('click', closeDropdown)
    window.addEventListener('scroll', closeDropdown, true)
  }
  fetchData()
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('click', closeDropdown)
    window.removeEventListener('scroll', closeDropdown, true)
  }
})

// Form State template generator
const createFormState = () => ({
  id: 0,
  title: '',
  subtitle: '',
  slug: '',
  cover_image_url: '',
  hero_bg_url: '',
  release_date: 'MAY 2024',
  genre: 'Extreme Death Metal',
  producer: 'WHITEEYES',
  label: 'Iron Tomb Records',
  listen_url: '',
  video_url: '',
  press_kit_url: '',
  intro_headline: '',
  intro_body: '',
  highlight_title: '',
  highlight_body: '',
  feature_title: '',
  feature_body: '',
  feature_image_url: '',
  feature_points_text: '',
  legacy_title: 'THE LEGACY',
  legacy_points_text: '',
  current_title: 'ANICONISM NOW',
  current_points_text: '',
  quote_text: '',
  quote_author: '',
  personnel_body: '',
  personnel_text: '',
  video_embed_url: '',
  tracklist_info: '',
  press_email: 'whiteeyes@gmail.com',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  is_published: true,
})

const formData = ref(createFormState())
const formError = ref('')
const isSubmitting = ref(false)

const fetchData = async () => {
  loading.value = true
  try {
    const data = await $fetch<PressRelease[]>('/api/admin/press-releases')
    pressReleases.value = data || []
  } catch (err: any) {
    triggerToast(err.data?.statusMessage || 'Failed to fetch press releases', 'error')
  } finally {
    loading.value = false
  }
}

const filteredReleases = computed(() => {
  if (!searchQuery.value.trim()) return pressReleases.value
  const query = searchQuery.value.toLowerCase()
  return pressReleases.value.filter(
    (p) => p.title.toLowerCase().includes(query) || (p.subtitle && p.subtitle.toLowerCase().includes(query)) || p.slug.toLowerCase().includes(query)
  )
})

const openCreateModal = () => {
  formData.value = createFormState()
  activeTab.value = 'hero'
  formError.value = ''
  showCreateModal.value = true
}

const handleCreate = async () => {
  formError.value = ''
  if (!formData.value.title) {
    formError.value = 'Title is required'
    return
  }

  isSubmitting.value = true
  try {
    const payload = {
      ...formData.value,
      feature_points: formData.value.feature_points_text.split('\n').filter((s) => s.trim()),
      legacy_points: formData.value.legacy_points_text.split('\n').filter((s) => s.trim()),
      current_points: formData.value.current_points_text.split('\n').filter((s) => s.trim()),
      personnel_members: formData.value.personnel_text.split('\n').filter((s) => s.trim()).map((line) => {
        const [name, role] = line.split('-').map((s) => s.trim())
        return { name: name || line, role: role || 'Member' }
      }),
    }

    await $fetch('/api/admin/press-releases', {
      method: 'POST',
      body: payload,
    })
    triggerToast('New press release statement published')
    showCreateModal.value = false
    await fetchData()
  } catch (err: any) {
    formError.value = err.data?.statusMessage || 'Failed to create press release'
  } finally {
    isSubmitting.value = false
  }
}

const openEditModal = (item: PressRelease) => {
  selectedItem.value = item
  activeTab.value = 'hero'
  formData.value = {
    id: item.id,
    title: item.title,
    subtitle: item.subtitle || '',
    slug: item.slug,
    cover_image_url: item.cover_image_url || '',
    hero_bg_url: item.hero_bg_url || '',
    release_date: item.release_date || '',
    genre: item.genre || 'Extreme Death Metal',
    producer: item.producer || 'WHITEEYES',
    label: item.label || 'Iron Tomb Records',
    listen_url: item.listen_url || '',
    video_url: item.video_url || '',
    press_kit_url: item.press_kit_url || '',
    intro_headline: item.intro_headline || '',
    intro_body: item.intro_body || '',
    highlight_title: item.highlight_title || '',
    highlight_body: item.highlight_body || '',
    feature_title: item.feature_title || '',
    feature_body: item.feature_body || '',
    feature_image_url: item.feature_image_url || '',
    feature_points_text: Array.isArray(item.feature_points) ? item.feature_points.join('\n') : '',
    legacy_title: item.legacy_title || 'THE LEGACY',
    legacy_points_text: Array.isArray(item.legacy_points) ? item.legacy_points.join('\n') : '',
    current_title: item.current_title || 'ANICONISM NOW',
    current_points_text: Array.isArray(item.current_points) ? item.current_points.join('\n') : '',
    quote_text: item.quote_text || '',
    quote_author: item.quote_author || '',
    personnel_body: item.personnel_body || '',
    personnel_text: Array.isArray(item.personnel_members) ? item.personnel_members.map((m) => `${m.name} - ${m.role}`).join('\n') : '',
    video_embed_url: item.video_embed_url || '',
    tracklist_info: item.tracklist_info || '',
    press_email: item.press_email || 'whiteeyes@gmail.com',
    meta_title: item.meta_title || '',
    meta_description: item.meta_description || '',
    meta_keywords: item.meta_keywords || '',
    is_published: item.is_published,
  }
  formError.value = ''
  showEditModal.value = true
}

const handleEdit = async () => {
  if (!selectedItem.value) return
  formError.value = ''
  isSubmitting.value = true

  try {
    const payload = {
      ...formData.value,
      feature_points: formData.value.feature_points_text.split('\n').filter((s) => s.trim()),
      legacy_points: formData.value.legacy_points_text.split('\n').filter((s) => s.trim()),
      current_points: formData.value.current_points_text.split('\n').filter((s) => s.trim()),
      personnel_members: formData.value.personnel_text.split('\n').filter((s) => s.trim()).map((line) => {
        const [name, role] = line.split('-').map((s) => s.trim())
        return { name: name || line, role: role || 'Member' }
      }),
    }

    await $fetch(`/api/admin/press-releases/${formData.value.id}`, {
      method: 'PUT',
      body: payload,
    })
    triggerToast('Press release statement updated')
    showEditModal.value = false
    await fetchData()
  } catch (err: any) {
    formError.value = err.data?.statusMessage || 'Failed to update press release'
  } finally {
    isSubmitting.value = false
  }
}

const togglePublish = async (item: PressRelease) => {
  try {
    await $fetch(`/api/admin/press-releases/${item.id}`, {
      method: 'PUT',
      body: { is_published: !item.is_published },
    })
    item.is_published = !item.is_published
    triggerToast(`Press release updated to ${item.is_published ? 'Published' : 'Draft'}`)
  } catch (err: any) {
    triggerToast('Failed to update status', 'error')
  }
}

const openDeleteModal = (item: PressRelease) => {
  selectedItem.value = item
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!selectedItem.value) return
  isSubmitting.value = true
  try {
    await $fetch(`/api/admin/press-releases/${selectedItem.value.id}`, {
      method: 'DELETE',
    })
    triggerToast('Press release deleted successfully')
    showDeleteModal.value = false
    await fetchData()
  } catch (err: any) {
    triggerToast(err.data?.statusMessage || 'Failed to delete item', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <AdminToastNotification
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
      @close="toast.show = false"
    />

    <!-- Action Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-void-border pb-6">
      <div>
        <h1 class="font-display text-3xl tracking-wider text-white uppercase">PRESS RELEASES & MANIFESTOS</h1>
        <p class="font-sans text-xs text-gray-400 mt-1">Manage single, LP, and tour release statements.</p>
      </div>

      <button
        @click="openCreateModal"
        class="btn-brutal bg-blood text-white border-blood hover:bg-red-700 transition-all flex items-center justify-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>CREATE NEW PRESS RELEASE</span>
      </button>
    </div>

    <!-- Search Bar -->
    <div class="bg-void-charcoal border border-void-border p-4 rounded-xl flex items-center gap-3">
      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 0 0114 0z" />
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search press releases by title, subtitle, or slug..."
        class="bg-transparent border-none text-white placeholder-gray-500 font-sans text-sm focus:outline-none flex-1"
      />
    </div>

    <!-- Data Table -->
    <div class="bg-void-charcoal border border-void-border rounded-xl overflow-hidden shadow-2xl">
      <div v-if="loading" class="p-12 text-center text-gray-400 font-sans text-sm">
        <div class="inline-block animate-spin w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full mb-3"></div>
        <p>Loading press release statements...</p>
      </div>

      <div v-else-if="filteredReleases.length === 0" class="p-12 text-center text-gray-400 font-sans text-sm">
        No press releases found.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left font-sans border-collapse">
          <thead>
            <tr class="bg-void border-b border-void-border text-xs uppercase tracking-wider text-gray-400">
              <th class="py-3.5 px-6 font-semibold">Title & Tag</th>
              <th class="py-3.5 px-6 font-semibold">Release Date</th>
              <th class="py-3.5 px-6 font-semibold">Status</th>
              <th class="py-3.5 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-void-border/60 text-sm">
            <tr v-for="p in filteredReleases" :key="p.id" class="hover:bg-void/60 transition-colors">
              <td class="py-4 px-6">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-10 bg-void rounded border border-void-border overflow-hidden shrink-0">
                    <img v-if="p.cover_image_url" :src="p.cover_image_url" :alt="p.title" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-[10px] text-gray-600">NO IMG</div>
                  </div>
                  <div>
                    <h3 class="font-medium text-white line-clamp-1 max-w-md">{{ p.title }} <span class="text-xs text-red-400 font-mono">({{ p.subtitle || 'RELEASE' }})</span></h3>
                    <p class="text-xs text-gray-400 font-mono line-clamp-1">/press-release/{{ p.slug }}</p>
                  </div>
                </div>
              </td>

              <td class="py-4 px-6 text-xs font-mono text-gray-300">
                {{ p.release_date || 'MAY 2024' }}
              </td>

              <td class="py-4 px-6">
                <button
                  @click="togglePublish(p)"
                  class="text-[11px] font-mono px-2.5 py-1 rounded border font-bold uppercase transition-all"
                  :class="p.is_published
                    ? 'bg-green-500/20 text-green-400 border-green-500/40 hover:bg-green-500/30'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'"
                >
                  {{ p.is_published ? '✓ PUBLISHED' : '✎ DRAFT' }}
                </button>
              </td>

              <td class="py-4 px-6 text-right font-sans">
                <button
                  @click.stop="toggleDropdown(p, $event)"
                  class="w-8 h-8 rounded-lg bg-void border border-void-border hover:border-blood text-gray-300 hover:text-white flex items-center justify-center transition-all shadow-sm focus:outline-none ml-auto"
                  title="Actions"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- CREATE MODAL -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div class="bg-void-charcoal border border-void-border rounded-xl p-6 max-w-4xl w-full shadow-2xl space-y-5 my-8 relative">
        <div class="flex items-center justify-between border-b border-void-border pb-3">
          <h3 class="font-display text-xl text-white tracking-wider uppercase">CREATE PRESS RELEASE</h3>
          <button @click="showCreateModal = false" class="text-gray-400 hover:text-white">✕</button>
        </div>

        <div v-if="formError" class="bg-red-950/60 border border-red-800 text-red-300 p-3 rounded-lg text-xs font-sans">
          {{ formError }}
        </div>

        <!-- Form Tab Nav -->
        <div class="flex items-center gap-2 border-b border-void-border pb-3 overflow-x-auto text-xs font-mono">
          <button @click="activeTab = 'hero'" :class="activeTab === 'hero' ? 'bg-blood text-white' : 'text-gray-400 bg-void'" class="px-3 py-1.5 rounded">1. HERO & METADATA</button>
          <button @click="activeTab = 'intro'" :class="activeTab === 'intro' ? 'bg-blood text-white' : 'text-gray-400 bg-void'" class="px-3 py-1.5 rounded">2. INTRO STATEMENT</button>
          <button @click="activeTab = 'feature'" :class="activeTab === 'feature' ? 'bg-blood text-white' : 'text-gray-400 bg-void'" class="px-3 py-1.5 rounded">3. RITUAL FEATURE</button>
          <button @click="activeTab = 'music'" :class="activeTab === 'music' ? 'bg-blood text-white' : 'text-gray-400 bg-void'" class="px-3 py-1.5 rounded">4. MUSIC DIRECTION</button>
          <button @click="activeTab = 'quote'" :class="activeTab === 'quote' ? 'bg-blood text-white' : 'text-gray-400 bg-void'" class="px-3 py-1.5 rounded">5. QUOTE & MEMBERS</button>
        </div>

        <form @submit.prevent="handleCreate" class="space-y-4 font-sans text-sm max-h-[65vh] overflow-y-auto pr-2">
          <!-- TAB 1: HERO -->
          <div v-if="activeTab === 'hero'" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Release Title *</label>
                <input v-model="formData.title" type="text" required placeholder="ANICONISM" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Subtitle / Tag</label>
                <input v-model="formData.subtitle" type="text" placeholder="SINGLE 2024" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Release Date</label>
                <input v-model="formData.release_date" type="text" placeholder="MAY 2024" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Genre Label</label>
                <input v-model="formData.genre" type="text" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Record Label</label>
                <input v-model="formData.label" type="text" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Listen URL (Spotify)</label>
                <input v-model="formData.listen_url" type="text" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Watch Video URL</label>
                <input v-model="formData.video_url" type="text" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Press Kit Download URL</label>
                <input v-model="formData.press_kit_url" type="text" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Cover Image URL</label>
              <AdminImageUpload v-model="formData.cover_image_url" label="Release Artwork Photo" />
            </div>
          </div>

          <!-- TAB 2: INTRO STATEMENT -->
          <div v-if="activeTab === 'intro'" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Intro Statement Headline</label>
              <input v-model="formData.intro_headline" type="text" placeholder="THE ECHOES OF CIVILIZATION'S DECAY." class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Statement Body Paragraph</label>
              <textarea v-model="formData.intro_body" rows="4" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-void border border-void-border p-4 rounded-lg">
              <div>
                <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Highlight Card Title</label>
                <input v-model="formData.highlight_title" type="text" placeholder="ENVIRONMENTAL DESTINY" class="w-full bg-void-charcoal border border-void-border rounded px-3 py-1.5 text-xs text-white focus:border-red-600 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Highlight Card Text</label>
                <textarea v-model="formData.highlight_body" rows="2" class="w-full bg-void-charcoal border border-void-border rounded px-3 py-1.5 text-xs text-white focus:border-red-600 focus:outline-none"></textarea>
              </div>
            </div>
          </div>

          <!-- TAB 3: RITUAL FEATURE -->
          <div v-if="activeTab === 'feature'" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Feature Title</label>
              <input v-model="formData.feature_title" type="text" placeholder="THE ANICONIC RITUAL" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Feature Body Description</label>
              <textarea v-model="formData.feature_body" rows="3" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none"></textarea>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Feature Art Photo</label>
              <AdminImageUpload v-model="formData.feature_image_url" label="Feature Photo" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Feature Points (1 per line)</label>
              <textarea v-model="formData.feature_points_text" rows="3" placeholder="01 - Destruction&#10;02 - Rebirth" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 font-mono text-xs text-white focus:border-red-600 focus:outline-none"></textarea>
            </div>
          </div>

          <!-- TAB 4: MUSIC DIRECTION -->
          <div v-if="activeTab === 'music'" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-void border border-void-border p-4 rounded-lg space-y-3">
                <h4 class="font-mono text-xs text-gray-400 uppercase">PREVIOUS SOUND (LEGACY)</h4>
                <input v-model="formData.legacy_title" type="text" placeholder="THE LEGACY" class="w-full bg-void-charcoal border border-void-border rounded px-3 py-1.5 text-xs text-white" />
                <textarea v-model="formData.legacy_points_text" rows="4" placeholder="Points 1 per line..." class="w-full bg-void-charcoal border border-void-border rounded px-3 py-1.5 font-mono text-xs text-white"></textarea>
              </div>

              <div class="bg-void border border-void-border p-4 rounded-lg space-y-3">
                <h4 class="font-mono text-xs text-red-400 uppercase">CURRENT SOUND (NOW)</h4>
                <input v-model="formData.current_title" type="text" placeholder="ANICONISM NOW" class="w-full bg-void-charcoal border border-void-border rounded px-3 py-1.5 text-xs text-white" />
                <textarea v-model="formData.current_points_text" rows="4" placeholder="Points 1 per line..." class="w-full bg-void-charcoal border border-void-border rounded px-3 py-1.5 font-mono text-xs text-white"></textarea>
              </div>
            </div>
          </div>

          <!-- TAB 5: QUOTE & MEMBERS -->
          <div v-if="activeTab === 'quote'" class="space-y-4">
            <div class="bg-void border border-void-border p-4 rounded-lg space-y-3">
              <h4 class="font-mono text-xs text-blood uppercase">FEATURED QUOTE CALLOUT</h4>
              <textarea v-model="formData.quote_text" rows="3" placeholder="UNDERSTANDING THAT EARTH IS NOT OWNED BY HUMANS ALONE..." class="w-full bg-void-charcoal border border-void-border rounded px-3 py-1.5 text-xs text-white"></textarea>
              <input v-model="formData.quote_author" type="text" placeholder="ARYS PRIHADI, Vocalist" class="w-full bg-void-charcoal border border-void-border rounded px-3 py-1.5 text-xs text-white" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Band Personnel (Name - Role per line)</label>
              <textarea v-model="formData.personnel_text" rows="4" placeholder="ARYS PRIHADI - Vocalist&#10;EKO RUSTON - Guitarist" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 font-mono text-xs text-white"></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-void-border">
            <button type="button" @click="showCreateModal = false" class="px-4 py-2 text-xs font-semibold text-gray-300 bg-void hover:bg-void-border rounded-lg">CANCEL</button>
            <button type="submit" :disabled="isSubmitting" class="btn-brutal text-xs py-2 px-5 bg-blood text-white border-blood hover:bg-red-700">
              {{ isSubmitting ? 'SAVING...' : 'PUBLISH STATEMENT' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div class="bg-void-charcoal border border-void-border rounded-xl p-6 max-w-4xl w-full shadow-2xl space-y-5 my-8 relative">
        <div class="flex items-center justify-between border-b border-void-border pb-3">
          <h3 class="font-display text-xl text-white tracking-wider uppercase">EDIT PRESS RELEASE #{{ formData.id }}</h3>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-white">✕</button>
        </div>

        <div v-if="formError" class="bg-red-950/60 border border-red-800 text-red-300 p-3 rounded-lg text-xs font-sans">
          {{ formError }}
        </div>

        <div class="flex items-center gap-2 border-b border-void-border pb-3 overflow-x-auto text-xs font-mono">
          <button @click="activeTab = 'hero'" :class="activeTab === 'hero' ? 'bg-blood text-white' : 'text-gray-400 bg-void'" class="px-3 py-1.5 rounded">1. HERO & METADATA</button>
          <button @click="activeTab = 'intro'" :class="activeTab === 'intro' ? 'bg-blood text-white' : 'text-gray-400 bg-void'" class="px-3 py-1.5 rounded">2. INTRO STATEMENT</button>
          <button @click="activeTab = 'feature'" :class="activeTab === 'feature' ? 'bg-blood text-white' : 'text-gray-400 bg-void'" class="px-3 py-1.5 rounded">3. RITUAL FEATURE</button>
          <button @click="activeTab = 'music'" :class="activeTab === 'music' ? 'bg-blood text-white' : 'text-gray-400 bg-void'" class="px-3 py-1.5 rounded">4. MUSIC DIRECTION</button>
          <button @click="activeTab = 'quote'" :class="activeTab === 'quote' ? 'bg-blood text-white' : 'text-gray-400 bg-void'" class="px-3 py-1.5 rounded">5. QUOTE & MEMBERS</button>
        </div>

        <form @submit.prevent="handleEdit" class="space-y-4 font-sans text-sm max-h-[65vh] overflow-y-auto pr-2">
          <!-- TAB 1: HERO -->
          <div v-if="activeTab === 'hero'" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Release Title *</label>
                <input v-model="formData.title" type="text" required class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Subtitle / Tag</label>
                <input v-model="formData.subtitle" type="text" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Release Date</label>
                <input v-model="formData.release_date" type="text" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Genre Label</label>
                <input v-model="formData.genre" type="text" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Record Label</label>
                <input v-model="formData.label" type="text" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Listen URL</label>
                <input v-model="formData.listen_url" type="text" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Watch Video URL</label>
                <input v-model="formData.video_url" type="text" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Press Kit URL</label>
                <input v-model="formData.press_kit_url" type="text" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Cover Image URL</label>
              <AdminImageUpload v-model="formData.cover_image_url" label="Release Artwork Photo" />
            </div>
          </div>

          <!-- TAB 2: INTRO STATEMENT -->
          <div v-if="activeTab === 'intro'" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Intro Statement Headline</label>
              <input v-model="formData.intro_headline" type="text" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Statement Body Paragraph</label>
              <textarea v-model="formData.intro_body" rows="4" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-void border border-void-border p-4 rounded-lg">
              <div>
                <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Highlight Title</label>
                <input v-model="formData.highlight_title" type="text" class="w-full bg-void-charcoal border border-void-border rounded px-3 py-1.5 text-xs text-white" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Highlight Text</label>
                <textarea v-model="formData.highlight_body" rows="2" class="w-full bg-void-charcoal border border-void-border rounded px-3 py-1.5 text-xs text-white"></textarea>
              </div>
            </div>
          </div>

          <!-- TAB 3: RITUAL FEATURE -->
          <div v-if="activeTab === 'feature'" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Feature Title</label>
              <input v-model="formData.feature_title" type="text" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Feature Description</label>
              <textarea v-model="formData.feature_body" rows="3" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none"></textarea>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Feature Image</label>
              <AdminImageUpload v-model="formData.feature_image_url" label="Feature Photo" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Feature Points (1 per line)</label>
              <textarea v-model="formData.feature_points_text" rows="3" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 font-mono text-xs text-white"></textarea>
            </div>
          </div>

          <!-- TAB 4: MUSIC DIRECTION -->
          <div v-if="activeTab === 'music'" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-void border border-void-border p-4 rounded-lg space-y-3">
                <h4 class="font-mono text-xs text-gray-400 uppercase">PREVIOUS SOUND (LEGACY)</h4>
                <input v-model="formData.legacy_title" type="text" class="w-full bg-void-charcoal border border-void-border rounded px-3 py-1.5 text-xs text-white" />
                <textarea v-model="formData.legacy_points_text" rows="4" class="w-full bg-void-charcoal border border-void-border rounded px-3 py-1.5 font-mono text-xs text-white"></textarea>
              </div>

              <div class="bg-void border border-void-border p-4 rounded-lg space-y-3">
                <h4 class="font-mono text-xs text-red-400 uppercase">CURRENT SOUND (NOW)</h4>
                <input v-model="formData.current_title" type="text" class="w-full bg-void-charcoal border border-void-border rounded px-3 py-1.5 text-xs text-white" />
                <textarea v-model="formData.current_points_text" rows="4" class="w-full bg-void-charcoal border border-void-border rounded px-3 py-1.5 font-mono text-xs text-white"></textarea>
              </div>
            </div>
          </div>

          <!-- TAB 5: QUOTE & MEMBERS -->
          <div v-if="activeTab === 'quote'" class="space-y-4">
            <div class="bg-void border border-void-border p-4 rounded-lg space-y-3">
              <h4 class="font-mono text-xs text-blood uppercase">FEATURED QUOTE CALLOUT</h4>
              <textarea v-model="formData.quote_text" rows="3" class="w-full bg-void-charcoal border border-void-border rounded px-3 py-1.5 text-xs text-white"></textarea>
              <input v-model="formData.quote_author" type="text" class="w-full bg-void-charcoal border border-void-border rounded px-3 py-1.5 text-xs text-white" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Band Personnel (Name - Role per line)</label>
              <textarea v-model="formData.personnel_text" rows="4" class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 font-mono text-xs text-white"></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-void-border">
            <button type="button" @click="showEditModal = false" class="px-4 py-2 text-xs font-semibold text-gray-300 bg-void hover:bg-void-border rounded-lg">CANCEL</button>
            <button type="submit" :disabled="isSubmitting" class="btn-brutal text-xs py-2 px-5 bg-blood text-white border-blood hover:bg-red-700">
              {{ isSubmitting ? 'SAVING...' : 'SAVE CHANGES' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- DELETE CONFIRMATION -->
    <AdminConfirmModal
      :show="showDeleteModal"
      title="DELETE PRESS RELEASE"
      :message="`Are you sure you want to delete press release '${selectedItem?.title}'?`"
      confirmText="DELETE STATEMENT"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />

    <!-- Teleported Floating Action Menu -->
    <Teleport to="body">
      <div
        v-if="activeDropdownId !== null && activeItemForMenu"
        class="fixed w-48 bg-void-charcoal border border-void-border rounded-xl shadow-2xl z-[9999] py-1 divide-y divide-void-border/50 text-xs font-mono tracking-wider uppercase text-left"
        :style="{ top: `${dropdownPos.top}px`, left: `${dropdownPos.left}px` }"
        @click.stop
      >
        <div class="py-1">
          <NuxtLink
            v-if="activeItemForMenu.is_published"
            :to="`/press-release/${activeItemForMenu.slug}`"
            target="_blank"
            @click="closeDropdown"
            class="flex items-center gap-2.5 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-void transition-colors"
          >
            <svg class="w-3.5 h-3.5 text-blood" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>VIEW STATEMENT ↗</span>
          </NuxtLink>

          <button
            @click="openEditModal(activeItemForMenu); closeDropdown()"
            class="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-void transition-colors"
          >
            <svg class="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>EDIT RELEASE ✎</span>
          </button>

          <button
            @click="togglePublish(activeItemForMenu); closeDropdown()"
            class="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-void transition-colors"
          >
            <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span>{{ activeItemForMenu.is_published ? 'UNPUBLISH (DRAFT)' : 'PUBLISH STATEMENT' }}</span>
          </button>
        </div>

        <div class="py-1">
          <button
            @click="openDeleteModal(activeItemForMenu); closeDropdown()"
            class="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
          >
            <svg class="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>DELETE STATEMENT 🗑</span>
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
