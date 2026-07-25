<script setup lang="ts">
import type { AdminUser } from '~/types/content'

definePageMeta({
  layout: 'admin',
})

const { fetchMe } = useAuth()
const authStore = useAuthStore()

const profileData = ref<AdminUser | null>(null)
const loading = ref(true)

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

// Form state
const emailForm = ref({
  email: '',
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const emailError = ref('')
const passwordError = ref('')
const isUpdatingEmail = ref(false)
const isUpdatingPassword = ref(false)

const loadProfile = async () => {
  loading.value = true
  try {
    const user = await $fetch<AdminUser>('/api/admin/profile')
    profileData.value = user
    if (user) {
      emailForm.value.email = user.email
    }
  } catch (err: any) {
    triggerToast(err.data?.statusMessage || 'Failed to load profile data', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfile()
})

const handleUpdateEmail = async () => {
  emailError.value = ''
  if (!emailForm.value.email || !emailForm.value.email.includes('@')) {
    emailError.value = 'Please enter a valid email address'
    return
  }

  isUpdatingEmail.value = true
  try {
    const res = await $fetch<{ user: AdminUser; message: string }>('/api/admin/profile', {
      method: 'PUT',
      body: { email: emailForm.value.email },
    })
    triggerToast(res.message || 'Email updated successfully')
    profileData.value = res.user
    authStore.setUser(res.user)
    await fetchMe()
  } catch (err: any) {
    emailError.value = err.data?.statusMessage || 'Failed to update email'
  } finally {
    isUpdatingEmail.value = false
  }
}

const handleUpdatePassword = async () => {
  passwordError.value = ''
  if (!passwordForm.value.currentPassword) {
    passwordError.value = 'Current password is required'
    return
  }
  if (!passwordForm.value.newPassword || passwordForm.value.newPassword.length < 6) {
    passwordError.value = 'New password must be at least 6 characters long'
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'New passwords do not match'
    return
  }

  isUpdatingPassword.value = true
  try {
    const res = await $fetch<{ user: AdminUser; message: string }>('/api/admin/profile', {
      method: 'PUT',
      body: {
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword,
      },
    })
    triggerToast(res.message || 'Password changed successfully')
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    profileData.value = res.user
  } catch (err: any) {
    passwordError.value = err.data?.statusMessage || 'Failed to change password'
  } finally {
    isUpdatingPassword.value = false
  }
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (_) {
    return dateStr
  }
}
</script>

<template>
  <div class="space-y-8 max-w-4xl mx-auto">
    <!-- Toast Notification -->
    <AdminToastNotification
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
      @close="toast.show = false"
    />

    <!-- Page Header -->
    <div class="border-b border-void-border pb-6">
      <h1 class="font-display text-3xl tracking-wider text-white uppercase">ADMIN PROFILE</h1>
      <p class="font-sans text-xs text-gray-400 mt-1">Manage your account information, credentials, and password settings.</p>
    </div>

    <div v-if="loading" class="p-12 text-center text-gray-400 font-sans text-sm">
      <div class="inline-block animate-spin w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full mb-3"></div>
      <p>Loading profile information...</p>
    </div>

    <div v-else class="space-y-8">
      <!-- Profile Overview Card -->
      <div class="bg-void-charcoal border border-void-border rounded-xl p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-void border-2 border-red-600/50 flex items-center justify-center text-red-500 font-bold font-mono text-2xl shadow-[0_0_15px_rgba(255,51,51,0.2)]">
            {{ profileData?.email?.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h2 class="text-xl font-bold font-sans text-white">{{ profileData?.email }}</h2>
            <div class="flex items-center gap-2 mt-1 font-mono text-xs">
              <span class="text-gray-400">User ID: #{{ profileData?.id }}</span>
              <span class="text-gray-600">•</span>
              <span class="text-gray-400">Joined: {{ formatDate(profileData?.created_at) }}</span>
            </div>
          </div>
        </div>

        <div>
          <span
            class="text-xs font-mono px-3 py-1.5 rounded-lg border font-bold uppercase tracking-wider inline-flex items-center gap-2"
            :class="profileData?.role === 'superadmin'
              ? 'bg-blood/20 text-red-400 border-red-500/40 shadow-[0_0_12px_rgba(255,51,51,0.3)]'
              : 'bg-zinc-800 text-zinc-300 border-zinc-700'"
          >
            <svg v-if="profileData?.role === 'superadmin'" class="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            {{ profileData?.role || 'admin' }}
          </span>
        </div>
      </div>

      <!-- Forms Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Update Email Card -->
        <div class="bg-void-charcoal border border-void-border rounded-xl p-6 shadow-xl space-y-5">
          <div class="border-b border-void-border pb-3">
            <h3 class="font-display text-lg text-white tracking-wider uppercase">CHANGE EMAIL ADDRESS</h3>
            <p class="text-xs text-gray-400 mt-1">Update your primary administrative login email.</p>
          </div>

          <div v-if="emailError" class="bg-red-950/60 border border-red-800 text-red-300 p-3 rounded-lg text-xs font-sans">
            {{ emailError }}
          </div>

          <form @submit.prevent="handleUpdateEmail" class="space-y-4 font-sans text-sm">
            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                v-model="emailForm.email"
                type="email"
                required
                class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2.5 text-white focus:border-red-600 focus:outline-none"
              />
            </div>

            <div class="pt-2">
              <button
                type="submit"
                :disabled="isUpdatingEmail"
                class="btn-brutal text-xs py-2.5 px-5 bg-blood text-white border-blood hover:bg-red-700 transition-colors w-full disabled:opacity-50"
              >
                {{ isUpdatingEmail ? 'SAVING...' : 'UPDATE EMAIL' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Change Password Card -->
        <div class="bg-void-charcoal border border-void-border rounded-xl p-6 shadow-xl space-y-5">
          <div class="border-b border-void-border pb-3">
            <h3 class="font-display text-lg text-white tracking-wider uppercase">CHANGE PASSWORD</h3>
            <p class="text-xs text-gray-400 mt-1">Enhance account security with a strong new password.</p>
          </div>

          <div v-if="passwordError" class="bg-red-950/60 border border-red-800 text-red-300 p-3 rounded-lg text-xs font-sans">
            {{ passwordError }}
          </div>

          <form @submit.prevent="handleUpdatePassword" class="space-y-4 font-sans text-sm">
            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Current Password</label>
              <input
                v-model="passwordForm.currentPassword"
                type="password"
                required
                placeholder="Enter current password"
                class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2.5 text-white focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">New Password</label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                required
                minlength="6"
                placeholder="Minimum 6 characters"
                class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2.5 text-white focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Confirm New Password</label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                required
                minlength="6"
                placeholder="Repeat new password"
                class="w-full bg-void border border-void-border rounded-lg px-3.5 py-2.5 text-white focus:border-red-600 focus:outline-none"
              />
            </div>

            <div class="pt-2">
              <button
                type="submit"
                :disabled="isUpdatingPassword"
                class="btn-brutal text-xs py-2.5 px-5 bg-blood text-white border-blood hover:bg-red-700 transition-colors w-full disabled:opacity-50"
              >
                {{ isUpdatingPassword ? 'SAVING...' : 'CHANGE PASSWORD' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
