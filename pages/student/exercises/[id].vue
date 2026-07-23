<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import {
  IconArrowLeft,
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconSparkles,
  IconLock,
} from "@tabler/icons-vue";
import { useExercise } from "~/composables/useExercise";
import { useAiChat } from "~/composables/useAiChat";
import ExerciseSplitView from "~/components/learn/ExerciseSplitView.vue";
import AiChatDrawer from "~/components/sandbox/AiChatDrawer.vue";

definePageMeta({ layout: "default" });

const route = useRoute();
const router = useRouter();

const {
  currentExercise,
  userCode,
  isDirty,
  loading,
  submitting,
  compiling,
  pdfBase64,
  compileError,
  compileLogs,
  error,
  fetchExerciseById,
  updateCode,
  resetCode,
  compileCode,
  submitSolution,
} = useExercise();

// ─── AI Chat State (Inkremen 5) ─────────────────────────────────────────────
const {
  isOpen: isAiOpen,
  messages: aiMessages,
  savedHistory: aiSavedHistory,
  loading: aiLoading,
  historyLoading: aiHistoryLoading,
  toggleDrawer: toggleAiDrawer,
  fetchHistory: fetchAiHistory,
  loadHistoryIntoChat: loadAiHistoryIntoChat,
  loadSingleHistoryItem: loadSingleAiHistoryItem,
  sendMessage: sendAiMessage,
  clearChat: clearAiChat,
} = useAiChat();

const pageTitle = computed(() => {
  return currentExercise.value
    ? `Latihan: ${currentExercise.value.lesson_title} | ScribeTex`
    : "Latihan Kode Interaktif | ScribeTex";
});

useHead({ title: pageTitle });

const showSuccessToast = ref(false);

const loadExerciseData = async (id: number) => {
  if (!isNaN(id) && id > 0) {
    await fetchExerciseById(id);
  }
};

onMounted(async () => {
  const id = Number(route.params.id);
  await loadExerciseData(id);
});

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await loadExerciseData(Number(newId));
    }
  },
);

const handleSubmit = async () => {
  const result = await submitSolution(true);
  if (result) {
    showSuccessToast.value = true;
    setTimeout(() => {
      showSuccessToast.value = false;
    }, 4000);
  }
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8 space-y-6 relative">
    <!-- Header Bar & Tombol Kembali ke Materi -->
    <div class="flex items-center justify-between gap-4">
      <button
        @click="
          currentExercise
            ? router.push(
                `/student/modules/lesson/${currentExercise.lesson_id}`,
              )
            : router.push('/student/exercises')
        "
        class="flex items-center gap-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
      >
        <IconArrowLeft class="size-4" />
        <span>{{
          currentExercise
            ? "Kembali ke Naskah Materi"
            : "Kembali ke Katalog Latihan"
        }}</span>
      </button>
    </div>

    <!-- Toast Notification Sukses Submisi -->
    <Transition name="fade">
      <div
        v-if="showSuccessToast"
        class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-semibold flex items-center justify-between gap-3 shadow-xs"
      >
        <div class="flex items-center gap-2">
          <IconCheck class="size-5 text-emerald-600 shrink-0" />
          <span>Jawaban latihan berhasil tersimpan ke sistem database!</span>
        </div>
        <button
          @click="showSuccessToast = false"
          class="text-emerald-700 hover:text-emerald-900 cursor-pointer"
        >
          <IconX class="size-4" />
        </button>
      </div>
    </Transition>

    <!-- State Loading -->
    <div v-if="loading" class="space-y-6">
      <div class="h-28 bg-border/40 rounded-xl animate-pulse"></div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="h-96 bg-border/40 rounded-xl animate-pulse"></div>
        <div class="h-96 bg-border/40 rounded-xl animate-pulse"></div>
      </div>
    </div>

    <!-- State Error / Akses Terkunci (403 Forbidden) -->
    <div
      v-else-if="error"
      class="max-w-xl mx-auto my-12 p-8 bg-(--color-surface) rounded-2xl border border-border shadow-modal text-center space-y-4"
    >
      <div class="size-16 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
        <IconLock class="size-8" />
      </div>
      <div class="space-y-1.5">
        <h3 class="text-xl font-bold text-(--color-text-primary) font-display tracking-tight">Latihan Masih Terkunci</h3>
        <p class="text-sm text-(--color-text-secondary) leading-relaxed">
          {{ error }}
        </p>
      </div>
      <div class="pt-2">
        <button
          @click="router.push('/student/modules')"
          class="btn-primary btn-md gap-2 rounded-xl cursor-pointer"
        >
          <IconArrowLeft class="size-4" />
          <span>Kembali ke Daftar Modul</span>
        </button>
      </div>
    </div>

    <!-- Split View Practice Workspace -->
    <ExerciseSplitView
      v-else-if="currentExercise"
      :exercise="currentExercise"
      :modelValue="userCode"
      :isDirty="isDirty"
      :submitting="submitting"
      :compiling="compiling"
      :pdfBase64="pdfBase64"
      :compileError="compileError"
      :compileLogs="compileLogs"
      @update:modelValue="updateCode"
      @reset="resetCode"
      @compile="compileCode"
      @submit="handleSubmit"
      @askAiError="handleAskAiError"
    />

    <!-- Fallback jika data kosong tanpa error -->
    <div
      v-else
      class="p-8 rounded-xl bg-surface border border-border text-center space-y-3"
    >
      <p class="text-sm font-semibold text-text-primary">
        Latihan #{{ route.params.id }} tidak ditemukan
      </p>
      <p class="text-xs text-text-muted">
        Data latihan belum ada di database atau belum dipublikasikan.
      </p>
      <NuxtLink
        to="/student/exercises"
        class="inline-block px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg"
      >
        Lihat Semua Latihan
      </NuxtLink>
    </div>

    <!-- Floating Action Button (FAB) Pembimbing AI di Pojok Kanan Bawah Halaman Latihan -->
    <div class="fixed bottom-6 right-6 z-40">
      <button
        @click="toggleAiDrawer(true)"
        class="btn-primary btn-md gap-2 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 border border-white/20 transition-all cursor-pointer font-bold"
        title="Buka Chatbot Pembimbing Cerdas AI"
      >
        <IconSparkles class="size-5 animate-pulse" />
        <span>Pembimbing AI</span>
      </button>
    </div>

    <!-- Drawer Chatbot AI (Inkremen 5) -->
    <ClientOnly>
      <AiChatDrawer
        :isOpen="isAiOpen"
        :messages="aiMessages"
        :savedHistory="aiSavedHistory"
        :loading="aiLoading"
        :historyLoading="aiHistoryLoading"
        :codeContext="userCode"
        @close="toggleAiDrawer(false)"
        @send="sendAiMessage"
        @clear="clearAiChat"
        @fetchHistory="fetchAiHistory"
        @loadHistory="loadAiHistoryIntoChat"
        @selectHistory="loadSingleAiHistoryItem"
      />
    </ClientOnly>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
