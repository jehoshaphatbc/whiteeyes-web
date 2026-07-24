<script setup lang="ts">
const { pageContent, fetchPageContent } = usePageContent()

const sectionIds = ['hero', 'about', 'latest-release', 'discography', 'artwork', 'videos', 'merch', 'connect']
const { activeSection } = useActiveSection(sectionIds)

onMounted(async () => {
  await fetchPageContent()
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
    />

    <PublicMerchSection
      :merch="pageContent?.merch"
      :global-whats-app="pageContent?.social_links?.whatsapp_number"
    />

    <PublicConnectSection
      :social-links="pageContent?.social_links"
    />

    <PublicTheFooter
      :band-profile="pageContent?.band_profile"
    />
  </div>
</template>
