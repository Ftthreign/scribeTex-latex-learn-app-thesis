<script setup lang="ts">
import { IconBook, IconCode, IconInfoCircle } from '@tabler/icons-vue'
import type { ExerciseDetail } from '~/composables/useExercise'

defineProps<{
  exercise: ExerciseDetail
}>()
</script>

<template>
  <div class="bg-(--color-surface) border border-border rounded-xl p-5 space-y-3" style="box-shadow: var(--shadow-card)">
    <!-- Header Modul & Lesson -->
    <div class="flex items-center justify-between gap-2 border-b border-border pb-3">
      <div class="flex items-center gap-2 text-xs font-semibold text-primary">
        <IconBook class="size-4 shrink-0" />
        <span class="truncate">{{ exercise?.module_title || 'Modul Pembelajaran' }}</span>
      </div>
      <span class="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
        {{ exercise?.lesson_title || 'Latihan Kode' }}
      </span>
    </div>

    <!-- Instruksi Utama -->
    <div class="space-y-1.5">
      <h3 class="text-sm font-bold text-(--color-text-primary) flex items-center gap-2">
        <IconCode class="size-4 text-primary shrink-0" />
        Instruksi Latihan Kode
      </h3>
      <p class="text-xs text-(--color-text-secondary) leading-relaxed">
        {{ exercise?.instruction || 'Selesaikan perbaikan kode pada starter_code sesuai petunjuk materi.' }}
      </p>
    </div>

    <!-- Petunjuk Singkat -->
    <div class="pt-2 flex items-center gap-1.5 text-[11px] text-(--color-text-muted) border-t border-border/60">
      <IconInfoCircle class="size-3.5 text-primary shrink-0" />
      <span>Edit sintaks pada editor di bawah lalu amati hasil rendering instan KaTeX pada panel pratinjau.</span>
    </div>
  </div>
</template>
