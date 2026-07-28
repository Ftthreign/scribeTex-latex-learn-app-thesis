<script setup lang="ts">
import { IconRefresh, IconEye } from "@tabler/icons-vue";

defineProps<{
  pending: boolean;
}>();

const emit = defineEmits<{
  (e: "refresh"): void;
}>();
</script>

<template>
  <div class="gsap-admin-content-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 font-body">
    <div class="space-y-1">
      <h1 class="text-2xl lg:text-3xl font-bold text-(--color-text-primary) font-display tracking-tight">
        Manajemen <span class="text-primary">Konten Kurikulum</span>
      </h1>
      <p class="text-xs lg:text-sm text-(--color-text-muted) max-w-2xl leading-relaxed font-sans">
        Pengelolaan data modul pembelajaran, materi lesson LaTeX, latihan praktik interaktif, serta artikel regulasi.
      </p>
    </div>

    <div class="flex items-center gap-2.5 shrink-0 font-sans">
      <NuxtLink
        to="/student/modules"
        class="btn-primary btn-md gap-2 rounded-xl cursor-pointer font-bold shadow-xs hover:scale-[1.02] active:scale-95 transition-all flex items-center"
        title="Pratinjau tampilan kurikulum siswa"
      >
        <IconEye class="size-4 stroke-[2.5]" />
        <span>Pratinjau Kurikulum Siswa</span>
      </NuxtLink>

      <button
        @click="emit('refresh')"
        :disabled="pending"
        class="btn-secondary btn-md gap-2 rounded-xl cursor-pointer font-bold shadow-xs flex items-center"
        title="Muat Ulang Seluruh Data Konten Kurikulum"
      >
        <IconRefresh :class="['size-4 text-primary', pending && 'animate-spin']" />
        <span>{{ pending ? 'Memuat...' : 'Muat Ulang' }}</span>
      </button>
    </div>
  </div>
</template>
