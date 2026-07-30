<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useStudentDashboard } from "~/composables/useStudentDashboard";
import { useAiChat } from "~/composables/useAiChat";
import { IconMessages } from "@tabler/icons-vue";
import { useStudentAnimations } from "~/composables/student/useStudentAnimations";
import DashboardSkeleton from "~/components/skeleton/DashboardSkeleton.vue";
import AiChatDrawer from "~/components/sandbox/AiChatDrawer.vue";

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

const { animateDashboardEntrance } = useStudentAnimations();

const isAiChatOpen = ref(false);
const {
  messages: aiMessages,
  savedHistory: aiSavedHistory,
  loading: aiLoading,
  historyLoading: aiHistoryLoading,
  sendMessage: sendAiMessage,
  fetchHistory: fetchAiHistory,
  loadHistoryIntoChat: loadAiHistoryIntoChat,
  selectHistoryItem: selectAiHistoryItem,
  clearChat: clearAiChat,
} = useAiChat();

const router = useRouter();
const handleViewAllModules = () => router.push("/student/modules");
const handleReadArticles = () => router.push("/student/panduan");
const handleSelectArticle = (id: number) =>
  router.push(`/student/panduan/${id}`);
const handleSelectAssignment = (item: any) => {
  if (item.exercise_id) {
    router.push(`/student/exercises/${item.exercise_id}`);
  } else if (item.lesson_id) {
    router.push(`/student/modules/lesson/${item.lesson_id}`);
  }
};
const handleOpenChat = () => {
  isAiChatOpen.value = true;
};

watch(
  isLoading,
  (loading) => {
    if (!loading) {
      animateDashboardEntrance();
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (!isLoading.value) {
    animateDashboardEntrance();
  }
});
</script>

<template>
  <div class="w-full space-y-8 font-body">
    <!-- ═══ SKELETON LOADING STATE ═══ -->
    <DashboardSkeleton v-if="isLoading" />

    <!-- ═══ ACTUAL DASHBOARD CONTENT WITH GSAP TARGETS ═══ -->
    <div v-else class="w-full space-y-8">
      <div class="gsap-header">
        <DashboardStudentHeader :name="studentName" />
      </div>

      <div class="gsap-stat-card">
        <DashboardStudentStats :stats="stats" />
      </div>

      <!-- <DashboardStudentAnalyticsCharts :analytics="analytics" /> -->

      <div class="flex flex-col lg:flex-row gap-8">
        <div class="flex-1 min-w-0 space-y-8">
          <div class="gsap-learning-card">
            <DashboardStudentContinueLearning
              v-if="activeModule"
              :activeModule="activeModule"
              @resume="resumeModule"
              @view-all="handleViewAllModules"
            />

            <div
              v-else
              class="border border-border rounded-xl bg-surface p-6 flex flex-col items-center justify-center gap-4 text-center min-h-40 shadow-xs font-sans"
            >
              <p class="text-sm font-semibold text-text-primary font-display">
                Mulai Belajar LaTeX!
              </p>
              <p class="text-xs text-text-muted">
                Anda belum memulai modul apapun. Klik tombol di bawah untuk
                memulai perjalanan belajar.
              </p>
              <button
                @click="handleViewAllModules"
                class="btn-primary btn-md cursor-pointer font-bold"
              >
                Lihat Katalog Modul
              </button>
            </div>
          </div>

          <div class="gsap-assignment-section">
            <DashboardStudentAssignments
              :assignments="assignments"
              @select="handleSelectAssignment"
            />
          </div>
        </div>

        <div class="gsap-article-section w-full lg:w-80 shrink-0">
          <DashboardStudentRecentArticles
            :articles="articles"
            @view-all="handleReadArticles"
            @click-article="handleSelectArticle"
          />
        </div>
      </div>
    </div>

    <button
      @click="handleOpenChat"
      class="fixed bottom-8 right-8 w-14 h-14 bg-primary hover:bg-primary-hover text-white flex items-center justify-center rounded-(--radius-xl) shadow-lg hover:shadow-xl transition-all z-40 cursor-pointer"
      title="Tanya AI Assistant"
    >
      <IconMessages class="size-6" />
    </button>

    <AiChatDrawer
      :isOpen="isAiChatOpen"
      :messages="aiMessages"
      :savedHistory="aiSavedHistory"
      :loading="aiLoading"
      :historyLoading="aiHistoryLoading"
      @close="isAiChatOpen = false"
      @send="sendAiMessage"
      @fetchHistory="fetchAiHistory"
      @clear="clearAiChat"
      @loadHistory="loadAiHistoryIntoChat"
      @selectHistory="selectAiHistoryItem"
    />
  </div>
</template>
