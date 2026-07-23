<script setup lang="ts">
import { IconFileText, IconCalendar, IconUser, IconArrowRight } from '@tabler/icons-vue'
import type { ArticleSummary } from '~/composables/useArticles'

defineProps<{
  article: ArticleSummary
}>()

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <NuxtLink
    :to="`/student/panduan/${article.id}`"
    class="group border border-border rounded-xl bg-(--color-surface) p-6 hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
  >
    <div class="space-y-4">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <IconFileText class="size-4" />
        </div>
        <span class="text-xs font-medium text-(--color-text-muted)">Panduan Regulasi Unila</span>
      </div>

      <div>
        <h3
          class="text-base font-bold text-(--color-text-primary) group-hover:text-primary transition-colors line-clamp-2"
        >
          {{ article.title }}
        </h3>
      </div>
    </div>

    <div class="pt-4 mt-4 border-t border-border/50 flex items-center justify-between text-xs text-(--color-text-muted)">
      <div class="flex items-center gap-3">
        <span class="flex items-center gap-1">
          <IconUser class="size-3.5" />
          {{ article.author?.name || 'Admin Unila' }}
        </span>
        <span class="flex items-center gap-1">
          <IconCalendar class="size-3.5" />
          {{ formatDate(article.created_at) }}
        </span>
      </div>

      <span class="font-semibold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
        Baca
        <IconArrowRight class="size-3.5" />
      </span>
    </div>
  </NuxtLink>
</template>
