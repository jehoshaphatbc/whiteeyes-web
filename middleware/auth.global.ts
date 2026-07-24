export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) return
  if (to.path === '/admin/login') return

  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    try {
      const user = await $fetch<any>('/api/auth/me')
      if (user && user.id) {
        authStore.setUser(user)
        return
      }
    } catch (_) {}
    return navigateTo('/admin/login')
  }
})
