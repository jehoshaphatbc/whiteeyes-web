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
    throw createError({ statusCode: 400, statusMessage: 'Invalid post ID' })
  }

  const body = await readBody(event)
  const {
    title,
    slug: rawSlug,
    excerpt,
    content,
    cover_image_url,
    author,
    category,
    meta_title,
    meta_description,
    meta_keywords,
    is_published,
  } = body

  const sql = getDb()

  if (sql) {
    const [existing] = await sql`SELECT * FROM blog_posts WHERE id = ${targetId}`
    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: 'Post not found' })
    }

    let finalSlug = existing.slug
    if (rawSlug || title) {
      const candidateSlug = slugify(rawSlug || title)
      if (candidateSlug && candidateSlug !== existing.slug) {
        const [dup] = await sql`SELECT id FROM blog_posts WHERE slug = ${candidateSlug} AND id != ${targetId}`
        finalSlug = dup ? `${candidateSlug}-${targetId}` : candidateSlug
      }
    }

    const [updated] = await sql`
      UPDATE blog_posts SET
        title = ${title ?? existing.title},
        slug = ${finalSlug},
        excerpt = ${excerpt ?? existing.excerpt},
        content = ${content ?? existing.content},
        cover_image_url = ${cover_image_url ?? existing.cover_image_url},
        author = ${author ?? existing.author},
        category = ${category ?? existing.category},
        meta_title = ${meta_title ?? existing.meta_title},
        meta_description = ${meta_description ?? existing.meta_description},
        meta_keywords = ${meta_keywords ?? existing.meta_keywords},
        is_published = ${is_published ?? existing.is_published},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${targetId}
      RETURNING *
    `
    return updated
  }

  // Memory store fallback
  const postIdx = memoryStore.blogPosts.findIndex((p: any) => p.id === targetId)
  if (postIdx === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  }

  const existing = memoryStore.blogPosts[postIdx]
  let finalSlug = existing.slug
  if (rawSlug || title) {
    const candidateSlug = slugify(rawSlug || title)
    if (candidateSlug && candidateSlug !== existing.slug) {
      const dup = memoryStore.blogPosts.find((p: any) => p.slug === candidateSlug && p.id !== targetId)
      finalSlug = dup ? `${candidateSlug}-${targetId}` : candidateSlug
    }
  }

  const updated = {
    ...existing,
    title: title ?? existing.title,
    slug: finalSlug,
    excerpt: excerpt ?? existing.excerpt,
    content: content ?? existing.content,
    cover_image_url: cover_image_url ?? existing.cover_image_url,
    author: author ?? existing.author,
    category: category ?? existing.category,
    meta_title: meta_title ?? existing.meta_title,
    meta_description: meta_description ?? existing.meta_description,
    meta_keywords: meta_keywords ?? existing.meta_keywords,
    is_published: is_published ?? existing.is_published,
    updated_at: new Date().toISOString(),
  }

  memoryStore.blogPosts[postIdx] = updated
  return updated
})
