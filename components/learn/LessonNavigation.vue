<script setup lang="ts">
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-vue";

interface RelatedLesson {
  id: number;
  title: string;
}

defineProps<{
  prevLesson?: RelatedLesson | null;
  nextLesson?: RelatedLesson | null;
}>();

const emit = defineEmits<{
  (e: "navigate", lessonId: number): void;
}>();
</script>

<template>
  <div
    class="flex items-center justify-between pt-6 border-t border-border gap-4 font-body"
  >
    <!-- Tombol Prev Lesson -->
    <button
      v-if="prevLesson"
      @click="prevLesson?.id && emit('navigate', prevLesson.id)"
      class="group flex-1 min-w-0 px-4 py-3 text-xs font-semibold border border-border hover:border-primary/50 hover:bg-primary/5 text-(--color-text-primary) rounded-xl transition-all cursor-pointer flex items-center gap-2"
    >
      <IconArrowLeft class="size-4 shrink-0 text-(--color-primary)" />
      <div class="text-left min-w-0">
        <p
          class="text-[10px] text-(--color-text-muted) uppercase tracking-wider font-semibold"
        >
          Materi Sebelumnya
        </p>
        <p
          class="truncate font-bold mt-0.5 text-(--color-text-primary) font-display"
        >
          {{ prevLesson.title }}
        </p>
      </div>
    </button>
    <div v-else class="flex-1"></div>

    <!-- Tombol Next Lesson -->
    <button
      v-if="nextLesson"
      @click="nextLesson?.id && emit('navigate', nextLesson.id)"
      class="group flex-1 min-w-0 px-4 py-3 text-xs font-semibold bg-primary hover:bg-primary-hover text-white rounded-xl transition-all cursor-pointer flex items-center gap-2 justify-end"
    >
      <div class="text-right min-w-0">
        <p
          class="text-[10px] text-white/80 uppercase tracking-wider font-semibold"
        >
          Materi Berikutnya
        </p>
        <p class="truncate font-bold mt-0.5 font-display">
          {{ nextLesson.title }}
        </p>
      </div>
      <IconArrowRight class="size-4 shrink-0" />
    </button>
    <div v-else class="flex-1"></div>
  </div>
</template>
