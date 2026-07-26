<script setup lang="ts">
import { watch, onMounted } from "vue";
import { useAdminAnimations } from "~/composables/admin/useAdminAnimations";
import AdminDashboardSkeleton from "~/components/skeleton/AdminDashboardSkeleton.vue";
import AdminDashboardHeader from "~/components/dashboard/admin/AdminDashboardHeader.vue";
import AdminMetricCards from "~/components/dashboard/admin/AdminMetricCards.vue";
import AdminActivityChart from "~/components/dashboard/admin/AdminActivityChart.vue";
import AdminPlatformOverview from "~/components/dashboard/admin/AdminPlatformOverview.vue";

definePageMeta({ layout: "admin", middleware: ["role-admin"] });
useHead({ title: "Monitoring Dashboard | ScribeTex Admin" });

const { animateAdminDashboardEntrance } = useAdminAnimations();

const {
  data: statsRes,
  refresh: refreshStats,
  pending: statsPending,
} = await useFetch<any>("/api/admin/stats");
const {
  data: analyticsRes,
  refresh: refreshAnalytics,
  pending: analyticsPending,
} = await useFetch<any>("/api/admin/analytics/daily");

const stats = computed(() => statsRes.value?.data || null);
const analytics = computed(() => analyticsRes.value?.data || null);
const isPending = computed(() => statsPending.value || analyticsPending.value);

function refreshAll() {
  refreshStats();
  refreshAnalytics();
}

watch(
  isPending,
  (pending) => {
    if (!pending) {
      animateAdminDashboardEntrance();
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (!isPending.value) {
    animateAdminDashboardEntrance();
  }
});
</script>

<template>
  <div class="max-w-7xl mx-auto w-full pb-12 space-y-8 px-1 font-body">
    <AdminDashboardSkeleton v-if="isPending" />
    <div v-else class="w-full space-y-8">
      <div class="gsap-admin-header">
        <AdminDashboardHeader :pending="isPending" @refresh="refreshAll" />
      </div>
      <AdminMetricCards :stats="stats" />
      <AdminActivityChart :analytics="analytics" />
      <AdminPlatformOverview :stats="stats" />
    </div>
  </div>
</template>
