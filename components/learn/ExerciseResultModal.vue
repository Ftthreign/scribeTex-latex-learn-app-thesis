<script setup lang="ts">
import { ref, computed, watch } from "vue";
import UiModal from "~/components/ui/Modal.vue";
import {
  IconFileText,
  IconClock,
  IconArrowRight,
  IconRefresh,
  IconExternalLink,
  IconHistory,
  IconCopy,
  IconCheck,
  IconCode,
  IconAlertTriangle,
} from "@tabler/icons-vue";
import type { ExerciseSubmissionResult } from "~/composables/useExercise";

const props = defineProps<{
  isOpen: boolean;
  exerciseTitle?: string;
  submittedCode?: string;
  pdfUrl?: string | null;
  createdAt?: string;
  nextLessonId?: number | null;
  history?: ExerciseSubmissionResult[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "retry"): void;
  (e: "next"): void;
}>();

const selectedIndex = ref(0);
const copied = ref(false);

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      selectedIndex.value = 0;
      copied.value = false;
    }
  }
);

const activeItem = computed(() => {
  if (props.history && props.history.length > 0 && props.history[selectedIndex.value]) {
    return props.history[selectedIndex.value];
  }
  return {
    submitted_code: props.submittedCode || "",
    is_success: true,
    pdf_url: props.pdfUrl,
    created_at: props.createdAt,
    error_log: null,
  };
});

function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return dateStr;
  }
}

async function copyCodeToClipboard() {
  if (!activeItem.value.submitted_code) return;
  try {
    await navigator.clipboard.writeText(activeItem.value.submitted_code);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 1500);
  } catch (e) {
    console.error("Gagal menyalin kode:", e);
  }
}
</script>

<template>
  <UiModal
    :isOpen="isOpen"
    :title="`Riwayat & Detail Pengerjaan — ${exerciseTitle || 'Latihan LaTeX'}`"
    size="5xl"
    @close="emit('close')"
  >
    <div class="space-y-4 font-body">
      <!-- Header Ringkasan Akademik Minimalis -->
      <div
        class="p-3 bg-(--color-surface-alt)/60 border border-border rounded-(--radius-md) flex items-center justify-between gap-3 text-xs"
      >
        <div class="flex items-center gap-2">
          <!-- Minimalist Status Dot -->
          <span
            :class="[
              'size-2 rounded-full shrink-0',
              activeItem.is_success ? 'bg-(--color-success)' : 'bg-(--color-warning)',
            ]"
          ></span>
          <span class="font-bold text-(--color-text-primary) font-display">
            {{ activeItem.is_success ? "Terverifikasi Sesuai Solusi" : "Percobaan Belum Sesuai" }}
          </span>
          <span class="text-(--color-text-muted)">•</span>
          <span class="text-(--color-text-secondary) font-sans">
            Percobaan #{{ history && history.length > 0 ? history.length - selectedIndex : 1 }}
          </span>
        </div>

        <div v-if="activeItem.created_at" class="text-[11px] text-(--color-text-muted) font-mono flex items-center gap-1 shrink-0">
          <IconClock class="size-3.5" />
          <span>{{ formatDate(activeItem.created_at) }}</span>
        </div>
      </div>

      <!-- Subtle History Timeline Strip (Jika Ada > 1 Pengiriman) -->
      <div v-if="history && history.length > 1" class="space-y-2 border-b border-border pb-3">
        <div class="flex items-center justify-between text-xs">
          <label class="font-bold text-(--color-text-primary) flex items-center gap-1.5 font-display">
            <IconHistory class="size-4 text-(--color-primary)" />
            <span>Pilih Riwayat Percobaan:</span>
          </label>
          <span class="text-[11px] text-(--color-text-muted) font-sans">
            {{ history.length }} total pengiriman
          </span>
        </div>

        <!-- Horizontal Timeline Strip -->
        <div class="flex gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
          <button
            v-for="(item, idx) in history"
            :key="item.id"
            @click="selectedIndex = idx"
            :class="[
              'px-3 py-1.5 rounded-md text-xs font-sans transition-all cursor-pointer shrink-0 flex items-center gap-2 border',
              selectedIndex === idx
                ? 'bg-(--color-surface) border-(--color-primary) border-l-3 border-l-(--color-primary) font-bold text-(--color-text-primary) shadow-xs'
                : 'bg-(--color-surface-alt)/40 border-border text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-surface-alt)'
            ]"
          >
            <span
              :class="[
                'size-1.5 rounded-full shrink-0',
                item.is_success ? 'bg-(--color-success)' : 'bg-(--color-warning)',
              ]"
            ></span>
            <span>Percobaan #{{ history.length - idx }}</span>
          </button>
        </div>
      </div>

      <!-- Content Split 2 Kolom Layout (Editor Kode Kiri & Preview PDF Kanan) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        <!-- Kolom Kiri: Kode LaTeX Jawaban -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <label class="font-bold text-(--color-text-primary) flex items-center gap-1.5 font-display">
              <IconCode class="size-4 text-(--color-primary)" />
              <span>Kode LaTeX Jawaban:</span>
            </label>

            <button
              @click="copyCodeToClipboard"
              class="text-[11px] text-(--color-text-secondary) hover:text-(--color-primary) transition-colors flex items-center gap-1 cursor-pointer font-sans"
              title="Salin Kode LaTeX"
            >
              <IconCheck v-if="copied" class="size-3.5 text-(--color-success)" />
              <IconCopy v-else class="size-3.5" />
              <span>{{ copied ? "Kode Tersalin!" : "Salin Kode" }}</span>
            </button>
          </div>

          <div
            class="p-4 bg-(--color-code-bg) border border-(--color-code-border) rounded-(--radius-md) font-mono text-xs text-(--color-code-text) overflow-x-auto h-[440px] whitespace-pre leading-relaxed shadow-inner"
          >
            <code>{{ activeItem.submitted_code || "% Tidak ada kode tersedia" }}</code>
          </div>
        </div>

        <!-- Kolom Kanan: Preview PDF / Error Output Container -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <label class="font-bold text-(--color-text-primary) flex items-center gap-1.5 font-display">
              <IconFileText class="size-4 text-(--color-primary)" />
              <span>Hasil Kompilasi PDF:</span>
            </label>

            <a
              v-if="activeItem.pdf_url"
              :href="activeItem.pdf_url"
              target="_blank"
              download
              class="text-[11px] font-bold text-(--color-primary) hover:underline flex items-center gap-1 cursor-pointer font-sans"
            >
              <IconExternalLink class="size-3.5" />
              <span>Buka Tab Baru</span>
            </a>
          </div>

          <!-- Mode PDF Tersedia -->
          <div v-if="activeItem.pdf_url" class="w-full h-[440px] rounded-(--radius-md) border border-border overflow-hidden bg-(--color-code-bg) shadow-xs">
            <iframe
              :src="activeItem.pdf_url"
              class="w-full h-full border-none"
              title="Preview PDF Hasil Submission"
            ></iframe>
          </div>

          <!-- Mode Error Log / PDF Belum Tersedia -->
          <div
            v-else-if="!activeItem.is_success && (activeItem as any).error_log"
            class="p-4 bg-(--color-code-bg) border border-(--color-code-border) rounded-(--radius-md) font-mono text-xs space-y-2 h-[440px] overflow-y-auto"
          >
            <div class="flex items-center gap-1.5 text-(--color-warning) font-sans text-[11px] font-semibold">
              <IconAlertTriangle class="size-3.5" />
              <span>Catatan Hasil Percobaan Ini:</span>
            </div>
            <p class="text-(--color-code-text) opacity-90 leading-relaxed font-mono whitespace-pre-wrap">
              {{ (activeItem as any).error_log }}
            </p>
          </div>

          <div
            v-else
            class="p-6 rounded-(--radius-md) border border-dashed border-border text-center text-xs text-(--color-text-muted) space-y-1 bg-(--color-surface-alt)/40 font-sans h-[440px] flex flex-col items-center justify-center"
          >
            <p class="font-semibold text-(--color-text-primary)">PDF Belum Tersedia</p>
            <p class="text-[11px]">Berkas PDF belum terunggah untuk percobaan ini.</p>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <button
        @click="emit('retry')"
        class="btn-secondary btn-sm flex items-center gap-1.5 font-sans font-semibold cursor-pointer"
      >
        <IconRefresh class="size-3.5" />
        <span>Coba Kerjakan Ulang</span>
      </button>
      <button
        @click="emit('next')"
        class="btn-primary btn-sm flex items-center gap-1.5 font-sans font-bold cursor-pointer shadow-xs"
      >
        <span>Lanjut Belajar</span>
        <IconArrowRight class="size-4" />
      </button>
    </template>
  </UiModal>
</template>
