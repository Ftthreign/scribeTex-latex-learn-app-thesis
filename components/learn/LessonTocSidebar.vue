<script setup lang="ts">
import { ref } from "vue";
import { IconListDetails } from "@tabler/icons-vue";

export interface TocEntry {
  id: string;
  text: string;
  level: number;
  isActive: boolean;
}

defineProps<{
  tocEntries: TocEntry[];
  activeHeadingId: string;
  readProgress: number;
  progressBarClass: string;
  progressTextClass: string;
}>();

const emit = defineEmits<{
  (e: "select-heading", id: string): void;
}>();

const isTocOpen = ref(false);

const handleSelect = (id: string) => {
  emit("select-heading", id);
  isTocOpen.value = false;
};
</script>

<template>
  <!-- Desktop Sticky Floating ToC Sidebar -->
  <aside
    v-if="tocEntries.length > 0"
    class="hidden xl:block w-64 shrink-0 sticky top-24 self-start font-body"
  >
    <div
      class="bg-[var(--color-surface)]/95 backdrop-blur-md border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4 space-y-3.5 max-h-[calc(100vh-7rem)] overflow-y-auto shadow-md"
    >
      <!-- Header ToC -->
      <div class="flex items-center gap-2 pb-3 border-b border-[var(--color-border)]">
        <IconListDetails class="size-4 text-[var(--color-primary)] shrink-0" />
        <p
          class="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest font-display"
        >
          Isi Materi
        </p>
      </div>

      <!-- Progress mini bar di ToC -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-medium text-[var(--color-text-muted)]"
            >Progres Baca</span
          >
          <span
            :class="[
              'text-[10px] font-bold tabular-nums transition-colors',
              progressTextClass,
            ]"
          >
            {{ readProgress }}%
          </span>
        </div>
        <div
          class="h-1 bg-[var(--color-surface-alt)] rounded-full overflow-hidden border border-[var(--color-border)]/50"
        >
          <div
            :class="[
              'h-full rounded-full transition-all duration-500 ease-out',
              progressBarClass,
            ]"
            :style="{ width: readProgress + '%' }"
          />
        </div>
      </div>

      <!-- Daftar Heading -->
      <nav class="space-y-0.5 pt-1">
        <button
          v-for="entry in tocEntries"
          :key="entry.id"
          @click="handleSelect(entry.id)"
          :class="[
            'w-full text-left leading-snug rounded-md px-2.5 py-1.5 transition-all duration-150 cursor-pointer block text-xs',
            entry.level === 1 ? 'font-semibold pl-2.5' : '',
            entry.level === 2 ? 'font-medium pl-4' : '',
            entry.level === 3 ? 'font-normal pl-6' : '',
            entry.level >= 4 ? 'font-normal pl-8' : '',
            activeHeadingId === entry.id
              ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold border-l-2 border-[var(--color-primary)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]',
          ]"
        >
          {{ entry.text }}
        </button>
      </nav>
    </div>
  </aside>

  <!-- Mobile Floating Toggle Button & Drawer -->
  <template v-if="tocEntries.length > 0">
    <button
      @click="isTocOpen = !isTocOpen"
      class="xl:hidden fixed bottom-24 right-4 z-40 w-11 h-11 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex items-center justify-center cursor-pointer hover:border-[var(--color-primary)] transition-all shadow-md"
      title="Daftar Isi Materi"
    >
      <IconListDetails class="size-5 text-[var(--color-primary)]" />
    </button>

    <!-- Mobile Bottom Drawer -->
    <Transition name="slide-up">
      <div
        v-if="isTocOpen"
        class="xl:hidden fixed bottom-36 right-4 z-40 w-64 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4 space-y-2 shadow-xl backdrop-blur-md"
      >
        <div
          class="flex items-center justify-between pb-2 border-b border-[var(--color-border)]"
        >
          <p
            class="text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-1.5 font-display"
          >
            <IconListDetails class="size-3.5 text-[var(--color-primary)]" />
            Isi Materi
          </p>
          <span
            :class="[
              'text-[10px] font-bold tabular-nums transition-colors',
              progressTextClass,
            ]"
          >
            {{ readProgress }}%
          </span>
        </div>
        <nav class="space-y-0.5 max-h-64 overflow-y-auto">
          <button
            v-for="entry in tocEntries"
            :key="entry.id"
            @click="handleSelect(entry.id)"
            :class="[
              'w-full text-left text-[11px] leading-snug rounded-md px-2 py-1.5 transition-all cursor-pointer block',
              entry.level === 1 ? 'font-semibold pl-2' : '',
              entry.level === 2 ? 'font-medium pl-4' : '',
              entry.level >= 3 ? 'font-normal pl-6' : '',
              activeHeadingId === entry.id
                ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold border-l-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]',
            ]"
          >
            {{ entry.text }}
          </button>
        </nav>
      </div>
    </Transition>
  </template>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
