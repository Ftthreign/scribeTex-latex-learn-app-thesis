<script setup lang="ts">
import { onMounted } from 'vue'
import { useArticles } from '~/composables/useArticles'
import ArticleCard from '~/components/learn/ArticleCard.vue'

definePageMeta({ layout: 'default' })
useHead({ title: 'Panduan Regulasi Akademik Unila | ScribeTex' })

const { articles, loading, error, fetchArticles } = useArticles()

onMounted(async () => {
  await fetchArticles()
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
    <!-- Header Halaman -->
    <div class="space-y-2">
      <h1 class="text-2xl lg:text-3xl font-bold text-(--color-text-primary)">
        Panduan Regulasi Akademik Unila
      </h1>
      <p class="text-xs lg:text-sm text-(--color-text-muted) max-w-2xl leading-relaxed">
        Kumpulan artikel digitasi resmi Pedoman Penulisan Karya Ilmiah Universitas Lampung untuk memandu aturan tata letak, margin, rumus matematika, dan daftar pustaka skripsi Anda.
      </p>
    </div>

    <!-- State Loading -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="h-44 rounded-xl bg-border/40 animate-pulse"></div>
    </div>

    <!-- State Error -->
    <div v-else-if="error" class="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
      {{ error }}
    </div>

    <!-- Grid Artikel Panduan -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ArticleCard
        v-for="article in articles"
        :key="article.id"
        :article="article"
      />
    </div>
  </div>
</template>

