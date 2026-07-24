export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token')

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    const user = await $fetch(`${config.apiBackendUrl}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return user
  } catch (error: any) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
})
