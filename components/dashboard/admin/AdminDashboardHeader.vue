<script setup lang="ts">
import { IconRefresh } from "@tabler/icons-vue";

defineProps<{
  pending: boolean;
}>();

const emit = defineEmits<{
  (e: "refresh"): void;
}>();
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 font-body">
    <div class="space-y-1">
      <h1 class="text-2xl lg:text-3xl font-bold text-(--color-text-primary) font-display tracking-tight">
        Monitoring Dashboard <span class="text-primary">Admin</span>
      </h1>
      <p class="text-xs lg:text-sm text-(--color-text-muted) max-w-2xl leading-relaxed font-sans">
        Statistik operasional platform ScribeTex, tren kompilasi Docker LaTeX, konsultasi AI, dan progres mahasiswa secara real-time.
      </p>
    </div>

    <button
      @click="emit('refresh')"
      :disabled="pending"
      class="btn-secondary btn-md gap-2 rounded-xl cursor-pointer font-bold font-sans shadow-xs shrink-0"
      title="Muat Ulang Seluruh Data Dashboard Admin"
    >
      <IconRefresh :class="['size-4 text-primary', pending && 'animate-spin']" />
      <span>{{ pending ? 'Memuat Data...' : 'Muat Ulang Data' }}</span>
    </button>
  </div>
</template>
