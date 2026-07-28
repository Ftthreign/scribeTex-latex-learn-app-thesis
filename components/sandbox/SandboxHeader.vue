<script setup lang="ts">
import { IconArrowLeft, IconRefresh, IconFileText, IconPlayerPlay, IconLoader2 } from '@tabler/icons-vue'

defineProps<{
  compiling: boolean;
  isDirty: boolean;
}>()

const emit = defineEmits<{
  (e: 'goBack'): void;
  (e: 'reset'): void;
  (e: 'openReference'): void;
  (e: 'compile'): void;
}>()
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3 shrink-0 font-body">
    <div class="space-y-0.5">
      <div class="flex items-center gap-2">
        <button
          @click="emit('goBack')"
          class="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer font-sans"
        >
          <IconArrowLeft class="size-3.5" />
          <span>Dashboard</span>
        </button>
        <span class="text-xs text-(--color-text-muted)">/</span>
        <span class="text-xs font-bold text-(--color-text-primary) font-sans">Project Sandbox</span>
      </div>
      <h1 class="text-base sm:text-xl font-bold text-(--color-text-primary) font-display tracking-tight">
        Project Sandbox Compiler <span class="text-primary">LaTeX</span>
      </h1>
    </div>

    <!-- Header Toolbar Action Buttons -->
    <div class="flex items-center gap-2 flex-wrap font-sans">
      <!-- Reset Workspace -->
      <button
        @click="emit('reset')"
        class="btn-secondary btn-sm gap-1.5 cursor-pointer font-semibold"
        title="Kembalikan workspace ke draf awal"
      >
        <IconRefresh class="size-3.5" />
        <span class="hidden sm:inline">Reset Workspace</span>
      </button>

      <!-- Referensi PDF -->
      <button
        @click="emit('openReference')"
        class="btn-secondary btn-sm gap-1.5 cursor-pointer font-semibold"
        title="Lihat Referensi Struktur LaTeX"
      >
        <IconFileText class="size-3.5 text-primary" />
        <span class="hidden sm:inline">Referensi Dokumen</span>
      </button>

      <!-- Compile PDF Button -->
      <button
        @click="emit('compile')"
        :disabled="compiling"
        class="btn-primary btn-sm gap-1.5 shadow-xs cursor-pointer font-bold disabled:opacity-60"
        title="Kompilasi dokumen LaTeX ke berkas PDF"
      >
        <IconLoader2 v-if="compiling" class="size-3.5 animate-spin" />
        <IconPlayerPlay v-else class="size-3.5" />
        <span>{{ compiling ? 'Mengompilasi...' : 'Kompilasi PDF' }}</span>
      </button>
    </div>
  </div>
</template>
