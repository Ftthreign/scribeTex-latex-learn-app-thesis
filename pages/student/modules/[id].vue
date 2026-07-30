<script setup lang="ts">
import { onMounted, watch } from "vue";
import {
  IconArrowLeft,
  IconBook,
  IconArrowRight,
  IconLock,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-vue";
import { useModules, type LessonSummary } from "~/composables/useModules";
import { useStudentAnimations } from "~/composables/student/useStudentAnimations";
import { useToast } from "~/composables/useToast";
import ModuleDetailSkeleton from "~/components/skeleton/ModuleDetailSkeleton.vue";

definePageMeta({ layout: "default" });

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { currentModule, loading, error, fetchModuleById } = useModules();
const { animateModuleDetailEntrance } = useStudentAnimations();

const loadModuleData = async (id: number) => {
  if (!isNaN(id)) {
    const mod = await fetchModuleById(id);
    if (mod) {
      useHead({ title: `${mod.title} | ScribeTex` });
    }
  }
};

const handleLockedLessonClick = (lesson: LessonSummary) => {
  toast.warning(
    `Materi "${lesson.title}" Masih Terkunci`,
    lesson.lock_reason ||
      "Selesaikan bab sebelumnya terlebih dahulu untuk membuka akses.",
  );
};

onMounted(async () => {
  await loadModuleData(Number(route.params.id));
});

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await loadModuleData(Number(newId));
    }
  },
);

watch(
  loading,
  (isLoading) => {
    if (!isLoading) {
      animateModuleDetailEntrance();
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8 space-y-8 font-body relative">
    <!-- Tombol Kembali -->
    <button
      @click="router.push('/student/modules')"
      class="flex items-center gap-2 text-xs font-semibold text-primary hover:underline cursor-pointer transition-colors"
    >
      <IconArrowLeft class="size-4" />
      <span>Kembali ke Katalog Modul</span>
    </button>

    <ModuleDetailSkeleton v-if="loading" />

    <div
      v-else-if="error"
      class="p-6 rounded-(--radius-lg) bg-error-light border border-(--color-error)/30 text-(--color-error) text-sm font-semibold flex items-center gap-3"
    >
      <IconAlertCircle class="size-5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <div v-else-if="currentModule" class="space-y-8 font-sans">
      <div
        class="gsap-module-detail-header bg-(--color-surface) border border-border rounded-(--radius-xl) p-6 lg:p-8 space-y-4 shadow-xs relative overflow-hidden"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span
              class="px-3 py-1 text-xs font-semibold rounded-full bg-primary-light text-primary border border-primary/20"
            >
              Modul {{ currentModule.sort_order }}
            </span>
            <span
              class="text-xs text-(--color-text-muted) flex items-center gap-1 font-medium"
            >
              <IconBook class="size-3.5 text-primary" />
              {{ currentModule.lessons?.length || 0 }} Bab Materi
            </span>
          </div>

          <!-- Ringkasan Progres Modul -->
          <div
            v-if="currentModule.progress_percent !== undefined"
            class="flex items-center gap-2 text-xs font-semibold"
          >
            <span class="text-(--color-text-muted)">Progres:</span>
            <span
              :class="[
                'px-2.5 py-0.5 rounded-full text-[11px] font-bold border',
                currentModule.progress_percent >= 100
                  ? 'bg-success-light text-success border-success/30'
                  : 'bg-primary-light text-primary border-primary/20',
              ]"
            >
              {{ currentModule.completed_lessons || 0 }}/{{
                currentModule.total_lessons || 0
              }}
              Bab ({{ currentModule.progress_percent }}%)
            </span>
          </div>
        </div>

        <h1
          class="text-2xl lg:text-3xl font-bold text-(--color-text-primary) font-display tracking-tight"
        >
          {{ currentModule.title }}
        </h1>
        <p class="text-xs lg:text-sm text-text-secondary leading-relaxed">
          {{ currentModule.description }}
        </p>

        <!-- Banner Jika Seluruh Modul Terkunci -->
        <div
          v-if="currentModule.is_locked"
          class="mt-4 p-3.5 rounded-md bg-warning-light border border-warning/30 flex items-center gap-2.5 text-xs text-(--color-text-primary) font-medium"
        >
          <IconLock class="size-4 shrink-0 text-warning" />
          <span>{{
            currentModule.lock_reason ||
            "Modul ini masih terkunci. Selesaikan modul sebelumnya terlebih dahulu."
          }}</span>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-bold text-(--color-text-primary) tracking-tight font-display"
          >
            Daftar Bab Pembelajaran
          </h3>
          <span class="text-xs text-(--color-text-muted) font-medium">
            Urutan pembelajaran bergradasi
          </span>
        </div>

        <div class="space-y-3">
          <template
            v-for="(lesson, idx) in currentModule.lessons"
            :key="lesson.id"
          >
            <div
              v-if="lesson.is_locked"
              @click="handleLockedLessonClick(lesson)"
              class="gsap-lesson-item group border border-border/80 rounded-(--radius-lg) bg-surface-alt/60 p-4 lg:p-5 transition-all duration-200 cursor-not-allowed flex items-center justify-between opacity-70 hover:opacity-85 hover:border-border-strong select-none shadow-2xs"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-9 h-9 rounded-md bg-surface border border-border text-(--color-text-muted) font-bold text-sm flex items-center justify-center shrink-0 relative"
                >
                  <span>{{ idx + 1 }}</span>
                  <div
                    class="absolute -top-1 -right-1 size-4 bg-(--color-text-muted) text-white rounded-full flex items-center justify-center shadow-xs"
                  >
                    <IconLock class="size-2.5" />
                  </div>
                </div>

                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <h4
                      class="text-sm font-bold text-text-muted line-clamp-1 font-display"
                    >
                      {{ lesson.title }}
                    </h4>
                    <span
                      class="px-2 py-0.5 text-[10px] font-bold rounded-md bg-surface-alt text-text-muted border border-border flex items-center gap-1 shrink-0"
                    >
                      <IconLock class="size-3" />
                      <span>Terkunci</span>
                    </span>
                  </div>
                  <p
                    class="text-[11px] text-text-muted font-medium line-clamp-1"
                  >
                    {{
                      lesson.lock_reason ||
                      "Selesaikan bab sebelumnya terlebih dahulu"
                    }}
                  </p>
                </div>
              </div>

              <div
                class="flex items-center gap-1.5 text-xs font-semibold text-(--color-text-muted) shrink-0 pl-2"
              >
                <IconLock class="size-4" />
                <span class="hidden sm:inline">Terkunci</span>
              </div>
            </div>

            <NuxtLink
              v-else-if="lesson.is_completed"
              :to="`/student/modules/lesson/${lesson.id}`"
              class="gsap-lesson-item group border border-success/30 rounded-(--radius-lg) bg-success-light/40 hover:bg-success-light p-4 lg:p-5 hover:border-success/60 hover:shadow-md transition-all duration-300 cursor-pointer flex items-center justify-between shadow-xs hover:-translate-y-0.5"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-9 h-9 rounded-md bg-success-light text-success border border-success/30 font-bold text-sm flex items-center justify-center shrink-0"
                >
                  <IconCheck class="size-5" />
                </div>

                <div>
                  <div class="flex items-center gap-2">
                    <h4
                      class="text-sm font-bold text-(--color-text-primary) group-hover:text-success transition-colors font-display"
                    >
                      {{ lesson.title }}
                    </h4>
                  </div>
                  <p class="text-xs text-text-secondary mt-0.5 font-medium">
                    Bab {{ lesson.sort_order }} dari Modul
                    {{ currentModule.sort_order }}
                  </p>
                </div>
              </div>

              <span
                class="text-xs font-semibold text-success flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0"
              >
                <span>Pelajari Ulang</span>
                <IconArrowRight class="size-4" />
              </span>
            </NuxtLink>

            <NuxtLink
              v-else
              :to="`/student/modules/lesson/${lesson.id}`"
              class="gsap-lesson-item group border-2 border-primary rounded-(--radius-lg) bg-(--color-surface) p-4 lg:p-5 hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-between shadow-xs hover:-translate-y-0.5 ring-2 ring-primary/20"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-9 h-9 rounded-md bg-primary text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs"
                >
                  {{ idx + 1 }}
                </div>

                <div>
                  <div class="flex items-center gap-2">
                    <h4
                      class="text-sm font-bold text-(--color-text-primary) group-hover:text-primary transition-colors font-display"
                    >
                      {{ lesson.title }}
                    </h4>
                  </div>
                  <p class="text-xs text-text-secondary mt-0.5 font-medium">
                    Bab {{ lesson.sort_order }} dari Modul
                    {{ currentModule.sort_order }}
                  </p>
                </div>
              </div>

              <span
                class="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0"
              >
                <span>Mulai Pelajari</span>
                <IconArrowRight class="size-4" />
              </span>
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
