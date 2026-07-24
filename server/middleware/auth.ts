import jwt from 'jsonwebtoken'

export default defineEventHandler((event) => {
  const path = getRequestPath(event)

  // Only protect /api/admin routes except login/logout/health
  if (!path.startsWith('/api/admin') && !path.startsWith('/api/v1/admin')) {
    return
  }

  const token = getCookie(event, 'auth_token') || getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  try {
    const config = useRuntimeConfig()
    const decoded = jwt.verify(token, config.jwtSecret)
    event.context.auth = decoded
  } catch (err) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid or expired token' })
  }
})
