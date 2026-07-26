<template>
  <section
    id="faq"
    class="py-24 bg-surface-alt/40 border-t border-b border-border/40 relative"
  >
    <div class="container mx-auto px-6">
      <div class="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <h2
          class="text-3xl md:text-5xl font-display font-bold text-text-primary tracking-tight"
        >
          Pertanyaan Umum (FAQ)
        </h2>
        <p
          class="text-text-secondary text-base leading-relaxed font-sans max-w-lg mx-auto"
        >
          Temukan jawaban cepat untuk pertanyaan seputar teknis platform,
          lisensi, dan dukungan AI.
        </p>
      </div>

      <div class="max-w-3xl mx-auto space-y-4">
        <div
          v-for="(item, i) in faqs"
          :key="i"
          class="faq-item bg-surface rounded-2xl border border-border overflow-hidden transition-all duration-300 shadow-xs hover:border-primary/30"
          :class="{ 'ring-2 ring-primary/10 border-primary/40': open === i }"
        >
          <button
            @click="toggle(i)"
            class="w-full px-6 py-5 text-left flex items-center justify-between gap-4 transition-colors cursor-pointer group"
            :aria-expanded="open === i"
          >
            <span
              class="text-base sm:text-lg font-sans font-bold text-text-primary group-hover:text-primary transition-colors"
            >
              {{ item.q }}
            </span>
            <div
              class="size-8 rounded-lg bg-surface-alt flex items-center justify-center text-text-secondary group-hover:text-primary group-hover:bg-primary-light transition-all shrink-0"
            >
              <IconChevronDown
                class="size-4 transition-transform duration-300"
                :class="{ 'rotate-180 text-primary': open === i }"
              />
            </div>
          </button>

          <Transition
            enter-active-class="transition-all duration-200 ease-out overflow-hidden"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-40 opacity-100"
            leave-active-class="transition-all duration-150 ease-in overflow-hidden"
            leave-from-class="max-h-40 opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >
            <div v-if="open === i" class="px-6 pb-5 pt-0">
              <div class="h-px bg-border/40 w-full mb-4"></div>
              <p
                class="text-sm sm:text-base text-text-secondary leading-relaxed font-sans"
              >
                {{ item.a }}
              </p>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconChevronDown } from "@tabler/icons-vue";
import { ref, onMounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const open = ref<number | null>(0);

const toggle = (i: number) => {
  open.value = open.value === i ? null : i;
};

const faqs = [
  {
    q: "Apakah aplikasi ini sepenuhnya gratis?",
    a: "Ya, ScribeTex menyediakan modul kurikulum dasar yang dapat diakses secara bebas oleh mahasiswa. Kami juga merencanakan fitur lanjutan untuk kolaborasi tim dan template jurnal eksklusif.",
  },
  {
    q: "Apakah saya perlu menginstal TeXLive atau paket LaTeX di laptop?",
    a: "Sama sekali tidak. ScribeTex mengoperasikan mesin kompilator LaTeX otomatis di sisi server terisolasi. Anda cukup mengetik melalui browser dan langsung mendapatkan hasil PDF berstandar tinggi.",
  },
  {
    q: "Bagaimana cara kerja Pembimbing AI dalam mendeteksi error?",
    a: "Asisten AI kami dilengkapi kecerdasan buatan terpercaya yang dilatih dengan konteks sintaksis LaTeX. Ketika terjadi kegagalan kompilasi, AI akan menganalisis log keluaran kompilasi dan memberikan penjelasan yang mudah dipahami beserta saran kode perbaikan.",
  },
  {
    q: "Apakah dokumen PDF akhir siap dikirimkan ke penerbit jurnal ilmiah?",
    a: "Tentu saja. PDF dikompilasi secara asali (native) menggunakan mesin TeX yang presisi, sehingga font, kerning, dan resolusi grafisnya memenuhi baku mutu publikasi jurnal internasional terindeks.",
  },
];

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo(
    ".faq-item",
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      scrollTrigger: {
        trigger: "#faq",
        start: "top 80%",
      },
      stagger: 0.1,
      duration: 0.6,
      ease: "power2.out",
    },
  );
});
</script>
