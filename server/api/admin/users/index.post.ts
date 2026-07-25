import bcrypt from 'bcryptjs'
import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, role = 'admin' } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
  }

  const cleanEmail = email.trim().toLowerCase()
  if (!cleanEmail.includes('@') || cleanEmail.length < 5) {
    throw createError({ statusCode: 400, statusMessage: 'Valid email address is required' })
  }

  if (password.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be at least 6 characters long' })
  }

  const validRole = role === 'superadmin' ? 'superadmin' : 'admin'
  const passwordHash = bcrypt.hashSync(password, 10)
  const sql = getDb()

  if (sql) {
    // Check existing email
    const [existing] = await sql`SELECT id FROM admin_users WHERE LOWER(email) = ${cleanEmail}`
    if (existing) {
      throw createError({ statusCode: 400, statusMessage: 'A user with this email address already exists' })
    }

    const [newUser] = await sql`
      INSERT INTO admin_users (email, password_hash, role)
      VALUES (${cleanEmail}, ${passwordHash}, ${validRole})
      RETURNING id, email, role, created_at
    `
    return newUser
  }

  // Memory store fallback
  const existingMemoryUser = memoryStore.adminUsers.find((u: any) => u.email.toLowerCase() === cleanEmail)
  if (existingMemoryUser) {
    throw createError({ statusCode: 400, statusMessage: 'A user with this email address already exists' })
  }

  const newId = memoryStore.adminUsers.length > 0 
    ? Math.max(...memoryStore.adminUsers.map((u: any) => u.id)) + 1 
    : 1

  const newUser = {
    id: newId,
    email: cleanEmail,
    passwordHash,
    role: validRole,
    created_at: new Date().toISOString(),
  }

  memoryStore.adminUsers.push(newUser)

  return {
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
    created_at: newUser.created_at,
  }
})
