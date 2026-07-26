<script setup lang="ts">
import { IconArrowLeft, IconFileText, IconCheck } from "@tabler/icons-vue";

defineProps<{
  hasExercise: boolean;
  isCompleted?: boolean;
}>();

const emit = defineEmits<{
  (e: "goBack"): void;
  (e: "viewResult"): void;
}>();
</script>

<template>
  <div class="flex items-center justify-between gap-4 font-body">
    <button
      @click="emit('goBack')"
      class="flex items-center gap-2 text-xs font-semibold text-(--color-primary) hover:underline cursor-pointer transition-colors font-display"
    >
      <IconArrowLeft class="size-4" />
      <span>{{
        hasExercise ? "Kembali ke Naskah Materi" : "Kembali ke Katalog Latihan"
      }}</span>
    </button>

    <div v-if="isCompleted" class="flex items-center gap-2 font-sans">
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-(--color-primary-light) text-(--color-primary) border border-(--color-primary)/20">
        <IconCheck class="size-3.5 stroke-[2.5]" />
        <span>Selesai</span>
      </span>

      <button
        @click="emit('viewResult')"
        class="btn-secondary btn-sm flex items-center gap-1.5 text-(--color-primary) hover:border-(--color-primary)/40 transition-all cursor-pointer font-bold shadow-xs"
      >
        <IconFileText class="size-4 text-(--color-primary)" />
        <span>Lihat Hasil Pengerjaan Saya</span>
      </button>
    </div>
  </div>
</template>
