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
  const body = await readBody(event)
  const { name } = body

  if (!name || !name.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Category name is required' })
  }

  const cleanName = name.trim()
  const slug = slugify(cleanName) || `cat-${Date.now()}`

  const sql = getDb()

  if (sql) {
    const [existing] = await sql`SELECT id FROM blog_categories WHERE LOWER(name) = ${cleanName.toLowerCase()}`
    if (existing) {
      throw createError({ statusCode: 400, statusMessage: 'Category already exists' })
    }

    const [newCat] = await sql`
      INSERT INTO blog_categories (name, slug)
      VALUES (${cleanName}, ${slug})
      RETURNING *
    `
    return newCat
  }

  // Memory store fallback
  const existing = memoryStore.blogCategories.find((c: any) => c.name.toLowerCase() === cleanName.toLowerCase())
  if (existing) {
    throw createError({ statusCode: 400, statusMessage: 'Category already exists' })
  }

  const newId = memoryStore.blogCategories.length > 0 
    ? Math.max(...memoryStore.blogCategories.map((c: any) => c.id)) + 1 
    : 1

  const newCat = {
    id: newId,
    name: cleanName,
    slug,
    created_at: new Date().toISOString(),
  }

  memoryStore.blogCategories.push(newCat)
  return newCat
})
