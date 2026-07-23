<script setup lang="ts">
import { computed, onMounted } from "vue";
import { IconBook, IconChecklist, IconTrophy } from "@tabler/icons-vue";
import { useModules } from "~/composables/useModules";
import ModuleCard from "~/components/learn/ModuleCard.vue";

definePageMeta({ layout: "default" });
useHead({ title: "Kurikulum Pembelajaran LaTeX | ScribeTex" });

const { modules, loading, error, fetchModules } = useModules();

onMounted(async () => {
  await fetchModules();
});

// Kalkulasi statistik progres kurikulum keseluruhan
const overallStats = computed(() => {
  let totalLessons = 0;
  let completedLessons = 0;
  let completedModules = 0;

  modules.value.forEach((m) => {
    totalLessons += m.total_lessons || 0;
    completedLessons += m.completed_lessons || 0;
    if ((m.progress_percent || 0) >= 100 && m.total_lessons > 0) {
      completedModules += 1;
    }
  });

  const overallPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return {
    totalLessons,
    completedLessons,
    completedModules,
    overallPercent,
  };
});
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
    <!-- Header Halaman -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div class="space-y-2">
        <h1 class="text-2xl lg:text-3xl font-bold text-(--color-text-primary)">
          Kurikulum Pembelajaran \LaTeX{}
        </h1>
        <p
          class="text-xs lg:text-sm text-(--color-text-muted) max-w-2xl leading-relaxed"
        >
          Silabus terstruktur 8 Modul Pembelajaran \LaTeX{} dari tingkat dasar
          hingga lanjut yang dirancang khusus untuk mempermudah penyusunan
          naskah skripsi karya ilmiah Universitas Lampung.
        </p>
      </div>

      <!-- Ringkasan Progres Keseluruhan -->
      <div
        v-if="!loading && modules.length > 0"
        class="bg-(--color-surface) border border-border rounded-xl p-4 shrink-0 min-w-[18rem] space-y-2"
        style="box-shadow: var(--shadow-card)"
      >
        <div class="flex items-center justify-between text-xs font-semibold">
          <span class="text-text-secondary flex items-center gap-1.5">
            <IconTrophy class="size-4 text-primary" />
            Progres Kurikulum
          </span>
          <span class="text-primary font-bold tabular-nums">
            {{ overallStats.overallPercent }}% Tuntas
          </span>
        </div>

        <div
          class="h-2 w-full bg-surface-alt rounded-full overflow-hidden border border-border"
        >
          <div
            :class="[
              'h-full rounded-full transition-all duration-500 ease-out',
              overallStats.overallPercent >= 100 ? 'bg-success' : 'bg-primary',
            ]"
            :style="{ width: overallStats.overallPercent + '%' }"
          />
        </div>

        <div
          class="flex items-center justify-between text-[11px] text-(--color-text-muted)"
        >
          <span
            >{{ overallStats.completedLessons }}/{{
              overallStats.totalLessons
            }}
            Bab Selesai</span
          >
          <span
            >{{ overallStats.completedModules }}/{{ modules.length }} Modul
            Tuntas</span
          >
        </div>
      </div>
    </div>

    <!-- State Loading -->
    <div
      v-if="loading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="i in 6"
        :key="i"
        class="h-56 rounded-xl bg-border/40 animate-pulse"
      ></div>
    </div>

    <!-- State Error -->
    <div
      v-else-if="error"
      class="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm"
    >
      {{ error }}
    </div>

    <!-- Grid Modul Pembelajaran -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ModuleCard v-for="mod in modules" :key="mod.id" :module="mod" />
    </div>
  </div>
</template>
