<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { marked } from "marked";
import {
  IconCode,
  IconColumns,
  IconEye,
  IconH1,
  IconH2,
  IconBold,
  IconItalic,
  IconList,
  IconQuote,
  IconTerminal,
} from "@tabler/icons-vue";

const modelValue = defineModel<string>({ default: "" });

type ViewMode = "editor" | "split" | "preview";
const viewMode = ref<ViewMode>("split");
const textareaRef = ref<HTMLTextAreaElement | null>(null);

marked.setOptions({ gfm: true, breaks: true });

const renderedContent = computed(() => {
  try {
    return marked.parse(modelValue.value || "") as string;
  } catch {
    return modelValue.value || "";
  }
});

function insertFormatting(prefix: string, suffix: string = "") {
  if (!textareaRef.value) {
    modelValue.value = (modelValue.value || "") + `${prefix}teks${suffix}`;
    return;
  }
  const el = textareaRef.value;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const text = el.value;
  const selected = text.substring(start, end) || "teks";
  const replacement = `${prefix}${selected}${suffix}`;

  modelValue.value = text.substring(0, start) + replacement + text.substring(end);

  nextTick(() => {
    el.focus();
    el.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
  });
}
</script>

<template>
  <div class="space-y-2 font-body">
    <div class="flex items-center justify-between font-sans">
      <label class="text-xs font-bold text-(--color-text-primary)">
        Penjelasan Materi Lesson (Markdown / LaTeX)
      </label>

      <!-- 3 Viewport Mode Switcher Toolbar -->
      <div class="flex items-center bg-surface-alt rounded-lg border border-border p-0.5 text-xs shadow-2xs">
        <button
          type="button"
          @click="viewMode = 'editor'"
          :class="[
            'px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1',
            viewMode === 'editor'
              ? 'bg-surface text-primary shadow-2xs'
              : 'text-text-secondary hover:text-(--color-text-primary)'
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
              : 'text-text-secondary hover:text-(--color-text-primary)'
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
              : 'text-text-secondary hover:text-(--color-text-primary)'
          ]"
          title="Hanya Pratinjau WYSIWYG"
        >
          <IconEye class="size-3.5" />
          <span>Preview</span>
        </button>
      </div>
    </div>

    <!-- Viewport Panel Container -->
    <div class="border border-border rounded-xl overflow-hidden bg-surface shadow-2xs min-h-65">
      <!-- Editor Formatting Action Bar (Header, Bold, Italic, Code, List, Quote) -->
      <div
        v-if="viewMode === 'editor' || viewMode === 'split'"
        class="flex items-center gap-1 p-2 bg-surface-alt/70 border-b border-border text-xs flex-wrap font-sans"
      >
        <button
          type="button"
          @click="insertFormatting('# ')"
          class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
          title="Header 1 (# Judul)"
        >
          <IconH1 class="size-4" />
        </button>

        <button
          type="button"
          @click="insertFormatting('## ')"
          class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
          title="Header 2 (## Sub Judul)"
        >
          <IconH2 class="size-4" />
        </button>

        <div class="h-4 w-px bg-border mx-1"></div>

        <button
          type="button"
          @click="insertFormatting('**', '**')"
          class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
          title="Teks Tebal (**bold**)"
        >
          <IconBold class="size-4" />
        </button>

        <button
          type="button"
          @click="insertFormatting('*', '*')"
          class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
          title="Teks Miring (*italic*)"
        >
          <IconItalic class="size-4" />
        </button>

        <div class="h-4 w-px bg-border mx-1"></div>

        <button
          type="button"
          @click="insertFormatting('`', '`')"
          class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
          title="Inline Code (`code`)"
        >
          <IconCode class="size-4" />
        </button>

        <button
          type="button"
          @click="insertFormatting('```latex\n', '\n```')"
          class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
          title="Blok Kode LaTeX (```latex ... ```)"
        >
          <IconTerminal class="size-4" />
        </button>

        <button
          type="button"
          @click="insertFormatting('- ')"
          class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
          title="List Poin (- Poin)"
        >
          <IconList class="size-4" />
        </button>

        <button
          type="button"
          @click="insertFormatting('> ')"
          class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
          title="Kutipan Catatan (> Catatan)"
        >
          <IconQuote class="size-4" />
        </button>
      </div>

      <!-- Main Editor & Preview Grid -->
      <div
        :class="[
          'grid gap-0 h-full min-h-55',
          viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border' : 'grid-cols-1'
        ]"
      >
        <!-- Editor Input Panel -->
        <div v-if="viewMode === 'editor' || viewMode === 'split'" class="p-3 flex flex-col">
          <textarea
            ref="textareaRef"
            v-model="modelValue"
            rows="9"
            placeholder="Tuliskan isi materi pelajaran dalam sintaks Markdown atau LaTeX..."
            class="w-full h-full min-h-50 p-2 bg-transparent text-xs font-mono text-(--color-text-primary) outline-none resize-y leading-relaxed"
          />
        </div>

        <!-- Live WYSIWYG Preview Panel -->
        <div
          v-if="viewMode === 'preview' || viewMode === 'split'"
          class="p-4 bg-surface-alt/40 overflow-y-auto max-h-80 text-xs leading-relaxed text-(--color-text-primary) font-sans"
        >
          <div
            v-if="renderedContent"
            class="prose prose-sm max-w-none text-xs leading-relaxed space-y-2"
            v-html="renderedContent"
          />
          <div v-else class="text-center py-12 text-(--color-text-muted) italic">
            Pratinjau WYSIWYG akan muncul di sini saat Anda mengetikkan materi...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
