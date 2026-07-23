<script setup lang="ts">
import {
  IconUsers,
  IconBooks,
  IconBrain,
  IconChartBar,
  IconChartLine,
  IconActivity,
  IconRefresh,
  IconTrendingUp,
  IconCircleCheck,
  IconFileText,
  IconCode,
  IconAlertCircle,
} from "@tabler/icons-vue";

definePageMeta({ layout: "admin", middleware: ["role-admin"] });
useHead({ title: "Monitoring Dashboard | ScribeTex Admin" });

// ─── Fetch Stats & Analytics ─────────────────────────────────────────────────
const { data: statsRes, refresh: refreshStats, pending: statsPending } = await useFetch<any>("/api/admin/stats");
const { data: analyticsRes, refresh: refreshAnalytics, pending: analyticsPending } = await useFetch<any>("/api/admin/analytics/daily");

const stats = computed(() => statsRes.value?.data || null);
const analytics = computed(() => analyticsRes.value?.data || null);

function refreshAll() {
  refreshStats();
  refreshAnalytics();
}

// ─── Metric Card Config ────────────────────────────────────────────────────
const metricCards = computed(() => [
  {
    label: "Total Mahasiswa",
    value: stats.value?.users?.students ?? "—",
    sub: `${stats.value?.users?.admins ?? 0} Admin`,
    icon: IconUsers,
    bgLight: "bg-primary/10",
    textColor: "text-primary",
  },
  {
    label: "Total Materi Aktif",
    value: stats.value?.content?.lessons ?? "—",
    sub: `${stats.value?.content?.modules ?? 0} Modul`,
    icon: IconBooks,
    bgLight: "bg-[var(--color-success-light)]",
    textColor: "text-[var(--color-success)]",
  },
  {
    label: "Konsultasi AI",
    value: stats.value?.activity?.ai_chats ?? "—",
    sub: "Total Percakapan",
    icon: IconBrain,
    bgLight: "bg-[var(--color-ai-light)]",
    textColor: "text-[var(--color-ai-primary)]",
  },
  {
    label: "Kompilasi PDF",
    value: stats.value?.activity?.compilations ?? "—",
    sub: "Total Eksekusi Docker",
    icon: IconChartBar,
    bgLight: "bg-[var(--color-warning-light)]",
    textColor: "text-[var(--color-warning)]",
  },
]);

// ─── ApexCharts Setup ─────────────────────────────────────────────────────
const isClient = ref(false);
onMounted(() => {
  isClient.value = true;
});

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
    categories: analytics.value?.labels || [],
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
    fontSize: "13px",
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
    data: analytics.value?.series?.compilations || [],
  },
  {
    name: "Konsultasi AI",
    data: analytics.value?.series?.ai_chats || [],
  },
  {
    name: "Progress Update",
    data: analytics.value?.series?.progress_updates || [],
  },
]);
</script>

<template>
  <div class="max-w-7xl mx-auto w-full pb-12 space-y-8 px-1">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-(--color-text-primary) font-display tracking-tight">
          Monitoring Dashboard
        </h1>
        <p class="text-sm text-(--color-text-muted) mt-0.5">
          Statistik operasional & aktivitas platform ScribeTex secara real-time.
        </p>
      </div>
      <button
        @click="refreshAll"
        :disabled="statsPending || analyticsPending"
        class="flex items-center gap-2 px-4 py-2 bg-(--color-surface) hover:bg-(--color-surface-alt) border border-border rounded-xl text-sm font-semibold text-(--color-text-primary) transition-all cursor-pointer disabled:opacity-50 shadow-xs"
      >
        <IconRefresh :class="['size-4', (statsPending || analyticsPending) && 'animate-spin']" />
        <span>Muat Ulang Data</span>
      </button>
    </div>

    <!-- Metric Cards Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="card in metricCards"
        :key="card.label"
        class="bg-(--color-surface) rounded-2xl border border-border p-5 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 group"
      >
        <div class="flex items-start justify-between mb-4">
          <div :class="['p-2.5 rounded-xl', card.bgLight]">
            <component :is="card.icon" :class="['size-5', card.textColor]" />
          </div>
          <IconTrendingUp class="size-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div>
          <div class="text-2xl font-bold text-(--color-text-primary) font-mono tracking-tight">
            <span v-if="statsPending" class="block h-7 w-12 bg-(--color-surface-alt) animate-pulse rounded-lg"></span>
            <span v-else>{{ card.value.toLocaleString("id-ID") }}</span>
          </div>
          <div class="text-xs font-semibold text-(--color-text-primary) mt-1">{{ card.label }}</div>
          <div class="text-[11px] text-(--color-text-muted) mt-0.5">{{ card.sub }}</div>
        </div>
      </div>
    </div>

    <!-- Activity Chart -->
    <div class="bg-(--color-surface) rounded-2xl border border-border shadow-xs p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="font-bold text-(--color-text-primary) flex items-center gap-2">
            <IconChartLine class="size-5 text-primary" />
            <span>Tren Aktivitas Harian (7 Hari Terakhir)</span>
          </h2>
          <p class="text-xs text-(--color-text-muted) mt-0.5">
            Kompilasi PDF, konsultasi AI, dan pembaruan progres per hari.
          </p>
        </div>
      </div>

      <!-- Chart Skeleton / Real Chart -->
      <div v-if="analyticsPending" class="h-56 bg-(--color-surface-alt) animate-pulse rounded-xl"></div>
      <ClientOnly v-else>
        <apexchart
          type="area"
          height="220"
          :options="chartOptions"
          :series="chartSeries"
        />
      </ClientOnly>
    </div>

    <!-- Progress Overview + Content Summary -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Overall Progress Bar -->
      <div class="lg:col-span-1 bg-(--color-surface) rounded-2xl border border-border shadow-xs p-6 space-y-4">
        <div class="flex items-center gap-2">
          <IconActivity class="size-5 text-emerald-600" />
          <h3 class="font-bold text-(--color-text-primary) text-sm">Progres Belajar Platform</h3>
        </div>

        <div v-if="statsPending" class="space-y-3">
          <div v-for="i in 3" :key="i" class="h-8 bg-(--color-surface-alt) animate-pulse rounded-lg"></div>
        </div>

        <div v-else class="space-y-4">
          <div>
            <div class="flex justify-between text-xs font-medium text-(--color-text-secondary) mb-1.5">
              <span>Rata-rata Penyelesaian Materi</span>
              <span class="font-bold text-(--color-text-primary)">{{ stats?.activity?.progress_percentage ?? 0 }}%</span>
            </div>
            <div class="w-full h-2.5 bg-(--color-surface-alt) rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-700"
                :style="{ width: `${stats?.activity?.progress_percentage ?? 0}%` }"
              ></div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 pt-2 border-t border-border">
            <div class="text-center p-3 bg-(--color-surface-alt) rounded-xl">
              <div class="text-lg font-bold text-emerald-600 font-mono">{{ stats?.activity?.completed_progress ?? 0 }}</div>
              <div class="text-[11px] text-(--color-text-muted) font-medium mt-0.5">Lesson Selesai</div>
            </div>
            <div class="text-center p-3 bg-(--color-surface-alt) rounded-xl">
              <div class="text-lg font-bold text-(--color-text-primary) font-mono">{{ stats?.activity?.progress_records ?? 0 }}</div>
              <div class="text-[11px] text-(--color-text-muted) font-medium mt-0.5">Total Record</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Summary Cards -->
      <div class="lg:col-span-2 bg-(--color-surface) rounded-2xl border border-border shadow-xs p-6">
        <div class="flex items-center gap-2 mb-5">
          <IconFileText class="size-5 text-indigo-600" />
          <h3 class="font-bold text-(--color-text-primary) text-sm">Ringkasan Konten Platform</h3>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <template v-if="statsPending">
            <div v-for="i in 4" :key="i" class="h-20 bg-(--color-surface-alt) animate-pulse rounded-xl"></div>
          </template>
          <template v-else>
            <div class="p-4 rounded-xl bg-blue-50 border border-blue-100 text-center space-y-1">
              <div class="text-2xl font-bold text-blue-600 font-mono">{{ stats?.content?.modules ?? 0 }}</div>
              <div class="text-[11px] font-semibold text-blue-700">Modul</div>
            </div>
            <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center space-y-1">
              <div class="text-2xl font-bold text-emerald-600 font-mono">{{ stats?.content?.lessons ?? 0 }}</div>
              <div class="text-[11px] font-semibold text-emerald-700">Materi Lesson</div>
            </div>
            <div class="p-4 rounded-xl bg-amber-50 border border-amber-100 text-center space-y-1">
              <div class="text-2xl font-bold text-amber-600 font-mono">{{ stats?.content?.exercises ?? 0 }}</div>
              <div class="text-[11px] font-semibold text-amber-700">Latihan Praktik</div>
            </div>
            <div class="p-4 rounded-xl bg-purple-50 border border-purple-100 text-center space-y-1">
              <div class="text-2xl font-bold text-purple-600 font-mono">{{ stats?.content?.articles ?? 0 }}</div>
              <div class="text-[11px] font-semibold text-purple-700">Artikel Regulasi</div>
            </div>
          </template>
        </div>

        <!-- Quick Actions -->
        <div class="mt-5 pt-4 border-t border-border">
          <p class="text-[11px] text-(--color-text-muted) font-semibold uppercase tracking-wider mb-3">Aksi Cepat Admin</p>
          <div class="flex flex-wrap gap-2">
            <NuxtLink
              to="/admin/content"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              <IconCode class="size-3.5" />
              <span>Kelola Konten</span>
            </NuxtLink>
            <NuxtLink
              to="/admin/profile"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-(--color-surface-alt) hover:bg-(--color-border) text-(--color-text-secondary) border border-border rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              <IconUsers class="size-3.5" />
              <span>Lihat Pengguna</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
