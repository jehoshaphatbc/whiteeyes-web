import { getDb } from '../../../database/db'
import { memoryStore } from '../../../database/schema'

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const {
    title,
    slug: rawSlug,
    excerpt,
    content,
    cover_image_url = '',
    author = 'WHITEEYES',
    category = 'News',
    meta_title = '',
    meta_description = '',
    meta_keywords = '',
    is_published = true,
  } = body

  if (!title || !content) {
    throw createError({ statusCode: 400, statusMessage: 'Title and content are required' })
  }

  let finalSlug = rawSlug ? slugify(rawSlug) : slugify(title)
  if (!finalSlug) {
    finalSlug = `post-${Date.now()}`
  }

  const sql = getDb()

  if (sql) {
    const [existing] = await sql`SELECT id FROM blog_posts WHERE slug = ${finalSlug}`
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`
    }

    const [newPost] = await sql`
      INSERT INTO blog_posts (
        title, slug, excerpt, content, cover_image_url, author, category,
        meta_title, meta_description, meta_keywords, is_published
      ) VALUES (
        ${title}, ${finalSlug}, ${excerpt || ''}, ${content}, ${cover_image_url},
        ${author}, ${category}, ${meta_title || title}, ${meta_description || excerpt || ''},
        ${meta_keywords || ''}, ${is_published}
      )
      RETURNING *
    `
    return newPost
  }

  // Memory store fallback
  const existingMemory = memoryStore.blogPosts.find((p: any) => p.slug === finalSlug)
  if (existingMemory) {
    finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`
  }

  const newId = memoryStore.blogPosts.length > 0 
    ? Math.max(...memoryStore.blogPosts.map((p: any) => p.id)) + 1 
    : 1

  const newPost = {
    id: newId,
    title,
    slug: finalSlug,
    excerpt: excerpt || '',
    content,
    cover_image_url,
    author,
    category,
    meta_title: meta_title || title,
    meta_description: meta_description || excerpt || '',
    meta_keywords: meta_keywords || '',
    is_published: !!is_published,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  memoryStore.blogPosts.unshift(newPost)
  return newPost
})
