export const useImageUpload = () => {
  const uploading = ref(false)
  const error = ref<string | null>(null)

  const upload = async (file: File): Promise<string | null> => {
    uploading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await $fetch<{ url: string; provider: string }>('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (response && response.url) {
        return response.url
      }
      throw new Error('Upload returned no URL')
    } catch (err: any) {
      console.warn('Vercel Blob endpoint error, falling back to client Base64:', err)
      // Client-side fallback if server fails
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (e) => reject(e)
        reader.readAsDataURL(file)
      })
    } finally {
      uploading.value = false
    }
  }

  return { upload, uploading, error }
}
