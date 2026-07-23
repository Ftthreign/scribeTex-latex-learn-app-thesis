<script setup lang="ts">
import { ref } from 'vue'
import { IconRefresh, IconSend, IconEye, IconCode } from '@tabler/icons-vue'
import type { ExerciseDetail } from '~/composables/useExercise'
import ExerciseInstruction from './ExerciseInstruction.vue'
import CodeMirrorEditor from './CodeMirrorEditor.client.vue'
import KatexRenderer from './KatexRenderer.vue'

const props = defineProps<{
  exercise: ExerciseDetail
  modelValue: string
  isDirty: boolean
  submitting: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'reset'): void
  (e: 'submit'): void
}>()

const activeTabMobile = ref<'editor' | 'preview'>('editor')
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
        Live Preview
      </button>
    </div>

    <!-- Layout Split-View 2 Kolom -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

      <!-- Kolom Kiri: CodeMirror 6 Editor (LaTeX sTeX mode) -->
      <div :class="['space-y-3', activeTabMobile === 'editor' ? 'block' : 'hidden lg:block']">
        <!-- Header Editor Bar & Action Buttons -->
        <div class="flex items-center justify-between px-1">
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
          <div class="flex items-center gap-2">
            <button
              @click="emit('reset')"
              :disabled="!isDirty"
              class="px-3 py-1.5 border border-border hover:bg-(--color-surface-alt) disabled:opacity-50 text-(--color-text-secondary) text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
            >
              <IconRefresh class="size-3.5" />
              <span class="hidden sm:inline">Reset</span>
            </button>
            <button
              @click="emit('submit')"
              :disabled="submitting"
              class="px-4 py-1.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
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
            <div class="h-[380px] w-full rounded-lg bg-(--color-surface-alt) animate-pulse border border-border flex items-center justify-center text-xs text-(--color-text-muted)">
              Memuat CodeMirror 6 Editor…
            </div>
          </template>
        </ClientOnly>
      </div>

      <!-- Kolom Kanan: KaTeX + LaTeX Text Preprocessor Live Preview -->
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
          class="bg-(--color-surface) border border-border rounded-xl p-4 sm:p-6 min-h-[380px] overflow-x-auto shadow-xs"
          style="box-shadow: var(--shadow-card)"
        >
          <!-- KatexRenderer dengan preprocessor perintah teks LaTeX built-in -->
          <KatexRenderer :content="modelValue" :isMarkdown="true" />
        </div>

        <p class="text-[10px] text-(--color-text-muted) px-1">
          ✓ Merender math LaTeX (<code class="text-[9px]">$x^2$</code>, <code class="text-[9px]">$$\frac{a}{b}$$</code>)
          dan perintah teks (<code class="text-[9px]">\textit{}</code>, <code class="text-[9px]">\textbf{}</code>, <code class="text-[9px]">\section{}</code>, dll.)
        </p>
      </div>
    </div>
  </div>
</template>
