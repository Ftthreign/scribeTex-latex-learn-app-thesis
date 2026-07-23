<script setup lang="ts">
import { IconBook } from "@tabler/icons-vue";

defineProps<{
  moduleTitle?: string;
  lessonTitle: string;
  readProgress: number;
  progressBarClass: string;
  progressStatusText: string;
  progressTextClass: string;
}>();
</script>

<template>
  <div>
    <!-- Top Progress Bar (fixed di paling atas layar) -->
    <div class="fixed top-0 left-0 right-0 z-50 h-0.75 bg-border">
      <div
        :class="[
          'h-full transition-all duration-500 ease-out',
          progressBarClass,
        ]"
        :style="{ width: readProgress + '%' }"
      />
    </div>

    <!-- Header Materi -->
    <div class="border-b border-border pb-6 space-y-3">
      <div class="flex items-center gap-2 text-xs font-semibold text-primary">
        <IconBook class="size-4 shrink-0" />
        <span class="truncate">{{ moduleTitle }}</span>
      </div>
      <h1
        class="text-2xl lg:text-3xl font-bold font-display text-(--color-text-primary) leading-tight"
      >
        {{ lessonTitle }}
      </h1>

      <!-- Progress Reading Badge -->
      <div class="flex items-center gap-3 flex-wrap">
        <div
          class="flex-1 min-w-24 h-1.5 bg-surface-alt rounded-full overflow-hidden max-w-xs border border-border"
        >
          <div
            :class="[
              'h-full rounded-full transition-all duration-500 ease-out',
              progressBarClass,
            ]"
            :style="{ width: readProgress + '%' }"
          />
        </div>
        <span
          :class="[
            'text-xs font-semibold tabular-nums whitespace-nowrap transition-colors shrink-0',
            progressTextClass,
          ]"
        >
          {{ progressStatusText }}
        </span>
      </div>
    </div>
  </div>
</template>
