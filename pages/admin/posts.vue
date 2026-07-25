<script setup lang="ts">
import type { BlogPost } from '~/types/content'

interface BlogCategory {
  id: number
  name: string
  slug: string
}

definePageMeta({
  layout: 'admin',
})

const posts = ref<BlogPost[]>([])
const categories = ref<BlogCategory[]>([])
const loading = ref(true)
const searchQuery = ref('')

const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'info',
})

const triggerToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
  toast.value = {
    show: true,
    message: msg,
    type,
  }
}

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showCategoryModal = ref(false)
const selectedPost = ref<BlogPost | null>(null)

// Category Manager state
const newCategoryName = ref('')
const editingCategoryId = ref<number | null>(null)
const editingCategoryName = ref('')

// Form State
const createForm = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image_url: '',
  author: 'WHITEEYES',
  category: 'Announcement',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  is_published: true,
})

const editForm = ref({
  id: 0,
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image_url: '',
  author: 'WHITEEYES',
  category: 'Announcement',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  is_published: true,
})

const formError = ref('')
const isSubmitting = ref(false)

const fetchData = async () => {
  loading.value = true
  try {
    const [postsData, catsData] = await Promise.all([
      $fetch<BlogPost[]>('/api/admin/posts'),
      $fetch<BlogCategory[]>('/api/categories'),
    ])
    posts.value = postsData || []
    categories.value = catsData || []
    if (categories.value.length > 0) {
      if (!createForm.value.category) createForm.value.category = categories.value[0].name
    }
  } catch (err: any) {
    triggerToast(err.data?.statusMessage || 'Failed to fetch data', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const filteredPosts = computed(() => {
  if (!searchQuery.value.trim()) return posts.value
  const query = searchQuery.value.toLowerCase()
  return posts.value.filter(
    (p) => p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query) || p.slug.toLowerCase().includes(query)
  )
})

// Category CRUD
const handleAddCategory = async () => {
  if (!newCategoryName.value.trim()) return
  try {
    await $fetch('/api/admin/categories', {
      method: 'POST',
      body: { name: newCategoryName.value.trim() },
    })
    triggerToast('Category added successfully')
    newCategoryName.value = ''
    await fetchData()
  } catch (err: any) {
    triggerToast(err.data?.statusMessage || 'Failed to add category', 'error')
  }
}

const handleEditCategory = async (catId: number) => {
  if (!editingCategoryName.value.trim()) return
  try {
    await $fetch(`/api/admin/categories/${catId}`, {
      method: 'PUT',
      body: { name: editingCategoryName.value.trim() },
    })
    triggerToast('Category updated successfully')
    editingCategoryId.value = null
    editingCategoryName.value = ''
    await fetchData()
  } catch (err: any) {
    triggerToast(err.data?.statusMessage || 'Failed to update category', 'error')
  }
}

const handleDeleteCategory = async (catId: number) => {
  try {
    await $fetch(`/api/admin/categories/${catId}`, {
      method: 'DELETE',
    })
    triggerToast('Category deleted successfully')
    await fetchData()
  } catch (err: any) {
    triggerToast(err.data?.statusMessage || 'Failed to delete category', 'error')
  }
}

// Create Post
const openCreateModal = () => {
  createForm.value = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image_url: '',
    author: 'WHITEEYES',
    category: categories.value[0]?.name || 'Announcement',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    is_published: true,
  }
  formError.value = ''
  showCreateModal.value = true
}

const handleCreatePost = async () => {
  formError.value = ''
  if (!createForm.value.title || !createForm.value.content) {
    formError.value = 'Title and Content are required'
    return
  }

  isSubmitting.value = true
  try {
    await $fetch('/api/admin/posts', {
      method: 'POST',
      body: createForm.value,
    })
    triggerToast('New blog post created successfully')
    showCreateModal.value = false
    await fetchData()
  } catch (err: any) {
    formError.value = err.data?.statusMessage || 'Failed to create post'
  } finally {
    isSubmitting.value = false
  }
}

// Edit Post
const openEditModal = (postItem: BlogPost) => {
  selectedPost.value = postItem
  editForm.value = {
    id: postItem.id,
    title: postItem.title,
    slug: postItem.slug,
    excerpt: postItem.excerpt || '',
    content: postItem.content || '',
    cover_image_url: postItem.cover_image_url || '',
    author: postItem.author || 'WHITEEYES',
    category: postItem.category || (categories.value[0]?.name || 'News'),
    meta_title: postItem.meta_title || '',
    meta_description: postItem.meta_description || '',
    meta_keywords: postItem.meta_keywords || '',
    is_published: postItem.is_published,
  }
  formError.value = ''
  showEditModal.value = true
}

const handleEditPost = async () => {
  if (!selectedPost.value) return
  formError.value = ''
  isSubmitting.value = true

  try {
    await $fetch(`/api/admin/posts/${editForm.value.id}`, {
      method: 'PUT',
      body: editForm.value,
    })
    triggerToast('Blog post updated successfully')
    showEditModal.value = false
    await fetchData()
  } catch (err: any) {
    formError.value = err.data?.statusMessage || 'Failed to update post'
  } finally {
    isSubmitting.value = false
  }
}

// Quick toggle publish status
const togglePublish = async (postItem: BlogPost) => {
  try {
    await $fetch(`/api/admin/posts/${postItem.id}`, {
      method: 'PUT',
      body: { is_published: !postItem.is_published },
    })
    postItem.is_published = !postItem.is_published
    triggerToast(`Post status updated to ${postItem.is_published ? 'Published' : 'Draft'}`)
  } catch (err: any) {
    triggerToast('Failed to toggle publish status', 'error')
  }
}

// Delete Post
const openDeleteModal = (postItem: BlogPost) => {
  selectedPost.value = postItem
  showDeleteModal.value = true
}

const handleDeletePost = async () => {
  if (!selectedPost.value) return
  isSubmitting.value = true

  try {
    await $fetch(`/api/admin/posts/${selectedPost.value.id}`, {
      method: 'DELETE',
    })
    triggerToast('Blog post deleted successfully')
    showDeleteModal.value = false
    await fetchData()
  } catch (err: any) {
    triggerToast(err.data?.statusMessage || 'Failed to delete post', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (_) {
    return dateStr
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Toast Notification -->
    <AdminToastNotification
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
      @close="toast.show = false"
    />

    <!-- Header & Action Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-void-border pb-6">
      <div>
        <h1 class="font-display text-3xl tracking-wider text-white uppercase">BLOG POSTS & DISPATCHES</h1>
        <p class="font-sans text-xs text-gray-400 mt-1">Manage articles, WYSIWYG content, categories, and SEO metadata.</p>
      </div>

      <div class="flex items-center gap-3 self-start md:self-auto">
        <button
          @click="showCategoryModal = true"
          class="btn-brutal text-xs py-3 px-4 flex items-center gap-2"
        >
          <svg class="w-4 h-4 text-blood" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span>MANAGE CATEGORIES</span>
        </button>

        <button
          @click="openCreateModal"
          class="btn-brutal bg-blood text-white border-blood hover:bg-red-700 transition-all flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>CREATE NEW POST</span>
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="bg-void-charcoal border border-void-border p-4 rounded-xl flex items-center gap-3">
      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 0 0114 0z" />
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search blog posts by title, slug, or category..."
        class="bg-transparent border-none text-white placeholder-gray-500 font-sans text-sm focus:outline-none flex-1"
      />
    </div>

    <!-- Posts Table -->
    <div class="bg-void-charcoal border border-void-border rounded-xl overflow-hidden shadow-2xl">
      <div v-if="loading" class="p-12 text-center text-gray-400 font-sans text-sm">
        <div class="inline-block animate-spin w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full mb-3"></div>
        <p>Loading blog articles...</p>
      </div>

      <div v-else-if="filteredPosts.length === 0" class="p-12 text-center text-gray-400 font-sans text-sm">
        No blog posts found.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left font-sans border-collapse">
          <thead>
            <tr class="bg-void border-b border-void-border text-xs uppercase tracking-wider text-gray-400">
              <th class="py-3.5 px-6 font-semibold">Post Title & Slug</th>
              <th class="py-3.5 px-6 font-semibold">Category</th>
              <th class="py-3.5 px-6 font-semibold">Status</th>
              <th class="py-3.5 px-6 font-semibold">Date</th>
              <th class="py-3.5 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-void-border/60 text-sm">
            <tr
              v-for="p in filteredPosts"
              :key="p.id"
              class="hover:bg-void/60 transition-colors"
            >
              <!-- Cover & Title -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-10 bg-void rounded border border-void-border overflow-hidden shrink-0">
                    <img v-if="p.cover_image_url" :src="p.cover_image_url" :alt="p.title" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-[10px] text-gray-600">NO IMG</div>
                  </div>
                  <div>
                    <h3 class="font-medium text-white line-clamp-1 max-w-md">{{ p.title }}</h3>
                    <p class="text-xs text-gray-400 font-mono line-clamp-1">/blog/{{ p.slug }}</p>
                  </div>
                </div>
              </td>

              <!-- Category -->
              <td class="py-4 px-6">
                <span class="text-xs font-mono px-2.5 py-1 rounded bg-void border border-void-border text-gray-300 font-semibold uppercase">
                  {{ p.category }}
                </span>
              </td>

              <!-- Status Toggle -->
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

              <!-- Date -->
              <td class="py-4 px-6 text-gray-400 text-xs font-mono">
                {{ formatDate(p.created_at) }}
              </td>

              <!-- Actions -->
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink
                    v-if="p.is_published"
                    :to="`/blog/${p.slug}`"
                    target="_blank"
                    class="px-2.5 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-void hover:bg-void-border border border-void-border rounded-lg transition-colors"
                    title="View live page"
                  >
                    View ↗
                  </NuxtLink>

                  <button
                    @click="openEditModal(p)"
                    class="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-void hover:bg-void-border border border-void-border rounded-lg transition-colors"
                  >
                    Edit
                  </button>

                  <button
                    @click="openDeleteModal(p)"
                    class="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-900/50 border border-red-900/50 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- CATEGORY MANAGER MODAL -->
    <div v-if="showCategoryModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="bg-void-charcoal border border-void-border rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-5 relative">
        <div class="flex items-center justify-between border-b border-void-border pb-3">
          <h3 class="font-display text-xl text-white tracking-wider uppercase">MANAGE BLOG CATEGORIES</h3>
          <button @click="showCategoryModal = false" class="text-gray-400 hover:text-white">✕</button>
        </div>

        <!-- Add Category Form -->
        <form @submit.prevent="handleAddCategory" class="flex gap-2 font-sans">
          <input
            v-model="newCategoryName"
            type="text"
            placeholder="New Category Name (e.g. Tour Reviews)..."
            class="flex-1 bg-void border border-void-border rounded-lg px-3.5 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
          />
          <button
            type="submit"
            class="btn-brutal text-xs py-2 px-4 bg-blood text-white border-blood shrink-0"
          >
            ADD
          </button>
        </form>

        <!-- Categories List -->
        <div class="divide-y divide-void-border/60 max-h-60 overflow-y-auto pr-1">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="py-3 flex items-center justify-between gap-3 text-sm font-sans"
          >
            <!-- Normal view -->
            <template v-if="editingCategoryId !== cat.id">
              <div>
                <span class="font-medium text-white">{{ cat.name }}</span>
                <span class="text-xs text-gray-400 font-mono ml-2">({{ cat.slug }})</span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="editingCategoryId = cat.id; editingCategoryName = cat.name"
                  class="text-xs text-gray-400 hover:text-white"
                >
                  Edit
                </button>
                <button
                  @click="handleDeleteCategory(cat.id)"
                  class="text-xs text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </template>

            <!-- Editing view -->
            <template v-else>
              <input
                v-model="editingCategoryName"
                type="text"
                class="flex-1 bg-void border border-void-border px-2 py-1 text-xs text-white rounded focus:border-red-600 focus:outline-none"
              />
              <div class="flex items-center gap-2">
                <button
                  @click="handleEditCategory(cat.id)"
                  class="text-xs text-green-400 font-bold"
                >
                  Save
                </button>
                <button
                  @click="editingCategoryId = null"
                  class="text-xs text-gray-400"
                >
                  Cancel
                </button>
              </div>
            </template>
          </div>
        </div>

        <div class="pt-3 border-t border-void-border text-right">
          <button
            @click="showCategoryModal = false"
            class="px-4 py-2 text-xs font-semibold text-gray-300 bg-void hover:bg-void-border rounded-lg"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>

    <!-- CREATE POST MODAL -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div class="bg-void-charcoal border border-void-border rounded-xl p-6 max-w-3xl w-full shadow-2xl space-y-5 my-8 relative">
        <div class="flex items-center justify-between border-b border-void-border pb-3">
          <h3 class="font-display text-xl text-white tracking-wider uppercase">CREATE BLOG POST</h3>
          <button @click="showCreateModal = false" class="text-gray-400 hover:text-white">✕</button>
        </div>

        <div v-if="formError" class="bg-red-950/60 border border-red-800 text-red-300 p-3 rounded-lg text-xs font-sans">
          {{ formError }}
        </div>

        <form @submit.prevent="handleCreatePost" class="space-y-4 font-sans text-sm max-h-[75vh] overflow-y-auto pr-2">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Article Title *</label>
              <input
                v-model="createForm.title"
                type="text"
                required
                placeholder="e.g. Chronicles of Decay LP Release"
                class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                URL Slug <span class="text-gray-500 lowercase">(leave blank to auto-generate)</span>
              </label>
              <input
                v-model="createForm.slug"
                type="text"
                placeholder="chronicles-of-decay-lp-release"
                class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 font-mono text-xs text-white focus:border-red-600 focus:outline-none"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Category</label>
              <select
                v-model="createForm.category"
                class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none"
              >
                <option v-for="cat in categories" :key="cat.id" :value="cat.name">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Author</label>
              <input
                v-model="createForm.author"
                type="text"
                class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Status</label>
              <div class="flex items-center gap-4 pt-2">
                <label class="flex items-center gap-2 cursor-pointer text-xs text-white">
                  <input v-model="createForm.is_published" type="checkbox" class="accent-red-600 w-4 h-4" />
                  <span>Publish Immediately</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Cover Image Upload -->
          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Cover Image URL</label>
            <AdminImageUpload v-model="createForm.cover_image_url" label="Article Cover Photo" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Excerpt (Short Summary)</label>
            <textarea
              v-model="createForm.excerpt"
              rows="2"
              placeholder="Brief overview snippet for cards & previews..."
              class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none"
            ></textarea>
          </div>

          <!-- WYSIWYG Content Editor -->
          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Article Body Content (WYSIWYG Rich Editor) *</label>
            <AdminWysiwygEditor v-model="createForm.content" placeholder="Write full formatted post content here..." />
          </div>

          <!-- SEO Collapsible Box -->
          <div class="bg-void border border-void-border rounded-lg p-4 space-y-3">
            <h4 class="font-mono text-xs text-blood uppercase tracking-widest font-bold">// SEO META TAG OVERRIDES</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] text-gray-400 uppercase mb-1">SEO Title Tag</label>
                <input
                  v-model="createForm.meta_title"
                  type="text"
                  placeholder="Defaults to Article Title"
                  class="w-full bg-void-charcoal border border-void-border rounded px-3 py-1.5 text-xs text-white focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-[11px] text-gray-400 uppercase mb-1">SEO Keywords</label>
                <input
                  v-model="createForm.meta_keywords"
                  type="text"
                  placeholder="WHITEEYES, Death Metal, Album Release"
                  class="w-full bg-void-charcoal border border-void-border rounded px-3 py-1.5 text-xs text-white focus:border-red-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label class="block text-[11px] text-gray-400 uppercase mb-1">SEO Meta Description</label>
              <textarea
                v-model="createForm.meta_description"
                rows="2"
                placeholder="Defaults to Excerpt"
                class="w-full bg-void-charcoal border border-void-border rounded px-3 py-1.5 text-xs text-white focus:border-red-600 focus:outline-none"
              ></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-void-border">
            <button
              type="button"
              @click="showCreateModal = false"
              class="px-4 py-2 text-xs font-semibold text-gray-300 bg-void hover:bg-void-border rounded-lg transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="btn-brutal text-xs py-2 px-5 bg-blood text-white border-blood hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {{ isSubmitting ? 'SAVING...' : 'PUBLISH POST' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- EDIT POST MODAL -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div class="bg-void-charcoal border border-void-border rounded-xl p-6 max-w-3xl w-full shadow-2xl space-y-5 my-8 relative">
        <div class="flex items-center justify-between border-b border-void-border pb-3">
          <h3 class="font-display text-xl text-white tracking-wider uppercase">EDIT POST #{{ editForm.id }}</h3>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-white">✕</button>
        </div>

        <div v-if="formError" class="bg-red-950/60 border border-red-800 text-red-300 p-3 rounded-lg text-xs font-sans">
          {{ formError }}
        </div>

        <form @submit.prevent="handleEditPost" class="space-y-4 font-sans text-sm max-h-[75vh] overflow-y-auto pr-2">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Article Title *</label>
              <input
                v-model="editForm.title"
                type="text"
                required
                class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">URL Slug</label>
              <input
                v-model="editForm.slug"
                type="text"
                class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 font-mono text-xs text-white focus:border-red-600 focus:outline-none"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Category</label>
              <select
                v-model="editForm.category"
                class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none"
              >
                <option v-for="cat in categories" :key="cat.id" :value="cat.name">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Author</label>
              <input
                v-model="editForm.author"
                type="text"
                class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Status</label>
              <div class="flex items-center gap-4 pt-2">
                <label class="flex items-center gap-2 cursor-pointer text-xs text-white">
                  <input v-model="editForm.is_published" type="checkbox" class="accent-red-600 w-4 h-4" />
                  <span>Published</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Cover Image Upload -->
          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Cover Image URL</label>
            <AdminImageUpload v-model="editForm.cover_image_url" label="Article Cover Photo" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Excerpt (Short Summary)</label>
            <textarea
              v-model="editForm.excerpt"
              rows="2"
              class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none"
            ></textarea>
          </div>

          <!-- WYSIWYG Content Editor -->
          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Article Body Content (WYSIWYG Rich Editor) *</label>
            <AdminWysiwygEditor v-model="editForm.content" placeholder="Write full formatted post content here..." />
          </div>

          <!-- SEO Collapsible Box -->
          <div class="bg-void border border-void-border rounded-lg p-4 space-y-3">
            <h4 class="font-mono text-xs text-blood uppercase tracking-widest font-bold">// SEO META TAG OVERRIDES</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] text-gray-400 uppercase mb-1">SEO Title Tag</label>
                <input
                  v-model="editForm.meta_title"
                  type="text"
                  class="w-full bg-void-charcoal border border-void-border rounded px-3 py-1.5 text-xs text-white focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-[11px] text-gray-400 uppercase mb-1">SEO Keywords</label>
                <input
                  v-model="editForm.meta_keywords"
                  type="text"
                  class="w-full bg-void-charcoal border border-void-border rounded px-3 py-1.5 text-xs text-white focus:border-red-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label class="block text-[11px] text-gray-400 uppercase mb-1">SEO Meta Description</label>
              <textarea
                v-model="editForm.meta_description"
                rows="2"
                class="w-full bg-void-charcoal border border-void-border rounded px-3 py-1.5 text-xs text-white focus:border-red-600 focus:outline-none"
              ></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-void-border">
            <button
              type="button"
              @click="showEditModal = false"
              class="px-4 py-2 text-xs font-semibold text-gray-300 bg-void hover:bg-void-border rounded-lg transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="btn-brutal text-xs py-2 px-5 bg-blood text-white border-blood hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {{ isSubmitting ? 'SAVING...' : 'SAVE CHANGES' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- DELETE CONFIRMATION MODAL -->
    <AdminConfirmModal
      :show="showDeleteModal"
      title="DELETE BLOG POST"
      :message="`Are you sure you want to delete post '${selectedPost?.title}'? This action cannot be undone.`"
      confirmText="DELETE POST"
      @confirm="handleDeletePost"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>
