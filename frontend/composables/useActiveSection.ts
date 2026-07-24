import { useIntersectionObserver } from '@vueuse/core'

export const useActiveSection = (sectionIds: string[]) => {
  const activeSection = ref<string>(sectionIds[0] || 'hero')

  onMounted(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    }, observerOptions)

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    onUnmounted(() => {
      observer.disconnect()
    })
  })

  return { activeSection }
}
