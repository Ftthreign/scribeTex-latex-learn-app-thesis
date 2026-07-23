<script setup lang="ts">
import { computed } from 'vue'
import { IconBook, IconArrowRight, IconLock } from '@tabler/icons-vue'
import type { ModuleData } from '~/composables/useModules'

const props = defineProps<{
  module: ModuleData
}>()

const isLocked = computed(() => props.module.is_locked ?? false)
const completed = computed(() => props.module.completed_lessons || 0)
const total = computed(() => props.module.total_lessons || 0)
const progressPercent = computed(() => props.module.progress_percent || 0)

const statusBadge = computed(() => {
  if (isLocked.value) {
    return { label: '🔒 Terkunci', class: 'badge-neutral' }
  }
  if (progressPercent.value >= 100) {
    return { label: 'Selesai ✓', class: 'badge-success' }
  }
  if (progressPercent.value > 0) {
    return { label: `${progressPercent.value}% Selesai`, class: 'badge-warning' }
  }
  return { label: 'Belum Dimulai', class: 'badge-neutral' }
})
</script>

<template>
  <div
    :class="[
      'group border border-border rounded-xl bg-(--color-surface) p-6 transition-all duration-200 flex flex-col justify-between relative',
      isLocked
        ? 'opacity-75 bg-(--color-surface-alt)/50 cursor-not-allowed border-border/80'
        : 'hover:border-primary/50 hover:shadow-md cursor-pointer',
    ]"
    style="box-shadow: var(--shadow-card)"
  >
    <div class="space-y-4">
      <!-- Top Row: Badge Modul & Status Progres -->
      <div class="flex items-center justify-between">
        <span
          :class="[
            'px-3 py-1 text-xs font-semibold rounded-full border',
            isLocked ? 'bg-(--color-surface-alt) text-(--color-text-muted) border-border' : 'bg-primary/10 text-primary border-primary/20',
          ]"
        >
          Modul {{ module.sort_order }}
        </span>
        <span :class="statusBadge.class">
          {{ statusBadge.label }}
        </span>
      </div>

      <!-- Title & Description -->
      <div>
        <h3
          :class="[
            'text-lg font-bold transition-colors line-clamp-1',
            isLocked ? 'text-(--color-text-muted)' : 'text-(--color-text-primary) group-hover:text-primary',
          ]"
        >
          {{ module.title }}
        </h3>
        <p class="text-xs text-(--color-text-muted) mt-2 line-clamp-2 leading-relaxed">
          {{ module.description }}
        </p>
      </div>
    </div>

    <!-- Progress Track Section (DESIGN.md) -->
    <div class="pt-4 mt-4 border-t border-border/50 space-y-2.5">
      <div class="flex items-center justify-between text-xs">
        <span class="flex items-center gap-1.5 text-(--color-text-muted) font-medium">
          <IconBook class="size-3.5 text-primary" />
          {{ completed }}/{{ total }} Bab Selesai
        </span>
        <span class="font-bold text-(--color-text-primary) tabular-nums">
          {{ progressPercent }}%
        </span>
      </div>

      <!-- Progress Bar Track -->
      <div class="h-1.5 w-full bg-surface-alt rounded-full overflow-hidden border border-border">
        <div
          :class="[
            'h-full rounded-full transition-all duration-500 ease-out',
            progressPercent >= 100 ? 'bg-success' : 'bg-primary',
          ]"
          :style="{ width: progressPercent + '%' }"
        />
      </div>

      <!-- Action Footer -->
      <div class="pt-1 flex items-center justify-between">
        <NuxtLink
          v-if="!isLocked"
          :to="`/student/modules/${module.id}`"
          class="text-xs font-semibold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          <span>{{ progressPercent > 0 ? (progressPercent >= 100 ? 'Review Modul' : 'Lanjutkan Belajar') : 'Pelajari Modul' }}</span>
          <IconArrowRight class="size-3.5" />
        </NuxtLink>

        <span
          v-else
          class="text-xs font-medium text-(--color-text-muted) flex items-center gap-1.5"
          title="Selesaikan modul sebelumnya terlebih dahulu untuk membuka"
        >
          <IconLock class="size-3.5" />
          <span>Selesaikan Modul {{ module.sort_order - 1 }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
