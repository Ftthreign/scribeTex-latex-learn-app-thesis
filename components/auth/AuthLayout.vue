<script setup lang="ts">
import { IconMathIntegrals, IconChevronLeft } from "@tabler/icons-vue";

defineProps<{
  title: string;
  subtitle: string;
}>();
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col lg:flex-row">
    <div
      class="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-12"
    >
      <div
        class="absolute top-0 right-0 size-[600px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-[120px]"
      ></div>
      <div
        class="absolute bottom-0 left-0 size-[400px] bg-blue-400/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-[100px]"
      ></div>

      <NuxtLink
        to="/"
        class="flex items-center gap-2.5 text-white relative z-10 w-fit"
      >
        <div
          class="size-10 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-sm"
        >
          <IconMathIntegrals class="size-6" />
        </div>
        <span class="text-2xl font-display font-bold tracking-tight"
          >ScribeTex</span
        >
      </NuxtLink>

      <div class="relative z-10 max-w-md">
        <h1
          class="text-5xl font-display font-bold text-white leading-tight mb-6"
        >
          Wujudkan Artikel Ilmiah Sempurna dengan LaTeX.
        </h1>
        <p class="text-blue-100 text-lg leading-relaxed font-sans opacity-80">
          Platform terpadu untuk mempelajari, menulis, dan mempublikasikan karya
          akademik Anda dengan standar global.
        </p>
      </div>
    </div>

    <!-- Right Column: Form -->
    <div
      class="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 bg-surface relative"
    >
      <!-- Back to Home (Mobile only/Top) -->
      <div class="absolute top-8 left-6 lg:left-20">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors text-sm font-medium font-sans"
        >
          <IconChevronLeft class="size-4" />
          <span>Kembali ke Beranda</span>
        </NuxtLink>
      </div>

      <div class="max-w-md w-full mx-auto space-y-10">
        <div class="space-y-3">
          <h2
            class="text-3xl md:text-4xl font-display font-bold text-text-primary"
          >
            {{ title }}
          </h2>
          <p class="text-text-secondary font-sans leading-relaxed">
            {{ subtitle }}
          </p>
        </div>

        <!-- Form Slot -->
        <slot />
      </div>

      <!-- Footer Info -->
      <div
        class="mt-20 text-center lg:text-left text-xs text-text-muted font-sans border-t border-border/50 pt-6"
      >
        <p>© 2026 ScribeTex — Akademik Editorial Standard.</p>
      </div>
    </div>
  </div>
</template>
