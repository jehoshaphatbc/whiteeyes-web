import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')
  const targetId = Number(idParam)

  if (!targetId || isNaN(targetId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid category ID' })
  }

  const body = await readBody(event)
  const { name } = body

  if (!name || !name.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Category name is required' })
  }

  const cleanName = name.trim()
  const slug = slugify(cleanName) || `cat-${targetId}`

  const sql = getDb()

  if (sql) {
    const [existing] = await sql`SELECT id FROM blog_categories WHERE id = ${targetId}`
    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: 'Category not found' })
    }

    const [dup] = await sql`SELECT id FROM blog_categories WHERE LOWER(name) = ${cleanName.toLowerCase()} AND id != ${targetId}`
    if (dup) {
      throw createError({ statusCode: 400, statusMessage: 'A category with this name already exists' })
    }

    const [updated] = await sql`
      UPDATE blog_categories
      SET name = ${cleanName}, slug = ${slug}
      WHERE id = ${targetId}
      RETURNING *
    `
    return updated
  }

  // Memory store fallback
  const catIdx = memoryStore.blogCategories.findIndex((c: any) => c.id === targetId)
  if (catIdx === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  }

  const dup = memoryStore.blogCategories.find((c: any) => c.name.toLowerCase() === cleanName.toLowerCase() && c.id !== targetId)
  if (dup) {
    throw createError({ statusCode: 400, statusMessage: 'A category with this name already exists' })
  }

  memoryStore.blogCategories[catIdx].name = cleanName
  memoryStore.blogCategories[catIdx].slug = slug
  return memoryStore.blogCategories[catIdx]
})
