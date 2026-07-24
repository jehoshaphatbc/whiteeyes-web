import { put } from '@vercel/blob'

export default defineEventHandler(async (event) => {
  const token = process.env.BLOB_READ_WRITE_TOKEN

  const formData = await readMultipartFormData(event)
  if (!formData || !formData.length) {
    throw createError({ statusCode: 400, statusMessage: 'No file provided for upload' })
  }

  const file = formData.find((f) => f.name === 'file' || f.filename) || formData[0]
  if (!file || !file.data) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid file payload' })
  }

  const filename = file.filename || `whiteeyes-${Date.now()}.png`

  // If Vercel Blob token is present in environment, upload to Vercel Blob
  if (token) {
    try {
      const blob = await put(filename, file.data, {
        access: 'public',
        token,
      })
      return { url: blob.url, provider: 'vercel-blob' }
    } catch (err: any) {
      console.error('Error uploading to Vercel Blob:', err)
      throw createError({ statusCode: 500, statusMessage: `Vercel Blob upload failed: ${err.message}` })
    }
  }

  // Fallback: Generate Data URI if BLOB_READ_WRITE_TOKEN is not configured yet
  const mimeType = file.type || 'image/png'
  const base64 = file.data.toString('base64')
  return { url: `data:${mimeType};base64,${base64}`, provider: 'base64-fallback' }
})
