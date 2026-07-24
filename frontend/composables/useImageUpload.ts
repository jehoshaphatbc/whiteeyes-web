export const useImageUpload = () => {
  const config = useRuntimeConfig()
  const uploading = ref(false)
  const error = ref<string | null>(null)

  const upload = async (file: File, subfolder = 'general'): Promise<string | null> => {
    uploading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('subfolder', subfolder)

      const response = await $fetch<{ url: string }>(`${config.public.apiBase}/admin/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          // Token automatically handled by credentials/headers or proxy
        },
      })

      return response.url
    } catch (err: any) {
      error.value = err.data?.error || err.message || 'Image upload failed'
      return null
    } finally {
      uploading.value = false
    }
  }

  return { upload, uploading, error }
}
