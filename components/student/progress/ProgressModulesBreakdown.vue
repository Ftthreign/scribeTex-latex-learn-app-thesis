<script setup lang="ts">
import { IconBook, IconChevronRight, IconCheck } from '@tabler/icons-vue'

interface ModuleItem {
  id: number;
  title: string;
  sort_order?: number;
  order?: number;
  total_lessons?: number;
  lessons_count?: number;
  completed_lessons?: number;
  progress_percent?: number;
  exercises_count?: number;
  userProgress?: {
    is_completed: boolean;
    completed_lessons: number;
    completed_exercises: number;
    progress_percent: number;
  };
}

defineProps<{
  modules?: ModuleItem[];
}>()
</script>

<template>
  <div class="space-y-4 font-body">
    <div class="flex items-center justify-between border-b border-border pb-3">
      <div class="space-y-0.5">
        <h3 class="text-base font-bold text-(--color-text-primary) font-display tracking-tight flex items-center gap-2">
          <IconBook class="size-4 text-primary" />
          <span>Rincian Progres Per Modul Kurikulum</span>
        </h3>
        <p class="text-xs text-(--color-text-muted) font-sans">
          Daftar kelulusan 8 Modul Pembelajaran LaTeX ScribeTex secara rinci.
        </p>
      </div>
      <span class="text-xs font-semibold text-(--color-text-secondary) font-sans">
        {{ (modules || []).length }} Total Modul
      </span>
    </div>

    <!-- Grid List Modul Breakdown -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="mod in (modules || [])"
        :key="mod.id"
        class="border border-border rounded-(--radius-lg) bg-(--color-surface) p-5 hover:-translate-y-0.5 hover:border-border-strong transition-all duration-200 relative overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-sm group"
      >
        <div class="space-y-2">
          <div class="flex items-center justify-between gap-2">
            <span class="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-primary-light text-primary border border-primary/20 font-sans">
              Modul #{{ mod.sort_order || mod.order || mod.id }}
            </span>

            <span
              :class="[
                'px-2.5 py-0.5 text-[10px] font-bold rounded-full border font-sans flex items-center gap-1',
                ((mod.progress_percent || mod.userProgress?.progress_percent || 0) >= 100)
                  ? 'bg-primary-light text-primary border-primary/30 font-bold'
                  : ((mod.progress_percent || mod.userProgress?.progress_percent || 0) > 0)
                  ? 'bg-primary-light text-primary border-primary/20'
                  : 'bg-surface-alt text-text-secondary border-border'
              ]"
            >
              <IconCheck v-if="(mod.progress_percent || mod.userProgress?.progress_percent || 0) >= 100" class="size-3" />
              <span>
                {{
                  (mod.progress_percent || mod.userProgress?.progress_percent || 0) >= 100
                    ? 'Selesai'
                    : (mod.progress_percent || mod.userProgress?.progress_percent || 0) > 0
                    ? `${mod.progress_percent || mod.userProgress?.progress_percent}% Selesai`
                    : 'Belum Dimulai'
                }}
              </span>
            </span>
          </div>

          <h4 class="text-base font-bold text-(--color-text-primary) font-display line-clamp-1 group-hover:text-primary transition-colors">
            {{ mod.title }}
          </h4>
        </div>

        <!-- Progress Bar & Detail Stats -->
        <div class="space-y-2 pt-3 font-sans">
          <div class="flex items-center justify-between text-[12px] text-(--color-text-muted) font-medium">
            <span>{{ mod.completed_lessons || mod.userProgress?.completed_lessons || 0 }}/{{ mod.total_lessons || mod.lessons_count || 3 }} Materi Tuntas</span>
            <span class="font-bold text-primary tabular-nums">
              {{ mod.progress_percent || mod.userProgress?.progress_percent || 0 }}%
            </span>
          </div>

          <div class="h-2 w-full bg-surface-alt rounded-full overflow-hidden border border-border/50">
            <div
              class="h-full bg-primary rounded-full transition-all duration-500"
              :style="{ width: (mod.progress_percent || mod.userProgress?.progress_percent || 0) + '%' }"
            />
          </div>

          <div class="pt-2 flex items-center justify-between">
            <span class="text-[11px] text-(--color-text-secondary)">
              Latihan: {{ mod.userProgress?.completed_exercises || 0 }}/{{ mod.exercises_count || 2 }} Selesai
            </span>

            <NuxtLink
              :to="`/student/modules/${mod.id}`"
              class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer font-sans"
            >
              <span>Buka Modul</span>
              <IconChevronRight class="size-3.5" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
