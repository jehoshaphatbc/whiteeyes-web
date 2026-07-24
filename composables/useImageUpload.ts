export const useImageUpload = () => {
  const uploading = ref(false)
  const error = ref<string | null>(null)

  const upload = async (file: File): Promise<string | null> => {
    uploading.value = true
    error.value = null

    try {
      // Convert file to Base64 data URI for instant client preview and storage
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (e) => reject(e)
        reader.readAsDataURL(file)
      })
    } catch (err: any) {
      error.value = err.message || 'Image processing failed'
      return null
    } finally {
      uploading.value = false
    }
  }

  return { upload, uploading, error }
}
