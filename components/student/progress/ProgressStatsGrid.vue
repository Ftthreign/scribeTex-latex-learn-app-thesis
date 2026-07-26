<script setup lang="ts">
import {
  IconBook,
  IconFileText,
  IconCode,
  IconCheck,
} from "@tabler/icons-vue";

defineProps<{
  completedModules?: number;
  totalModules?: number;
  completedLessons?: number;
  totalLessons?: number;
  completedExercises?: number;
  totalExercises?: number;
  overallPercent?: number;
}>();
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-body">
    <!-- Stat 1: Modul Tuntas -->
    <div
      class="group relative overflow-hidden bg-(--color-surface) border border-border rounded-(--radius-lg) p-5 hover:-translate-y-1 hover:shadow-md hover:border-border-strong transition-all duration-300 cursor-default flex flex-col justify-between"
    >
      <div
        class="absolute -top-5 -right-5 w-28 h-28 rounded-2xl opacity-[0.08] rotate-12 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 pointer-events-none bg-primary"
      />
      <div class="relative z-10 flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <p class="text-[11px] font-bold text-(--color-text-muted) uppercase tracking-wider truncate mb-2">
            Modul Pembelajaran
          </p>
          <p class="text-[28px] lg:text-[32px] font-bold text-(--color-text-primary) leading-none font-display tracking-tight group-hover:text-primary transition-colors mb-2 tabular-nums">
            {{ completedModules || 0 }} <span class="text-sm font-normal text-(--color-text-muted)">/ {{ totalModules || 8 }}</span>
          </p>
          <span class="inline-block text-[9px] font-bold border px-2 py-0.5 rounded-full uppercase tracking-wider text-primary bg-primary-light border-primary/20">
            Kurikulum
          </span>
        </div>
        <div class="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-xs rotate-6 transition-all duration-300 group-hover:rotate-0 group-hover:scale-105">
          <IconBook class="size-5.5 -rotate-6 group-hover:rotate-0 transition-transform duration-300" />
        </div>
      </div>
    </div>

    <!-- Stat 2: Bab Materi Selesai -->
    <div
      class="group relative overflow-hidden bg-(--color-surface) border border-border rounded-(--radius-lg) p-5 hover:-translate-y-1 hover:shadow-md hover:border-border-strong transition-all duration-300 cursor-default flex flex-col justify-between"
    >
      <div
        class="absolute -top-5 -right-5 w-28 h-28 rounded-2xl opacity-[0.08] rotate-12 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 pointer-events-none bg-primary"
      />
      <div class="relative z-10 flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <p class="text-[11px] font-bold text-(--color-text-muted) uppercase tracking-wider truncate mb-2">
            Materi & Bab
          </p>
          <p class="text-[28px] lg:text-[32px] font-bold text-(--color-text-primary) leading-none font-display tracking-tight group-hover:text-primary transition-colors mb-2 tabular-nums">
            {{ completedLessons || 0 }} <span class="text-sm font-normal text-(--color-text-muted)">/ {{ totalLessons || 24 }}</span>
          </p>
          <span class="inline-block text-[9px] font-bold border px-2 py-0.5 rounded-full uppercase tracking-wider text-primary bg-primary-light border-primary/20">
            Materi Dibaca
          </span>
        </div>
        <div class="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-xs rotate-6 transition-all duration-300 group-hover:rotate-0 group-hover:scale-105">
          <IconFileText class="size-5.5 -rotate-6 group-hover:rotate-0 transition-transform duration-300" />
        </div>
      </div>
    </div>

    <!-- Stat 3: Latihan Terverifikasi -->
    <div
      class="group relative overflow-hidden bg-(--color-surface) border border-border rounded-(--radius-lg) p-5 hover:-translate-y-1 hover:shadow-md hover:border-border-strong transition-all duration-300 cursor-default flex flex-col justify-between"
    >
      <div
        class="absolute -top-5 -right-5 w-28 h-28 rounded-2xl opacity-[0.08] rotate-12 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 pointer-events-none bg-primary"
      />
      <div class="relative z-10 flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <p class="text-[11px] font-bold text-(--color-text-muted) uppercase tracking-wider truncate mb-2">
            Latihan Kode
          </p>
          <p class="text-[28px] lg:text-[32px] font-bold text-(--color-text-primary) leading-none font-display tracking-tight group-hover:text-primary transition-colors mb-2 tabular-nums">
            {{ completedExercises || 0 }} <span class="text-sm font-normal text-(--color-text-muted)">/ {{ totalExercises || 16 }}</span>
          </p>
          <span class="inline-block text-[9px] font-bold border px-2 py-0.5 rounded-full uppercase tracking-wider text-primary bg-primary-light border-primary/20">
            Terverifikasi
          </span>
        </div>
        <div class="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-xs rotate-6 transition-all duration-300 group-hover:rotate-0 group-hover:scale-105">
          <IconCode class="size-5.5 -rotate-6 group-hover:rotate-0 transition-transform duration-300" />
        </div>
      </div>
    </div>

    <!-- Stat 4: Persentase Tuntas -->
    <div
      class="group relative overflow-hidden bg-(--color-surface) border border-border rounded-(--radius-lg) p-5 hover:-translate-y-1 hover:shadow-md hover:border-border-strong transition-all duration-300 cursor-default flex flex-col justify-between"
    >
      <div
        class="absolute -top-5 -right-5 w-28 h-28 rounded-2xl opacity-[0.08] rotate-12 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 pointer-events-none bg-primary"
      />
      <div class="relative z-10 flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <p class="text-[11px] font-bold text-(--color-text-muted) uppercase tracking-wider truncate mb-2">
            Pencapaian Kurikulum
          </p>
          <p class="text-[28px] lg:text-[32px] font-bold text-primary leading-none font-display tracking-tight mb-2 tabular-nums">
            {{ overallPercent || 0 }}%
          </p>
          <span class="inline-block text-[9px] font-bold border px-2 py-0.5 rounded-full uppercase tracking-wider text-primary bg-primary-light border-primary/20">
            Total Selesai
          </span>
        </div>
        <div class="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-xs rotate-6 transition-all duration-300 group-hover:rotate-0 group-hover:scale-105">
          <IconCheck class="size-5.5 -rotate-6 group-hover:rotate-0 transition-transform duration-300" />
        </div>
      </div>
    </div>
  </div>
</template>
