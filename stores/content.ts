import { defineStore } from 'pinia'
import type { PageContent } from '~/types/content'

export const useContentStore = defineStore('content', () => {
  const pageContent = ref<PageContent | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  function setPageContent(data: PageContent) {
    pageContent.value = data
  }

  return {
    pageContent,
    loading,
    error,
    setPageContent,
  }
})
