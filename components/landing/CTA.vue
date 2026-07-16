<template>
  <section
    class="landing-cta sticky top-0 z-10 bg-background min-h-svh flex items-center py-24"
  >
    <div class="container mx-auto px-6">
      <div
        class="cta-card bg-text-primary rounded-[32px] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl"
      >
        <div
          class="absolute top-0 right-0 size-64 bg-primary/20 rounded-full blur-[100px]"
        ></div>
        <div
          class="absolute bottom-0 left-0 size-64 bg-blue-500/10 rounded-full blur-[100px]"
        ></div>

        <div class="relative z-10 space-y-10">
          <div class="space-y-6">
            <h2
              class="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-white max-w-3xl mx-auto leading-[1.15] tracking-tight"
            >
              Siap Menulis <br />
              <span class="text-primary-light">Artikel Ilmiah</span>
              Berkualitas?
            </h2>
            <p
              class="text-text-muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-sans"
            >
              Bergabunglah dengan ratusan akademisi lainnya dan nikmati alur
              pembelajaran LaTeX yang terstruktur, cepat, dan didampingi AI.
            </p>
          </div>

          <div
            class="flex flex-col sm:flex-row justify-center gap-4 pt-4 relative z-10"
          >
            <NuxtLink
              to="/register"
              class="btn-primary btn-lg shadow-lg shadow-primary/30"
            >
              Mulai Belajar Sekarang
            </NuxtLink>
            <button
              class="btn-secondary btn-lg bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Konsultasi AI Gratis
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
