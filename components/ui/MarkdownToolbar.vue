<script setup lang="ts">
import {
  IconBold,
  IconItalic,
  IconStrikethrough,
  IconH1,
  IconH2,
  IconH3,
  IconCode,
  IconMathSymbols,
  IconList,
  IconListNumbers,
  IconTable,
  IconQuote,
  IconAlertCircle,
  IconFunction,
} from "@tabler/icons-vue";

const emit = defineEmits<{
  (e: "action", prefix: string, suffix?: string, placeholder?: string): void;
}>();

const tools = [
  {
    group: "Format Teks",
    items: [
      { name: "Tebal (Bold)", icon: IconBold, prefix: "**", suffix: "**", placeholder: "teks tebal" },
      { name: "Miring (Italic)", icon: IconItalic, prefix: "*", suffix: "*", placeholder: "teks miring" },
      { name: "Coret (Strikethrough)", icon: IconStrikethrough, prefix: "~~", suffix: "~~", placeholder: "teks dicoret" },
    ],
  },
  {
    group: "Judul Sub-Bab",
    items: [
      { name: "Judul Utama (H1)", icon: IconH1, prefix: "# ", suffix: "", placeholder: "Judul Utama" },
      { name: "Sub Judul (H2)", icon: IconH2, prefix: "## ", suffix: "", placeholder: "Sub-Judul Materi" },
      { name: "Sub-Sub Judul (H3)", icon: IconH3, prefix: "### ", suffix: "", placeholder: "Poin Pembahasan" },
    ],
  },
  {
    group: "LaTeX & Kode",
    items: [
      { name: "Kode Inline", icon: IconCode, prefix: "`", suffix: "`", placeholder: "\\command" },
      {
        name: "Blok Kode LaTeX",
        icon: IconCode,
        prefix: "```latex\n",
        suffix: "\n```",
        placeholder: "\\documentclass{article}\n\\begin{document}\n  Hello World\n\\end{document}",
      },
      { name: "Rumus Inline ($...$)", icon: IconMathSymbols, prefix: "$", suffix: "$", placeholder: "E = mc^2" },
      {
        name: "Persamaan Math Block",
        icon: IconFunction,
        prefix: "\\begin{equation}\n  ",
        suffix: "\n\\end{equation}",
        placeholder: "\\int_{0}^{\\infty} f(x)\\,dx = 1",
      },
    ],
  },
  {
    group: "Struktur & Elemen",
    items: [
      { name: "Daftar Poin (List)", icon: IconList, prefix: "- ", suffix: "", placeholder: "Item poin 1" },
      { name: "Daftar Angka", icon: IconListNumbers, prefix: "1. ", suffix: "", placeholder: "Langkah 1" },
      { name: "Kutipan / Quote", icon: IconQuote, prefix: "> ", suffix: "", placeholder: "Kutipan penjelasan..." },
      { name: "Kotak Catatan (Alert)", icon: IconAlertCircle, prefix: "> [!NOTE]\n> ", suffix: "", placeholder: "Informasi penting..." },
      {
        name: "Tabel Templat",
        icon: IconTable,
        prefix: "| Perintah LaTeX | Fungsi |\n| -------------- | ------ |\n| ",
        suffix: " | Penjelasan... |",
        placeholder: "\\textbf{}",
      },
    ],
  },
];
</script>

<template>
  <div class="flex items-center gap-1 flex-wrap p-1.5 bg-(--color-surface-alt) border border-border rounded-xl shadow-2xs">
    <template v-for="(group, idx) in tools" :key="group.group">
      <div v-if="idx > 0" class="h-4 w-px bg-border my-auto mx-0.5"></div>
      <div class="flex items-center gap-0.5">
        <button
          v-for="item in group.items"
          :key="item.name"
          type="button"
          @click.prevent="emit('action', item.prefix, item.suffix, item.placeholder)"
          class="p-1.5 rounded-lg text-(--color-text-secondary) hover:text-primary hover:bg-(--color-surface) transition-all cursor-pointer flex items-center justify-center group relative"
          :title="item.name"
        >
          <component :is="item.icon" class="size-4 shrink-0" />
        </button>
      </div>
    </template>
  </div>
</template>
