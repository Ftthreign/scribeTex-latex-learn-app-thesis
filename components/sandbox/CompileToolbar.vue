<script setup lang="ts">
import { IconDownload, IconBug, IconFileText } from "@tabler/icons-vue";

const props = defineProps<{
  compiling: boolean;
  hasPdf: boolean;
  hasError: boolean;
  activeTab: "preview" | "logs";
}>();

const emit = defineEmits<{
  (e: "compile"): void;
  (e: "download"): void;
  (e: "openReference"): void;
  (e: "update:activeTab", tab: "preview" | "logs"): void;
}>();
</script>

<template>
  <div class="flex items-center gap-3 flex-wrap">
    <!-- Tombol Referensi PDF -->
    <button
      @click="emit('openReference')"
      class="px-3.5 py-2 border border-border hover:bg-(--color-surface-alt) text-primary text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 bg-(--color-surface) shadow-xs"
      title="Unggah / Lihat Artikel Referensi PDF"
    >
      <IconFileText class="size-4" />
      <span>Artikel Referensi</span>
    </button>

    <!-- Toggle Tab Switcher (Preview vs Error Logs) -->
    <div
      class="flex items-center bg-(--color-surface-alt) rounded-lg border border-border p-0.5 text-xs"
    >
      <button
        @click="emit('update:activeTab', 'preview')"
        :class="[
          'px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer',
          activeTab === 'preview'
            ? 'bg-(--color-surface) text-primary shadow-xs'
            : 'text-(--color-text-muted) hover:text-(--color-text-primary)',
        ]"
      >
        Pratinjau PDF
      </button>
      <button
        @click="emit('update:activeTab', 'logs')"
        :class="[
          'px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1',
          activeTab === 'logs'
            ? 'bg-(--color-surface) text-red-500 font-bold shadow-xs'
            : 'text-(--color-text-muted) hover:text-(--color-text-primary)',
        ]"
      >
        <IconBug class="size-3.5" />
        <span>Log Galat</span>
      </button>
    </div>

    <!-- Tombol Compile PDF Utama -->
    <button
      @click="emit('compile')"
      :disabled="compiling"
      class="px-4 py-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-xs cursor-pointer"
    >
      <div
        v-if="compiling"
        class="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"
      ></div>
      <span>{{ compiling ? "Mengompilasi..." : "Compile PDF" }}</span>
    </button>

    <!-- Tombol Unduh PDF -->
    <button
      v-if="hasPdf"
      @click="emit('download')"
      class="px-3.5 py-2 border border-border hover:bg-(--color-surface-alt) text-(--color-text-secondary) text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
      title="Unduh Berkas PDF"
    >
      <IconDownload class="size-3.5" />
      <span>Unduh PDF</span>
    </button>
  </div>
</template>
