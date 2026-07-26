<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { IconTrophy } from "@tabler/icons-vue";
import { useModules } from "~/composables/useModules";
import ModuleCard from "~/components/learn/ModuleCard.vue";
import { useStudentAnimations } from "~/composables/student/useStudentAnimations";
import ModulesIndexSkeleton from "~/components/skeleton/ModulesIndexSkeleton.vue";

definePageMeta({ layout: "default" });
useHead({ title: "Kurikulum Pembelajaran LaTeX | ScribeTex" });

const { modules, loading, error, fetchModules } = useModules();
const { animateModulesIndexEntrance } = useStudentAnimations();

onMounted(async () => {
  await fetchModules();
});

watch(
  loading,
  (isLoading) => {
    if (!isLoading) {
      animateModulesIndexEntrance();
    }
  },
  { immediate: true },
);

// Kalkulasi statistik progres kurikulum keseluruhan
const overallStats = computed(() => {
  let totalLessons = 0;
  let completedLessons = 0;
  let completedModules = 0;

  (modules.value || []).forEach((m) => {
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
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-8 font-body">
    <!-- ═══ SKELETON LOADING STATE ═══ -->
    <ModulesIndexSkeleton v-if="loading" />

    <div v-else class="space-y-8">
      <div
        class="gsap-modules-header flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div class="space-y-2">
          <h1
            class="text-2xl lg:text-3xl font-bold text-(--color-text-primary) font-display tracking-tight"
          >
            Kurikulum Pembelajaran <span class="text-primary">LaTeX</span>
          </h1>
          <p
            class="text-xs lg:text-sm text-(--color-text-muted) max-w-2xl leading-relaxed"
          >
            Silabus terstruktur 8 Modul Pembelajaran LaTeX dari tingkat dasar
            hingga lanjut yang dirancang khusus untuk mempermudah penyusunan
            naskah skripsi karya ilmiah Universitas Lampung.
          </p>
        </div>

        <!-- Ringkasan Progres Keseluruhan -->
        <div
          v-if="modules.length > 0"
          class="bg-(--color-surface) border border-border rounded-(--radius-lg) p-4 shrink-0 min-w-[18rem] space-y-2 shadow-xs"
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
            class="h-2 w-full bg-surface-alt rounded-full overflow-hidden border border-border/50"
          >
            <div
              :class="[
                'h-full rounded-full transition-all duration-500 ease-out',
                overallStats.overallPercent >= 100
                  ? 'bg-success'
                  : 'bg-primary',
              ]"
              :style="{ width: overallStats.overallPercent + '%' }"
            />
          </div>

          <div
            class="flex items-center justify-between text-[11px] text-(--color-text-muted) font-medium"
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

      <!-- State Error -->
      <div
        v-if="error"
        class="p-6 rounded-(--radius-lg) bg-error-light border border-(--color-error)/30 text-(--color-error) text-sm font-semibold"
      >
        {{ error }}
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="mod in modules" :key="mod.id" class="gsap-module-card">
          <ModuleCard :module="mod" />
        </div>
      </div>
    </div>
  </div>
</template>
