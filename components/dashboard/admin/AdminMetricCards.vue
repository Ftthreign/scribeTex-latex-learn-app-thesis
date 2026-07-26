<script setup lang="ts">
import {
  IconUsers,
  IconBook,
  IconRobot,
  IconTerminal2,
} from "@tabler/icons-vue";

const props = defineProps<{
  stats: any;
}>();

const metricCards = computed(() => [
  {
    label: "Total Mahasiswa",
    value: props.stats?.users?.students ?? 0,
    sub: `${props.stats?.users?.admins ?? 0} Pengelola Admin`,
    badge: "Pengguna",
    icon: IconUsers,
  },
  {
    label: "Materi & Modul",
    value: props.stats?.content?.lessons ?? 0,
    sub: `${props.stats?.content?.modules ?? 0} Modul Kurikulum`,
    badge: "Materi Aktif",
    icon: IconBook,
  },
  {
    label: "Konsultasi AI",
    value: props.stats?.activity?.ai_chats ?? 0,
    sub: "Percakapan Pembimbing AI",
    badge: "Interaktif",
    icon: IconRobot,
  },
  {
    label: "Kompilasi PDF",
    value: props.stats?.activity?.compilations ?? 0,
    sub: "Eksekusi Kompilasi Docker",
    badge: "Kompilasi",
    icon: IconTerminal2,
  },
]);
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-body">
    <div
      v-for="card in metricCards"
      :key="card.label"
      class="gsap-admin-metric group relative overflow-hidden bg-(--color-surface) border border-border rounded-(--radius-lg) p-5 hover:-translate-y-1 hover:shadow-md hover:border-border-strong transition-all duration-300 cursor-default flex flex-col justify-between"
    >
      <!-- Watermark Background Terotasi -->
      <div
        class="absolute -top-5 -right-5 w-28 h-28 rounded-2xl opacity-[0.08] rotate-12 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 pointer-events-none bg-primary"
      />

      <div class="relative z-10 flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <p class="text-[11px] font-bold text-(--color-text-muted) uppercase tracking-wider truncate mb-2 font-sans">
            {{ card.label }}
          </p>

          <p class="text-[28px] lg:text-[32px] font-bold text-(--color-text-primary) leading-none font-display tracking-tight group-hover:text-primary transition-colors mb-2 tabular-nums">
            {{ Number(card.value).toLocaleString("id-ID") }}
          </p>

          <span class="inline-block text-[9px] font-bold border px-2 py-0.5 rounded-full uppercase tracking-wider text-primary bg-primary-light border-primary/20 font-sans">
            {{ card.sub }}
          </span>
        </div>

        <!-- Rotated Featured Icon Box -->
        <div class="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-xs rotate-6 transition-all duration-300 group-hover:rotate-0 group-hover:scale-105">
          <component :is="card.icon" class="size-5.5 -rotate-6 group-hover:rotate-0 transition-transform duration-300" />
        </div>
      </div>
    </div>
  </div>
</template>
