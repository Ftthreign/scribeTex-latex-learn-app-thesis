<template>
  <main class="relative bg-background">
    <LandingNavbar />
    
    <LandingHero />

    <!-- Feature Section -->
    <section id="features" class="py-24">
      <div class="container mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 class="text-primary font-bold uppercase tracking-widest text-sm">Fitur Unggulan</h2>
          <p class="text-4xl md:text-5xl font-bold">Segala yang Anda butuhkan untuk menguasai LaTeX</p>
          <p class="text-lg text-muted-foreground">Platform kami dirancang khusus untuk memandu Anda dari nol hingga mahir dalam menulis artikel ilmiah.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <LandingFeatureCard 
            title="AI Learning Buddy" 
            description="Tanyakan apa saja tentang LaTeX ke chatbot berbasis Gemini kami. Penjelasan error secara instan dan cerdas."
            color-class="bg-blue-500/10 text-blue-600"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
            </template>
          </LandingFeatureCard>

          <LandingFeatureCard 
            title="PDF Compiler Service" 
            description="Kompilasi kode LaTeX Anda langsung di browser menggunakan TeXLive. Lihat hasil PDF asli secara real-time."
            color-class="bg-purple-500/10 text-purple-600"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15h3"/><path d="M9 11h6"/><path d="M9 19h6"/></svg>
            </template>
          </LandingFeatureCard>

          <LandingFeatureCard 
            title="Modul Terstruktur" 
            description="Kurikulum yang disusun secara sistematis mulai dari dasar hingga penulisan bibliografi yang kompleks."
            color-class="bg-orange-500/10 text-orange-600"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>
            </template>
          </LandingFeatureCard>
        </div>
      </div>
    </section>

    <!-- How it Works Section -->
    <section id="how-it-works" class="py-24 bg-secondary/20">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row gap-16 items-center">
          <div class="md:w-1/2 space-y-8">
            <h2 class="text-4xl font-bold">Bagaimana <span class="text-gradient">ScribeTex</span> Bekerja?</h2>
            <div class="space-y-12">
              <div v-for="(step, i) in steps" :key="i" class="flex gap-6">
                <div class="size-12 rounded-2xl bg-white shadow-lg flex items-center justify-center font-bold text-xl text-primary shrink-0">
                  {{ i + 1 }}
                </div>
                <div class="space-y-2">
                  <h4 class="text-xl font-bold">{{ step.title }}</h4>
                  <p class="text-muted-foreground">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="md:w-1/2 relative">
            <div class="glass aspect-square rounded-[3rem] p-1 overflow-hidden shadow-2xl">
              <div class="bg-accent h-full w-full rounded-[2.8rem] flex items-center justify-center">
                <!-- Visual Placeholder for interaction -->
                 <div class="text-center p-8 space-y-4">
                    <div class="size-24 bg-primary/20 rounded-full mx-auto flex items-center justify-center text-primary animate-bounce">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    </div>
                    <p class="text-xl font-bold">Interaktif & Real-time</p>
                    <p class="text-muted-foreground">Ketik kode, lihat preview, dapatkan masukan AI secara langsung.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-24">
      <div class="container mx-auto px-6">
        <div class="bg-primary rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl shadow-primary/20">
          <div class="absolute -top-24 -right-24 size-96 bg-white/10 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-24 -left-24 size-96 bg-white/10 rounded-full blur-3xl"></div>
          
          <h2 class="text-4xl md:text-6xl font-bold text-primary-foreground max-w-4xl mx-auto leading-tight">
            Siap untuk Menulis Artikel Ilmiah yang Sempurna?
          </h2>
          <p class="text-primary-foreground/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Bergabunglah sekarang dan rasakan pengalaman belajar LaTeX yang lebih cerdas, cepat, dan terstruktur.
          </p>
          <div class="flex flex-wrap justify-center gap-6 pt-4">
            <button class="px-10 py-5 bg-white text-primary rounded-2xl font-bold text-xl shadow-xl hover:scale-105 transition-all">
              Daftar Sekarang
            </button>
            <button class="px-10 py-5 border-2 border-white/20 text-white rounded-2xl font-bold text-xl hover:bg-white/10 transition-all">
              Hubungi Kami
            </button>
          </div>
        </div>
      </div>
    </section>

    <LandingFooter />
  </main>
</template>

<script setup lang="ts">
const steps = [
  {
    title: 'Pilih Modul Belajar',
    description: 'Pilih kurikulum yang sesuai dengan tingkat kemahiran Anda, mulai dari Beginner hingga Advanced.'
  },
  {
    title: 'Latihan Kode Interaktif',
    description: 'Tulis kode LaTeX di editor kami yang dilengkapi dengan syntax highlighting dan autocomplete.'
  },
  {
    title: 'Dapatkan Bimbingan AI',
    description: 'Jika menemukan kesulitan atau error, asisten AI kami siap memberikan penjelasan mendalam.'
  },
  {
    title: 'Kompilasi & Unduh PDF',
    description: 'Kompilasi dokumen Anda dan unduh hasilnya dalam format PDF yang siap dipublikasikan.'
  }
]
</script>
