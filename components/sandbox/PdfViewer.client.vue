<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
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
const pdfWidth = computed(() => Math.round(containerWidth.value * zoomFactor.value));

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
</script>

<template>
  <div
    class="h-full flex flex-col bg-(--color-surface) border border-border rounded-xl overflow-hidden shadow-xs"
  >
    <!-- Header Controls Bar -->
    <div
      class="flex items-center justify-between px-4 py-2.5 bg-(--color-surface-alt) border-b border-border text-xs shrink-0 flex-wrap gap-2 z-20"
    >
      <!-- Title & Status -->
      <div
        class="flex items-center gap-2 font-bold text-(--color-text-primary)"
      >
        <span>Pratinjau Dokumen PDF</span>
      </div>

      <!-- PDF Controls (Navigasi Halaman & Zoom) -->
      <div class="flex items-center gap-2" v-if="pdfUrl && !compiling">
        <!-- Navigasi Halaman -->
        <div
          class="flex items-center gap-1 bg-(--color-surface) rounded-lg border border-border px-2 py-1"
        >
          <button
            @click="prevPage"
            :disabled="page <= 1"
            class="p-0.5 hover:bg-(--color-surface-alt) disabled:opacity-30 rounded text-(--color-text-primary) transition-colors cursor-pointer"
            title="Halaman Sebelumnya"
          >
            <IconChevronLeft class="size-3.5" />
          </button>

          <span
            class="text-[11px] font-mono text-(--color-text-secondary) px-1"
          >
            {{ page }} / {{ pageCount }}
          </span>

          <button
            @click="nextPage"
            :disabled="page >= pageCount"
            class="p-0.5 hover:bg-(--color-surface-alt) disabled:opacity-30 rounded text-(--color-text-primary) transition-colors cursor-pointer"
            title="Halaman Selanjutnya"
          >
            <IconChevronRight class="size-3.5" />
          </button>
        </div>

        <div class="h-4 w-px bg-border mx-0.5"></div>

        <!-- Zoom Controls -->
        <div
          class="flex items-center gap-1 bg-(--color-surface) rounded-lg border border-border px-1.5 py-1"
        >
          <button
            @click="zoomOut"
            class="p-0.5 hover:bg-(--color-surface-alt) rounded text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors cursor-pointer"
            title="Perkecil"
          >
            <IconZoomOut class="size-3.5" />
          </button>

          <button
            @click="resetZoom"
            class="text-[11px] font-mono text-(--color-text-muted) hover:text-primary w-12 text-center cursor-pointer"
            title="Reset Zoom ke 100%"
          >
            {{ Math.round(zoomFactor * 100) }}%
          </button>

          <button
            @click="zoomIn"
            class="p-0.5 hover:bg-(--color-surface-alt) rounded text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors cursor-pointer"
            title="Perbesar"
          >
            <IconZoomIn class="size-3.5" />
          </button>
        </div>

        <div class="h-4 w-px bg-border mx-0.5"></div>

        <!-- Unduh PDF -->
        <button
          @click="emit('download')"
          class="px-3 py-1 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <IconDownload class="size-3.5" />
          <span>Unduh PDF</span>
        </button>
      </div>
    </div>

    <!-- Canvas Scrollable Container viewport -->
    <div
      ref="containerRef"
      class="flex-1 w-full h-full min-h-0 bg-slate-900/10 dark:bg-slate-950/50 p-4 overflow-auto flex flex-col items-start justify-start relative"
    >
      <!-- Real-Time Docker Compilation Loading State Overlay -->
      <div
        v-if="compiling"
        class="absolute inset-0 bg-(--color-surface)/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 z-30 space-y-5"
      >
        <div class="relative flex items-center justify-center">
          <div
            class="size-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin"
          ></div>
          <IconCpu class="size-6 text-primary absolute animate-pulse" />
        </div>

        <div
          class="max-w-md w-full bg-(--color-surface) border border-border rounded-2xl p-5 shadow-lg space-y-3 text-left"
        >
          <div
            class="flex items-center justify-between border-b border-border pb-2"
          >
            <span
              class="text-xs font-bold text-(--color-text-primary) flex items-center gap-2"
            >
              <IconCpu class="size-4 text-primary" />
              <span>Proses Kompilasi Docker TeXLive</span>
            </span>
            <span
              class="text-[11px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full"
            >
              Tahap {{ compileStep || 1 }} / 5
            </span>
          </div>

          <!-- Progress Message -->
          <p
            class="text-xs font-semibold text-(--color-text-primary) animate-pulse flex items-center gap-2"
          >
            <span class="size-2 rounded-full bg-primary animate-ping"></span>
            <span>{{
              compileStepMessage || "Menyiapkan mesin kompilasi..."
            }}</span>
          </p>

          <!-- Step Indicators Bar -->
          <div class="grid grid-cols-5 gap-1.5 pt-1">
            <div
              v-for="s in 5"
              :key="s"
              :class="[
                'h-1.5 rounded-full transition-all duration-300',
                (compileStep || 1) >= s
                  ? 'bg-primary'
                  : 'bg-slate-200 dark:bg-slate-800',
              ]"
            ></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="max-w-md p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-center space-y-3 my-auto"
      >
        <IconAlertTriangle class="size-10 text-red-500 mx-auto" />
        <h4 class="text-sm font-bold text-red-600">Gagal Mengompilasi PDF</h4>
        <p class="text-xs text-(--color-text-muted) leading-relaxed font-mono">
          {{ error }}
        </p>
      </div>

      <!-- VuePdfEmbed Canvas Component: lebar mengikuti container, zoom = multiplier -->
      <div
        v-else-if="pdfUrl"
        class="w-full flex flex-col items-center"
      >
        <div
          class="shadow-2xl rounded-sm bg-white border border-slate-300 dark:border-slate-700"
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
        class="text-center py-20 text-(--color-text-muted) space-y-3 my-auto"
      >
        <p class="text-xs max-w-xs mx-auto leading-relaxed">
          Tuliskan sintaks \LaTeX{} pada editor lalu tekan tombol
          <strong>Compile PDF</strong> untuk menghasilkan pratinjau dokumen.
        </p>
      </div>
    </div>
  </div>
</template>

<style>
/* PDF canvas mengisi lebar wrapper */
.vue-pdf-embed canvas {
  display: block !important;
  width: 100% !important;
  height: auto !important;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.3);
}
</style>
