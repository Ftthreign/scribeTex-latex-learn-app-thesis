<script setup lang="ts">
import { useAdminDashboard } from "~/composables/useAdminDashboard";

definePageMeta({ layout: "admin", middleware: ["role-admin"] });
useHead({ title: "CMS Dashboard | ScribeTex Admin" });

const {
  searchQuery,
  currentPage,
  paginatedModules,
  totalPages,
  startItemIndex,
  endItemIndex,
  filteredModules,
  changePage,
  deleteModule,
  toggleStatus,
  stats,
  recentActivities,
  isEmailing,
  isBackingUp,
  emailWeeklyReport,
  backupDatabase,
} = useAdminDashboard();

const router = useRouter();
const handleEditModule = (id: number) =>
  router.push(`/admin/modules?edit=${id}`);

const { user, userProfile } = useAuth();

const displayName = computed(
  () =>
    userProfile.value?.name ||
    user.value?.user_metadata?.full_name ||
    user.value?.email?.split("@")[0] ||
    "Administrator",
);
</script>

<template>
  <div class="max-w-300 mx-auto w-full pb-10">
    <DashboardAdminHeader
      subtitle="Manage modules, students, and platform performance."
      @add-module="() => router.push('/admin/modules')"
    >
      <template #title>
        Welcome back, <span class="text-primary">{{ displayName }}</span>
      </template>
    </DashboardAdminHeader>

    <!-- Stats -->
    <DashboardAdminStats :stats="stats" />

    <!-- Charts -->
    <DashboardAdminCharts />

    <!-- Module Table -->
    <DashboardAdminModuleTable
      v-model:searchQuery="searchQuery"
      :modules="paginatedModules"
      :currentPage="currentPage"
      :totalPages="totalPages"
      :startItemIndex="startItemIndex"
      :endItemIndex="endItemIndex"
      :totalCount="filteredModules.length"
      @change-page="changePage"
      @edit="handleEditModule"
      @delete="deleteModule"
      @toggle-status="toggleStatus"
    />

    <!-- Bottom Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      <div class="lg:col-span-2">
        <DashboardAdminRecentActivity :activities="recentActivities" />
      </div>
      <div>
        <DashboardAdminPlatformHealth
          :isEmailing="isEmailing"
          :isBackingUp="isBackingUp"
          @email-report="emailWeeklyReport"
          @backup-db="backupDatabase"
        />
      </div>
    </div>
  </div>
</template>
