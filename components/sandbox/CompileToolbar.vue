<script setup lang="ts">
import { IconDownload, IconBug, IconEye, IconPlayerPlay, IconLoader2 } from "@tabler/icons-vue";

defineProps<{
  compiling: boolean;
  hasPdf: boolean;
  hasError: boolean;
  activeTab: "preview" | "logs";
}>();

const emit = defineEmits<{
  (e: "compile"): void;
  (e: "download"): void;
  (e: "update:activeTab", tab: "preview" | "logs"): void;
}>();
</script>

<template>
  <div class="px-3 py-2 bg-(--color-surface-alt) border-b border-border flex items-center justify-between gap-2 shrink-0 font-sans">
    <!-- Left: Tab Switcher (Pratinjau PDF vs Log Error) -->
    <div class="flex items-center bg-(--color-surface) rounded-lg border border-border p-0.5 text-xs shadow-2xs">
      <button
        @click="emit('update:activeTab', 'preview')"
        :class="[
          'px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5',
          activeTab === 'preview'
            ? 'bg-primary-light text-primary font-bold shadow-2xs'
            : 'text-(--color-text-muted) hover:text-(--color-text-primary)',
        ]"
      >
        <IconEye class="size-3.5" />
        <span>Pratinjau PDF</span>
      </button>
      <button
        @click="emit('update:activeTab', 'logs')"
        :class="[
          'px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5',
          activeTab === 'logs'
            ? 'bg-red-500/10 text-red-600 font-bold shadow-2xs'
            : hasError
            ? 'text-red-500 font-semibold'
            : 'text-(--color-text-muted) hover:text-(--color-text-primary)',
        ]"
      >
        <IconBug class="size-3.5" />
        <span>Log Error</span>
        <span v-if="hasError" class="size-1.5 rounded-full bg-red-500"></span>
      </button>
    </div>

    <!-- Right: Action Buttons (Compile & Download PDF) -->
    <div class="flex items-center gap-2">
      <button
        v-if="hasPdf"
        @click="emit('download')"
        class="px-2.5 py-1 bg-(--color-surface) hover:bg-(--color-surface-alt) text-(--color-text-secondary) text-xs font-semibold rounded-md border border-border transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
        title="Unduh Berkas PDF Hasil Kompilasi"
      >
        <IconDownload class="size-3.5" />
        <span class="hidden sm:inline">Unduh PDF</span>
      </button>

      <button
        @click="emit('compile')"
        :disabled="compiling"
        class="px-3 py-1 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-xs font-bold rounded-md transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
        title="Kompilasi dokumen LaTeX"
      >
        <IconLoader2 v-if="compiling" class="size-3.5 animate-spin" />
        <IconPlayerPlay v-else class="size-3.5" />
        <span>{{ compiling ? "Proses..." : "Compile" }}</span>
      </button>
    </div>
  </div>
</template>
