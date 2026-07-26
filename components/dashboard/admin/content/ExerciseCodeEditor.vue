<script setup lang="ts">
import { ref } from "vue";
import {
  IconCode,
  IconColumns,
  IconEye,
  IconPlayerPlay,
  IconLoader2,
} from "@tabler/icons-vue";
import CompileResultModal from "~/components/learn/CompileResultModal.vue";
import CodeMirrorEditor from "~/components/learn/CodeMirrorEditor.client.vue";

const starterCode = defineModel<string>("starterCode", { default: "" });
const solutionCode = defineModel<string>("solutionCode", { default: "" });

type CodeTab = "starter" | "solution";
const activeCodeTab = ref<CodeTab>("solution");

type ViewMode = "editor" | "split" | "preview";
const viewMode = ref<ViewMode>("split");

const compiling = ref(false);
const showCompileModal = ref(false);
const compileSuccess = ref(false);
const pdfBase64 = ref<string | null>(null);
const compileErrorLogs = ref<string | null>(null);

function wrapLatexIfNeeded(code: string): string {
  if (!code || !code.trim()) return "";
  if (code.includes("\\documentclass")) return code;
  return `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath,amssymb}
\\begin{document}
${code}
\\end{document}`;
}

async function handleCompilePdf() {
  const rawCode =
    activeCodeTab.value === "solution" ? solutionCode.value : starterCode.value;
  if (!rawCode || !rawCode.trim()) return;

  const codeToCompile = wrapLatexIfNeeded(rawCode);

  compiling.value = true;
  compileSuccess.value = false;
  pdfBase64.value = null;
  compileErrorLogs.value = null;
  showCompileModal.value = true;

  try {
    const res = await $fetch<any>("/api/compile", {
      method: "POST",
      body: { code: codeToCompile },
    });

    if (res?.data?.isSuccess && res.data.pdfBase64) {
      compileSuccess.value = true;
      pdfBase64.value = res.data.pdfBase64;
      compileErrorLogs.value = null;
    } else {
      compileSuccess.value = false;
      pdfBase64.value = null;
      compileErrorLogs.value =
        res?.data?.logs ||
        res?.data?.errorText ||
        res?.message ||
        "Kompilasi TeXLive gagal.";
    }
  } catch (err: any) {
    compileSuccess.value = false;
    pdfBase64.value = null;
    compileErrorLogs.value =
      err?.data?.data?.logs ||
      err?.data?.message ||
      err?.message ||
      "Terjadi kesalahan koneksi ke kontainer Docker TeXLive.";
  } finally {
    compiling.value = false;
  }
}
</script>

<template>
  <div class="space-y-3 font-body">
    <!-- Header Bar: Code Selector & View Modes & Compile Button -->
    <div
      class="flex flex-col sm:flex-row gap-2 sm:items-center justify-between font-sans"
    >
      <!-- Left: Code Tab Switcher (Starter vs Solution) -->
      <div
        class="flex items-center bg-surface-alt rounded-lg border border-border p-0.5 text-xs shadow-2xs"
      >
        <button
          type="button"
          @click="activeCodeTab = 'starter'"
          :class="[
            'px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer',
            activeCodeTab === 'starter'
              ? 'bg-surface text-primary shadow-2xs'
              : 'text-text-secondary hover:text-(--color-text-primary)',
          ]"
        >
          Starter Code (Mahasiswa)
        </button>
        <button
          type="button"
          @click="activeCodeTab = 'solution'"
          :class="[
            'px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer',
            activeCodeTab === 'solution'
              ? 'bg-primary-light text-primary font-bold shadow-2xs'
              : 'text-text-secondary hover:text-(--color-text-primary)',
          ]"
        >
          Solution Code (Kunci)
        </button>
      </div>

      <!-- Right: Viewport Mode Switcher & Compile PDF Button -->
      <div class="flex items-center gap-2">
        <div
          class="flex items-center bg-surface-alt rounded-lg border border-border p-0.5 text-xs shadow-2xs"
        >
          <button
            type="button"
            @click="viewMode = 'editor'"
            :class="[
              'px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1',
              viewMode === 'editor'
                ? 'bg-surface text-primary shadow-2xs'
                : 'text-text-secondary hover:text-(--color-text-primary)',
            ]"
            title="Hanya Editor Kode"
          >
            <IconCode class="size-3.5" />
            <span>Editor</span>
          </button>

          <button
            type="button"
            @click="viewMode = 'split'"
            :class="[
              'px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1',
              viewMode === 'split'
                ? 'bg-surface text-primary shadow-2xs'
                : 'text-text-secondary hover:text-(--color-text-primary)',
            ]"
            title="Tampilan Split Screen"
          >
            <IconColumns class="size-3.5" />
            <span>Split</span>
          </button>

          <button
            type="button"
            @click="viewMode = 'preview'"
            :class="[
              'px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1',
              viewMode === 'preview'
                ? 'bg-surface text-primary shadow-2xs'
                : 'text-text-secondary hover:text-(--color-text-primary)',
            ]"
            title="Hanya Pratinjau Teks Kode"
          >
            <IconEye class="size-3.5" />
            <span>Preview</span>
          </button>
        </div>

        <button
          type="button"
          @click="handleCompilePdf"
          :disabled="compiling"
          class="btn-primary btn-sm gap-1.5 rounded-lg font-bold shadow-2xs cursor-pointer shrink-0"
          title="Uji kompilasi kode LaTeX via Docker TeXLive"
        >
          <IconLoader2 v-if="compiling" class="size-3.5 animate-spin" />
          <IconPlayerPlay v-else class="size-3.5" />
          <span>{{ compiling ? "Mengompilasi..." : "Uji Kompilasi PDF" }}</span>
        </button>
      </div>
    </div>

    <!-- Code Viewport Container -->
    <div
      class="border border-border rounded-xl overflow-hidden bg-surface shadow-2xs min-h-55"
    >
      <div
        :class="[
          'grid gap-0 h-full min-h-55',
          viewMode === 'split'
            ? 'grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border'
            : 'grid-cols-1',
        ]"
      >
        <div
          v-if="viewMode === 'editor' || viewMode === 'split'"
          class="p-3 flex flex-col"
        >
          <label class="text-[11px] font-bold text-text-muted mb-1 font-sans">
            Input Kode
            {{
              activeCodeTab === "solution"
                ? "Solution Code (Kunci)"
                : "Starter Code (Mahasiswa)"
            }}
          </label>
          <ClientOnly>
            <CodeMirrorEditor
              v-if="activeCodeTab === 'starter'"
              v-model="starterCode"
              class="min-h-55"
            />
            <CodeMirrorEditor v-else v-model="solutionCode" class="min-h-55" />
          </ClientOnly>
        </div>

        <div
          v-if="viewMode === 'preview' || viewMode === 'split'"
          class="p-3 bg-surface-alt/40 overflow-y-auto max-h-75 font-mono text-xs text-(--color-text-primary)"
        >
          <label
            class="text-[11px] font-bold text-text-muted mb-1 block font-sans"
          >
            Pratinjau Kode
            {{
              activeCodeTab === "solution" ? "Solution Code" : "Starter Code"
            }}
          </label>
          <pre
            class="bg-surface p-3 rounded-lg border border-border whitespace-pre-wrap leading-relaxed text-[11px] overflow-x-auto"
          ><code>{{ activeCodeTab === 'solution' ? solutionCode || 'Kode solusi masih kosong.' : starterCode || 'Kode starter masih kosong.' }}</code></pre>
        </div>
      </div>
    </div>

    <!-- Live Docker Compile Result Modal -->
    <CompileResultModal
      v-if="showCompileModal"
      :isOpen="showCompileModal"
      :isCompiling="compiling"
      :isSuccess="compileSuccess"
      :pdfBase64="pdfBase64"
      :errorLogs="compileErrorLogs"
      title="Uji Kompilasi PDF Admin"
      @close="showCompileModal = false"
    />
  </div>
</template>
