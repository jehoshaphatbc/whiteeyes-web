import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDb } from '../../database/db'
import { memoryStore } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
  }

  const sql = getDb()
  let user: any = null

  if (sql) {
    const [dbUser] = await sql`SELECT * FROM admin_users WHERE email = ${email}`
    user = dbUser
  } else {
    if (email === memoryStore.adminUser.email) {
      user = memoryStore.adminUser
    }
  }

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const validPassword = bcrypt.compareSync(password, user.password_hash || user.passwordHash)
  if (!validPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const config = useRuntimeConfig()
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role || 'admin' },
    config.jwtSecret,
    { expiresIn: '7d' }
  )

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 86400 * 7,
    path: '/',
  })

  return {
    token,
    user: { id: user.id, email: user.email, role: user.role || 'admin' },
  }
})
