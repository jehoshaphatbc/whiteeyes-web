export default defineNuxtRouteMiddleware(async (to) => {
  // Only apply to /admin routes
  if (!to.path.startsWith('/admin')) return

  // Allow login page
  if (to.path === '/admin/login') return

  const authStore = useAuthStore()

  // If store doesn't have user info yet, verify session with backend
  if (!authStore.isAuthenticated) {
    try {
      const user = await $fetch<any>('/api/auth/me')
      if (user && user.id) {
        authStore.setUser(user)
        return
      }
    } catch (_) {
      // Not authenticated
    }
    return navigateTo('/admin/login')
  }
})
