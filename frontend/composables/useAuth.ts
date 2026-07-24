import { useAuthStore } from '~/stores/auth'

export const useAuth = () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  const router = useRouter()

  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch<{ token: string; user: any }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      authStore.setToken(response.token)
      authStore.setUser(response.user)
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.data?.error || err.message || 'Login failed' }
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch (_) {}
    authStore.logout()
    router.push('/admin/login')
  }

  const fetchMe = async () => {
    try {
      const user = await $fetch<any>('/api/auth/me')
      if (user) {
        authStore.setUser(user)
        return true
      }
    } catch (_) {
      authStore.logout()
    }
    return false
  }

  return {
    login,
    logout,
    fetchMe,
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
  }
}
