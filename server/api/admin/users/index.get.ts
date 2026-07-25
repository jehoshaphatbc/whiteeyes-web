import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const sql = getDb()

  if (sql) {
    const users = await sql`
      SELECT id, email, role, created_at 
      FROM admin_users 
      ORDER BY id ASC
    `
    return users
  }

  // Memory store fallback
  return memoryStore.adminUsers.map((u: any) => ({
    id: u.id,
    email: u.email,
    role: u.role || 'admin',
    created_at: u.created_at || new Date().toISOString(),
  }))
})
