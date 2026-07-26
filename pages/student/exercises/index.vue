<script setup lang="ts">
import { onMounted, watch } from "vue";
import {
  IconCode,
  IconArrowRight,
  IconLock,
  IconBook,
  IconAlertCircle,
} from "@tabler/icons-vue";
import { useExercise, type ExerciseDetail } from "~/composables/useExercise";
import { useStudentAnimations } from "~/composables/student/useStudentAnimations";
import ExercisesIndexSkeleton from "~/components/skeleton/ExercisesIndexSkeleton.vue";
import UiModal from "~/components/ui/Modal.vue";

definePageMeta({ layout: "default" });
useHead({ title: "Katalog Latihan Interaktif | ScribeTex" });

const router = useRouter();
const { exercisesList, loading, error, fetchExercises } = useExercise();
const { animateExercisesIndexEntrance } = useStudentAnimations();

const showLockModal = ref(false);
const lockedModalData = ref<{
  title: string;
  reason: string;
  lockReason?: "module_locked" | "lesson_not_completed";
  lessonId?: number;
} | null>(null);

onMounted(async () => {
  await fetchExercises();
});

watch(
  loading,
  (isLoading) => {
    if (!isLoading) {
      animateExercisesIndexEntrance();
    }
  },
  { immediate: true },
);

const goToExercise = (ex: ExerciseDetail) => {
  if (ex.is_locked) {
    if (ex.lock_reason === "lesson_not_completed") {
      lockedModalData.value = {
        title: ex.lesson_title,
        reason: `Materi bab "${ex.lesson_title}" belum selesai dibaca. Silakan baca dan selesaikan naskah materi bab ini terlebih dahulu untuk membuka akses latihan interaktif.`,
        lockReason: "lesson_not_completed",
        lessonId: ex.lesson_id,
      };
    } else {
      lockedModalData.value = {
        title: ex.lesson_title,
        reason: `Modul Kurikulum #${ex.module_sort_order} masih terkunci. Silakan tuntaskan seluruh materi dan latihan di modul sebelumnya terlebih dahulu.`,
        lockReason: "module_locked",
      };
    }
    showLockModal.value = true;
    return;
  }
  router.push(`/student/exercises/${ex.id}`);
};

const handleGoToLesson = () => {
  if (lockedModalData.value?.lessonId) {
    router.push(
      `/student/modules/lesson/${lockedModalData.value.lessonId}`,
    );
  } else {
    router.push("/student/modules");
  }
  showLockModal.value = false;
};
</script>

<template>
  <div class="space-y-8 font-body">
    <!-- ═══ SKELETON LOADING STATE ═══ -->
    <ExercisesIndexSkeleton v-if="loading" />

    <!-- ═══ ACTUAL CONTENT WITH GSAP ═══ -->
    <template v-else>
      <!-- Header Katalog Latihan dengan GSAP Selector -->
      <div class="gsap-exercises-header space-y-2 font-sans">
        <h1
          class="text-2xl lg:text-3xl font-bold text-text-primary font-display tracking-tight"
        >
          Katalog Latihan Interaktif <span class="text-primary">LaTeX</span>
        </h1>
        <p
          class="text-xs lg:text-sm text-text-muted max-w-2xl leading-relaxed"
        >
          Ruang praktik 16 Latihan Interaktif berbasis CodeMirror 6 dengan
          pratinjau live render KaTeX instan yang dirancang untuk menguji
          pemahaman sintaks Anda di setiap bab materi.
        </p>
      </div>

      <!-- State Error -->
      <div
        v-if="error"
        class="p-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-sm font-semibold font-sans"
      >
        <strong>Gagal memuat daftar latihan:</strong> {{ error }}
      </div>

      <!-- State Empty -->
      <div
        v-else-if="!exercisesList || exercisesList.length === 0"
        class="text-center py-16 text-text-muted space-y-3 font-sans"
      >
        <p class="text-sm font-medium">
          Belum ada latihan yang tersedia. Pastikan database sudah di-seed.
        </p>
        <code
          class="text-xs bg-surface-alt px-3 py-1 rounded-md font-mono"
          >bun run seed</code
        >
      </div>

      <!-- Grid Katalog Latihan Interaktif dengan GSAP Selector -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
        <div
          v-for="ex in exercisesList || []"
          :key="ex.id"
          @click="goToExercise(ex)"
          :class="[
            'gsap-exercise-card group border border-border rounded-xl p-6 transition-all duration-300 flex flex-col justify-between relative font-body shadow-xs',
            ex.is_locked
              ? ex.lock_reason === 'module_locked'
                ? 'opacity-75 bg-surface-alt/50 cursor-not-allowed border-border/80'
                : 'bg-surface-alt/40 border-border/80 hover:border-primary/40 cursor-pointer'
              : 'bg-surface hover:border-primary/50 hover:shadow-md cursor-pointer hover:-translate-y-1',
          ]"
        >
          <div class="space-y-4">
            <!-- Modul & Lesson Tag / Status Lock -->
            <div class="flex items-center justify-between">
              <span
                :class="[
                  'px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider',
                  ex.is_locked
                    ? 'bg-surface-alt text-text-muted border-border'
                    : 'bg-primary-light text-primary border-primary/20',
                ]"
              >
                Modul {{ ex.module_sort_order }}
              </span>

              <span
                v-if="ex.is_locked && ex.lock_reason === 'module_locked'"
                class="px-2.5 py-0.5 text-[9px] font-bold rounded-full bg-surface-alt text-text-muted border border-border uppercase tracking-wider flex items-center gap-1"
              >
                <IconLock class="size-3" />
                <span>Terkunci</span>
              </span>
              <span
                v-else-if="ex.is_locked"
                class="px-2.5 py-0.5 text-[9px] font-bold rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/30 uppercase tracking-wider flex items-center gap-1"
              >
                <IconLock class="size-3" />
                <span>Materi Belum Tuntas</span>
              </span>
              <span
                v-else
                class="flex items-center gap-1 text-xs text-text-muted font-medium"
              >
                <IconBook class="size-3.5 text-primary" />
                <span>Latihan #{{ ex.id }}</span>
              </span>
            </div>

            <!-- Lesson Title & Instruction Snippet -->
            <div>
              <h3
                :class="[
                  'text-base font-bold transition-colors line-clamp-1 font-display tracking-tight',
                  ex.is_locked
                    ? 'text-text-muted'
                    : 'text-text-primary group-hover:text-primary',
                ]"
              >
                {{ ex.lesson_title }}
              </h3>
              <p
                class="text-xs text-text-muted mt-2 line-clamp-2 leading-relaxed"
              >
                {{ ex.instruction }}
              </p>
            </div>
          </div>

          <!-- Action Footer -->
          <div
            class="pt-4 mt-4 border-t border-border/60 flex items-center justify-between"
          >
            <span
              v-if="!ex.is_locked"
              class="text-xs font-semibold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
            >
              <IconCode class="size-3.5" />
              <span>Mulai Latihan Kode</span>
              <IconArrowRight class="size-3.5" />
            </span>

            <span
              v-else-if="ex.lock_reason === 'module_locked'"
              class="text-xs font-medium text-text-muted flex items-center gap-1.5"
              title="Selesaikan modul sebelumnya terlebih dahulu untuk membuka"
            >
              <IconLock class="size-3.5" />
              <span>Selesaikan Modul Sebelum</span>
            </span>

            <span
              v-else
              class="text-xs font-semibold text-amber-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Baca Materi Dulu</span>
              <IconArrowRight class="size-3.5" />
            </span>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal Peringatan Akses Terkunci -->
    <UiModal
      :isOpen="showLockModal"
      title="Akses Latihan Terkunci"
      @close="showLockModal = false"
    >
      <div class="space-y-4 font-body">
        <div
          class="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center mx-auto"
        >
          <IconAlertCircle class="size-6 stroke-[2.5]" />
        </div>
        <div class="space-y-2 text-center font-sans">
          <h4 class="text-base font-bold text-text-primary font-display">
            {{ lockedModalData?.title }}
          </h4>
          <p class="text-xs text-text-muted leading-relaxed">
            {{ lockedModalData?.reason }}
          </p>
        </div>
      </div>

      <template #footer>
        <button
          @click="showLockModal = false"
          class="btn-secondary btn-md cursor-pointer font-bold"
        >
          Tutup
        </button>
        <button
          @click="handleGoToLesson"
          class="btn-primary btn-md gap-1.5 cursor-pointer font-bold"
        >
          <span>{{
            lockedModalData?.lockReason === "lesson_not_completed"
              ? "Buka Materi Bab Ini"
              : "Buka Katalog Modul"
          }}</span>
          <IconArrowRight class="size-4" />
        </button>
      </template>
    </UiModal>
  </div>
</template>
