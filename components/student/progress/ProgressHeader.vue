<script setup lang="ts">
import { IconAward, IconSparkles } from '@tabler/icons-vue'

defineProps<{
  overallPercent?: number;
}>()
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6 font-body">
    <div class="space-y-1.5">
      <div class="flex items-center gap-2">
        <span class="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-(--color-primary-light) text-(--color-primary) border border-(--color-primary)/20 font-sans flex items-center gap-1">
          <IconSparkles class="size-3" />
          <span>Kurikulum ScribeTex</span>
        </span>
      </div>
      <h1 class="text-2xl lg:text-3xl font-bold text-(--color-text-primary) font-display tracking-tight">
        Progress Belajar LaTeX Saya
      </h1>
      <p class="text-xs lg:text-sm text-(--color-text-muted) max-w-2xl leading-relaxed font-sans">
        Pantau pencapaian penyelesaian modul, latihan kode terverifikasi, dan perkembangan kemampuan LaTeX Anda secara real-time.
      </p>
    </div>

    <!-- Badge Level Kemampuan Akademis Pembelajar -->
    <div class="bg-(--color-surface) border border-border rounded-(--radius-md) p-3 px-4 flex items-center gap-3 shrink-0 shadow-xs">
      <div class="size-10 rounded-full bg-(--color-primary-light) text-(--color-primary) flex items-center justify-center font-bold shrink-0">
        <IconAward class="size-5" />
      </div>
      <div class="space-y-0.5">
        <span class="text-[10px] font-bold uppercase tracking-wider text-(--color-text-muted) font-sans">Tingkat Kemampuan</span>
        <h4 class="text-xs font-bold text-(--color-text-primary) font-display">
          {{ (overallPercent || 0) >= 80 ? 'Mahir LaTeX' : (overallPercent || 0) >= 40 ? 'Pembelajar Menengah' : 'Pembelajar Dasar' }}
        </h4>
      </div>
    </div>
  </div>
</template>
