import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  devtools: { enabled: true },

  modules: ["@pinia/nuxt", "@vueuse/nuxt", "@nuxtjs/supabase"],

  css: ["~/assets/css/main.css", "katex/dist/katex.min.css"],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["pdfjs-dist"],
    },
  },

  supabase: {
    redirect: false,
  },

  runtimeConfig: {
    geminiApiKey: "",
    databaseUrl: "",
    public: {
      supabaseUrl: "",
      supabaseAnonKey: "",
    },
  },

  nitro: {
    experimental: {
      wasm: true,
    },
  },
  build: {
    transpile: ["katex"],
  },
});
