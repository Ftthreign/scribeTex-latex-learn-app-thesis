<script setup lang="ts">
import {
  IconBrain,
  IconClock,
  IconDevices,
  IconMessageChatbot,
} from "@tabler/icons-vue";

import { ref } from "vue";
import Modal from "~/components/ui/Modal.vue";

const features = [
  {
    title: "AI Learning Buddy",
    description:
      "Dapatkan bimbingan cerdas dari AI yang memahami konteks penulisan ilmiah Anda secara real-time.",
    details: `
      <p>AI Buddy kami bukan sekadar chatbot biasa. Ia dilatih khusus menggunakan ribuan dokumentasi LaTeX dan standar penulisan artikel ilmiah internasional (IEEE, APA, Elsevier).</p>
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>Penjelasan Error:</strong> Salin pesan error dari compiler, dan AI akan menjelaskan penyebabnya dalam bahasa Indonesia yang mudah dimengerti.</li>
        <li><strong>Optimasi Kalimat:</strong> Minta AI untuk mengubah kalimat pasif menjadi aktif atau membuat kalimat lebih formal sesuai standar akademik.</li>
        <li><strong>Pencarian Perintah:</strong> Lupa cara membuat tabel kompleks? Cukup tanya AI, dan ia akan memberikan potongan kode yang siap digunakan.</li>
      </ul>
    `,
    icon: IconBrain,
    color: "primary",
  },
  {
    title: "Live PDF Compiler",
    description:
      "Kompilasi naskah LaTeX Anda secara instan tanpa perlu menginstal distribusi TeXLive yang berat.",
    details: `
      <p>Lupakan proses instalasi TeXLive atau MiKTeX yang memakan ruang penyimpanan bergiga-giga. Compiler cloud kami menangani semuanya untuk Anda.</p>
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>Server-Side Rendering:</strong> Proses kompilasi dilakukan di server kami yang cepat, memberikan hasil PDF dalam hitungan detik.</li>
        <li><strong>Template Siap Pakai:</strong> Akses berbagai template jurnal nasional dan internasional yang sudah terkonfigurasi dengan benar.</li>
        <li><strong>Isolasi Keamanan:</strong> Setiap proses kompilasi berjalan dalam container terisolasi untuk memastikan keamanan data Anda.</li>
      </ul>
    `,
    icon: IconClock,
    color: "success",
  },
  {
    title: "Kurikulum Terstruktur",
    description:
      "Materi pembelajaran yang disusun dari dasar hingga mahir untuk membantu publikasi jurnal internasional.",
    details: `
      <p>Kurikulum ScribeTex dirancang oleh para akademisi berpengalaman untuk membantu Anda dari nol hingga siap publikasi.</p>
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>Modul Progresif:</strong> Mulai dari instalasi paket, sintaks matematika, hingga manajemen bibliografi menggunakan BibTeX.</li>
        <li><strong>Checkpoint Kompetensi:</strong> Tes kecil di setiap akhir modul untuk memastikan Anda memahami materi sebelum lanjut ke tahap berikutnya.</li>
        <li><strong>Studi Kasus Jurnal:</strong> Latihan langsung menggunakan struktur artikel ilmiah nyata.</li>
      </ul>
    `,
    icon: IconDevices,
    color: "warning",
  },
  {
    title: "Interaktif Editor",
    description:
      "Editor berbasis CodeMirror 6 dengan fitur syntax highlighting dan auto-completion khusus LaTeX.",
    details: `
      <p>Editor kami dirancang khusus untuk memberikan pengalaman menulis yang nyaman dan produktif.</p>
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>Syntax Highlighting:</strong> Pembedaan warna yang jelas antara perintah (\command), argumen ({arg}), dan konten teks.</li>
        <li><strong>Auto-Completion:</strong> Prediksi perintah LaTeX saat Anda mengetik, mengurangi risiko typo.</li>
        <li><strong>Shortcut Akademik:</strong> Pintasan keyboard untuk menyisipkan lingkungan (environments) seperti equation, figure, dan table dengan cepat.</li>
      </ul>
    `,
    icon: IconMessageChatbot,
    color: "ai-primary",
  },
];

const activeFeature = ref<null | (typeof features)[0]>(null);
const isModalOpen = ref(false);

const openDetails = (feature: (typeof features)[0]) => {
  activeFeature.value = feature;
  isModalOpen.value = true;
};
</script>

<template>
  <section id="features" class="py-24 relative">
    <!-- Background subtle radial grid glow -->
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(26,86,219,0.03),transparent_70%)] pointer-events-none"
    ></div>

    <div class="container mx-auto px-6 relative z-10">
      <div class="text-center max-w-3xl mx-auto mb-20 space-y-4">
        <div
          class="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-light text-primary font-bold text-xs uppercase tracking-widest"
        >
          Keunggulan Platform
        </div>
        <h2
          class="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight"
        >
          Semua yang Anda Butuhkan untuk Menguasai LaTeX
        </h2>
        <p
          class="text-base sm:text-lg text-text-secondary leading-relaxed font-sans max-w-2xl mx-auto"
        >
          Platform kami dirancang khusus memandu Anda dari nol hingga mahir
          dalam menulis artikel ilmiah dengan presisi tipografi berstandar
          internasional.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <LandingFeatureCard
          v-for="(feature, i) in features"
          :key="i"
          class="feature-card"
          :title="feature.title"
          :description="feature.description"
          :icon="feature.icon"
          :color="feature.color"
          @learn-more="openDetails(feature)"
        />
      </div>
    </div>

    <!-- Detail Modal -->
    <Modal
      :is-open="isModalOpen"
      :title="activeFeature?.title || ''"
      @close="isModalOpen = false"
    >
      <div v-if="activeFeature" v-html="activeFeature.details"></div>
    </Modal>
  </section>
</template>
