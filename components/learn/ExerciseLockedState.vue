<script setup lang="ts">
import { IconLock, IconArrowLeft } from "@tabler/icons-vue";

defineProps<{
  error: string | null;
}>();

const emit = defineEmits<{
  (e: "backToModules"): void;
}>();
</script>

<template>
  <div
    class="max-w-xl mx-auto my-12 p-8 bg-(--color-surface) rounded-(--radius-xl) border border-border shadow-md text-center space-y-4 font-body"
  >
    <div
      class="size-16 rounded-full bg-warning-light text-warning flex items-center justify-center mx-auto"
    >
      <IconLock class="size-8" />
    </div>
    <div class="space-y-1.5">
      <h3
        class="text-xl font-bold text-(--color-text-primary) font-display tracking-tight"
      >
        Latihan Masih Terkunci
      </h3>
      <p class="text-sm text-text-secondary leading-relaxed">
        {{ error }}
      </p>
    </div>
    <div class="pt-2">
      <button
        @click="emit('backToModules')"
        class="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-md flex items-center gap-2 mx-auto cursor-pointer shadow-xs transition-all"
      >
        <IconArrowLeft class="size-4" />
        <span>Kembali ke Daftar Modul</span>
      </button>
    </div>
  </div>
</template>
