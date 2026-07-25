import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')
  const targetId = Number(idParam)

  if (!targetId || isNaN(targetId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid user ID' })
  }

  // 1. Primary superadmin protection guard
  if (targetId === 1) {
    throw createError({
      statusCode: 403,
      statusMessage: 'The primary superadmin account cannot be deleted under any circumstances.',
    })
  }

  // 2. Self-deletion guard
  const activeUserId = event.context.auth?.userId
  if (activeUserId && Number(activeUserId) === targetId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'You cannot delete your own active account while logged in.',
    })
  }

  const sql = getDb()

  if (sql) {
    const [existing] = await sql`SELECT id FROM admin_users WHERE id = ${targetId}`
    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    await sql`DELETE FROM admin_users WHERE id = ${targetId}`
    return { success: true, message: 'User deleted successfully' }
  }

  // Memory store fallback
  const userIdx = memoryStore.adminUsers.findIndex((u: any) => u.id === targetId)
  if (userIdx === -1) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  memoryStore.adminUsers.splice(userIdx, 1)
  return { success: true, message: 'User deleted successfully' }
})
