<script setup lang="ts">
import { computed } from "vue";
import { IconBook, IconArrowRight, IconLock } from "@tabler/icons-vue";
import type { ModuleData } from "~/composables/useModules";

const props = defineProps<{
  module: ModuleData;
}>();

const isLocked = computed(() => props.module.is_locked ?? false);
const completed = computed(() => props.module.completed_lessons || 0);
const total = computed(() => props.module.total_lessons || 0);
const progressPercent = computed(() => props.module.progress_percent || 0);

const statusBadge = computed(() => {
  if (isLocked.value) {
    return {
      label: "Terkunci",
      class:
        "bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] border-[var(--color-border)]",
    };
  }
  if (progressPercent.value >= 100) {
    return {
      label: "Selesai",
      class:
        "bg-[var(--color-primary-light)] text-[var(--color-primary)] border-[var(--color-primary)]/30 font-bold",
    };
  }
  if (progressPercent.value > 0) {
    return {
      label: `${progressPercent.value}% Selesai`,
      class:
        "bg-[var(--color-primary-light)] text-[var(--color-primary)] border-[var(--color-primary)]/20",
    };
  }
  return {
    label: "Belum Dimulai",
    class:
      "bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] border-[var(--color-border)]",
  };
});
</script>

<template>
  <div
    :class="[
      'group border border-[var(--color-border)] rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-6 transition-all duration-300 flex flex-col justify-between relative font-body shadow-xs',
      isLocked
        ? 'opacity-75 bg-[var(--color-surface-alt)]/50 cursor-not-allowed border-[var(--color-border)]/80'
        : 'hover:border-[var(--color-primary)]/50 hover:shadow-md cursor-pointer hover:-translate-y-1',
    ]"
  >
    <div class="space-y-4">
      <!-- Top Row: Badge Modul & Status Progres -->
      <div class="flex items-center justify-between">
        <span
          :class="[
            'px-3 py-1 text-xs font-semibold rounded-full border',
            isLocked
              ? 'bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] border-[var(--color-border)]'
              : 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border-[var(--color-primary)]/20',
          ]"
        >
          Modul {{ module.sort_order }}
        </span>
        <span
          :class="[
            'px-2.5 py-0.5 text-[11px] font-bold rounded-full border font-sans',
            statusBadge.class,
          ]"
        >
          {{ statusBadge.label }}
        </span>
      </div>

      <!-- Title & Description -->
      <div>
        <h3
          :class="[
            'text-lg font-bold transition-colors line-clamp-1 font-display tracking-tight',
            isLocked
              ? 'text-[var(--color-text-muted)]'
              : 'text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]',
          ]"
        >
          {{ module.title }}
        </h3>
        <p
          class="text-xs text-[var(--color-text-muted)] mt-2 line-clamp-2 leading-relaxed"
        >
          {{ module.description }}
        </p>
      </div>
    </div>

    <!-- Progress Track Section -->
    <div class="pt-4 mt-4 border-t border-[var(--color-border)]/60 space-y-2.5">
      <div class="flex items-center justify-between text-xs">
        <span
          class="flex items-center gap-1.5 text-[var(--color-text-muted)] font-medium"
        >
          <IconBook class="size-3.5 text-[var(--color-primary)]" />
          {{ completed }}/{{ total }} Bab Selesai
        </span>
        <span class="font-bold text-[var(--color-text-primary)] tabular-nums">
          {{ progressPercent }}%
        </span>
      </div>

      <!-- Progress Bar Track -->
      <div
        class="h-1.5 w-full bg-[var(--color-surface-alt)] rounded-full overflow-hidden border border-[var(--color-border)]/50"
      >
        <div
          :class="[
            'h-full rounded-full transition-all duration-500 ease-out',
            progressPercent >= 100
              ? 'bg-[var(--color-success)]'
              : 'bg-[var(--color-primary)]',
          ]"
          :style="{ width: progressPercent + '%' }"
        />
      </div>

      <!-- Action Footer -->
      <div class="pt-1 flex items-center justify-between">
        <NuxtLink
          v-if="!isLocked"
          :to="`/student/modules/${module.id}`"
          class="text-xs font-semibold text-[var(--color-primary)] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          <span>{{
            progressPercent > 0
              ? progressPercent >= 100
                ? "Review Modul"
                : "Lanjutkan Belajar"
              : "Pelajari Modul"
          }}</span>
          <IconArrowRight class="size-3.5" />
        </NuxtLink>

        <span
          v-else
          class="text-xs font-medium text-[var(--color-text-muted)] flex items-center gap-1.5"
          title="Selesaikan modul sebelumnya terlebih dahulu untuk membuka"
        >
          <IconLock class="size-3.5" />
          <span>Selesaikan Modul {{ module.sort_order - 1 }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
