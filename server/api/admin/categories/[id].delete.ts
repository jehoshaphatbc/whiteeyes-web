import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')
  const targetId = Number(idParam)

  if (!targetId || isNaN(targetId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid category ID' })
  }

  const sql = getDb()

  if (sql) {
    const [existing] = await sql`SELECT id FROM blog_categories WHERE id = ${targetId}`
    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: 'Category not found' })
    }

    await sql`DELETE FROM blog_categories WHERE id = ${targetId}`
    return { success: true, message: 'Category deleted successfully' }
  }

  // Memory store fallback
  const catIdx = memoryStore.blogCategories.findIndex((c: any) => c.id === targetId)
  if (catIdx === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  }

  memoryStore.blogCategories.splice(catIdx, 1)
  return { success: true, message: 'Category deleted successfully' }
})
