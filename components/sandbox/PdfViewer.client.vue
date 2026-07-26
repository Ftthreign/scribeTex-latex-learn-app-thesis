<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import VuePdfEmbed from "vue-pdf-embed";
import "vue-pdf-embed/dist/styles/annotationLayer.css";
import "vue-pdf-embed/dist/styles/textLayer.css";

import {
  IconDownload,
  IconZoomIn,
  IconZoomOut,
  IconChevronLeft,
  IconChevronRight,
  IconAlertTriangle,
  IconCpu,
} from "@tabler/icons-vue";

const props = defineProps<{
  pdfUrl: string | null;
  compiling: boolean;
  compileStep?: number;
  compileStepMessage?: string;
  error: string | null;
}>();

const emit = defineEmits<{
  (e: "download"): void;
}>();

const page = ref<number>(1);
const pageCount = ref<number>(1);
const zoomFactor = ref<number>(1.0); // 1.0 = fit container width
const containerRef = ref<HTMLElement | null>(null);
const containerWidth = ref<number>(600);
let ro: ResizeObserver | null = null;

// Derived PDF render width = container width * zoom factor
const pdfWidth = computed(() =>
  Math.round(containerWidth.value * zoomFactor.value),
);

onMounted(() => {
  if (!containerRef.value) return;
  ro = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (entry) {
      containerWidth.value = entry.contentRect.width || 600;
    }
  });
  ro.observe(containerRef.value);
});

onBeforeUnmount(() => {
  ro?.disconnect();
});

const handleLoaded = (pdf: any) => {
  pageCount.value = pdf._pdfInfo?.numPages || pdf.numPages || 1;
  page.value = 1;
};

const prevPage = () => {
  if (page.value > 1) page.value--;
};

const nextPage = () => {
  if (page.value < pageCount.value) page.value++;
};

const zoomIn = () => {
  if (zoomFactor.value < 3.0) {
    zoomFactor.value = Number((zoomFactor.value + 0.15).toFixed(2));
  }
};

const zoomOut = () => {
  if (zoomFactor.value > 0.3) {
    zoomFactor.value = Number((zoomFactor.value - 0.15).toFixed(2));
  }
};

const resetZoom = () => {
  zoomFactor.value = 1.0;
};

watch(
  () => props.pdfUrl,
  () => {
    page.value = 1;
    zoomFactor.value = 1.0;
  },
);

// Expose controls untuk pemanggil jika diperlukan
defineExpose({
  page,
  pageCount,
  zoomFactor,
  prevPage,
  nextPage,
  zoomIn,
  zoomOut,
  resetZoom,
});
</script>

<template>
  <div class="h-full w-full flex flex-col overflow-hidden font-body">
    <!-- Mini Controls Floating Bar (Navigasi Halaman & Zoom jika ada PDF) -->
    <div
      v-if="pdfUrl && !compiling"
      class="px-3 py-1.5 bg-(--color-surface) border-b border-border text-xs flex items-center justify-between gap-2 shrink-0 z-20 shadow-2xs"
    >
      <!-- Navigasi Halaman -->
      <div class="flex items-center gap-1">
        <button
          @click="prevPage"
          :disabled="page <= 1"
          class="p-1 hover:bg-(--color-surface-alt) disabled:opacity-30 rounded text-(--color-text-primary) transition-colors cursor-pointer"
          title="Halaman Sebelumnya"
        >
          <IconChevronLeft class="size-3.5" />
        </button>

        <span class="text-[11px] font-mono font-semibold text-(--color-text-secondary) px-1.5 tabular-nums">
          Halaman {{ page }} dari {{ pageCount }}
        </span>

        <button
          @click="nextPage"
          :disabled="page >= pageCount"
          class="p-1 hover:bg-(--color-surface-alt) disabled:opacity-30 rounded text-(--color-text-primary) transition-colors cursor-pointer"
          title="Halaman Selanjutnya"
        >
          <IconChevronRight class="size-3.5" />
        </button>
      </div>

      <!-- Zoom Controls -->
      <div class="flex items-center gap-1">
        <button
          @click="zoomOut"
          class="p-1 hover:bg-(--color-surface-alt) rounded text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors cursor-pointer"
          title="Perkecil Zoom"
        >
          <IconZoomOut class="size-3.5" />
        </button>

        <button
          @click="resetZoom"
          class="text-[11px] font-mono text-(--color-text-muted) hover:text-primary px-1 font-semibold cursor-pointer tabular-nums"
          title="Reset Zoom ke 100%"
        >
          {{ Math.round(zoomFactor * 100) }}%
        </button>

        <button
          @click="zoomIn"
          class="p-1 hover:bg-(--color-surface-alt) rounded text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors cursor-pointer"
          title="Perbesar Zoom"
        >
          <IconZoomIn class="size-3.5" />
        </button>
      </div>
    </div>

    <!-- Canvas Scrollable Container viewport -->
    <div
      ref="containerRef"
      class="flex-1 w-full h-full min-h-0 bg-(--color-surface-alt)/60 p-4 overflow-auto flex flex-col items-center justify-start relative"
    >
      <!-- Real-Time Docker Compilation Loading State Overlay -->
      <div
        v-if="compiling"
        class="absolute inset-0 bg-(--color-surface)/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 z-30 space-y-5"
      >
        <div class="relative flex items-center justify-center">
          <div class="size-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <IconCpu class="size-6 text-primary absolute animate-pulse" />
        </div>

        <div class="max-w-md w-full bg-(--color-surface) border border-border rounded-2xl p-5 shadow-lg space-y-3 text-left">
          <div class="flex items-center justify-between border-b border-border pb-2">
            <span class="text-xs font-bold text-(--color-text-primary) flex items-center gap-2">
              <IconCpu class="size-4 text-primary" />
              <span>Proses Kompilasi Docker TeXLive</span>
            </span>
            <span class="text-[11px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              Tahap {{ compileStep || 1 }} / 5
            </span>
          </div>

          <p class="text-xs font-semibold text-(--color-text-primary) animate-pulse flex items-center gap-2 font-sans">
            <span class="size-2 rounded-full bg-primary animate-ping"></span>
            <span>{{ compileStepMessage || "Menyiapkan mesin kompilasi..." }}</span>
          </p>

          <div class="grid grid-cols-5 gap-1.5 pt-1">
            <div
              v-for="s in 5"
              :key="s"
              :class="[
                'h-1.5 rounded-full transition-all duration-300',
                (compileStep || 1) >= s ? 'bg-primary' : 'bg-border',
              ]"
            ></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="max-w-md p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-center space-y-3 m-auto"
      >
        <IconAlertTriangle class="size-10 text-red-500 mx-auto" />
        <h4 class="text-sm font-bold text-red-600 font-display">Gagal Mengompilasi PDF</h4>
        <p class="text-xs text-(--color-text-muted) leading-relaxed font-mono">
          {{ error }}
        </p>
      </div>

      <!-- VuePdfEmbed Canvas Component -->
      <div v-else-if="pdfUrl" class="w-full flex flex-col items-center pt-2">
        <div
          class="shadow-xl rounded-sm bg-white border border-border"
          :style="{ width: pdfWidth + 'px' }"
        >
          <VuePdfEmbed
            :source="pdfUrl"
            :page="page"
            :width="pdfWidth"
            @loaded="handleLoaded"
          />
        </div>
      </div>

      <!-- Empty Initial State -->
      <div
        v-else
        class="m-auto max-w-md w-full p-8 bg-(--color-surface) border border-border rounded-2xl shadow-sm text-center space-y-4 font-body"
      >
        <div class="space-y-1.5 font-sans">
          <h4 class="text-base font-bold text-(--color-text-primary) font-display tracking-tight">
            Pratinjau Dokumen Belum Tersedia
          </h4>
          <p class="text-xs text-(--color-text-secondary) leading-relaxed max-w-xs mx-auto">
            Sunting sintaks LaTeX pada editor di sebelah kiri, lalu tekan tombol
            <strong class="text-primary font-semibold">Kompilasi PDF</strong> untuk merender pratinjau dokumen secara instan.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.vue-pdf-embed canvas {
  display: block !important;
  width: 100% !important;
  height: auto !important;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.2);
}
</style>
