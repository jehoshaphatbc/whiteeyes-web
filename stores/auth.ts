import { defineStore } from 'pinia'
import type { AdminUser } from '~/types/content'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AdminUser | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = computed(() => !!token.value || !!user.value)

  function setUser(u: AdminUser | null) {
    user.value = u
  }

  function setToken(t: string | null) {
    token.value = t
  }

  function logout() {
    user.value = null
    token.value = null
  }

  return {
    user,
    token,
    isAuthenticated,
    setUser,
    setToken,
    logout,
  }
})
