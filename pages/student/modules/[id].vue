<script setup lang="ts">
import { onMounted, watch } from "vue";
import { IconArrowLeft, IconBook, IconArrowRight } from "@tabler/icons-vue";
import { useModules } from "~/composables/useModules";
import { useStudentAnimations } from "~/composables/student/useStudentAnimations";
import ModuleDetailSkeleton from "~/components/skeleton/ModuleDetailSkeleton.vue";

definePageMeta({ layout: "default" });

const route = useRoute();
const router = useRouter();
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
  <div class="max-w-4xl mx-auto px-4 py-8 space-y-8 font-body">
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
      class="p-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-sm font-semibold"
    >
      {{ error }}
    </div>

    <div v-else-if="currentModule" class="space-y-8 font-sans">
      <div
        class="gsap-module-detail-header bg-surface border border-border rounded-2xl p-6 lg:p-8 space-y-4 shadow-xs"
      >
        <div class="flex items-center gap-2">
          <span
            class="px-3 py-1 text-xs font-semibold rounded-full bg-primary-light text-primary border border-primary/20"
          >
            Modul {{ currentModule.sort_order }}
          </span>
          <span
            class="text-xs text-text-muted flex items-center gap-1 font-medium"
          >
            <IconBook class="size-3.5 text-primary" />
            {{ currentModule.lessons?.length || 0 }} Bab Materi
          </span>
        </div>

        <h1
          class="text-2xl lg:text-3xl font-bold text-text-primary font-display tracking-tight"
        >
          {{ currentModule.title }}
        </h1>
        <p class="text-xs lg:text-sm text-text-muted leading-relaxed">
          {{ currentModule.description }}
        </p>
      </div>

      <div class="space-y-4">
        <h3
          class="text-base font-bold text-text-primary tracking-tight font-display"
        >
          Daftar Bab Pembelajaran
        </h3>

        <div class="space-y-3">
          <NuxtLink
            v-for="(lesson, idx) in currentModule.lessons"
            :key="lesson.id"
            :to="`/student/modules/lesson/${lesson.id}`"
            class="gsap-lesson-item group border border-border rounded-xl bg-surface p-4 lg:p-5 hover:border-primary/50 hover:shadow-md transition-all duration-300 cursor-pointer flex items-center justify-between shadow-xs hover:-translate-y-0.5"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-9 h-9 rounded-lg bg-primary-light text-primary font-bold text-sm flex items-center justify-center shrink-0"
              >
                {{ idx + 1 }}
              </div>

              <div>
                <h4
                  class="text-sm font-bold text-text-primary group-hover:text-primary transition-colors font-display"
                >
                  {{ lesson.title }}
                </h4>
                <p class="text-xs text-text-muted mt-0.5 font-medium">
                  Bab {{ lesson.sort_order }} dari Modul
                  {{ currentModule.sort_order }}
                </p>
              </div>
            </div>

            <span
              class="text-xs font-semibold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Buka Materi</span>
              <IconArrowRight class="size-4" />
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
