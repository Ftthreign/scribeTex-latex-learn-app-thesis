<template>
  <footer class="bg-surface border-t border-border pt-20 pb-12">
    <div class="container mx-auto px-6">
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16"
      >
        <div class="lg:col-span-2 space-y-6">
          <a
            href="#"
            class="flex items-center gap-2.5 group cursor-pointer w-fit"
          >
            <div
              class="size-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm group-hover:rotate-6 transition-transform duration-300"
            >
              <IconMathIntegrals class="size-5" stroke-width="2.5" />
            </div>
            <span class="text-2xl font-display font-bold tracking-tight">
              <span class="text-text-primary">Scribe</span
              ><span class="text-primary">Tex</span>
            </span>
          </a>

          <p
            class="text-text-secondary text-base leading-relaxed font-sans max-w-sm"
          >
            Platform pembelajaran LaTeX terpadu untuk mendukung penulisan
            artikel ilmiah dan naskah akademis berkualitas tinggi bagi mahasiswa
            dan peneliti.
          </p>

          <div class="flex gap-3 pt-2">
            <a
              v-for="(social, i) in socials"
              :key="i"
              href="#"
              class="size-10 rounded-xl bg-surface-alt border border-border flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-1 transition-all duration-300 shadow-xs cursor-pointer"
              :aria-label="social.label"
            >
              <component :is="social.icon" class="size-5" />
            </a>
          </div>
        </div>

        <div>
          <h4
            class="text-base font-sans font-bold text-text-primary mb-6 tracking-wide"
          >
            Kurikulum
          </h4>
          <ul class="space-y-3.5 font-sans">
            <li v-for="link in curriculumLinks" :key="link.label">
              <a
                :href="link.href"
                class="text-sm text-text-secondary hover:text-primary transition-colors inline-flex items-center gap-2 group"
              >
                <span
                  class="size-1 rounded-full bg-border group-hover:bg-primary transition-colors"
                ></span>
                <span>{{ link.label }}</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4
            class="text-base font-sans font-bold text-text-primary mb-6 tracking-wide"
          >
            Layanan
          </h4>
          <ul class="space-y-3.5 font-sans">
            <li v-for="link in serviceLinks" :key="link.label">
              <a
                :href="link.href"
                class="text-sm text-text-secondary hover:text-primary transition-colors inline-flex items-center gap-2 group"
              >
                <span
                  class="size-1 rounded-full bg-border group-hover:bg-primary transition-colors"
                ></span>
                <span>{{ link.label }}</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4
            class="text-base font-sans font-bold text-text-primary mb-6 tracking-wide"
          >
            Dukungan
          </h4>
          <ul class="space-y-3.5 font-sans">
            <li v-for="link in supportLinks" :key="link.label">
              <a
                :href="link.href"
                class="text-sm text-text-secondary hover:text-primary transition-colors inline-flex items-center gap-2 group"
              >
                <span
                  class="size-1 rounded-full bg-border group-hover:bg-primary transition-colors"
                ></span>
                <span>{{ link.label }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted font-sans"
      >
        <div
          class="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6"
        >
          <p>© 2026 ScribeTex. Hak cipta dilindungi undang-undang.</p>
          <div class="flex items-center gap-4">
            <a href="#" class="hover:text-primary transition-colors">Privasi</a>
            <a href="#" class="hover:text-primary transition-colors"
              >Ketentuan</a
            >
          </div>
        </div>
        <div class="flex items-center gap-1.5 font-medium">
          <span>Dirancang dengan</span>
          <IconHeartFilled class="size-3.5 text-error animate-pulse" />
          <span>menggunakan Nuxt 3 & Gemini AI</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import {
  IconMathIntegrals,
  IconBrandInstagram,
  IconBrandGithub,
  IconBrandTwitter,
  IconHeartFilled,
} from "@tabler/icons-vue";

const socials = [
  { icon: IconBrandInstagram, label: "Instagram" },
  { icon: IconBrandTwitter, label: "Twitter" },
  { icon: IconBrandGithub, label: "GitHub" },
];

const curriculumLinks = [
  { label: "Sintaks Dasar", href: "#" },
  { label: "Format Paragraf", href: "#" },
  { label: "Persamaan Matematika", href: "#" },
  { label: "Tabel & Figur", href: "#" },
  { label: "Manajemen Sitasi", href: "#" },
];

const serviceLinks = [
  { label: "Live Preview KaTeX", href: "#" },
  { label: "Kompilasi TeXLive", href: "#" },
  { label: "AI Explainer Buddy", href: "#" },
  { label: "Pelacakan Progres", href: "#" },
];

const supportLinks = [
  { label: "Dokumentasi", href: "#" },
  { label: "Pertanyaan Umum", href: "#faq" },
  { label: "Kontak Tim", href: "#" },
  { label: "Lisensi Platform", href: "#" },
];
</script>
