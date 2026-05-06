<template>
  <nav 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="[isScrolled ? 'glass py-3' : 'bg-transparent py-5']"
  >
    <div class="container mx-auto px-6 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="size-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open-text"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/><path d="M6 8h2"/><path d="M6 12h2"/><path d="M16 8h2"/><path d="M16 12h2"/></svg>
        </div>
        <span class="text-xl font-display font-bold tracking-tight">ScribeTex</span>
      </div>

      <div class="hidden md:flex items-center gap-8 font-medium">
        <a href="#features" class="hover:text-primary transition-colors">Fitur</a>
        <a href="#how-it-works" class="hover:text-primary transition-colors">Cara Kerja</a>
        <a href="#about" class="hover:text-primary transition-colors">Tentang</a>
      </div>

      <div class="flex items-center gap-4">
        <button class="px-5 py-2 rounded-full font-semibold hover:bg-accent transition-colors">Masuk</button>
        <button class="px-6 py-2 bg-primary text-primary-foreground rounded-full font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all">Mulai Belajar</button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const isScrolled = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20
  })
})
</script>
