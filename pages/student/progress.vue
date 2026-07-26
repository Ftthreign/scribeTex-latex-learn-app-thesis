<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useStudentDashboard } from "~/composables/useStudentDashboard";
import { useModules } from "~/composables/useModules";
import ProgressHeader from "~/components/student/progress/ProgressHeader.vue";
import ProgressStatsGrid from "~/components/student/progress/ProgressStatsGrid.vue";
import ProgressActiveModuleCard from "~/components/student/progress/ProgressActiveModuleCard.vue";
import ProgressModulesBreakdown from "~/components/student/progress/ProgressModulesBreakdown.vue";

definePageMeta({ layout: "default" });
useHead({ title: "Progress Belajar | ScribeTex" });

const {
  activeModule,
  isLoading: dashboardLoading,
  fetchDashboardData,
} = useStudentDashboard();
const { modules, loading: modulesLoading, fetchModules } = useModules();

const isLoading = computed(
  () => dashboardLoading.value || modulesLoading.value,
);

const overallStats = computed(() => {
  let totalLessons = 0;
  let completedLessons = 0;
  let completedModules = 0;
  let completedExercises = 0;
  let totalExercises = 0;

  const modList = modules && modules.value ? modules.value : [];
  modList.forEach((m: any) => {
    totalLessons += m.total_lessons || 0;
    completedLessons += m.completed_lessons || 0;
    if ((m.progress_percent || 0) >= 100 && m.total_lessons > 0) {
      completedModules += 1;
    }
    if (m.userProgress) {
      completedExercises += m.userProgress.completed_exercises || 0;
    }
    totalExercises += m.exercises_count || 2;
  });

  const overallPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return {
    totalLessons,
    completedLessons,
    completedModules,
    completedExercises,
    totalExercises,
    overallPercent,
  };
});

onMounted(async () => {
  await Promise.all([fetchModules(), fetchDashboardData()]);
});
</script>

<template>
  <div class="w-full space-y-6 relative font-body">
    <ProgressHeader :overallPercent="overallStats?.overallPercent || 0" />

    <div v-if="isLoading" class="space-y-6 animate-pulse">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-28 rounded-xl bg-border/40"></div>
      </div>
      <div class="h-44 rounded-xl bg-border/40"></div>
      <div class="h-64 rounded-xl bg-border/40"></div>
    </div>

    <div v-else class="space-y-8">
      <ProgressStatsGrid
        :completedModules="overallStats?.completedModules || 0"
        :totalModules="modules && modules.length ? modules.length : 8"
        :completedLessons="overallStats?.completedLessons || 0"
        :totalLessons="overallStats?.totalLessons || 24"
        :completedExercises="overallStats?.completedExercises || 0"
        :totalExercises="overallStats?.totalExercises || 16"
        :overallPercent="overallStats?.overallPercent || 0"
      />

      <ProgressActiveModuleCard :activeModule="activeModule" />

      <ProgressModulesBreakdown :modules="modules || []" />
    </div>
  </div>
</template>
