export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  try {
    const response = await $fetch<{ token: string; user: any }>(`${config.apiBackendUrl}/api/v1/auth/login`, {
      method: 'POST',
      body,
    })

    // Set httpOnly cookie on Nuxt response
    setCookie(event, 'auth_token', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 401,
      statusMessage: error.data?.error || 'Invalid credentials',
    })
  }
})
