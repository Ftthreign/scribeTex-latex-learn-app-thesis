<script setup lang="ts">
import { ref } from "vue";
import { useCompile } from "~/composables/useCompile";
import { useProjectFiles } from "~/composables/useProjectFiles";
import { useAiChat } from "~/composables/useAiChat";
import { IconFileText } from "@tabler/icons-vue";
import PdfViewer from "~/components/sandbox/PdfViewer.client.vue";
import CompileToolbar from "~/components/sandbox/CompileToolbar.vue";
import ErrorLogDrawer from "~/components/sandbox/ErrorLogDrawer.vue";
import ReferencePdfModal from "~/components/sandbox/ReferencePdfModal.vue";
import FileTreePanel from "~/components/sandbox/FileTreePanel.vue";
import AiChatDrawer from "~/components/sandbox/AiChatDrawer.vue";
import ExerciseFabAi from "~/components/learn/ExerciseFabAi.vue";
import SandboxHeader from "~/components/sandbox/SandboxHeader.vue";
import SandboxMobileTabs from "~/components/sandbox/SandboxMobileTabs.vue";
import SandboxEditorPanel from "~/components/sandbox/SandboxEditorPanel.vue";
import SandboxModals from "~/components/sandbox/SandboxModals.vue";

definePageMeta({ layout: "default" });
useHead({ title: "Project Sandbox LaTeX | ScribeTex" });

const router = useRouter();

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
} = useCompile();

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
  hasUnsavedChanges,
} = useProjectFiles();

const {
  isOpen: isAiOpen,
  messages: aiMessages,
  savedHistory: aiSavedHistory,
  loading: aiLoading,
  historyLoading: aiHistoryLoading,
  toggleDrawer: toggleAiDrawer,
  fetchHistory: fetchAiHistory,
  loadHistoryIntoChat: loadAiHistoryIntoChat,
  loadSingleHistoryItem: loadSingleAiHistoryItem,
  sendMessage: sendAiMessage,
  explainError: explainAiError,
  clearChat: clearAiChat,
} = useAiChat();

const isReferenceModalOpen = ref(false);
const activeRightTab = ref<"preview" | "logs">("preview");
const activeMobileTab = ref<"editor" | "preview">("editor");

const showResetModal = ref(false);
const showDeleteModal = ref(false);
const fileToDelete = ref<string | null>(null);
const showErrorModal = ref(false);
const showLeaveModal = ref(false);
const errorMessage = ref("");

const handleGoBack = () => {
  if (hasUnsavedChanges.value) {
    showLeaveModal.value = true;
  } else {
    router.push("/student/dashboard");
  }
};

const confirmLeave = () => {
  showLeaveModal.value = false;
  router.push("/student/dashboard");
};

const handleCompile = async () => {
  const res = await compileLatex(toPayload(), ENTRY_FILE);
  activeRightTab.value = !res || !res.isSuccess ? "logs" : "preview";
};

const handleConfirmReset = () => {
  showResetModal.value = false;
  if (typeof window !== "undefined") {
    window.location.reload();
  }
};

const handleAddFile = (name: string) => {
  const { error } = addFile(name);
  if (error) {
    errorMessage.value = error;
    showErrorModal.value = true;
  }
};

const handleDeleteFile = (name: string) => {
  fileToDelete.value = name;
  showDeleteModal.value = true;
};

const confirmDeleteFile = () => {
  if (!fileToDelete.value) return;
  const target = fileToDelete.value;
  showDeleteModal.value = false;
  fileToDelete.value = null;
  const { error } = deleteFile(target);
  if (error) {
    errorMessage.value = error;
    showErrorModal.value = true;
  }
};

const handleRenameFile = (oldName: string, newName: string) => {
  const { error } = renameFile(oldName, newName);
  if (error) {
    errorMessage.value = error;
    showErrorModal.value = true;
  }
};
</script>

<template>
  <div
    class="w-full h-[calc(100vh-4.5rem)] overflow-hidden flex flex-col p-4 lg:p-5 gap-3 relative font-body"
  >
    <SandboxHeader
      :compiling="compiling"
      :isDirty="activeFile?.isDirty || false"
      @goBack="handleGoBack"
      @reset="showResetModal = true"
      @openReference="isReferenceModalOpen = true"
      @compile="handleCompile"
    />

    <SandboxMobileTabs v-model:activeTab="activeMobileTab" />

    <div class="flex-1 flex gap-3 min-h-0 overflow-hidden relative">
      <!-- File Tree Sidebar -->
      <FileTreePanel
        :files="files"
        :activeFileName="activeFileName"
        :entryFile="ENTRY_FILE"
        @switch="switchFile"
        @add="handleAddFile"
        @delete="handleDeleteFile"
        @rename="handleRenameFile"
      />

      <div
        :class="[
          'flex-1 flex flex-col min-w-0 border border-border rounded-xl overflow-hidden shadow-xs',
          activeMobileTab === 'editor' ? 'flex' : 'hidden lg:flex',
        ]"
      >
        <SandboxEditorPanel
          :activeFileName="activeFileName"
          :activeFileContent="activeFile?.content || ''"
          @updateContent="(content) => updateContent(activeFileName, content)"
        />
      </div>

      <div
        :class="[
          'w-full lg:w-1/2 flex flex-col min-w-0 border border-border rounded-xl overflow-hidden bg-(--color-surface) shadow-xs',
          activeMobileTab === 'preview' ? 'flex' : 'hidden lg:flex',
        ]"
      >
        <CompileToolbar
          v-model:activeTab="activeRightTab"
          :hasPdf="!!pdfUrl"
          :hasError="!!compileError"
          :compiling="compiling"
          @compile="handleCompile"
          @download="downloadPdf"
          @openReference="isReferenceModalOpen = true"
        />

        <div class="flex-1 overflow-hidden relative">
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
              <div
                class="h-full bg-surface-alt animate-pulse flex items-center justify-center text-xs text-(--color-text-muted)"
              >
                Memuat PDF Viewer…
              </div>
            </template>
          </ClientOnly>

          <ErrorLogDrawer
            v-else
            :logs="logs"
            :securityWarning="securityWarning"
            :errorText="compileError"
            @askAi="explainAiError(logs, toPayload())"
          />
        </div>
      </div>
    </div>

    <div class="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      <button
        @click="isReferenceModalOpen = true"
        class="px-3.5 py-2.5 bg-(--color-surface) hover:bg-surface-alt text-(--color-text-primary) text-xs font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer border border-border shrink-0 font-sans"
        title="Buka / Unggah Artikel Referensi PDF"
      >
        <IconFileText class="size-4.5 text-primary" />
        <span class="hidden sm:inline">Artikel Referensi</span>
      </button>

      <ExerciseFabAi @openDrawer="toggleAiDrawer(true)" />
    </div>

    <!-- 5. Modals & Drawers Terpisah -->
    <ClientOnly>
      <ReferencePdfModal
        :isOpen="isReferenceModalOpen"
        @close="isReferenceModalOpen = false"
      />
    </ClientOnly>

    <ClientOnly>
      <AiChatDrawer
        :isOpen="isAiOpen"
        :messages="aiMessages"
        :savedHistory="aiSavedHistory"
        :loading="aiLoading"
        :historyLoading="aiHistoryLoading"
        :codeContext="toPayload()"
        :errorLogs="logs"
        @close="toggleAiDrawer(false)"
        @send="sendAiMessage"
        @clear="clearAiChat"
        @fetchHistory="fetchAiHistory"
        @loadHistory="loadAiHistoryIntoChat"
        @selectHistory="loadSingleAiHistoryItem"
      />
    </ClientOnly>

    <ClientOnly>
      <SandboxModals
        :showResetModal="showResetModal"
        :showDeleteModal="showDeleteModal"
        :showErrorModal="showErrorModal"
        :fileToDelete="fileToDelete"
        :errorMessage="errorMessage"
        @closeReset="showResetModal = false"
        @confirmReset="handleConfirmReset"
        @closeDelete="showDeleteModal = false"
        @confirmDelete="confirmDeleteFile"
        @closeError="showErrorModal = false"
      />
    </ClientOnly>

    <!-- Modal Konfirmasi Keluar saat Ada Perubahan Belum Disimpan (H3 Guard) -->
    <ClientOnly>
      <UiModal
        :isOpen="showLeaveModal"
        title="Perubahan Belum Disimpan"
        size="md"
        @close="showLeaveModal = false"
      >
        <div class="space-y-3 font-sans text-sm text-text-secondary">
          <p>
            Anda memiliki perubahan berkas LaTeX yang belum
            disimpan/dikompilasi. Apakah Anda yakin ingin mengabaikan perubahan
            dan kembali ke dasbor?
          </p>
        </div>
        <template #footer>
          <button
            @click="showLeaveModal = false"
            class="btn-secondary btn-sm font-semibold cursor-pointer"
          >
            Batal
          </button>
          <button
            @click="confirmLeave"
            class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs font-sans"
          >
            Ya, Tinggalkan Workspace
          </button>
        </template>
      </UiModal>
    </ClientOnly>
  </div>
</template>
