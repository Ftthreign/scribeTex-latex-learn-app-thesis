<script setup lang="ts">
import { IconClipboardList, IconSquareCheck, IconStar, IconMessage2 } from '@tabler/icons-vue'

interface StatItem {
  label: string
  value: string | number
  badge?: string
  icon: string
}

defineProps<{ stats: StatItem[] }>()

const iconMap: Record<string, any> = {
  menu_book: IconClipboardList,
  task_alt:  IconSquareCheck,
  school:    IconStar,
  smart_toy: IconMessage2,
}

const iconBgMap: Record<string, string> = {
  menu_book: 'bg-blue-50 text-blue-600',
  task_alt:  'bg-violet-50 text-violet-600',
  school:    'bg-amber-50 text-amber-500',
  smart_toy: 'bg-sky-50 text-sky-600',
}
</script>

<template>
  <section class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <div
      v-for="stat in stats" :key="stat.label"
      class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 hover:shadow-sm transition-shadow"
    >
      <!-- Top row: icon + optional badge -->
      <div class="flex items-start justify-between mb-4">
        <div :class="['w-9 h-9 rounded-lg flex items-center justify-center shrink-0', iconBgMap[stat.icon] ?? 'bg-blue-50 text-blue-600']">
          <component :is="iconMap[stat.icon] ?? IconClipboardList" class="size-4.5" />
        </div>
        <span
          v-if="stat.badge"
          class="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full leading-none whitespace-nowrap"
        >
          {{ stat.badge }}
        </span>
      </div>

      <!-- Value -->
      <p class="text-[28px] font-bold text-[var(--color-text-primary)] leading-none mb-1.5 font-display tracking-tight">
        {{ stat.value }}
      </p>
      <!-- Label -->
      <p class="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest leading-none">
        {{ stat.label }}
      </p>
    </div>
  </section>
</template>
