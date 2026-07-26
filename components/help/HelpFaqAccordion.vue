<script setup lang="ts">
import { ref, computed } from "vue";
import { IconChevronDown } from "@tabler/icons-vue";

const props = defineProps<{
  searchQuery: string;
}>();

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqs: FaqItem[] = [
  {
    id: 1,
    category: "Dasar LaTeX",
    question: "Bagaimana struktur minimal sebuah dokumen LaTeX?",
    answer:
      "Sebuah dokumen LaTeX minimal membutuhkan struktur preamble dan body. Contoh paling mendasar adalah:\n```latex\n\\documentclass{article}\n\\begin{document}\nHalo, ScribeTex!\n\\end{document}\n```\nPreamble berisi deklarasi class dokumen, sedangkan isi dokumen wajib diletakkan di antara `\\begin{document}` dan `\\end{document}`.",
  },
  {
    id: 2,
    category: "Editor & Kompilasi",
    question: "Mengapa kompilasi PDF saya gagal dan memunculkan error?",
    answer:
      "Gagal kompilasi (compiler error) umumnya terjadi karena kesalahan sintaks LaTeX. Masalah paling umum meliputi:\n1. Typo pada penulisan perintah/perintah tidak dikenal (misal `\\begin{equation}` tapi ditulis `\\begin{equatn}`).\n2. Kurung kurawal `{}` atau tanda dolar `$` yang tidak lengkap atau tidak ditutup.\n3. Menggunakan simbol khusus (seperti `%`, `&`, `_`, `#`) tanpa tanda backslash `\\` di depannya.\n\nDetail error dapat Anda periksa pada tab **Log Compiler** di bawah panel editor.",
  },
  {
    id: 3,
    category: "Asisten AI",
    question: "Bagaimana cara kerja Pembimbing AI dalam mengoreksi kode saya?",
    answer:
      "Pembimbing AI kami dilengkapi kecerdasan buatan terpercaya yang dilatih khusus dengan sintaksis LaTeX. Anda dapat menanyakan kesalahan kode Anda dengan menyalin potongan kode LaTeX yang bermasalah ke dalam ruang chat, lalu memintanya untuk mengoreksi. AI akan menganalisis kode tersebut, menjelaskan letak kesalahan, dan memberikan perbaikan kode LaTeX yang siap Anda salin kembali.",
  },
  {
    id: 4,
    category: "Editor & Kompilasi",
    question: "Apakah paket (package) LaTeX tambahan didukung di ScribeTex?",
    answer:
      "Ya! Kompilator ScribeTex dilengkapi dengan paket-paket standar LaTeX terlengkap. Anda dapat meng-import paket-paket umum seperti `amsmath` (rumus matematika), `graphicx` (penyisipan gambar), `geometry` (layout kertas), `hyperref` (link interaktif), dan `booktabs` (tabel estetik) di bagian preamble menggunakan perintah `\\usepackage{nama_paket}`.",
  },
  {
    id: 5,
    category: "Editor & Kompilasi",
    question: "Bagaimana cara mengunduh hasil dokumen PDF saya?",
    answer:
      "Setelah Anda menekan tombol **Kompilasi** (atau shortcut `Ctrl+Enter`) dan kompilasi berhasil tanpa error, preview PDF akan dimuat di sisi kanan layar. Di panel atas preview PDF tersebut, terdapat tombol **Unduh PDF** (Download) yang dapat diklik untuk menyimpan file PDF secara langsung ke penyimpanan lokal Anda.",
  },
  {
    id: 6,
    category: "Dasar LaTeX",
    question:
      "Mengapa preview PDF tidak langsung berubah secara real-time saat saya mengetik?",
    answer:
      "Karena proses rendering LaTeX membutuhkan kompilasi backend yang memproses source code menjadi dokumen PDF statis menggunakan mesin compiler LaTeX (seperti `pdflatex`). Untuk memperbarui tampilan preview PDF, Anda harus menekan tombol **Kompilasi** secara manual.",
  },
];

const activeId = ref<number | null>(null);

const toggleFaq = (id: number) => {
  activeId.value = activeId.value === id ? null : id;
};

const filteredFaqs = computed(() => {
  if (!props.searchQuery.trim()) return faqs;
  const q = props.searchQuery.toLowerCase();
  return faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      faq.category.toLowerCase().includes(q),
  );
});
</script>

<template>
  <div class="space-y-4 max-w-3xl mx-auto">
    <h2
      class="text-lg sm:text-xl font-display font-bold text-text-primary mb-4"
    >
      Pertanyaan yang Sering Diajukan (FAQ)
    </h2>

    <div
      v-if="filteredFaqs.length > 0"
      class="border border-border rounded-xl bg-surface divide-y divide-border overflow-hidden"
    >
      <div
        v-for="faq in filteredFaqs"
        :key="faq.id"
        class="transition-colors hover:bg-surface-alt/20"
      >
        <!-- Question Header -->
        <button
          @click="toggleFaq(faq.id)"
          class="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none group cursor-pointer"
        >
          <div class="space-y-1 pr-4">
            <span
              class="inline-block text-[10px] font-semibold bg-surface border border-border px-2 py-0.5 rounded-sm text-text-secondary uppercase"
            >
              {{ faq.category }}
            </span>
            <h3
              class="text-sm sm:text-[14.5px] font-bold text-text-primary group-hover:text-primary transition-colors leading-relaxed"
            >
              {{ faq.question }}
            </h3>
          </div>
          <IconChevronDown
            :class="[
              'size-4.5 text-text-muted shrink-0 transition-transform duration-300',
              activeId === faq.id ? 'rotate-180 text-primary' : '',
            ]"
          />
        </button>

        <!-- Answer Container -->
        <div
          v-show="activeId === faq.id"
          class="px-5 pb-5 pt-1 text-xs sm:text-sm text-text-secondary leading-relaxed font-sans border-t border-border/40 bg-surface-alt/10 space-y-3"
        >
          <p class="whitespace-pre-line">{{ faq.answer }}</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-12 border border-dashed border-border rounded-xl space-y-2 bg-surface-alt/5"
    >
      <p class="text-sm font-semibold text-text-secondary">
        Pertanyaan tidak ditemukan
      </p>
      <p class="text-xs text-text-muted">
        Coba masukkan kata kunci lain seperti "pdf", "error", atau "gemini".
      </p>
    </div>
  </div>
</template>
