import { useContentStore } from '~/stores/content'
import type { PageContent } from '~/types/content'

export const usePageContent = () => {
  const contentStore = useContentStore()
  const config = useRuntimeConfig()

  const fetchPageContent = async () => {
    contentStore.loading = true
    contentStore.error = null
    try {
      const data = await $fetch<PageContent>(`${config.public.apiBase}/page-content`)
      contentStore.setPageContent(data)
      return data
    } catch (err: any) {
      contentStore.error = err.message || 'Failed to fetch page content'
      console.error('Error fetching page content:', err)
      return null
    } finally {
      contentStore.loading = false
    }
  }

  return {
    fetchPageContent,
    pageContent: computed(() => contentStore.pageContent),
    loading: computed(() => contentStore.loading),
    error: computed(() => contentStore.error),
  }
}
