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
    server: {
      allowedHosts: true,
    },
  },

  supabase: {
    redirect: true,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/", "/register", "/panduan-pengujian", "/panduan-pengujian/**"],
    },
  },

  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY || "",
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
