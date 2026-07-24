<script setup lang="ts">
const { pageContent, fetchPageContent, loading } = usePageContent()

// Section IDs for active-section scroll highlight
const sectionIds = ['hero', 'about', 'latest-release', 'discography', 'artwork', 'videos', 'merch', 'connect']
const { activeSection } = useActiveSection(sectionIds)

onMounted(async () => {
  await fetchPageContent()
})
</script>

<template>
  <div class="relative bg-void">
    <!-- Header Navigation -->
    <PublicTheHeader
      :band-profile="pageContent?.band_profile"
      :active-section="activeSection"
    />

    <!-- Hero Section -->
    <PublicHeroSection
      :band-profile="pageContent?.band_profile"
    />

    <!-- About Section -->
    <PublicAboutSection
      :about="pageContent?.about"
    />

    <!-- Latest Release Section -->
    <PublicLatestRelease
      :release="pageContent?.latest_release"
    />

    <!-- Discography Archive -->
    <PublicDiscographySection
      :releases="pageContent?.discography"
    />

    <!-- Artwork Vault -->
    <PublicArtworkSection
      :artwork="pageContent?.artwork"
    />

    <!-- Videos Section -->
    <PublicVideosSection
      :videos="pageContent?.videos"
    />

    <!-- Merchandise Showcase -->
    <PublicMerchSection
      :merch="pageContent?.merch"
      :global-whats-app="pageContent?.social_links?.whatsapp_number"
    />

    <!-- Connect / Social Links -->
    <PublicConnectSection
      :social-links="pageContent?.social_links"
    />

    <!-- Footer -->
    <PublicTheFooter
      :band-profile="pageContent?.band_profile"
    />
  </div>
</template>
