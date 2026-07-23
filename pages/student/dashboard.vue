<script setup lang="ts">
import { useStudentDashboard } from "~/composables/useStudentDashboard";
import { IconMessages } from "@tabler/icons-vue";

definePageMeta({ layout: "default" });
useHead({ title: "Dashboard | ScribeTex" });

const {
  studentName,
  stats,
  activeModule,
  assignments,
  articles,
  resumeModule,
} = useStudentDashboard();

const router = useRouter();
const handleViewAllModules = () => router.push("/modules");
const handleReadArticles = () => router.push("/articles");
const handleOpenChat = () => router.push("/chat");
</script>

<template>
  <div class="max-w-275 mx-auto w-full pb-20">
    <DashboardStudentHeader :name="studentName" />
    <DashboardStudentStats :stats="stats" />

    <div class="flex flex-col lg:flex-row gap-8">
      <div class="flex-1 min-w-0 space-y-8">
        <DashboardStudentContinueLearning
          :activeModule="activeModule"
          @resume="resumeModule"
          @view-all="handleViewAllModules"
        />
        <DashboardStudentAssignments :assignments="assignments" />
      </div>

      <DashboardStudentRecentArticles
        :articles="articles"
        @view-all="handleReadArticles"
      />
    </div>

    <button
      @click="handleOpenChat"
      class="fixed bottom-8 right-8 w-14 h-14 bg-primary hover:bg-primary-hover text-white flex items-center justify-center rounded-xl shadow-lg hover:shadow-xl transition-all z-40 cursor-pointer"
      title="Tanya AI Assistant"
    >
      <IconMessages class="size-6" />
    </button>
  </div>
</template>
