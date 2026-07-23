<script setup lang="ts">
import { ref } from 'vue'
import { IconRefresh, IconArrowLeft, IconFileText } from '@tabler/icons-vue'
import { useCompile } from '~/composables/useCompile'
import { useProjectFiles } from '~/composables/useProjectFiles'
import CodeMirrorEditor from '~/components/learn/CodeMirrorEditor.client.vue'
import PdfViewer from '~/components/sandbox/PdfViewer.client.vue'
import CompileToolbar from '~/components/sandbox/CompileToolbar.vue'
import ErrorLogDrawer from '~/components/sandbox/ErrorLogDrawer.vue'
import ReferencePdfModal from '~/components/sandbox/ReferencePdfModal.vue'
import FileTreePanel from '~/components/sandbox/FileTreePanel.vue'

definePageMeta({ layout: 'default' })
useHead({ title: 'Project Sandbox LaTeX | ScribeTex' })

const router = useRouter()

// ─── Compile state ───────────────────────────────────────────────────────────
const {
  compiling,
  compileStep,
  compileStepMessage,
  pdfUrl,
  compileError,
  securityWarning,
  logs,
  compileLatex,
  downloadPdf,
} = useCompile()

// ─── Multi-File Workspace ─────────────────────────────────────────────────────
const {
  files,
  activeFileName,
  activeFile,
  ENTRY_FILE,
  switchFile,
  updateContent,
  addFile,
  deleteFile,
  renameFile,
  toPayload,
} = useProjectFiles()

// ─── UI State ────────────────────────────────────────────────────────────────
const isReferenceModalOpen = ref<boolean>(false)
const activeRightTab = ref<'preview' | 'logs'>('preview')
const activeMobileTab = ref<'editor' | 'preview'>('editor')

// ─── Handlers ────────────────────────────────────────────────────────────────

/** Compile semua berkas workspace ke PDF */
const handleCompile = async () => {
  const res = await compileLatex(toPayload(), ENTRY_FILE)
  if (!res || !res.isSuccess) {
    activeRightTab.value = 'logs'
  } else {
    activeRightTab.value = 'preview'
  }
}

/** Reset seluruh workspace ke default 2 berkas awal */
const handleResetWorkspace = () => {
  if (confirm('Apakah Anda yakin ingin mengembalikan workspace ke draf awal? Semua perubahan akan hilang.')) {
    location.reload()
  }
}

/** Handler add berkas baru dari FileTreePanel */
const handleAddFile = (name: string) => {
  const { error } = addFile(name)
  if (error) alert(error)
}

/** Handler delete berkas dari FileTreePanel */
const handleDeleteFile = (name: string) => {
  if (confirm(`Hapus berkas "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
    const { error } = deleteFile(name)
    if (error) alert(error)
  }
}

/** Handler rename berkas dari FileTreePanel */
const handleRenameFile = (oldName: string, newName: string) => {
  const { error } = renameFile(oldName, newName)
  if (error) alert(error)
}
</script>

<template>
  <div class="w-full h-[calc(100vh-4.5rem)] overflow-hidden flex flex-col p-4 lg:p-5 gap-3 relative">
    <!-- Header Halaman Sandbox & Navigasi -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3 shrink-0">
      <div class="space-y-0.5">
        <div class="flex items-center gap-2">
          <button
            @click="router.push('/student/dashboard')"
            class="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <IconArrowLeft class="size-3.5" />
            <span>Dashboard</span>
          </button>
          <span class="text-xs text-(--color-text-muted)">/</span>
          <span class="text-xs font-bold text-(--color-text-primary)">Project Sandbox</span>
        </div>
        <h1 class="text-xl font-bold text-(--color-text-primary)">
          Project Sandbox Compiler \LaTeX{}
        </h1>
      </div>

      <!-- Bilah Alat Kompilasi & Toolbar Utama -->
      <CompileToolbar
        :compiling="compiling"
        :hasPdf="!!pdfUrl"
        :hasError="!!compileError || !!securityWarning"
        v-model:activeTab="activeRightTab"
        @compile="handleCompile"
        @download="downloadPdf"
        @openReference="isReferenceModalOpen = true"
      />
    </div>

    <!-- Mobile Switcher Tab (hanya di layar kecil < lg) -->
    <div class="flex lg:hidden bg-(--color-surface-alt) p-1 rounded-xl border border-border shrink-0">
      <button
        @click="activeMobileTab = 'editor'"
        :class="[
          'flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer',
          activeMobileTab === 'editor'
            ? 'bg-(--color-surface) text-primary shadow-xs'
            : 'text-(--color-text-muted)',
        ]"
      >
        Editor Kode
      </button>
      <button
        @click="activeMobileTab = 'preview'"
        :class="[
          'flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer',
          activeMobileTab === 'preview'
            ? 'bg-(--color-surface) text-primary shadow-xs'
            : 'text-(--color-text-muted)',
        ]"
      >
        Pratinjau PDF
      </button>
    </div>

    <!-- Layout 3-Kolom: File Tree | Editor | PDF Preview -->
    <div class="flex gap-0 flex-1 h-full min-h-0 overflow-hidden border border-border rounded-xl shadow-xs">

      <!-- Kolom 1: File Tree Explorer (192px fixed, desktop only) -->
      <FileTreePanel
        class="hidden lg:flex"
        :files="files"
        :activeFileName="activeFileName"
        :entryFile="ENTRY_FILE"
        @switch="switchFile"
        @add="handleAddFile"
        @delete="handleDeleteFile"
        @rename="handleRenameFile"
      />

      <!-- Kolom 2: CodeMirror Editor -->
      <div
        :class="[
          'flex flex-col flex-1 h-full min-h-0 overflow-hidden border-r border-border',
          activeMobileTab === 'editor' ? 'flex' : 'hidden lg:flex',
        ]"
      >
        <!-- Editor Tab Bar (active file name) -->
        <div class="flex items-center justify-between px-3 py-2 bg-(--color-surface-alt) border-b border-border shrink-0">
          <div class="flex items-center gap-0">
            <!-- Active file tab -->
            <div class="flex items-center gap-1.5 px-3 py-1.5 bg-(--color-surface) border border-border border-b-transparent rounded-t-lg text-xs font-mono font-semibold text-(--color-text-primary) -mb-px">
              <span class="size-2 rounded-full bg-primary inline-block shrink-0"></span>
              {{ activeFileName }}
            </div>
          </div>

          <button
            @click="handleResetWorkspace"
            class="px-2.5 py-1 border border-border hover:bg-(--color-surface) text-(--color-text-muted) hover:text-(--color-text-primary) text-[11px] font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            title="Reset seluruh workspace ke draf awal"
          >
            <IconRefresh class="size-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <!-- Editor -->
        <div class="flex-1 h-full min-h-0 overflow-hidden">
          <ClientOnly>
            <CodeMirrorEditor
              :key="activeFileName"
              :modelValue="activeFile.content"
              @update:modelValue="updateContent(activeFileName, $event)"
            />
            <template #fallback>
              <div class="h-full w-full bg-(--color-surface-alt) animate-pulse flex items-center justify-center text-xs text-(--color-text-muted)">
                Memuat CodeMirror 6 Editor…
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>

      <!-- Kolom 3: Pratinjau PDF / Error Log Drawer -->
      <div
        :class="[
          'flex flex-col flex-1 h-full min-h-0 overflow-hidden',
          activeMobileTab === 'preview' ? 'flex' : 'hidden lg:flex',
        ]"
      >
        <ClientOnly v-if="activeRightTab === 'preview'">
          <PdfViewer
            :pdfUrl="pdfUrl"
            :compiling="compiling"
            :compileStep="compileStep"
            :compileStepMessage="compileStepMessage"
            :error="compileError"
            @download="downloadPdf"
          />
          <template #fallback>
            <div class="h-full bg-(--color-surface-alt) animate-pulse flex items-center justify-center text-xs text-(--color-text-muted)">
              Memuat PDF Viewer…
            </div>
          </template>
        </ClientOnly>

        <ErrorLogDrawer
          v-else
          :logs="logs"
          :securityWarning="securityWarning"
          :errorText="compileError"
        />
      </div>
    </div>

    <!-- Floating Action Button (FAB) Referensi PDF -->
    <div class="fixed bottom-6 right-6 z-40">
      <button
        @click="isReferenceModalOpen = true"
        class="px-4 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer border border-white/20"
        title="Buka / Unggah Artikel Referensi PDF"
      >
        <IconFileText class="size-5" />
        <span>Artikel Referensi PDF</span>
      </button>
    </div>

    <!-- Modal Referensi PDF -->
    <ClientOnly>
      <ReferencePdfModal
        :isOpen="isReferenceModalOpen"
        @close="isReferenceModalOpen = false"
      />
    </ClientOnly>
  </div>
</template>
