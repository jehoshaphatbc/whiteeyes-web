<script setup lang="ts">
import type { AdminUser } from '~/types/content'

definePageMeta({
  layout: 'admin',
})

const { user: activeUser } = useAuth()

const users = ref<AdminUser[]>([])
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
const selectedUser = ref<AdminUser | null>(null)

// Form states
const createForm = ref({
  email: '',
  password: '',
  role: 'admin',
})

const editForm = ref({
  id: 0,
  email: '',
  password: '',
  role: 'admin',
})

const formError = ref('')
const isSubmitting = ref(false)

const fetchUsers = async () => {
  loading.value = true
  try {
    const data = await $fetch<AdminUser[]>('/api/admin/users')
    users.value = data || []
  } catch (err: any) {
    triggerToast(err.data?.statusMessage || 'Failed to load admin users', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(
    (u) => u.email.toLowerCase().includes(query) || u.role.toLowerCase().includes(query)
  )
})

// Create user
const openCreateModal = () => {
  createForm.value = { email: '', password: '', role: 'admin' }
  formError.value = ''
  showCreateModal.value = true
}

const handleCreateUser = async () => {
  formError.value = ''
  if (!createForm.value.email || !createForm.value.password) {
    formError.value = 'Email and Password are required'
    return
  }

  isSubmitting.value = true
  try {
    await $fetch('/api/admin/users', {
      method: 'POST',
      body: createForm.value,
    })
    triggerToast('New admin user created successfully')
    showCreateModal.value = false
    await fetchUsers()
  } catch (err: any) {
    formError.value = err.data?.statusMessage || 'Failed to create user'
  } finally {
    isSubmitting.value = false
  }
}

// Edit user
const openEditModal = (userItem: AdminUser) => {
  selectedUser.value = userItem
  editForm.value = {
    id: userItem.id,
    email: userItem.email,
    password: '',
    role: userItem.role,
  }
  formError.value = ''
  showEditModal.value = true
}

const handleEditUser = async () => {
  if (!selectedUser.value) return
  formError.value = ''
  isSubmitting.value = true

  try {
    const payload: any = {
      email: editForm.value.email,
      role: editForm.value.role,
    }
    if (editForm.value.password) {
      payload.password = editForm.value.password
    }

    await $fetch(`/api/admin/users/${editForm.value.id}`, {
      method: 'PUT',
      body: payload,
    })
    triggerToast('User updated successfully')
    showEditModal.value = false
    await fetchUsers()
  } catch (err: any) {
    formError.value = err.data?.statusMessage || 'Failed to update user'
  } finally {
    isSubmitting.value = false
  }
}

// Delete user
const openDeleteModal = (userItem: AdminUser) => {
  if (userItem.id === 1) {
    triggerToast('The primary superadmin account cannot be deleted', 'error')
    return
  }
  if (activeUser.value && activeUser.value.id === userItem.id) {
    triggerToast('You cannot delete your own active account while logged in', 'error')
    return
  }

  selectedUser.value = userItem
  showDeleteModal.value = true
}

const handleDeleteUser = async () => {
  if (!selectedUser.value) return
  isSubmitting.value = true

  try {
    await $fetch(`/api/admin/users/${selectedUser.value.id}`, {
      method: 'DELETE',
    })
    triggerToast('User deleted successfully')
    showDeleteModal.value = false
    await fetchUsers()
  } catch (err: any) {
    triggerToast(err.data?.statusMessage || 'Failed to delete user', 'error')
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
        <h1 class="font-display text-3xl tracking-wider text-white uppercase">USER ACCOUNTS</h1>
        <p class="font-sans text-xs text-gray-400 mt-1">Manage system administrators, roles, and superadmin accounts.</p>
      </div>

      <button
        @click="openCreateModal"
        class="btn-brutal bg-blood text-white border-blood hover:bg-red-700 transition-all flex items-center justify-center gap-2 self-start md:self-auto"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>ADD NEW USER</span>
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
        placeholder="Search users by email or role..."
        class="bg-transparent border-none text-white placeholder-gray-500 font-sans text-sm focus:outline-none flex-1"
      />
    </div>

    <!-- User Table Card -->
    <div class="bg-void-charcoal border border-void-border rounded-xl overflow-hidden shadow-2xl">
      <div v-if="loading" class="p-12 text-center text-gray-400 font-sans text-sm">
        <div class="inline-block animate-spin w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full mb-3"></div>
        <p>Loading user accounts...</p>
      </div>

      <div v-else-if="filteredUsers.length === 0" class="p-12 text-center text-gray-400 font-sans text-sm">
        No user accounts found.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left font-sans border-collapse">
          <thead>
            <tr class="bg-void border-b border-void-border text-xs uppercase tracking-wider text-gray-400">
              <th class="py-3.5 px-6 font-semibold">User</th>
              <th class="py-3.5 px-6 font-semibold">Role</th>
              <th class="py-3.5 px-6 font-semibold">Created Date</th>
              <th class="py-3.5 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-void-border/60 text-sm">
            <tr
              v-for="u in filteredUsers"
              :key="u.id"
              class="hover:bg-void/60 transition-colors"
            >
              <!-- User Info -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-void-border flex items-center justify-center text-red-400 font-bold font-mono text-sm border border-red-900/40">
                    {{ u.email.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-medium text-white flex items-center gap-2">
                      {{ u.email }}
                      <span
                        v-if="u.id === activeUser?.id"
                        class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      >
                        YOU
                      </span>
                    </p>
                    <p class="text-xs text-gray-400">User ID: #{{ u.id }}</p>
                  </div>
                </div>
              </td>

              <!-- Role Badge -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-2">
                  <span
                    class="text-xs font-mono px-2.5 py-1 rounded-md border font-semibold tracking-wider uppercase inline-flex items-center gap-1.5"
                    :class="u.role === 'superadmin'
                      ? 'bg-blood/20 text-red-400 border-red-500/40 shadow-[0_0_10px_rgba(255,51,51,0.2)]'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700'"
                  >
                    <svg v-if="u.role === 'superadmin'" class="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    {{ u.role }}
                  </span>

                  <span
                    v-if="u.id === 1"
                    class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 tracking-wide"
                  >
                    UNDELETABLE
                  </span>
                </div>
              </td>

              <!-- Created Date -->
              <td class="py-4 px-6 text-gray-400 text-xs">
                {{ formatDate(u.created_at) }}
              </td>

              <!-- Actions -->
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openEditModal(u)"
                    class="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-void hover:bg-void-border border border-void-border rounded-lg transition-colors"
                  >
                    Edit
                  </button>

                  <button
                    v-if="u.id !== 1 && u.id !== activeUser?.id"
                    @click="openDeleteModal(u)"
                    class="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-900/50 border border-red-900/50 rounded-lg transition-colors"
                  >
                    Delete
                  </button>

                  <span
                    v-else
                    class="px-3 py-1.5 text-xs font-medium text-gray-600 bg-void border border-void-border/50 rounded-lg cursor-not-allowed opacity-60 flex items-center gap-1"
                    title="Superadmin account & active account cannot be deleted"
                  >
                    <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Protected
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- CREATE USER MODAL -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="bg-void-charcoal border border-void-border rounded-xl p-6 max-w-md w-full shadow-2xl space-y-5 relative">
        <div class="flex items-center justify-between border-b border-void-border pb-3">
          <h3 class="font-display text-xl text-white tracking-wider uppercase">CREATE ADMIN USER</h3>
          <button @click="showCreateModal = false" class="text-gray-400 hover:text-white">✕</button>
        </div>

        <div v-if="formError" class="bg-red-950/60 border border-red-800 text-red-300 p-3 rounded-lg text-xs font-sans">
          {{ formError }}
        </div>

        <form @submit.prevent="handleCreateUser" class="space-y-4 font-sans text-sm">
          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Email Address</label>
            <input
              v-model="createForm.email"
              type="email"
              required
              placeholder="user@whiteeyes.metal"
              class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Password</label>
            <input
              v-model="createForm.password"
              type="password"
              required
              minlength="6"
              placeholder="Minimum 6 characters"
              class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Role</label>
            <select
              v-model="createForm.role"
              class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
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
              {{ isSubmitting ? 'CREATING...' : 'CREATE USER' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- EDIT USER MODAL -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="bg-void-charcoal border border-void-border rounded-xl p-6 max-w-md w-full shadow-2xl space-y-5 relative">
        <div class="flex items-center justify-between border-b border-void-border pb-3">
          <h3 class="font-display text-xl text-white tracking-wider uppercase">EDIT USER #{{ editForm.id }}</h3>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-white">✕</button>
        </div>

        <div v-if="formError" class="bg-red-950/60 border border-red-800 text-red-300 p-3 rounded-lg text-xs font-sans">
          {{ formError }}
        </div>

        <form @submit.prevent="handleEditUser" class="space-y-4 font-sans text-sm">
          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Email Address</label>
            <input
              v-model="editForm.email"
              type="email"
              required
              class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              New Password <span class="text-gray-500 font-normal lowercase">(leave blank to keep current)</span>
            </label>
            <input
              v-model="editForm.password"
              type="password"
              minlength="6"
              placeholder="••••••••"
              class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Role</label>
            <select
              v-model="editForm.role"
              :disabled="editForm.id === 1"
              class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2 text-white focus:border-red-600 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
            <p v-if="editForm.id === 1" class="text-[11px] text-amber-400 mt-1">Primary superadmin role cannot be changed.</p>
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
      title="DELETE USER ACCOUNT"
      :message="`Are you sure you want to delete user '${selectedUser?.email}'? This action cannot be undone.`"
      confirmText="DELETE USER"
      @confirm="handleDeleteUser"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>
