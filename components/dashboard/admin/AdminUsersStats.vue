<script setup lang="ts">
import {
  IconUsers,
  IconTrendingUp,
  IconTerminal2,
  IconRobot,
} from "@tabler/icons-vue";

const props = defineProps<{
  totalStudents: number;
  totalAdmins: number;
  avgProgress: number;
  totalCompilations: number;
  totalAiChats: number;
}>();

const metricCards = computed(() => [
  {
    label: "Mahasiswa Terdaftar",
    value: props.totalStudents,
    sub: `${props.totalAdmins} Administrator`,
    icon: IconUsers,
  },
  {
    label: "Rata-rata Kelulusan",
    value: `${props.avgProgress}%`,
    sub: "Penyelesaian Materi",
    icon: IconTrendingUp,
  },
  {
    label: "Total Kompilasi PDF",
    value: props.totalCompilations,
    sub: "Eksekusi Kontainer Docker",
    icon: IconTerminal2,
  },
  {
    label: "Konsultasi Pembimbing AI",
    value: props.totalAiChats,
    sub: "Percakapan Interaktif",
    icon: IconRobot,
  },
]);
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-body">
    <div
      v-for="card in metricCards"
      :key="card.label"
      class="gsap-admin-users-stat group relative overflow-hidden bg-(--color-surface) border border-border rounded-(--radius-lg) p-5 hover:-translate-y-1 hover:shadow-md hover:border-border-strong transition-all duration-300 cursor-default flex flex-col justify-between"
    >
      <div
        class="absolute -top-5 -right-5 w-28 h-28 rounded-2xl opacity-[0.08] rotate-12 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 pointer-events-none bg-primary"
      />

      <div class="relative z-10 flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <p class="text-[11px] font-bold text-(--color-text-muted) uppercase tracking-wider truncate mb-2 font-sans">
            {{ card.label }}
          </p>

          <p class="text-[28px] lg:text-[32px] font-bold text-(--color-text-primary) leading-none font-display tracking-tight group-hover:text-primary transition-colors mb-2 tabular-nums">
            {{ typeof card.value === 'number' ? card.value.toLocaleString("id-ID") : card.value }}
          </p>

          <span class="inline-block text-[9px] font-bold border px-2 py-0.5 rounded-full uppercase tracking-wider text-primary bg-primary-light border-primary/20 font-sans">
            {{ card.sub }}
          </span>
        </div>

        <div class="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-xs rotate-6 transition-all duration-300 group-hover:rotate-0 group-hover:scale-105">
          <component :is="card.icon" class="size-5.5 -rotate-6 group-hover:rotate-0 transition-transform duration-300" />
        </div>
      </div>
    </div>
  </div>
</template>
