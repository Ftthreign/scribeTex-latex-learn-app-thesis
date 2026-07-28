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
    redirect: false,
  },

  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY || "",
    databaseUrl: process.env.DATABASE_URL || "",
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
