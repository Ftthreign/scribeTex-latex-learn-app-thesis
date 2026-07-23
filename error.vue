<script setup lang="ts">
import { computed } from "vue";
import type { NuxtError } from "#app";
import { clearError } from "#app";
import {
  IconAlertTriangle,
  IconChevronRight,
  IconArrowLeft,
  IconLifebuoy,
  IconLink,
} from "@tabler/icons-vue";

const props = defineProps<{
  error: NuxtError;
}>();

// Helper to compute Levenshtein distance
const getLevenshteinDistance = (a: string, b: string): number => {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1, // deletion
          ),
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

const statusCode = computed(() => props.error?.statusCode || 404);
const requestedPath = computed(() => {
  const err = props.error as any;
  return err?.url || "";
});

const message = computed(() => {
  if (statusCode.value === 404) {
    return "Halaman yang Anda cari tidak dapat ditemukan. Kemungkinan tautan rusak atau halaman telah dipindahkan.";
  }
  return props.error?.message || "Terjadi kesalahan internal pada server kami.";
});

// Known registered routes
const knownRoutes = [
  { path: "/", label: "Beranda" },
  { path: "/login", label: "Masuk (Login)" },
  { path: "/register", label: "Daftar Akun" },
  { path: "/dashboard", label: "Dashboard Belajar" },
  { path: "/modules", label: "Modul Pembelajaran" },
  { path: "/articles", label: "Daftar Artikel" },
  { path: "/progress", label: "Progres Belajar" },
  { path: "/admin", label: "Dashboard Admin" },
];

// Compute recommended routes based on distance <= 4
const recommendedRoutes = computed(() => {
  if (statusCode.value !== 404 || !requestedPath.value) return [];

  // Normalize current path (remove query params, hashes, trailing slashes)
  const pathToCheck =
    requestedPath.value.split("?")[0].split("#")[0].replace(/\/$/, "") || "/";

  return knownRoutes
    .map((route) => {
      const dist = getLevenshteinDistance(
        pathToCheck.toLowerCase(),
        route.path.toLowerCase(),
      );
      return { ...route, distance: dist };
    })
    .filter((route) => route.distance <= 4 && route.path !== pathToCheck)
    .sort((a, b) => a.distance - b.distance);
});

const handleClearError = () => clearError({ redirect: "/" });
const handleRedirect = (path: string) => clearError({ redirect: path });
</script>

<template>
  <div
    class="min-h-screen bg-(--color-bg) flex flex-col items-center justify-center p-6 font-sans"
  >
    <div class="max-w-xl w-full text-center space-y-8">
      <!-- Academic Icon Badge -->
      <div
        class="inline-flex items-center justify-center size-20 rounded-full bg-error-light text-(--color-error) animate-bounce"
      >
        <IconAlertTriangle class="size-10" />
      </div>

      <!-- Main Title -->
      <div class="space-y-3">
        <h1
          class="text-7xl md:text-8xl font-display font-bold text-(--color-error)/80 tracking-tight"
        >
          {{ statusCode }}
        </h1>
        <h2
          class="text-2xl md:text-3xl font-display font-semibold text-(--color-text-primary)"
        >
          {{ statusCode === 404 ? "Page Not Found" : "Internal Server Error" }}
        </h2>
      </div>

      <!-- Router / System Error Block -->
      <div
        class="bg-code-bg border border-code-border rounded-xl p-5 text-left font-mono text-[13px] text-code-text shadow-lg overflow-x-auto select-none"
      >
        <div
          class="flex items-center justify-between pb-3 mb-3 border-b border-code-border/40 text-(--color-text-muted) text-xs"
        >
          <span>scribetex_router.log</span>
          <span
            class="px-2 py-0.5 rounded bg-(--color-error)/10 text-(--color-error) text-[10px] font-bold"
            >ROUTE_ERROR</span
          >
        </div>
        <div class="space-y-1.5 leading-relaxed">
          <template v-if="statusCode === 404">
            <p class="text-(--color-error) font-semibold">
              ! Router Error: Path '{{ requestedPath }}' not resolved.
            </p>
            <p class="text-(--color-error)">Status: NOT_FOUND (Code 404)</p>
            <p class="text-(--color-text-muted)">
              Reason: The request did not match any registered routes.
            </p>
          </template>
          <template v-else>
            <p class="text-(--color-error) font-semibold">
              ! Server Error: Exception occurred.
            </p>
            <p class="text-(--color-text-muted)">
              Status: SERVER_ERROR (Code {{ statusCode }})
            </p>
            <p class="text-(--color-text-muted)">Message: {{ message }}</p>
          </template>
          <div
            class="flex items-center gap-1.5 mt-3 text-success font-semibold"
          >
            <IconChevronRight class="size-4 animate-pulse" />
            <span class="text-code-accent"
              >Action: Please return to home document.</span
            >
          </div>
        </div>
      </div>

      <!-- Route Recommendations using Levenshtein distance <= 4 -->
      <div
        v-if="recommendedRoutes.length > 0"
        class="bg-(--color-surface) border border-border rounded-xl p-5 text-left shadow-sm space-y-3"
      >
        <h3
          class="text-sm font-semibold text-(--color-text-primary) flex items-center gap-2"
        >
          <IconLink class="size-4 text-primary" />
          Apakah maksud Anda salah satu halaman berikut?
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            v-for="route in recommendedRoutes"
            :key="route.path"
            @click="handleRedirect(route.path)"
            class="flex items-center justify-between p-2.5 rounded-lg border border-border hover:border-primary hover:bg-primary-light text-left transition-all group cursor-pointer"
          >
            <div>
              <div
                class="text-xs font-semibold text-(--color-text-primary) group-hover:text-primary"
              >
                {{ route.label }}
              </div>
              <div class="text-[10px] text-(--color-text-muted) font-mono">
                {{ route.path }}
              </div>
            </div>
            <IconChevronRight
              class="size-4 text-(--color-text-muted) group-hover:text-primary transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>

      <!-- User-friendly message -->
      <p
        class="text-text-secondary text-sm md:text-base max-w-md mx-auto leading-relaxed"
      >
        {{ message }}
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row justify-center gap-4 pt-2">
        <button
          @click="handleClearError"
          class="btn-primary btn-md md:btn-lg shadow-md shadow-primary/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <IconArrowLeft class="size-5" />
          <span>Kembali ke Beranda</span>
        </button>
        <a
          href="https://github.com/Ftthreign/scribeTex-latex-learn-app-thesis"
          target="_blank"
          class="btn-secondary btn-md md:btn-lg flex items-center justify-center gap-2 transition-all cursor-pointer text-(--color-text-primary)"
        >
          <IconLifebuoy class="size-5 text-text-secondary" />
          <span>Laporkan Masalah</span>
        </a>
      </div>

      <div
        class="pt-8 text-xs text-(--color-text-muted) border-t border-border max-w-xs mx-auto"
      >
        ScribeTex Engine v1.0.0 &copy; 2026. <br />
        LaTeX Learning Application Project.
      </div>
    </div>
  </div>
</template>
