<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import {
  IconCode,
  IconColumns,
  IconEye,
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrikethrough,
  IconSubscript,
  IconSuperscript,
  IconHighlight,
  IconList,
  IconListNumbers,
  IconListCheck,
  IconQuote,
  IconTable,
  IconTerminal,
  IconMath,
  IconMathFunction,
  IconLink,
  IconPhoto,
  IconSeparator,
  IconEraser,
  IconCopy,
  IconCheck,
  IconInfoCircle,
  IconAlertTriangle,
  IconBulb,
} from "@tabler/icons-vue";
import KatexRenderer from "~/components/learn/KatexRenderer.vue";

const modelValue = defineModel<string>({ default: "" });

type ViewMode = "editor" | "split" | "preview";
const viewMode = ref<ViewMode>("split");
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const isCopied = ref(false);

const wordCount = computed(() => {
  const text = (modelValue.value || "").trim();
  if (!text) return 0;
  return text.split(/\s+/).length;
});

const charCount = computed(() => (modelValue.value || "").length);

function insertFormatting(prefix: string, suffix: string = "") {
  if (!textareaRef.value) {
    modelValue.value = (modelValue.value || "") + `${prefix}teks${suffix}`;
    return;
  }
  const el = textareaRef.value;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const text = el.value;
  const selectedText = text.substring(start, end);

  if (
    suffix &&
    selectedText.startsWith(prefix) &&
    selectedText.endsWith(suffix) &&
    selectedText.length >= prefix.length + suffix.length
  ) {
    const unwrapped = selectedText.substring(
      prefix.length,
      selectedText.length - suffix.length,
    );
    modelValue.value =
      text.substring(0, start) + unwrapped + text.substring(end);
    nextTick(() => {
      el.focus();
      el.setSelectionRange(start, start + unwrapped.length);
    });
    return;
  }

  if (!suffix && selectedText.startsWith(prefix)) {
    const unwrapped = selectedText.substring(prefix.length);
    modelValue.value =
      text.substring(0, start) + unwrapped + text.substring(end);
    nextTick(() => {
      el.focus();
      el.setSelectionRange(start, start + unwrapped.length);
    });
    return;
  }

  const selected = selectedText || "teks";
  const replacement = `${prefix}${selected}${suffix}`;

  modelValue.value =
    text.substring(0, start) + replacement + text.substring(end);

  nextTick(() => {
    el.focus();
    el.setSelectionRange(
      start + prefix.length,
      start + prefix.length + selected.length,
    );
  });
}

function insertSnippet(snippet: string) {
  if (!textareaRef.value) {
    modelValue.value = (modelValue.value || "") + snippet;
    return;
  }
  const el = textareaRef.value;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const text = el.value;

  modelValue.value = text.substring(0, start) + snippet + text.substring(end);

  nextTick(() => {
    el.focus();
    const newPos = start + snippet.length;
    el.setSelectionRange(newPos, newPos);
  });
}

function insertTableMarkdown() {
  const tableTemplate = `\n| Judul Kolom 1 | Judul Kolom 2 | Judul Kolom 3 |\n| --- | --- | --- |\n| Data 1 | Data 2 | Data 3 |\n| Data 4 | Data 5 | Data 6 |\n`;
  insertSnippet(tableTemplate);
}

function insertTableLatex() {
  const latexTableTemplate = `\n\\begin{tabular}{|c|c|c|}\n\\hline\nJudul 1 & Judul 2 & Judul 3 \\\\\n\\hline\nData 1 & Data 2 & Data 3 \\\\\nData 4 & Data 5 & Data 6 \\\\\n\\hline\n\\end{tabular}\n`;
  insertSnippet(latexTableTemplate);
}

function insertCallout(type: "note" | "warning" | "tip") {
  const templates = {
    note: `\n> [!NOTE]\n> Tuliskan catatan penting di sini...\n`,
    warning: `\n> [!WARNING]\n> Tuliskan peringatan di sini...\n`,
    tip: `\n> [!TIP]\n> Tuliskan tips atau petunjuk di sini...\n`,
  };
  insertSnippet(templates[type]);
}

function clearFormatting() {
  if (!textareaRef.value) return;
  const el = textareaRef.value;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const text = el.value;
  const selectedText = text.substring(start, end);
  if (!selectedText) return;

  const cleaned = selectedText
    .replace(/^#+\s*/, "")
    .replace(/^>\s*/, "")
    .replace(/^[-*+]\s*/, "")
    .replace(/^\d+\.\s*/, "")
    .replace(/[*_`~<>]|\[|\]|\(.*\)/g, "");

  modelValue.value = text.substring(0, start) + cleaned + text.substring(end);
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(modelValue.value || "");
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (e) {
    console.error("Gagal menyalin teks:", e);
  }
}
</script>

<template>
  <div class="space-y-2 font-body">
    <div class="flex items-center justify-between font-sans">
      <label class="text-xs font-bold text-(--color-text-primary)">
        Penjelasan Materi Lesson & Artikel (Markdown / LaTeX)
      </label>

      <!-- 3 Viewport Mode Switcher Toolbar -->
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
          title="Hanya Pratinjau WYSIWYG"
        >
          <IconEye class="size-3.5" />
          <span>Preview</span>
        </button>
      </div>
    </div>

    <!-- Viewport Panel Container -->
    <div
      class="border border-border rounded-xl overflow-hidden bg-surface shadow-2xs min-h-75 flex flex-col"
    >
      <!-- Super Complete Editor Formatting Action Bar -->
      <div
        v-if="viewMode === 'editor' || viewMode === 'split'"
        class="flex items-center gap-1 p-2 bg-surface-alt/80 border-b border-border text-xs flex-wrap font-sans"
      >
        <!-- Headings Group -->
        <div class="flex items-center gap-0.5">
          <button
            type="button"
            @click="insertFormatting('# ')"
            class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
            title="Header 1 (# Judul Utama)"
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
          <button
            type="button"
            @click="insertFormatting('### ')"
            class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
            title="Header 3 (### Sub-sub Judul)"
          >
            <IconH3 class="size-4" />
          </button>
          <button
            type="button"
            @click="insertFormatting('#### ')"
            class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
            title="Header 4 (#### Sub Bagian)"
          >
            <IconH4 class="size-4" />
          </button>
        </div>

        <div class="h-4 w-px bg-border mx-1"></div>

        <!-- Text Styling Group -->
        <div class="flex items-center gap-0.5">
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
          <button
            type="button"
            @click="insertFormatting('<u>', '</u>')"
            class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
            title="Garis Bawah (<u>underline</u>)"
          >
            <IconUnderline class="size-4" />
          </button>
          <button
            type="button"
            @click="insertFormatting('~~', '~~')"
            class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
            title="Teks Dicoret (~~strikethrough~~)"
          >
            <IconStrikethrough class="size-4" />
          </button>
          <button
            type="button"
            @click="insertFormatting('<sub>', '</sub>')"
            class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
            title="Subscript (<sub>teks</sub>)"
          >
            <IconSubscript class="size-4" />
          </button>
          <button
            type="button"
            @click="insertFormatting('<sup>', '</sup>')"
            class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
            title="Superscript (<sup>teks</sup>)"
          >
            <IconSuperscript class="size-4" />
          </button>
          <button
            type="button"
            @click="insertFormatting('<mark>', '</mark>')"
            class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
            title="Highlight Teks (<mark>teks</mark>)"
          >
            <IconHighlight class="size-4" />
          </button>
        </div>

        <div class="h-4 w-px bg-border mx-1"></div>

        <!-- Lists Group -->
        <div class="flex items-center gap-0.5">
          <button
            type="button"
            @click="insertFormatting('- ')"
            class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
            title="Bullet List (- Poin)"
          >
            <IconList class="size-4" />
          </button>
          <button
            type="button"
            @click="insertFormatting('1. ')"
            class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
            title="Numbered List (1. Poin Berurutan)"
          >
            <IconListNumbers class="size-4" />
          </button>
          <button
            type="button"
            @click="insertFormatting('- [ ] ')"
            class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
            title="Task / Checkbox List (- [ ] Tugas)"
          >
            <IconListCheck class="size-4" />
          </button>
        </div>

        <div class="h-4 w-px bg-border mx-1"></div>

        <!-- Tables Group (Markdown & LaTeX) -->
        <div class="flex items-center gap-1">
          <button
            type="button"
            @click="insertTableMarkdown"
            class="px-2 py-1 bg-surface hover:bg-primary-light hover:text-primary rounded-lg text-text-secondary text-[11px] font-bold border border-border transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
            title="Sisip Tabel Markdown (| Header | Header |)"
          >
            <IconTable class="size-3.5 text-primary" />
            <span>Tabel MD</span>
          </button>

          <button
            type="button"
            @click="insertTableLatex"
            class="px-2 py-1 bg-surface hover:bg-primary-light hover:text-primary rounded-lg text-text-secondary text-[11px] font-bold border border-border transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
            title="Sisip Tabel LaTeX (\begin{tabular}...)"
          >
            <IconTable class="size-3.5 text-indigo-500" />
            <span>Tabel LaTeX</span>
          </button>
        </div>

        <div class="h-4 w-px bg-border mx-1"></div>

        <!-- Code & Math Group -->
        <div class="flex items-center gap-0.5">
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
            @click="insertFormatting('$', '$')"
            class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
            title="LaTeX Math Inline ($ E=mc^2 $)"
          >
            <IconMath class="size-4 text-emerald-600" />
          </button>

          <button
            type="button"
            @click="insertFormatting('$$\n', '\n$$')"
            class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
            title="LaTeX Math Block ($$ ... $$)"
          >
            <IconMathFunction class="size-4 text-emerald-600" />
          </button>
        </div>

        <div class="h-4 w-px bg-border mx-1"></div>

        <!-- Quotes & Callouts Group -->
        <div class="flex items-center gap-0.5">
          <button
            type="button"
            @click="insertFormatting('> ')"
            class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
            title="Kutipan Teks (> Kutipan)"
          >
            <IconQuote class="size-4" />
          </button>

          <button
            type="button"
            @click="insertCallout('note')"
            class="p-1.5 hover:bg-surface rounded-lg text-blue-600 transition-all cursor-pointer"
            title="Callout Catatan Info (> [!NOTE])"
          >
            <IconInfoCircle class="size-4" />
          </button>

          <button
            type="button"
            @click="insertCallout('warning')"
            class="p-1.5 hover:bg-surface rounded-lg text-amber-600 transition-all cursor-pointer"
            title="Callout Peringatan (> [!WARNING])"
          >
            <IconAlertTriangle class="size-4" />
          </button>

          <button
            type="button"
            @click="insertCallout('tip')"
            class="p-1.5 hover:bg-surface rounded-lg text-emerald-600 transition-all cursor-pointer"
            title="Callout Tips / Hint (> [!TIP])"
          >
            <IconBulb class="size-4" />
          </button>
        </div>

        <div class="h-4 w-px bg-border mx-1"></div>

        <!-- Links & Media Group -->
        <div class="flex items-center gap-0.5">
          <button
            type="button"
            @click="insertFormatting('[', '](https://example.com)')"
            class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
            title="Sisip Link ([teks](https://...))"
          >
            <IconLink class="size-4" />
          </button>

          <button
            type="button"
            @click="insertFormatting('![', '](https://via.placeholder.com/600x300)')"
            class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
            title="Sisip Gambar (![deskripsi](https://...))"
          >
            <IconPhoto class="size-4" />
          </button>

          <button
            type="button"
            @click="insertSnippet('\n---\n')"
            class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
            title="Garis Pemisah / Divider (---)"
          >
            <IconSeparator class="size-4" />
          </button>
        </div>

        <div class="h-4 w-px bg-border mx-1"></div>

        <!-- Action Utilities -->
        <div class="flex items-center gap-0.5 ml-auto">
          <button
            type="button"
            @click="clearFormatting"
            class="p-1.5 hover:bg-surface rounded-lg text-amber-600 transition-all cursor-pointer"
            title="Hapus Formatting dari Teks Terpilih"
          >
            <IconEraser class="size-4" />
          </button>

          <button
            type="button"
            @click="copyContent"
            class="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-primary transition-all cursor-pointer"
            :title="isCopied ? 'Tersalin!' : 'Salin Semua Teks'"
          >
            <IconCheck v-if="isCopied" class="size-4 text-emerald-600" />
            <IconCopy v-else class="size-4" />
          </button>
        </div>
      </div>

      <!-- Main Editor & Preview Grid -->
      <div
        :class="[
          'grid gap-0 flex-1 min-h-60',
          viewMode === 'split'
            ? 'grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border'
            : 'grid-cols-1',
        ]"
      >
        <!-- Editor Input Panel -->
        <div
          v-if="viewMode === 'editor' || viewMode === 'split'"
          class="p-3 flex flex-col justify-between"
        >
          <textarea
            ref="textareaRef"
            v-model="modelValue"
            rows="10"
            placeholder="Tuliskan isi materi pelajaran dalam sintaks Markdown atau LaTeX... Contoh tabel:\n| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |"
            class="w-full h-full min-h-55 p-2 bg-transparent text-xs font-mono text-(--color-text-primary) outline-none resize-y leading-relaxed"
          />
        </div>

        <!-- Live Real-Time WYSIWYG & KaTeX Preview Panel -->
        <div
          v-if="viewMode === 'preview' || viewMode === 'split'"
          class="p-4 bg-surface-alt/40 overflow-y-auto max-h-96 text-xs leading-relaxed text-(--color-text-primary) font-sans"
        >
          <KatexRenderer
            v-if="modelValue"
            :content="modelValue"
            :isMarkdown="true"
          />
          <div
            v-else
            class="text-center py-16 text-(--color-text-muted) italic font-sans"
          >
            Pratinjau WYSIWYG & KaTeX akan muncul di sini secara real-time saat Anda mengetikkan materi atau menyisipkan tabel...
          </div>
        </div>
      </div>

      <!-- Footer Info Bar (Word & Character Counter) -->
      <div
        class="flex items-center justify-between px-3 py-1.5 bg-surface-alt/60 border-t border-border text-[11px] font-sans text-(--color-text-muted)"
      >
        <span class="flex items-center gap-2">
          <span><strong>{{ wordCount }}</strong> Kata</span>
          <span>•</span>
          <span><strong>{{ charCount }}</strong> Karakter</span>
        </span>
        <span class="font-medium italic">
          Mendukung Markdown GFM & KaTeX LaTeX Rendering
        </span>
      </div>
    </div>
  </div>
</template>
