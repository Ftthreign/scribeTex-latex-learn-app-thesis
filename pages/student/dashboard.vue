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
  isLoading,
  resumeModule,
} = useStudentDashboard();

const router = useRouter();
const handleViewAllModules = () => router.push("/student/modules");
const handleReadArticles = () => router.push("/student/panduan");
const handleSelectArticle = (id: number) => router.push(`/student/panduan/${id}`);
const handleOpenChat = () => router.push("/chat");
</script>

<template>
  <div class="max-w-275 mx-auto w-full pb-20">
    <DashboardStudentHeader :name="studentName" />
    <DashboardStudentStats :stats="stats" />

    <div class="flex flex-col lg:flex-row gap-8">
      <div class="flex-1 min-w-0 space-y-8">
        <!-- Loading skeleton -->
        <div v-if="isLoading" class="h-52 rounded-xl bg-border/40 animate-pulse"></div>

        <!-- Modul aktif dari API -->
        <DashboardStudentContinueLearning
          v-else-if="activeModule"
          :activeModule="activeModule"
          @resume="resumeModule"
          @view-all="handleViewAllModules"
        />

        <!-- Jika belum ada progress sama sekali -->
        <div
          v-else
          class="border border-border rounded-xl bg-(--color-surface) p-6 flex flex-col items-center justify-center gap-4 text-center min-h-40"
        >
          <p class="text-sm font-semibold text-(--color-text-primary)">Mulai Belajar LaTeX!</p>
          <p class="text-xs text-(--color-text-muted)">Anda belum memulai modul apapun. Klik tombol di bawah untuk memulai perjalanan belajar.</p>
          <button
            @click="handleViewAllModules"
            class="px-5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Lihat Katalog Modul
          </button>
        </div>

        <DashboardStudentAssignments :assignments="assignments" />
      </div>

      <DashboardStudentRecentArticles
        :articles="articles"
        @view-all="handleReadArticles"
        @click-article="handleSelectArticle"
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

