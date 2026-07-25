import bcrypt from 'bcryptjs'
import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')
  const targetId = Number(idParam)

  if (!targetId || isNaN(targetId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid user ID' })
  }

  const body = await readBody(event)
  const { email, password, role } = body

  const sql = getDb()

  if (sql) {
    const [existingUser] = await sql`SELECT * FROM admin_users WHERE id = ${targetId}`
    if (!existingUser) {
      throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    let cleanEmail = existingUser.email
    if (email && email.trim().toLowerCase() !== existingUser.email.toLowerCase()) {
      cleanEmail = email.trim().toLowerCase()
      if (!cleanEmail.includes('@') || cleanEmail.length < 5) {
        throw createError({ statusCode: 400, statusMessage: 'Valid email address is required' })
      }
      const [duplicate] = await sql`SELECT id FROM admin_users WHERE LOWER(email) = ${cleanEmail} AND id != ${targetId}`
      if (duplicate) {
        throw createError({ statusCode: 400, statusMessage: 'A user with this email address already exists' })
      }
    }

    // Role protection for primary superadmin (ID 1)
    let newRole = existingUser.role
    if (role) {
      if (targetId === 1 && role !== 'superadmin') {
        throw createError({ statusCode: 403, statusMessage: 'The primary superadmin account role cannot be demoted' })
      }
      newRole = role === 'superadmin' ? 'superadmin' : 'admin'
    }

    let passwordHash = existingUser.password_hash
    if (password) {
      if (password.length < 6) {
        throw createError({ statusCode: 400, statusMessage: 'Password must be at least 6 characters long' })
      }
      passwordHash = bcrypt.hashSync(password, 10)
    }

    const [updatedUser] = await sql`
      UPDATE admin_users
      SET email = ${cleanEmail},
          password_hash = ${passwordHash},
          role = ${newRole}
      WHERE id = ${targetId}
      RETURNING id, email, role, created_at
    `
    return updatedUser
  }

  // Memory store fallback
  const userIdx = memoryStore.adminUsers.findIndex((u: any) => u.id === targetId)
  if (userIdx === -1) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  const existingUser = memoryStore.adminUsers[userIdx]

  let cleanEmail = existingUser.email
  if (email && email.trim().toLowerCase() !== existingUser.email.toLowerCase()) {
    cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail.includes('@') || cleanEmail.length < 5) {
      throw createError({ statusCode: 400, statusMessage: 'Valid email address is required' })
    }
    const duplicate = memoryStore.adminUsers.find((u: any) => u.email.toLowerCase() === cleanEmail && u.id !== targetId)
    if (duplicate) {
      throw createError({ statusCode: 400, statusMessage: 'A user with this email address already exists' })
    }
  }

  let newRole = existingUser.role || 'admin'
  if (role) {
    if (targetId === 1 && role !== 'superadmin') {
      throw createError({ statusCode: 403, statusMessage: 'The primary superadmin account role cannot be demoted' })
    }
    newRole = role === 'superadmin' ? 'superadmin' : 'admin'
  }

  if (password) {
    if (password.length < 6) {
      throw createError({ statusCode: 400, statusMessage: 'Password must be at least 6 characters long' })
    }
    existingUser.passwordHash = bcrypt.hashSync(password, 10)
  }

  existingUser.email = cleanEmail
  existingUser.role = newRole

  return {
    id: existingUser.id,
    email: existingUser.email,
    role: existingUser.role,
    created_at: existingUser.created_at || new Date().toISOString(),
  }
})
