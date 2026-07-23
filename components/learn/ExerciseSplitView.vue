<script setup lang="ts">
import { ref } from 'vue'
import {
  IconRefresh,
  IconSend,
  IconEye,
  IconCode,
  IconPlayerPlay,
  IconFileTypePdf,
  IconLoader2,
} from '@tabler/icons-vue'
import type { ExerciseDetail } from '~/composables/useExercise'
import ExerciseInstruction from './ExerciseInstruction.vue'
import CodeMirrorEditor from './CodeMirrorEditor.client.vue'
import KatexRenderer from './KatexRenderer.vue'
import CompileResultModal from './CompileResultModal.vue'

const props = defineProps<{
  exercise: ExerciseDetail
  modelValue: string
  isDirty: boolean
  submitting: boolean
  compiling?: boolean
  pdfBase64?: string | null
  compileError?: string | null
  compileLogs?: any[] | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'reset'): void
  (e: 'submit'): void
  (e: 'compile'): void
  (e: 'askAiError', errorText: string): void
}>()

const activeTabMobile = ref<'editor' | 'preview'>('editor')
const showCompileModal = ref(false)

async function handleCompileClick() {
  showCompileModal.value = true
  emit('compile')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Instruksi Latihan -->
    <ExerciseInstruction :exercise="exercise" />

    <!-- Mobile Switcher Tab -->
    <div class="flex lg:hidden bg-(--color-surface-alt) p-1 rounded-xl border border-border">
      <button
        @click="activeTabMobile = 'editor'"
        :class="[
          'flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer',
          activeTabMobile === 'editor'
            ? 'bg-(--color-surface) text-primary shadow-xs'
            : 'text-(--color-text-muted)',
        ]"
      >
        <IconCode class="size-4" />
        Editor Kode
      </button>
      <button
        @click="activeTabMobile = 'preview'"
        :class="[
          'flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer',
          activeTabMobile === 'preview'
            ? 'bg-(--color-surface) text-primary shadow-xs'
            : 'text-(--color-text-muted)',
        ]"
      >
        <IconEye class="size-4" />
        Pratinjau KaTeX
      </button>
    </div>

    <!-- Layout Split-View 2 Kolom -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

      <!-- Kolom Kiri: CodeMirror 6 Editor (LaTeX sTeX mode) -->
      <div :class="['space-y-3', activeTabMobile === 'editor' ? 'block' : 'hidden lg:block']">
        <!-- Header Editor Bar & Action Buttons -->
        <div class="flex flex-wrap items-center justify-between gap-2 px-1">
          <div class="flex items-center gap-2 text-xs font-bold text-(--color-text-primary)">
            <IconCode class="size-4 text-primary" />
            <span>Editor Sintaks LaTeX</span>
            <span
              v-if="isDirty"
              class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20"
            >
              Berubah
            </span>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <!-- Reset Button -->
            <button
              @click="emit('reset')"
              :disabled="!isDirty"
              class="btn-secondary btn-sm gap-1.5 rounded-xl cursor-pointer disabled:opacity-50"
              title="Kembalikan kode awal"
            >
              <IconRefresh class="size-3.5" />
              <span class="hidden sm:inline">Reset</span>
            </button>

            <!-- Single-File Docker LaTeX Compile Button (Sesuai DESIGN.md) -->
            <button
              @click="handleCompileClick"
              :disabled="compiling"
              class="btn-primary btn-sm gap-1.5 rounded-xl shadow-xs cursor-pointer disabled:opacity-60"
              title="Kompilasi dokumen LaTeX dan buka modal pratinjau PDF split layout"
            >
              <IconLoader2 v-if="compiling" class="size-3.5 animate-spin" />
              <IconPlayerPlay v-else class="size-3.5" />
              <span>{{ compiling ? 'Mengompilasi...' : '⚡ Uji Kompilasi PDF' }}</span>
            </button>

            <!-- Submit Button -->
            <button
              @click="emit('submit')"
              :disabled="submitting"
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <IconSend v-if="!submitting" class="size-3.5" />
              <span>{{ submitting ? 'Menyimpan...' : 'Kirim Jawaban' }}</span>
            </button>
          </div>
        </div>

        <!-- CodeMirror Editor (Client-Only, LaTeX sTeX syntax highlighting) -->
        <ClientOnly>
          <CodeMirrorEditor
            :modelValue="modelValue"
            @update:modelValue="emit('update:modelValue', $event)"
          />
          <template #fallback>
            <div class="h-[420px] w-full rounded-lg bg-(--color-surface-alt) animate-pulse border border-border flex items-center justify-center text-xs text-(--color-text-muted)">
              Memuat CodeMirror 6 Editor…
            </div>
          </template>
        </ClientOnly>
      </div>

      <!-- Kolom Kanan: KaTeX Instant Preview -->
      <div :class="['space-y-3', activeTabMobile === 'preview' ? 'block' : 'hidden lg:block']">
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-2 text-xs font-bold text-(--color-text-primary)">
            <IconEye class="size-4 text-primary" />
            <span>Pratinjau Instan (KaTeX + LaTeX)</span>
          </div>
          <span class="text-[10px] text-(--color-text-muted)">Render Sisi Klien</span>
        </div>

        <!-- Output Preview Card -->
        <div
          class="bg-(--color-surface) border border-border rounded-2xl p-4 sm:p-6 min-h-[420px] max-h-[540px] overflow-y-auto shadow-xs"
          style="box-shadow: var(--shadow-card)"
        >
          <KatexRenderer :content="modelValue" :isMarkdown="true" />
        </div>

        <p class="text-[10px] text-(--color-text-muted) px-1">
          ✓ Merender math LaTeX (<code class="text-[9px]">$x^2$</code>, <code class="text-[9px]">$$\frac{a}{b}$$</code>)
          dan perintah teks (<code class="text-[9px]">\textit{}</code>, <code class="text-[9px]">\textbf{}</code>, <code class="text-[9px]">\section{}</code>, dll.)
        </p>
      </div>
    </div>

    <!-- ─── MODAL POPUP KOMPILASI SPLIT 2 LAYOUT (LOG KIRI & PDF KANAN) ──────────── -->
    <CompileResultModal
      :isOpen="showCompileModal"
      :isCompiling="compiling || false"
      :isSuccess="!compileError && !!pdfBase64"
      :pdfBase64="pdfBase64"
      :errorLogs="compileError"
      :title="`Hasil Kompilasi: Latihan #${exercise.id}`"
      @close="showCompileModal = false"
      @askAiError="(err) => emit('askAiError', err)"
    />
  </div>
</template>
