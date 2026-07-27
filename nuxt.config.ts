import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  devtools: { enabled: true },

  modules: ["@pinia/nuxt", "@vueuse/nuxt", "@nuxtjs/supabase"],

  css: ["~/assets/css/main.css", "katex/dist/katex.min.css"],

  vite: {
    build: {
      target: "es2022",
    },
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["pdfjs-dist"],
    },
    server: {
      allowedHosts: true,
    },
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: true,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: [
        "/",
        "/register",
        "/panduan-pengujian",
        "/panduan-pengujian/**",
      ],
    },
  },

  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY || "",
    databaseUrl: process.env.DATABASE_URL || "",
    public: {
      supabaseUrl: process.env.SUPABASE_URL || "",
      supabaseAnonKey: process.env.SUPABASE_KEY || "",
    },
  },

  nitro: {
    esbuild: {
      options: {
        target: "es2022",
      },
    },
    experimental: {
      wasm: true,
    },
  },
  build: {
    transpile: ["katex"],
  },
});
