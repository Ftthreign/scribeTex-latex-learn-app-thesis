<template>
  <section id="comparison" class="py-24 overflow-hidden relative">
    <div class="container mx-auto px-6">
      <div class="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <h2
          class="text-4xl md:text-5xl font-display font-bold text-text-primary tracking-tight"
        >
          Standar Dunia Akademik
        </h2>
        <p
          class="text-text-secondary text-base md:text-lg leading-relaxed font-sans"
        >
          Bandingkan bagaimana LaTeX memberikan kontrol penuh dan konsistensi
          tinggi dibandingkan pengolah kata tradisional.
        </p>
      </div>

      <div class="grid lg:grid-cols-12 gap-12 items-start">
        <div class="lg:col-span-6 space-y-5">
          <div
            v-for="(item, i) in benefits"
            :key="i"
            class="comp-item bg-surface border border-border p-6 rounded-2xl flex items-start gap-5 group hover:border-primary/40 transition-all duration-300 shadow-xs"
          >
            <div
              class="size-12 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300"
            >
              <component :is="item.icon" class="size-6" />
            </div>
            <div class="space-y-1.5">
              <h4
                class="text-lg font-sans font-bold text-text-primary group-hover:text-primary transition-colors duration-200"
              >
                {{ item.title }}
              </h4>
              <p class="text-sm text-text-secondary leading-relaxed font-sans">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>

        <div class="comp-table lg:col-span-6 relative">
          <div
            class="absolute inset-0 bg-primary/5 rounded-3xl -rotate-1 -z-10"
          ></div>

          <div
            class="bg-surface rounded-3xl border border-border p-8 shadow-card relative overflow-hidden flex flex-col justify-between h-full"
          >
            <div>
              <div
                class="flex items-center justify-between mb-8 pb-4 border-b border-border/60"
              >
                <h3 class="text-xl font-sans font-bold text-text-primary">
                  Perbandingan Kemampuan
                </h3>
                <span
                  class="text-xs font-semibold px-3 py-1 rounded-md bg-surface-alt text-text-secondary"
                >
                  Tinjauan Singkat
                </span>
              </div>

              <!-- Rows -->
              <div class="space-y-6">
                <div
                  v-for="(row, i) in comparison"
                  :key="i"
                  class="grid grid-cols-2 gap-6 pb-6 border-b border-border/40 last:border-0 last:pb-0"
                >
                  <!-- Word Side -->
                  <div class="space-y-1">
                    <p
                      class="text-[10px] font-bold uppercase text-text-muted tracking-wider"
                    >
                      Word / Tradisional
                    </p>
                    <p
                      class="text-sm text-text-secondary font-medium flex items-center gap-2"
                    >
                      <IconX class="size-4 text-error shrink-0" />
                      <span>{{ row.word }}</span>
                    </p>
                  </div>

                  <!-- LaTeX Side -->
                  <div class="space-y-1">
                    <p
                      class="text-[10px] font-bold uppercase text-primary tracking-wider"
                    >
                      LaTeX Standard
                    </p>
                    <p
                      class="text-sm text-text-primary font-bold flex items-center gap-2"
                    >
                      <IconCheck class="size-4 text-primary shrink-0" />
                      <span>{{ row.latex }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bottom Quote Box -->
            <div
              class="mt-8 p-5 rounded-xl bg-primary text-white shadow-md shadow-primary/20 relative overflow-hidden"
            >
              <div
                class="absolute -right-6 -bottom-6 size-24 bg-white/10 rounded-full blur-xs"
              ></div>
              <p class="text-sm font-sans italic leading-relaxed relative z-10">
                "LaTeX memisahkan konten dari desain, membiarkan Anda fokus pada
                esensi tulisan ilmiah, bukan bagaimana tata letak tampilannya."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  IconLayout,
  IconCalculator,
  IconBook,
  IconCheck,
  IconX,
} from "@tabler/icons-vue";
import { onMounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const benefits = [
  {
    title: "Manajemen Referensi Otomatis",
    description:
      "BibTeX menangani ribuan sitasi secara otomatis dan akurat tanpa khawatir penomoran yang terlewat.",
    icon: IconBook,
  },
  {
    title: "Notasi Matematika Sempurna",
    description:
      "Standar baku internasional untuk menulis formula rumit dengan presisi tipografi tingkat tinggi.",
    icon: IconCalculator,
  },
  {
    title: "Layout Editorial Akademis",
    description:
      "Setiap halaman yang dihasilkan mematuhi kaidah tata letak publikasi jurnal ilmiah global ternama.",
    icon: IconLayout,
  },
];

const comparison = [
  {
    word: "Format manual rentan berantakan",
    latex: "Layout terprogram, konsisten otomatis",
  },
  {
    word: "Render rumus lambat & buram",
    latex: "Notasi matematika tajam & baku",
  },
  {
    word: "File biner berat & lambat dibuka",
    latex: "Teks murni, sangat ringan & portabel",
  },
  {
    word: "Sitasi manual menyita waktu",
    latex: "BibTeX terintegrasi mulus",
  },
];

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);

  // Reveal benefits items
  gsap.fromTo(
    ".comp-item",
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      scrollTrigger: {
        trigger: "#comparison",
        start: "top 75%",
      },
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out",
    },
  );

  // Reveal comparison table
  gsap.fromTo(
    ".comp-table",
    { scale: 0.95, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      scrollTrigger: {
        trigger: "#comparison",
        start: "top 70%",
      },
      duration: 1,
      ease: "power3.out",
      delay: 0.2,
    },
  );
});
</script>
