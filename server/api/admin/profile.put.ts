import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDb } from '../../database/db'
import { memoryStore } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const userId = event.context.auth?.userId
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { email, currentPassword, newPassword } = body

  const sql = getDb()
  let dbUser: any = null
  let memUser: any = null

  if (sql) {
    const [found] = await sql`SELECT * FROM admin_users WHERE id = ${userId}`
    if (!found) throw createError({ statusCode: 404, statusMessage: 'User not found' })
    dbUser = found
  } else {
    memUser = memoryStore.adminUsers.find((u: any) => u.id === Number(userId))
    if (!memUser) throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  const currentUser = dbUser || memUser
  const existingPasswordHash = currentUser.password_hash || currentUser.passwordHash

  let updateEmail = currentUser.email
  if (email && email.trim().toLowerCase() !== currentUser.email.toLowerCase()) {
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail.includes('@') || cleanEmail.length < 5) {
      throw createError({ statusCode: 400, statusMessage: 'Valid email address is required' })
    }

    if (sql) {
      const [dup] = await sql`SELECT id FROM admin_users WHERE LOWER(email) = ${cleanEmail} AND id != ${userId}`
      if (dup) throw createError({ statusCode: 400, statusMessage: 'A user with this email address already exists' })
    } else {
      const dup = memoryStore.adminUsers.find((u: any) => u.email.toLowerCase() === cleanEmail && u.id !== Number(userId))
      if (dup) throw createError({ statusCode: 400, statusMessage: 'A user with this email address already exists' })
    }
    updateEmail = cleanEmail
  }

  let finalPasswordHash = existingPasswordHash
  if (newPassword) {
    if (!currentPassword) {
      throw createError({ statusCode: 400, statusMessage: 'Current password is required to set a new password' })
    }

    const isValidCurrent = bcrypt.compareSync(currentPassword, existingPasswordHash)
    if (!isValidCurrent) {
      throw createError({ statusCode: 400, statusMessage: 'Current password is incorrect' })
    }

    if (newPassword.length < 6) {
      throw createError({ statusCode: 400, statusMessage: 'New password must be at least 6 characters long' })
    }

    finalPasswordHash = bcrypt.hashSync(newPassword, 10)
  }

  let updatedRecord: any = null

  if (sql) {
    const [result] = await sql`
      UPDATE admin_users
      SET email = ${updateEmail},
          password_hash = ${finalPasswordHash}
      WHERE id = ${userId}
      RETURNING id, email, role, created_at
    `
    updatedRecord = result
  } else {
    memUser.email = updateEmail
    memUser.passwordHash = finalPasswordHash
    updatedRecord = {
      id: memUser.id,
      email: memUser.email,
      role: memUser.role || 'admin',
      created_at: memUser.created_at || new Date().toISOString(),
    }
  }

  // Refresh auth token cookie
  const config = useRuntimeConfig()
  const token = jwt.sign(
    { userId: updatedRecord.id, email: updatedRecord.email, role: updatedRecord.role },
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
    user: updatedRecord,
    token,
    message: 'Profile updated successfully',
  }
})
