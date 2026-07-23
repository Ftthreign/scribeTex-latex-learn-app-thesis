<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import {
  IconArrowLeft,
  IconCheck,
  IconX,
  IconAlertTriangle,
} from "@tabler/icons-vue";
import { useExercise } from "~/composables/useExercise";
import ExerciseSplitView from "~/components/learn/ExerciseSplitView.vue";

definePageMeta({ layout: "default" });

const route = useRoute();
const router = useRouter();

const {
  currentExercise,
  userCode,
  isDirty,
  loading,
  submitting,
  error,
  fetchExerciseById,
  updateCode,
  resetCode,
  submitSolution,
} = useExercise();

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
  <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
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

    <!-- State Error -->
    <div
      v-else-if="error"
      class="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm flex items-center gap-3"
    >
      <IconAlertTriangle class="size-5 shrink-0 text-red-600" />
      <div>
        <p class="font-bold">Gagal memuat latihan #{{ route.params.id }}</p>
        <p class="text-xs mt-0.5 opacity-90">{{ error }}</p>
      </div>
    </div>

    <!-- Split View Practice Workspace -->
    <ExerciseSplitView
      v-else-if="currentExercise"
      :exercise="currentExercise"
      :modelValue="userCode"
      :isDirty="isDirty"
      :submitting="submitting"
      @update:modelValue="updateCode"
      @reset="resetCode"
      @submit="handleSubmit"
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
