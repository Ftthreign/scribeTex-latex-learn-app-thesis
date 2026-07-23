<script setup lang="ts">
import { IconCircleCheck } from "@tabler/icons-vue";

const steps = [
  {
    title: "Pilih Modul Belajar",
    description:
      "Mulai dari konsep dasar dokumen hingga pengelolaan referensi BibTeX yang kompleks.",
  },
  {
    title: "Latihan Langsung di Editor",
    description:
      "Tulis sintaks LaTeX secara interaktif dengan panduan editor cerdas kami.",
  },
  {
    title: "Kompilasi & Preview PDF",
    description:
      "Lihat hasil akhir dokumen Anda secara instan dalam format PDF standar publikasi.",
  },
  {
    title: "Konsultasi dengan AI",
    description:
      "Gunakan AI Buddy untuk memperbaiki error atau meminta saran penulisan paragraf akademik.",
  },
];
</script>

<template>
  <section id="how-it-works" class="py-24 relative overflow-hidden">
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-150 md:size-225 bg-primary/5 rounded-full blur-[140px] -z-10 pointer-events-none"
    ></div>

    <div class="container mx-auto px-6">
      <div class="grid lg:grid-cols-12 gap-16 items-center">
        <div class="lg:col-span-5 space-y-10">
          <div class="space-y-6">
            <h2
              class="text-3xl sm:text-4xl md:text-5xl font-display font-bold leading-[1.15] tracking-tight"
            >
              Bagaimana <span class="text-primary">ScribeTex</span> <br />
              Membantu Anda?
            </h2>
            <p
              class="text-base sm:text-lg text-text-secondary leading-relaxed font-sans"
            >
              Empat langkah terarah untuk mentransformasi cara Anda merancang
              dan menulis naskah ilmiah bermutu tinggi.
            </p>
          </div>

          <div class="space-y-8">
            <div
              v-for="(step, i) in steps"
              :key="i"
              class="step-item flex gap-5 group"
            >
              <div
                class="size-10 rounded-full bg-primary text-white flex items-center justify-center font-bold font-sans shrink-0 group-hover:scale-110 transition-transform duration-300"
              >
                {{ i + 1 }}
              </div>
              <div class="space-y-1 pt-1">
                <h4
                  class="text-lg sm:text-xl font-sans font-bold tracking-tight text-text-primary group-hover:text-primary transition-colors"
                >
                  {{ step.title }}
                </h4>
                <p
                  class="text-sm sm:text-base text-text-secondary leading-relaxed font-sans"
                >
                  {{ step.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-7 relative">
          <div
            class="how-it-works-mockup bg-code-bg rounded-2xl border border-code-border shadow-2xl overflow-hidden relative z-10"
          >
            <div
              class="flex items-center justify-between px-5 py-4 bg-code-surface border-b border-code-border"
            >
              <div class="flex gap-2">
                <div class="size-3 rounded-full bg-[#ff5f56]"></div>
                <div class="size-3 rounded-full bg-[#ffbd2e]"></div>
                <div class="size-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <div
                class="text-xs font-mono text-text-muted/60 uppercase tracking-widest"
              >
                Interactive Workflow
              </div>
            </div>

            <div class="p-8 aspect-video flex items-center justify-center">
              <div class="w-full max-w-sm space-y-6">
                <div
                  class="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div
                    class="size-12 rounded-lg bg-primary/20 text-primary flex items-center justify-center"
                  >
                    <IconCircleCheck class="size-6" />
                  </div>
                  <div class="space-y-2">
                    <p
                      class="text-lg sm:text-xl font-sans font-bold text-white tracking-tight"
                    >
                      Siklus Belajar Interaktif
                    </p>
                    <p
                      class="text-text-muted text-xs sm:text-sm leading-relaxed font-sans"
                    >
                      Tulis sintaks, kompilasi waktu-nyata, dan dapatkan umpan
                      balik AI dalam lingkungan yang terintegrasi penuh.
                    </p>
                  </div>
                </div>
                <div class="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div class="w-3/4 h-full bg-primary animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="absolute -bottom-10 -right-10 size-64 bg-primary/20 rounded-full blur-[100px] -z-10"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>
