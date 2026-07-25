<script setup lang="ts">
import type { BlogPost } from '~/types/content'

const posts = ref<BlogPost[]>([])
const loading = ref(true)

const fetchLatestPosts = async () => {
  loading.value = true
  try {
    const data = await $fetch<BlogPost[]>('/api/posts')
    // Take top 3 latest published posts
    posts.value = (data || []).slice(0, 3)
  } catch (err) {
    console.error('Failed to load homepage blog posts:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLatestPosts()
})

const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (_) {
    return dateStr
  }
}
</script>

<template>
  <section id="blog" class="py-28 bg-void relative overflow-hidden border-t border-void-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <UiRevealOnScroll>
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span class="font-mono text-xs text-blood tracking-widest uppercase">// 07 CHRONICLES & DISPATCHES</span>
            <h2 class="font-display text-4xl sm:text-6xl text-white uppercase tracking-wider mt-2">
              LATEST BLOG TRANSMISSIONS
            </h2>
          </div>

          <NuxtLink
            to="/blog"
            class="btn-brutal text-xs py-3 px-6 shrink-0 self-start md:self-auto hidden sm:inline-flex items-center gap-2"
          >
            <span>VIEW ALL DISPATCHES</span>
            <span>↗</span>
          </NuxtLink>
        </div>

        <!-- Skeleton Loading -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="i in 3" :key="i" class="bg-void-charcoal border border-void-border rounded-xl p-6 h-80 animate-pulse"></div>
        </div>

        <!-- Posts Cards Grid -->
        <div v-else-if="posts.length" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article
            v-for="post in posts"
            :key="post.id"
            class="bg-void-charcoal border border-void-border hover:border-blood/80 transition-all duration-300 rounded-xl overflow-hidden flex flex-col group shadow-xl hover:shadow-[0_0_25px_rgba(255,51,51,0.15)]"
          >
            <!-- Cover Image / Thumbnail -->
            <NuxtLink :to="`/blog/${post.slug}`" class="relative aspect-[16/9] bg-black overflow-hidden block">
              <img
                v-if="post.cover_image_url"
                :src="post.cover_image_url"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter grayscale contrast-125 group-hover:grayscale-0"
              />
              <div v-else class="w-full h-full bg-void flex items-center justify-center text-ash font-mono text-xs">
                NO COVER IMAGE
              </div>

              <div class="absolute top-3 left-3 bg-void/90 backdrop-blur-sm border border-void-border px-2.5 py-1 text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider rounded">
                {{ post.category }}
              </div>
            </NuxtLink>

            <!-- Card Content -->
            <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div class="space-y-2">
                <div class="flex items-center justify-between text-[11px] font-mono text-ash">
                  <span>{{ formatDate(post.created_at) }}</span>
                  <span>BY {{ post.author || 'WHITEEYES' }}</span>
                </div>

                <NuxtLink :to="`/blog/${post.slug}`" class="block group-hover:text-blood transition-colors">
                  <h3 class="font-display text-2xl text-white uppercase tracking-wider line-clamp-2 leading-tight">
                    {{ post.title }}
                  </h3>
                </NuxtLink>

                <p v-if="post.excerpt" class="font-sans text-ash text-sm line-clamp-2 leading-relaxed">
                  {{ post.excerpt }}
                </p>
              </div>

              <div class="pt-4 border-t border-void-border/50">
                <NuxtLink
                  :to="`/blog/${post.slug}`"
                  class="inline-flex items-center gap-2 font-mono text-xs text-blood hover:text-white uppercase tracking-widest font-semibold transition-colors"
                >
                  <span>READ TRANSMISSION</span>
                  <span>↗</span>
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="text-center py-12 font-mono text-xs text-ash border border-dashed border-void-border">
          NO BLOG DISPATCHES PUBLISHED YET.
        </div>

        <!-- Prominent Bottom CTA Button -->
        <div class="mt-16 text-center">
          <NuxtLink
            to="/blog"
            class="btn-brutal-primary inline-flex items-center justify-center gap-3 text-sm py-4 px-8 tracking-widest shadow-[0_0_25px_rgba(255,51,51,0.3)] hover:scale-105 transition-transform"
          >
            <span>EXPLORE ALL DISPATCHES</span>
            <span>↗</span>
          </NuxtLink>
        </div>
      </UiRevealOnScroll>
    </div>
  </section>
</template>
