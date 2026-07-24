<script setup lang="ts">
import type { MerchItem } from '~/types/content'

const props = defineProps<{
  merch?: MerchItem[]
  globalWhatsApp?: string
}>()

const getWhatsAppOrderUrl = (item: MerchItem) => {
  const number = item.whatsapp_number || props.globalWhatsApp || '6281234567890'
  const text = encodeURIComponent(`Hi, I would like to order the ${item.name}.`)
  return `https://wa.me/${number}?text=${text}`
}
</script>

<template>
  <section id="merch" class="py-28 bg-void border-t border-void-border relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <UiRevealOnScroll>
        <div class="flex items-center justify-between mb-16">
          <div class="flex items-center gap-4">
            <span class="font-mono text-xs text-blood tracking-widest uppercase">// 06 OFFICIAL DROP</span>
            <h2 class="font-display text-4xl sm:text-6xl text-white uppercase tracking-wider">MERCHANDISE</h2>
          </div>
          <span class="hidden sm:block font-mono text-xs text-ash/60 tracking-widest uppercase">LIMITED EDITIONS</span>
        </div>

        <div v-if="merch && merch.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="item in merch"
            :key="item.id"
            class="group bg-void-charcoal border border-void-border hover:border-blood transition-all duration-300 flex flex-col justify-between p-6"
          >
            <!-- Image & Product Details -->
            <div>
              <div class="relative overflow-hidden aspect-square border border-void-border bg-void-gray mb-6">
                <img
                  :src="item.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop'"
                  :alt="item.name"
                  class="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500"
                />
                <div v-if="item.price" class="absolute bottom-3 right-3 bg-blood text-white font-mono font-bold text-sm px-3 py-1 uppercase">
                  {{ item.price }}
                </div>
              </div>

              <h3 class="font-display text-2xl text-white uppercase tracking-wider group-hover:text-blood transition-colors">
                {{ item.name }}
              </h3>

              <p class="font-sans text-ash text-sm mt-3 leading-relaxed">
                {{ item.description }}
              </p>
            </div>

            <!-- WhatsApp Order CTA -->
            <div class="mt-8 pt-6 border-t border-void-border">
              <a
                :href="getWhatsAppOrderUrl(item)"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-brutal w-full text-xs py-3.5 flex items-center justify-center gap-2 group-hover:border-blood group-hover:bg-blood group-hover:text-white"
              >
                <span>ORDER VIA WHATSAPP</span>
                <span class="text-blood group-hover:text-white font-bold">↗</span>
              </a>
            </div>
          </div>
        </div>
      </UiRevealOnScroll>
    </div>
  </section>
</template>
