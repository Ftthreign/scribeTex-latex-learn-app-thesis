<script setup lang="ts">
import { computed } from "vue";
import {
  IconX,
  IconFileTypePdf,
  IconCheck,
  IconAlertTriangle,
  IconLoader2,
  IconDownload,
  IconSparkles,
  IconTerminal2,
} from "@tabler/icons-vue";

const props = defineProps<{
  isOpen: boolean;
  isCompiling: boolean;
  isSuccess: boolean;
  pdfBase64?: string | null;
  errorLogs?: string | null;
  title?: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "askAiError", errorLogs: string): void;
}>();

// Formatter otomatis Data URL Base64 PDF agar mencegah duplikasi "data:application/pdf;base64,"
const formattedPdfUrl = computed(() => {
  if (!props.pdfBase64) return "";
  if (props.pdfBase64.startsWith("data:")) return props.pdfBase64;
  return `data:application/pdf;base64,${props.pdfBase64}`;
});

function handleDownloadPdf() {
  if (!formattedPdfUrl.value) return;
  const link = document.createElement("a");
  link.href = formattedPdfUrl.value;
  link.download = `dokumen-kompilasi-${Date.now()}.pdf`;
  link.click();
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-xs"
      @click.self="emit('close')"
    >
      <div
        class="bg-(--color-surface) rounded-2xl border border-border shadow-2xl w-full max-w-[92vw] h-[86vh] flex flex-col overflow-hidden transition-all duration-300"
      >
        <!-- Modal Header -->
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-alt/50 shrink-0"
        >
          <div class="flex items-center gap-3">
            <div
              class="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0"
            >
              <IconFileTypePdf class="size-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3
                  class="font-bold text-(--color-text-primary) font-display tracking-tight text-base"
                >
                  {{ title || "Hasil Kompilasi PDF" }}
                </h3>
                <!-- Status Badges -->
                <span v-if="isCompiling" class="badge-neutral animate-pulse">
                  <IconLoader2 class="size-3 animate-spin" />
                  <span>Memproses...</span>
                </span>
                <span v-else-if="isSuccess" class="badge-success">
                  <IconCheck class="size-3" />
                  <span>Berhasil</span>
                </span>
                <span v-else class="badge-error">
                  <IconAlertTriangle class="size-3" />
                  <span>Galat Kompilasi</span>
                </span>
              </div>
              <p class="text-[11px] text-(--color-text-muted)">
                Hasil eksekusi kompilasi berkas \LaTeX{} oleh mesin kompilator
                server.
              </p>
            </div>
          </div>

          <button
            @click="emit('close')"
            class="p-2 rounded-xl hover:bg-surface-alt text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors cursor-pointer"
          >
            <IconX class="size-5" />
          </button>
        </div>

        <!-- Modal Body (2-Column Split View) -->
        <div
          class="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
        >
          <!-- ─── KOLOM KIRI: LOG TERMINAL & ERROR DEBUGGER ──────────────────── -->
          <div class="flex flex-col space-y-3 h-full">
            <div class="flex items-center justify-between">
              <div
                class="flex items-center gap-1.5 text-xs font-bold text-(--color-text-primary)"
              >
                <IconTerminal2 class="size-4 text-primary" />
                <span>Log Hasil Kompilasi / Debugger</span>
              </div>

              <!-- Shortcut Tanya AI if Error -->
              <button
                v-if="!isCompiling && !isSuccess && errorLogs"
                @click="emit('askAiError', errorLogs)"
                class="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 border border-purple-200 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <IconSparkles class="size-3.5" />
                <span>Tanya AI 🤖</span>
              </button>
            </div>

            <!-- Loading State Log -->
            <div
              v-if="isCompiling"
              class="flex-1 p-6 bg-slate-950 text-slate-400 rounded-2xl border border-slate-800 font-mono text-xs flex flex-col items-center justify-center space-y-3 min-h-[56vh]"
            >
              <IconLoader2 class="size-8 text-primary animate-spin" />
              <p class="text-xs font-semibold text-slate-300">
                Menjalankan proses kompilasi dokumen PDF...
              </p>
            </div>

            <!-- Scrollable Log Box -->
            <div
              v-else
              class="flex-1 p-4 bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 font-mono text-xs overflow-y-auto min-h-[56vh] max-h-[58vh] leading-relaxed shadow-inner"
            >
              <pre
                v-if="isSuccess && !errorLogs"
                class="text-emerald-400 whitespace-pre-wrap"
              >
✅ Kompilasi LaTeX Sempurna!
[Mesin Kompilator LaTeX]
- Berkas Dokumen: main.tex
- Status: Berhasil (0 Error)
- Dokumen PDF telah berhasil dibuat.
</pre
              >
              <pre v-else class="text-red-300 whitespace-pre-wrap">{{
                errorLogs || "Tidak ada log error yang terekam."
              }}</pre>
            </div>
          </div>

          <!-- ─── KOLOM KANAN: PRATINJAU DOKUMEN PDF ────────────────────────── -->
          <div class="flex flex-col space-y-3 h-full">
            <div class="flex items-center justify-between">
              <div
                class="flex items-center gap-1.5 text-xs font-bold text-(--color-text-primary)"
              >
                <IconFileTypePdf class="size-4 text-emerald-600" />
                <span>Pratinjau Dokumen PDF</span>
              </div>

              <button
                v-if="isSuccess && pdfBase64"
                @click="handleDownloadPdf"
                class="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border border-emerald-200 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <IconDownload class="size-3.5" />
                <span>Unduh PDF</span>
              </button>
            </div>

            <!-- Loading State PDF -->
            <div
              v-if="isCompiling"
              class="flex-1 p-6 bg-surface-alt rounded-2xl border border-border flex flex-col items-center justify-center text-center space-y-3 min-h-[56vh]"
            >
              <IconLoader2 class="size-8 text-primary animate-spin" />
              <p class="text-xs font-semibold text-(--color-text-muted)">
                Menyiapkan dokumen PDF...
              </p>
            </div>

            <!-- PDF Embedded Iframe Viewer -->
            <div
              v-else-if="isSuccess && pdfBase64"
              class="flex-1 rounded-2xl border border-border bg-white shadow-xs overflow-hidden min-h-[56vh] max-h-[58vh]"
            >
              <iframe
                :src="formattedPdfUrl"
                class="w-full h-full border-none"
              ></iframe>
            </div>

            <!-- Empty / Error State for PDF Column -->
            <div
              v-else
              class="flex-1 p-8 bg-surface-alt rounded-2xl border border-border flex flex-col items-center justify-center text-center space-y-3 min-h-[56vh]"
            >
              <div
                class="size-12 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center"
              >
                <IconAlertTriangle class="size-6" />
              </div>
              <div class="max-w-xs space-y-1">
                <p class="text-sm font-bold text-(--color-text-primary)">
                  PDF Tidak Dapat Dirender
                </p>
                <p class="text-xs text-(--color-text-muted) leading-relaxed">
                  Dokumen PDF tidak dapat dibuat karena terdapat galat sintaks
                  \LaTeX{} fatal. Silakan perbaiki kesalahan pada log di sebelah
                  kiri.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div
          class="flex items-center justify-between px-6 py-3.5 border-t border-border bg-surface-alt/50 shrink-0 text-xs"
        >
          <span class="text-(--color-text-muted)">
            ScribeTex Academic Compiler Engine — TeXLive Docker
          </span>
          <button
            @click="emit('close')"
            class="btn-secondary btn-sm rounded-xl cursor-pointer"
          >
            Tutup Hasil
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
