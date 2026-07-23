<script setup lang="ts">
import { IconUsers, IconBook, IconSquareCheck, IconFileText } from '@tabler/icons-vue'

interface StatItem {
  label: string
  value: number | string
  indicator: string
  icon: string
  color: string
}

defineProps<{ stats: StatItem[] }>()

const iconMap: Record<string, any> = {
  groups: IconUsers, view_module: IconBook, task_alt: IconSquareCheck, description: IconFileText,
}

const iconBgMap: Record<string, string> = {
  primary:          'bg-blue-50 text-blue-600',
  secondary:        'bg-violet-50 text-violet-600',
  warning:          'bg-amber-50 text-amber-500',
  'on-surface-variant': 'bg-slate-100 text-slate-500',
}

const indicatorClass = (ind: string) => {
  if (ind.startsWith('+')) return 'text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full'
  if (ind === 'New')       return 'text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full'
  return 'text-[10px] font-medium text-[var(--color-text-muted)]'
}
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <div
      v-for="stat in stats" :key="stat.label"
      class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 hover:shadow-sm transition-shadow"
    >
      <div class="flex items-start justify-between mb-4">
        <div :class="['w-9 h-9 rounded-lg flex items-center justify-center', iconBgMap[stat.color] ?? 'bg-blue-50 text-blue-600']">
          <component :is="iconMap[stat.icon] ?? IconBook" class="size-4.5" />
        </div>
        <span :class="indicatorClass(stat.indicator)">{{ stat.indicator }}</span>
      </div>
      <p class="text-[28px] font-bold text-[var(--color-text-primary)] leading-none mb-1.5 font-display tracking-tight">{{ stat.value }}</p>
      <p class="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest leading-none">{{ stat.label }}</p>
    </div>
  </div>
</template>
