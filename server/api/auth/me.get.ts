import jwt from 'jsonwebtoken'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'auth_token') || getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    const config = useRuntimeConfig()
    const decoded = jwt.verify(token, config.jwtSecret) as any
    return { id: decoded.userId, email: decoded.email, role: decoded.role }
  } catch (err) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
})
