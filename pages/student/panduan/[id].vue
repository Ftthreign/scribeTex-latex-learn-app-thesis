<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { IconArrowLeft, IconUser, IconCalendar, IconFileText } from '@tabler/icons-vue'
import { useArticles } from '~/composables/useArticles'
import KatexRenderer from '~/components/learn/KatexRenderer.vue'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const { currentArticle, loading, error, fetchArticleById } = useArticles()

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const loadArticleData = async (id: number) => {
  if (!isNaN(id)) {
    const article = await fetchArticleById(id)
    if (article) {
      useHead({ title: `${article.title} | ScribeTex` })
    }
  }
}

onMounted(async () => {
  await loadArticleData(Number(route.params.id))
})

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await loadArticleData(Number(newId))
    }
  }
)
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8 space-y-6">
    <!-- Tombol Kembali -->
    <button
      @click="router.push('/student/panduan')"
      class="flex items-center gap-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
    >
      <IconArrowLeft class="size-4" />
      Kembali ke Panduan Regulasi
    </button>

    <!-- State Loading -->
    <div v-if="loading" class="space-y-4">
      <div class="h-10 w-2/3 bg-border/40 rounded-lg animate-pulse"></div>
      <div class="h-96 bg-border/40 rounded-xl animate-pulse"></div>
    </div>

    <!-- State Error -->
    <div v-else-if="error" class="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
      {{ error }}
    </div>

    <!-- Detail Artikel -->
    <div v-else-if="currentArticle" class="space-y-8">
      <!-- Header Artikel -->
      <div class="border-b border-border pb-6 space-y-3">
        <div class="flex items-center gap-2 text-xs font-semibold text-primary">
          <IconFileText class="size-4" />
          <span>Panduan Regulasi Akademik Universitas Lampung</span>
        </div>

        <h1 class="text-2xl lg:text-3xl font-bold text-(--color-text-primary)">
          {{ currentArticle.title }}
        </h1>

        <div class="flex items-center gap-4 text-xs text-(--color-text-muted) pt-1">
          <span class="flex items-center gap-1">
            <IconUser class="size-3.5" />
            {{ currentArticle.author?.name || 'Admin Unila' }}
          </span>
          <span class="flex items-center gap-1">
            <IconCalendar class="size-3.5" />
            {{ formatDate(currentArticle.created_at) }}
          </span>
        </div>
      </div>

      <!-- Area Teks Konten Artikel -->
      <div class="bg-(--color-surface) border border-border rounded-xl p-6 lg:p-10 shadow-sm">
        <KatexRenderer :content="currentArticle.content" :isMarkdown="true" />
      </div>
    </div>
  </div>
</template>
