<script setup lang="ts">
import { ref, watch } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

import {
  IconFileText,
  IconUpload,
  IconX,
  IconTrash,
  IconAlertCircle,
  IconChevronLeft,
  IconChevronRight,
  IconZoomIn,
  IconZoomOut,
} from '@tabler/icons-vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const referencePdfUrl = ref<string | null>(null)
const fileName = ref<string | null>(null)
const fileSizeFormatted = ref<string | null>(null)
const uploadError = ref<string | null>(null)

// Navigasi & Zoom State
const page = ref<number>(1)
const pageCount = ref<number>(1)
const scale = ref<number>(1.2)

const triggerFileInput = () => {
  uploadError.value = null
  fileInputRef.value?.click()
}

const handleLoaded = (pdf: any) => {
  pageCount.value = pdf._pdfInfo?.numPages || pdf.numPages || 1
  page.value = 1
}

const prevPage = () => {
  if (page.value > 1) page.value--
}

const nextPage = () => {
  if (page.value < pageCount.value) page.value++
}

const zoomIn = () => {
  if (scale.value < 2.8) scale.value = Number((scale.value + 0.2).toFixed(1))
}

const zoomOut = () => {
  if (scale.value > 0.6) scale.value = Number((scale.value - 0.2).toFixed(1))
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  uploadError.value = null

  if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
    uploadError.value = 'Berkas tidak valid! Hanya berkas bertipe PDF yang diperbolehkan.'
    if (fileInputRef.value) fileInputRef.value.value = ''
    return
  }

  const maxSizeBytes = 3 * 1024 * 1024 // 3MB
  if (file.size > maxSizeBytes) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2)
    uploadError.value = `Ukuran berkas terlalu besar (${sizeInMb} MB). Maksimal ukuran berkas referensi adalah 3 MB.`
    if (fileInputRef.value) fileInputRef.value.value = ''
    return
  }

  if (referencePdfUrl.value) {
    URL.revokeObjectURL(referencePdfUrl.value)
  }

  referencePdfUrl.value = URL.createObjectURL(file)
  fileName.value = file.name
  fileSizeFormatted.value = `${(file.size / (1024 * 1024)).toFixed(2)} MB`
  page.value = 1
}

const handleRemoveFile = () => {
  if (referencePdfUrl.value) {
    URL.revokeObjectURL(referencePdfUrl.value)
  }
  referencePdfUrl.value = null
  fileName.value = null
  fileSizeFormatted.value = null
  uploadError.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        @click.self="emit('close')"
      >
        <div
          class="bg-(--color-surface) border border-border rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-border bg-(--color-surface-alt) shrink-0 flex-wrap gap-2 z-10">
            <div class="flex items-center gap-3">
              <span class="p-2 rounded-xl bg-primary/10 text-primary">
                <IconFileText class="size-5" />
              </span>
              <div>
                <h3 class="text-sm font-bold text-(--color-text-primary)">
                  Artikel Referensi (PDF)
                </h3>
                <p class="text-[11px] text-(--color-text-muted)">
                  {{ fileName ? `${fileName} (${fileSizeFormatted})` : 'Unggah berkas PDF referensi artikel (Maks. 3 MB)' }}
                </p>
              </div>
            </div>

            <!-- Actions Header -->
            <div class="flex items-center gap-2">
              <!-- Controls jika PDF sudah terunggah -->
              <template v-if="referencePdfUrl">
                <div class="flex items-center gap-1 bg-(--color-surface) rounded-lg border border-border px-2 py-1 text-xs">
                  <button
                    @click="prevPage"
                    :disabled="page <= 1"
                    class="p-0.5 hover:bg-(--color-surface-alt) disabled:opacity-30 rounded text-(--color-text-primary) transition-colors cursor-pointer"
                  >
                    <IconChevronLeft class="size-3.5" />
                  </button>

                  <span class="text-[11px] font-mono text-(--color-text-secondary) px-1">
                    {{ page }} / {{ pageCount }}
                  </span>

                  <button
                    @click="nextPage"
                    :disabled="page >= pageCount"
                    class="p-0.5 hover:bg-(--color-surface-alt) disabled:opacity-30 rounded text-(--color-text-primary) transition-colors cursor-pointer"
                  >
                    <IconChevronRight class="size-3.5" />
                  </button>
                </div>

                <div class="flex items-center gap-1 bg-(--color-surface) rounded-lg border border-border px-1.5 py-1 text-xs">
                  <button @click="zoomOut" class="p-0.5 hover:bg-(--color-surface-alt) rounded text-(--color-text-muted) transition-colors cursor-pointer">
                    <IconZoomOut class="size-3.5" />
                  </button>
                  <span class="text-[11px] font-mono text-(--color-text-muted) w-10 text-center">
                    {{ Math.round(scale * 100) }}%
                  </span>
                  <button @click="zoomIn" class="p-0.5 hover:bg-(--color-surface-alt) rounded text-(--color-text-muted) transition-colors cursor-pointer">
                    <IconZoomIn class="size-3.5" />
                  </button>
                </div>

                <div class="h-4 w-px bg-border mx-1"></div>

                <button
                  @click="triggerFileInput"
                  class="px-3 py-1.5 border border-border hover:bg-(--color-surface) text-(--color-text-secondary) text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <IconUpload class="size-3.5" />
                  <span>Ganti Berkas</span>
                </button>

                <button
                  @click="handleRemoveFile"
                  class="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Hapus Referensi"
                >
                  <IconTrash class="size-4" />
                </button>
              </template>

              <button
                @click="emit('close')"
                class="p-1.5 text-(--color-text-muted) hover:text-(--color-text-primary) hover:bg-(--color-surface) rounded-lg transition-colors cursor-pointer"
              >
                <IconX class="size-5" />
              </button>
            </div>
          </div>

          <!-- Hidden Input File -->
          <input
            ref="fileInputRef"
            type="file"
            accept="application/pdf,.pdf"
            class="hidden"
            @change="handleFileSelect"
          />

          <!-- Modal Body Content -->
          <div class="flex-1 relative bg-slate-900/10 dark:bg-slate-950/50 p-6 overflow-auto flex flex-col items-center justify-start">
            <!-- Alert Error Validasi -->
            <div
              v-if="uploadError"
              class="w-full max-w-md p-4 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs flex items-center gap-2"
            >
              <IconAlertCircle class="size-5 shrink-0" />
              <span class="leading-relaxed">{{ uploadError }}</span>
            </div>

            <!-- Preview State: VuePdfEmbed Canvas Component -->
            <div
              v-if="referencePdfUrl"
              class="pdf-paper-wrapper py-4 px-2 flex justify-center items-start shrink-0 min-h-max"
            >
              <div class="shadow-2xl rounded-sm bg-white border border-slate-300 dark:border-slate-700">
                <VuePdfEmbed
                  :source="referencePdfUrl"
                  :page="page"
                  :scale="scale"
                  @loaded="handleLoaded"
                />
              </div>
            </div>

            <!-- Upload Area State (Jika belum ada berkas) -->
            <div
              v-else
              @click="triggerFileInput"
              class="w-full max-w-md p-8 border-2 border-dashed border-border hover:border-primary/50 bg-(--color-surface) rounded-2xl text-center space-y-4 cursor-pointer transition-all hover:shadow-md group my-auto"
            >
              <div class="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <IconUpload class="size-8" />
              </div>
              <div class="space-y-1">
                <h4 class="text-sm font-bold text-(--color-text-primary)">
                  Klik untuk Unggah Artikel Referensi
                </h4>
                <p class="text-xs text-(--color-text-muted)">
                  Hanya menerima berkas format <strong>.PDF</strong> (Maksimal ukuran <strong>3 MB</strong>)
                </p>
              </div>
              <button
                class="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-xs group-hover:bg-primary-hover transition-colors"
              >
                Pilih Berkas PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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
