<script setup lang="ts">
const { pageContent, fetchPageContent } = usePageContent()

const sectionIds = ['hero', 'about', 'latest-release', 'discography', 'artwork', 'videos', 'merch', 'blog', 'press-release', 'connect']
const { activeSection } = useActiveSection(sectionIds)

// Fetch initial SSR payload
await fetchPageContent()

const seo = computed(() => pageContent.value?.seo_settings)

// Dynamic SEO Head injection
useSeoMeta({
  title: () => seo.value?.meta_title || 'WHITEEYES — Extreme Death Metal',
  description: () => seo.value?.meta_description || 'Official portal of WHITEEYES Extreme Death Metal band.',
  keywords: () => seo.value?.meta_keywords || 'WHITEEYES, Death Metal, Extreme Metal, Underground Metal',
  ogTitle: () => seo.value?.og_title || seo.value?.meta_title || 'WHITEEYES — Extreme Death Metal',
  ogDescription: () => seo.value?.og_description || seo.value?.meta_description || 'Official portal of WHITEEYES.',
  ogImage: () => seo.value?.og_image_url || '/favicon.png',
  twitterCard: () => (seo.value?.twitter_card_type as any) || 'summary_large_image',
  twitterTitle: () => seo.value?.og_title || seo.value?.meta_title,
  twitterDescription: () => seo.value?.og_description || seo.value?.meta_description,
  twitterImage: () => seo.value?.og_image_url || '/favicon.png',
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: () => seo.value?.canonical_url || 'https://whiteeyes-web.vercel.app',
    },
  ],
})
</script>

<template>
  <div class="relative bg-void">
    <PublicTheHeader
      :band-profile="pageContent?.band_profile"
      :active-section="activeSection"
    />

    <PublicHeroSection
      :band-profile="pageContent?.band_profile"
    />

    <PublicAboutSection
      :about="pageContent?.about"
    />

    <PublicLatestRelease
      :release="pageContent?.latest_release"
    />

    <PublicDiscographySection
      :releases="pageContent?.discography"
    />

    <PublicArtworkSection
      :artwork="pageContent?.artwork"
    />

    <PublicVideosSection
      :videos="pageContent?.videos"
      :youtube-url="pageContent?.band_profile?.youtube_url || pageContent?.social_links?.youtube_url"
    />

    <PublicMerchSection
      :merch="pageContent?.merch"
      :global-whats-app="pageContent?.social_links?.whatsapp_number"
    />

    <PublicBlogSection />

    <PublicPressReleaseSection />

    <PublicConnectSection
      :social-links="pageContent?.social_links"
    />

    <PublicTheFooter
      :band-profile="pageContent?.band_profile"
    />
  </div>
</template>
