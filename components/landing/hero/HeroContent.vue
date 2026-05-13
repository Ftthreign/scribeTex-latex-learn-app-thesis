<template>
  <div
    class="hero-content lg:col-span-7 space-y-7 relative text-center lg:text-left order-2 lg:order-1"
  >
    <div
      class="hero-el inline-flex items-center gap-2.5 px-4 py-[7px] rounded-full bg-primary-light border border-primary/10 text-primary text-[13px] font-bold tracking-wide mx-auto lg:mx-0 shadow-xs"
    >
      <span class="text-base leading-none">✦</span>
      Platform Pembelajaran LaTeX
    </div>

    <h1
      class="hero-el text-4xl sm:text-[42px] md:text-[52px] font-display font-bold leading-[1.18] tracking-tight text-text-primary"
    >
      Kuasai LaTeX<br />
      <em class="text-primary not-italic font-display">Untuk Karya Ilmiah</em
      ><br />
      yang Berkesan
    </h1>

    <p
      class="hero-el text-base sm:text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 font-sans"
      style="line-height: 1.7"
    >
      Platform pembelajaran LaTeX interaktif dengan modul terstruktur, editor
      langsung, kompilasi PDF, dan chatbot AI — dirancang untuk mahasiswa dan
      dosen.
    </p>

    <div
      class="hero-el flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 pt-1"
    >
      <NuxtLink
        to="/register"
        class="btn-primary btn-lg shadow-md shadow-primary/25 w-full sm:w-auto"
        aria-label="Mulai belajar LaTeX secara gratis"
      >
        Mulai Belajar Gratis →
      </NuxtLink>
      <button
        class="btn-ghost-outline btn-lg w-full sm:w-auto"
        aria-label="Lihat demo platform ScribeTex"
      >
        Lihat Demo ▶
      </button>
    </div>
  </div>
</template>

<style scoped>
.btn-ghost-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--color-primary);
  color: var(--color-primary);
  background: transparent;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ghost-outline:hover {
  background: var(--color-primary-light);
}
</style>
