<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useExercise } from "~/composables/useExercise";
import { useAiChat } from "~/composables/useAiChat";
import ExerciseSplitView from "~/components/learn/ExerciseSplitView.vue";
import AiChatDrawer from "~/components/sandbox/AiChatDrawer.vue";
import { useStudentAnimations } from "~/composables/student/useStudentAnimations";

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
  userSuccessResult,
  userSuccessHistory,
  fetchExerciseById,
  fetchSuccessResult,
  updateCode,
  resetCode,
  compileCode,
  submitSolution,
} = useExercise();

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

useHead(() => ({ title: pageTitle.value }));

const showSuccessToast = ref(false);
const { animateExerciseDetailEntrance } = useStudentAnimations();

import UiModal from "~/components/ui/Modal.vue";
import ExerciseResultModal from "~/components/learn/ExerciseResultModal.vue";
import {
  IconCheck,
  IconAlertTriangle,
  IconSparkles,
  IconArrowRight,
} from "@tabler/icons-vue";

const showConfirmModal = ref(false);
const showResetConfirmModal = ref(false);
const showResultModal = ref(false);
const showViewDetailModal = ref(false);
const submitResultData = ref<ExerciseSubmissionResult | null>(null);

const handleRequestReset = () => {
  showResetConfirmModal.value = true;
};

const handleConfirmResetCode = () => {
  resetCode();
  showResetConfirmModal.value = false;
};

const loadExerciseData = async (id: number) => {
  if (!isNaN(id) && id > 0) {
    await fetchExerciseById(id);
    await fetchSuccessResult(id);
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

watch(
  loading,
  (isLoading) => {
    if (!isLoading) {
      animateExerciseDetailEntrance();
    }
  },
  { immediate: true },
);

const handleGoBack = () => {
  if (currentExercise.value?.lesson_id) {
    router.push(`/student/modules/lesson/${currentExercise.value.lesson_id}`);
  } else {
    router.push("/student/exercises");
  }
};

// 1. Membuka Modal Konfirmasi saat tombol Submit diklik di UI
const handleSubmit = () => {
  showConfirmModal.value = true;
};

// 2. Mengeksekusi Submit sungguhan ke server setelah dikonfirmasi di Modal
const handleConfirmSubmit = async () => {
  showConfirmModal.value = false;
  if (!pdfBase64.value) {
    await compileCode();
  }
  const result = await submitSolution(true, null, pdfBase64.value);
  if (result) {
    submitResultData.value = result;
    showResultModal.value = true;
  }
};

const handleNextLesson = () => {
  showResultModal.value = false;
  if (submitResultData.value?.next_lesson_id) {
    router.push(
      `/student/modules/lesson/${submitResultData.value.next_lesson_id}`,
    );
  } else if (currentExercise.value?.lesson_id) {
    router.push(`/student/modules/lesson/${currentExercise.value.lesson_id}`);
  } else {
    router.push("/student/exercises");
  }
};

const handleAskAiForSolutionHelp = async () => {
  showResultModal.value = false;
  isAiOpen.value = true;
  const prompt = `Saya sedang mengerjakan latihan "${
    currentExercise.value?.lesson_title || "LaTeX"
  }" dengan instruksi berikut:\n"${
    currentExercise.value?.instruction || ""
  }"\n\nKode LaTeX saya saat ini:\n\`\`\`latex\n${
    userCode.value
  }\n\`\`\`\n\nJawaban saya belum sesuai dengan kode solusi. Mohon bantu berikan petunjuk bagian mana yang perlu saya perbaiki (jangan langsung memberikan jawaban utuh).`;
  await sendAiMessage(prompt);
};

const handleAskAiError = async (errorText: string) => {
  isAiOpen.value = true;
  const prompt = `Saya mengalami error kompilasi LaTeX berikut saat mengerjakan latihan "${
    currentExercise.value?.lesson_title || "LaTeX"
  }":\n\n\`\`\`text\n${errorText}\n\`\`\`\n\nKode LaTeX saya saat ini:\n\`\`\`latex\n${
    userCode.value
  }\n\`\`\`\n\nMohon bantu jelaskan penyebab error ini dan berikan petunjuk perbaikannya secara singkat.`;
  await sendAiMessage(prompt);
};
</script>

<template>
  <div class="w-full space-y-6 relative font-body">
    <div class="gsap-exercise-header">
      <LearnExerciseHeaderNav
        :hasExercise="Boolean(currentExercise)"
        :isCompleted="Boolean(userSuccessResult?.is_success)"
        @goBack="handleGoBack"
        @viewResult="showViewDetailModal = true"
      />
    </div>

    <LearnExerciseToastSuccess
      :show="showSuccessToast"
      @close="showSuccessToast = false"
    />

    <!-- State Skeleton Loading -->
    <div v-if="loading" class="space-y-6 animate-pulse">
      <!-- Instruction Skeleton -->
      <div
        class="p-6 bg-(--color-surface) border border-border rounded-(--radius-lg) space-y-3"
      >
        <div class="h-4 w-32 bg-border/50 rounded-md"></div>
        <div class="h-6 w-2/3 bg-border/60 rounded-lg"></div>
        <div class="h-4 w-full bg-border/30 rounded-md"></div>
        <div class="h-4 w-4/5 bg-border/30 rounded-md"></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          class="h-96 bg-(--color-surface) border border-border rounded-(--radius-lg) p-4 space-y-3"
        >
          <div
            class="flex justify-between items-center pb-2 border-b border-border/50"
          >
            <div class="h-4 w-36 bg-border/50 rounded-md"></div>
            <div class="h-8 w-24 bg-border/40 rounded-lg"></div>
          </div>
          <div class="space-y-2 pt-2">
            <div class="h-4 w-3/4 bg-border/40 rounded-md"></div>
            <div class="h-4 w-1/2 bg-border/30 rounded-md"></div>
            <div class="h-4 w-5/6 bg-border/40 rounded-md"></div>
            <div class="h-4 w-2/3 bg-border/30 rounded-md"></div>
          </div>
        </div>

        <div
          class="h-96 bg-(--color-surface) border border-border rounded-(--radius-lg) p-4 space-y-3"
        >
          <div
            class="flex justify-between items-center pb-2 border-b border-border/50"
          >
            <div class="h-4 w-36 bg-border/50 rounded-md"></div>
            <div class="h-8 w-28 bg-border/40 rounded-lg"></div>
          </div>
          <div
            class="h-64 bg-border/20 rounded-lg flex items-center justify-center"
          >
            <div class="h-6 w-48 bg-border/40 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- State Error / Akses Terkunci (403 Forbidden) -->
    <LearnExerciseLockedState
      v-else-if="error"
      :error="error"
      @backToModules="router.push('/student/modules')"
    />

    <!-- Split View Practice Workspace dengan GSAP Selector -->
    <div v-else-if="currentExercise" class="gsap-exercise-workspace">
      <ExerciseSplitView
        :exercise="currentExercise"
        :modelValue="userCode"
        :isDirty="isDirty"
        :submitting="submitting"
        :compiling="compiling"
        :pdfBase64="pdfBase64"
        :compileError="compileError"
        :compileLogs="compileLogs"
        :isCompleted="Boolean(userSuccessResult?.is_success)"
        @update:modelValue="updateCode"
        @reset="handleRequestReset"
        @compile="compileCode"
        @submit="handleSubmit"
        @askAiError="handleAskAiError"
        @viewResult="showViewDetailModal = true"
      />
    </div>

    <LearnExerciseNotFoundState v-else :exerciseId="String(route.params.id)" />

    <div class="gsap-exercise-fab">
      <LearnExerciseFabAi @openDrawer="toggleAiDrawer(true)" />
    </div>

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

    <UiModal
      :isOpen="showResetConfirmModal"
      title="Konfirmasi Reset Kode"
      @close="showResetConfirmModal = false"
    >
      <div class="space-y-3 font-sans">
        <p class="text-sm text-text-primary">
          Apakah Anda yakin ingin mereset kode ke Kode Starter awal?
        </p>
        <div
          class="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-600 space-y-1"
        >
          <p class="font-semibold text-text-primary">Peringatan:</p>
          <p>
            Seluruh ketikan dan modifikasi kode LaTeX Anda saat ini akan dihapus
            dan dikembalikan ke kode templat awal.
          </p>
        </div>
      </div>

      <template #footer>
        <button
          @click="showResetConfirmModal = false"
          class="btn-secondary btn-md cursor-pointer font-bold"
        >
          Batal
        </button>
        <button
          @click="handleConfirmResetCode"
          class="btn-primary btn-md gap-2 cursor-pointer font-bold bg-red-600 hover:bg-red-700 text-white border-red-600"
        >
          <span>Ya, Reset Kode</span>
        </button>
      </template>
    </UiModal>

    <!-- ═══ MODAL KONFIRMASI SUBMISSION (REUSABLE UI MODAL) ═══ -->
    <UiModal
      :isOpen="showConfirmModal"
      title="Konfirmasi Pengiriman Jawaban"
      @close="showConfirmModal = false"
    >
      <div class="space-y-3 font-sans">
        <p class="text-sm text-text-primary">
          Apakah Anda yakin ingin mengirimkan kode LaTeX ini sebagai jawaban
          akhir latihan Anda?
        </p>
        <div
          class="p-3 rounded-lg bg-surface-alt border border-border text-xs text-text-muted space-y-1"
        >
          <p class="font-semibold text-text-primary">Catatan Sistem:</p>
          <p>
            Sistem akan memverifikasi kesesuaian kode Anda dengan kode solusi.
            Jika jawaban 100% tepat, status materi bab ini akan otomatis tuntas
            dan bab berikutnya akan terbuka.
          </p>
        </div>
      </div>

      <template #footer>
        <button
          @click="showConfirmModal = false"
          class="btn-secondary btn-md cursor-pointer font-bold"
        >
          Batal
        </button>
        <button
          @click="handleConfirmSubmit"
          :disabled="submitting"
          class="btn-primary btn-md gap-2 cursor-pointer font-bold"
        >
          <IconCheck v-if="!submitting" class="size-4" />
          <span v-if="submitting">Memverifikasi...</span>
          <span v-else>Ya, Kirimkan Jawaban</span>
        </button>
      </template>
    </UiModal>

    <!-- ═══ MODAL HASIL PENILAIAN (SUCCESS / TRY AGAIN) ═══ -->
    <UiModal
      :isOpen="showResultModal"
      :title="
        submitResultData?.is_match
          ? 'Latihan Berhasil Diselesaikan!'
          : 'Jawaban Belum Sesuai Solusi'
      "
      @close="showResultModal = false"
    >
      <!-- Mode Jawaban Sukses / Match -->
      <div
        v-if="submitResultData?.is_match"
        class="space-y-4 text-center py-2 font-body"
      >
        <div
          class="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto"
        >
          <IconCheck class="size-6 stroke-[2.5]" />
        </div>
        <div class="space-y-1 font-sans">
          <h4 class="text-base font-bold text-text-primary font-display">
            Selamat! Kode Anda 100% Tepat
          </h4>
          <p class="text-xs text-text-muted leading-relaxed">
            Selamat, kode LaTeX Anda telah terverifikasi cocok dengan solusi.
            Status materi bab ini kini 100% tuntas dan materi/latihan berikutnya
            telah terbuka!
          </p>
        </div>
      </div>

      <!-- Mode Jawaban Belum Match -->
      <div v-else class="space-y-4 py-2 font-body">
        <div
          class="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto"
        >
          <IconAlertTriangle class="size-6 stroke-[2.5]" />
        </div>
        <div class="space-y-2 text-center font-sans">
          <h4 class="text-base font-bold text-text-primary font-display">
            Jawaban Belum Sesuai Solusi
          </h4>
          <p class="text-xs text-text-muted leading-relaxed">
            Kode LaTeX yang Anda kirimkan belum cocok dengan kode solusi resmi.
            Silakan periksa kembali penulisan sintaks atau gunakan bantuan AI
            ScribeTex.
          </p>
        </div>
      </div>

      <template #footer>
        <template v-if="submitResultData?.is_match">
          <button
            @click="router.push('/student/exercises')"
            class="btn-secondary btn-md cursor-pointer font-bold"
          >
            Katalog Latihan
          </button>
          <button
            @click="handleNextLesson"
            class="btn-primary btn-md gap-1.5 cursor-pointer font-bold"
          >
            <span>Lanjut Belajar</span>
            <IconArrowRight class="size-4" />
          </button>
        </template>
        <template v-else>
          <button
            @click="handleAskAiForSolutionHelp"
            class="btn-secondary btn-md gap-1.5 cursor-pointer font-bold text-primary"
          >
            <IconSparkles class="size-4" />
            <span>Tanya AI ScribeTex</span>
          </button>
          <button
            @click="showResultModal = false"
            class="btn-primary btn-md cursor-pointer font-bold"
          >
            Coba Lagi
          </button>
        </template>
      </template>
    </UiModal>

    <!-- ═══ MODAL DETAIL HASIL PENGERJAAN SAYA (PDF PREVIEW & CODE) ═══ -->
    <ExerciseResultModal
      :isOpen="showViewDetailModal"
      :exerciseTitle="currentExercise?.lesson_title"
      :submittedCode="userSuccessResult?.submitted_code"
      :pdfUrl="userSuccessResult?.pdf_url"
      :createdAt="userSuccessResult?.created_at"
      :history="userSuccessHistory"
      :nextLessonId="submitResultData?.next_lesson_id"
      @close="showViewDetailModal = false"
      @retry="showViewDetailModal = false"
      @next="handleNextLesson"
    />
  </div>
</template>
