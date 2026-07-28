<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useStudentDashboard } from "~/composables/useStudentDashboard";
import { useModules } from "~/composables/useModules";
import {
  IconLock,
  IconUsers,
  IconLayoutDashboard,
  IconShieldCheck,
  IconArrowRight,
} from "@tabler/icons-vue";
import ProgressHeader from "~/components/student/progress/ProgressHeader.vue";
import ProgressStatsGrid from "~/components/student/progress/ProgressStatsGrid.vue";
import ProgressActiveModuleCard from "~/components/student/progress/ProgressActiveModuleCard.vue";
import ProgressModulesBreakdown from "~/components/student/progress/ProgressModulesBreakdown.vue";

definePageMeta({ layout: "default" });
useHead({ title: "Progress Belajar | ScribeTex" });

const { role } = useAuth();
const router = useRouter();
const isAdmin = computed(() => role.value === "ADMIN");

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
  if (!isAdmin.value) {
    await Promise.all([fetchModules(), fetchDashboardData()]);
  }
});
</script>

<template>
  <div class="w-full space-y-6 relative font-body">
    <!-- State Khusus Admin: Tampilan Terkunci & Informasi -->
    <div
      v-if="isAdmin"
      class="max-w-2xl mx-auto my-8 p-8 bg-surface border border-border rounded-2xl shadow-xs text-center space-y-6 font-sans"
    >
      <div
        class="w-16 h-16 rounded-2xl bg-primary-light border border-primary/20 text-primary flex items-center justify-center mx-auto shadow-xs"
      >
        <IconLock class="size-8 stroke-[2.2]" />
      </div>

      <div class="space-y-2">
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/30 text-xs font-bold uppercase tracking-wider font-mono"
        >
          <IconShieldCheck class="size-3.5" />
          <span>Akses Terkunci untuk Admin</span>
        </span>
        <h2
          class="text-2xl font-bold text-text-primary font-display tracking-tight"
        >
          Halaman Progres Pribadi Mahasiswa
        </h2>
        <p class="text-xs lg:text-sm text-text-muted leading-relaxed max-w-lg mx-auto">
          Anda saat ini login sebagai <strong class="text-primary font-semibold">Administrator</strong>. Halaman ini merupakan tracker indikator individu yang dirancang khusus untuk akun mahasiswa.
        </p>
      </div>

      <div
        class="p-4 bg-surface-alt/70 border border-border rounded-xl text-left space-y-2 text-xs text-text-secondary"
      >
        <div class="font-bold text-text-primary flex items-center gap-2">
          <IconUsers class="size-4 text-primary shrink-0" />
          <span>Fitur Pengawasan Progres Siswa untuk Admin:</span>
        </div>
        <p class="leading-relaxed pl-6">
          Untuk memantau persentase ketuntasan, jumlah kompilasi Docker, riwayat pengerjaan latihan, serta aktivitas seluruh siswa, silakan akses halaman <strong>Monitoring Progres Siswa</strong> di Dashboard Admin.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          @click="router.push('/admin/users')"
          class="btn-primary btn-md gap-2 w-full sm:w-auto font-bold shadow-xs cursor-pointer flex items-center justify-center"
        >
          <IconUsers class="size-4" />
          <span>Monitoring Progres Siswa</span>
          <IconArrowRight class="size-4" />
        </button>

        <button
          @click="router.push('/admin/dashboard')"
          class="btn-secondary btn-md gap-2 w-full sm:w-auto font-bold cursor-pointer flex items-center justify-center"
        >
          <IconLayoutDashboard class="size-4 text-primary" />
          <span>Panel Admin</span>
        </button>
      </div>
    </div>

    <!-- Tampilan Normal Mahasiswa -->
    <template v-else>
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
    </template>
  </div>
</template>
