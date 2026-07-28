<script setup lang="ts">
import { IconChartLine } from "@tabler/icons-vue";

const props = defineProps<{
  analytics: any;
}>();

const chartOptions = computed(() => ({
  chart: {
    id: "daily-analytics",
    type: "area",
    toolbar: { show: false },
    background: "transparent",
    fontFamily: "DM Sans, sans-serif",
    zoom: { enabled: false },
  },
  colors: ["#1a56db", "#7c3aed", "#0f9d58"],
  stroke: { curve: "smooth", width: 2.5 },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.35,
      opacityTo: 0.05,
    },
  },
  dataLabels: { enabled: false },
  grid: {
    borderColor: "#e2e8f0",
    strokeDashArray: 4,
  },
  xaxis: {
    categories: props.analytics?.labels || [],
    labels: { style: { colors: "#8a94a6", fontSize: "12px" } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: { style: { colors: "#8a94a6", fontSize: "12px" } },
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
    fontSize: "12px",
    labels: { colors: "#4b5675" },
  },
  tooltip: {
    theme: "light",
    x: { show: true },
  },
}));

const chartSeries = computed(() => [
  {
    name: "Kompilasi PDF",
    data: props.analytics?.series?.compilations || [],
  },
  {
    name: "Konsultasi AI",
    data: props.analytics?.series?.ai_chats || [],
  },
  {
    name: "Pembaruan Progres",
    data: props.analytics?.series?.progress_updates || [],
  },
]);
</script>

<template>
  <div class="gsap-admin-chart bg-(--color-surface) rounded-2xl border border-border shadow-xs p-6 font-body">
    <div class="flex items-center justify-between mb-6">
      <div class="space-y-0.5">
        <h2 class="font-bold text-(--color-text-primary) font-display tracking-tight flex items-center gap-2 text-base">
          <IconChartLine class="size-5 text-primary" />
          <span>Tren Aktivitas Harian (7 Hari Terakhir)</span>
        </h2>
        <p class="text-xs text-(--color-text-muted) font-sans">
          Grafik pemantauan eksekusi kompilasi PDF, konsultasi AI, dan pembaruan progres mahasiswa secara harian.
        </p>
      </div>
    </div>

    <!-- Real ApexChart Component -->
    <ClientOnly>
      <apexchart
        type="area"
        height="220"
        :options="chartOptions"
        :series="chartSeries"
      />
      <template #fallback>
        <div class="h-56 bg-surface-alt animate-pulse rounded-xl flex items-center justify-center text-xs text-(--color-text-muted) font-sans">
          Memuat Grafik Tren Aktivitas...
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
