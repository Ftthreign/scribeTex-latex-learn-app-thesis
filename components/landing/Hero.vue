<template>
  <section class="relative min-h-screen flex items-center pt-20 overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent blur-3xl"></div>
    <div class="absolute -top-24 -left-24 -z-10 size-96 bg-primary/10 rounded-full blur-3xl"></div>

    <div class="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
      <div class="space-y-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-semibold">
          <span class="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          AI-Powered LaTeX Learning
        </div>
        
        <h1 class="text-5xl lg:text-7xl font-bold leading-[1.1]">
          Kuasai <span class="text-gradient">LaTeX</span> untuk Artikel Ilmiah Anda.
        </h1>
        
        <p class="text-lg text-muted-foreground max-w-lg leading-relaxed">
          Platform edukasi interaktif yang menggabungkan kecerdasan AI (Gemini) dan kompilasi TeXLive untuk membantu Anda menulis dokumen ilmiah berkualitas tinggi.
        </p>

        <div class="flex flex-wrap gap-4">
          <button class="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all">
            Mulai Secara Gratis
          </button>
          <button class="px-8 py-4 border border-border rounded-2xl font-bold text-lg hover:bg-accent transition-all flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play-circle"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
            Lihat Demo
          </button>
        </div>

        <div class="flex items-center gap-6 pt-4">
          <div class="flex -space-x-3">
            <div v-for="i in 4" :key="i" class="size-10 rounded-full border-2 border-background bg-accent flex items-center justify-center text-xs font-bold">
              U{{ i }}
            </div>
          </div>
          <div class="text-sm">
            <p class="font-bold">500+ Mahasiswa</p>
            <p class="text-muted-foreground">Telah bergabung untuk belajar</p>
          </div>
        </div>
      </div>

      <div class="relative">
        <div class="absolute inset-0 bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        <div class="glass p-4 rounded-[2rem] shadow-2xl animate-float">
          <div class="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-inner">
            <div class="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-white/5">
              <div class="flex gap-1.5">
                <div class="size-3 rounded-full bg-red-500"></div>
                <div class="size-3 rounded-full bg-yellow-500"></div>
                <div class="size-3 rounded-full bg-green-500"></div>
              </div>
              <span class="text-[10px] text-white/40 font-mono uppercase tracking-widest ml-4">latex_editor.tex</span>
            </div>
            <div class="p-6 font-mono text-sm">
              <p class="text-blue-400">\documentclass<span class="text-white">{article}</span></p>
              <p class="text-blue-400">\usepackage<span class="text-white">{amsmath}</span></p>
              <p class="text-gray-500 mt-2">% Mulai menulis artikel Anda</p>
              <p class="text-blue-400">\begin<span class="text-white">{document}</span></p>
              <p class="text-green-400 pl-4">\section<span class="text-white">{Pendahuluan}</span></p>
              <p class="text-white pl-4">Aplikasi ini mempermudah belajar LaTeX...</p>
              <p class="text-blue-400">\end<span class="text-white">{document}</span></p>
              <div class="mt-4 flex items-center gap-2 text-primary font-bold">
                <span class="animate-pulse">|</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Badge -->
        <div class="absolute -bottom-6 -left-6 glass p-4 rounded-2xl shadow-xl flex items-center gap-3">
          <div class="size-10 bg-green-500/20 text-green-600 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Kompilasi PDF</p>
            <p class="text-sm font-bold">Berhasil Diselesaikan</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
