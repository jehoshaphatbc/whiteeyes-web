import { getDb } from '../../database/db'
import { memoryStore } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const userId = event.context.auth?.userId
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const sql = getDb()

  if (sql) {
    const [user] = await sql`
      SELECT id, email, role, created_at 
      FROM admin_users 
      WHERE id = ${userId}
    `
    if (!user) {
      throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }
    return user
  }

  // Memory store fallback
  const user = memoryStore.adminUsers.find((u: any) => u.id === Number(userId))
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role || 'admin',
    created_at: user.created_at || new Date().toISOString(),
  }
})
