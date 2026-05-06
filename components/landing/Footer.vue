<template>
  <footer class="bg-secondary/30 pt-20 pb-10 border-t border-border">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div class="col-span-1 md:col-span-2 space-y-6">
          <div class="flex items-center gap-2">
            <div class="size-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <span class="text-xl font-display font-bold">ScribeTex</span>
          </div>
          <p class="text-muted-foreground max-w-sm">
            Platform pembelajaran LaTeX terpadu untuk mendukung penulisan artikel ilmiah berkualitas tinggi bagi mahasiswa dan peneliti.
          </p>
          <div class="flex gap-4">
            <div v-for="i in 3" :key="i" class="size-10 rounded-full bg-accent flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </div>
          </div>
        </div>

        <div>
          <h4 class="font-bold mb-6">Navigasi</h4>
          <ul class="space-y-4 text-muted-foreground">
            <li><a href="#" class="hover:text-primary transition-colors">Modul Belajar</a></li>
            <li><a href="#" class="hover:text-primary transition-colors">Latihan Interaktif</a></li>
            <li><a href="#" class="hover:text-primary transition-colors">AI Chatbot</a></li>
            <li><a href="#" class="hover:text-primary transition-colors">Pricing</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold mb-6">Bantuan</h4>
          <ul class="space-y-4 text-muted-foreground">
            <li><a href="#" class="hover:text-primary transition-colors">Dokumentasi</a></li>
            <li><a href="#" class="hover:text-primary transition-colors">Kontak Kami</a></li>
            <li><a href="#" class="hover:text-primary transition-colors">FAQ</a></li>
            <li><a href="#" class="hover:text-primary transition-colors">Kebijakan Privasi</a></li>
          </ul>
        </div>
      </div>

      <div class="pt-8 border-t border-border flex flex-col md:row items-center justify-between gap-4 text-sm text-muted-foreground text-center md:text-left">
        <p>© 2024 ScribeTex. All rights reserved.</p>
        <p>Built with ❤️ using Nuxt 3 & Gemini AI</p>
      </div>
    </div>
  </footer>
</template>
