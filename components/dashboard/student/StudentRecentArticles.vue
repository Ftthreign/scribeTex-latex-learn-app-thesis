<script setup lang="ts">
interface ArticleItem {
  id: number
  category: string
  readTime: string
  title: string
  imageUrl: string
  categoryColor?: string
}

defineProps<{ articles: ArticleItem[] }>()
const emit = defineEmits<{ (e: 'click-article', id: number): void; (e: 'view-all'): void }>()

const categoryColorMap: Record<string, string> = {
  'Tips Akademik': 'text-violet-600',
  'LaTeX Guide':   'text-blue-600',
  'AI Insights':   'text-emerald-600',
}
</script>

<template>
  <aside class="w-full lg:w-[300px] shrink-0 font-body">
    <div class="sticky top-6">
      <h3 class="text-[15px] font-bold text-[var(--color-text-primary)] mb-4">Artikel Terbaru</h3>

      <div class="space-y-3">
        <div
          v-for="article in articles" :key="article.id"
          @click="emit('click-article', article.id)"
          class="border border-[var(--color-border)] rounded-xl p-4 bg-[var(--color-surface)] hover:shadow-sm hover:border-[var(--color-primary)]/30 transition-all cursor-pointer"
        >
          <!-- Category + read time -->
          <div class="flex items-center gap-1.5 mb-2">
            <span :class="['text-[10px] font-bold uppercase tracking-wider', categoryColorMap[article.category] ?? 'text-[var(--color-primary)]']">
              {{ article.category }}
            </span>
            <span class="text-[var(--color-text-muted)] text-[10px]">•</span>
            <span class="text-[10px] text-[var(--color-text-muted)] font-semibold">{{ article.readTime }}</span>
          </div>
          <!-- Title -->
          <p class="text-[13.5px] font-semibold text-[var(--color-text-primary)] leading-snug">
            {{ article.title }}
          </p>
        </div>
      </div>

      <button @click="emit('view-all')" class="w-full mt-4 py-2.5 border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] text-[12px] font-semibold text-[var(--color-text-secondary)] rounded-[var(--radius-md)] transition-colors cursor-pointer">
        Lihat Semua Artikel
      </button>
    </div>
  </aside>
</template>
