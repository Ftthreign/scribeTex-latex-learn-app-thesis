<script setup lang="ts">
import { IconSearch } from "@tabler/icons-vue";

defineProps<{
  modelValue: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>

<template>
  <div class="space-y-6 text-center max-w-2xl mx-auto mb-10">
    <div class="space-y-2">
      <h1
        class="text-3xl sm:text-4xl font-display font-bold tracking-tight text-transparent bg-clip-text bg-primary"
      >
        Pusat Bantuan ScribeTex
      </h1>
      <p
        class="text-sm sm:text-base text-text-secondary font-sans leading-relaxed"
      >
        Temukan panduan penulisan LaTeX, petunjuk kompilasi PDF, cara
        menggunakan asisten AI (Gemini), dan jawaban atas pertanyaan umum
        lainnya.
      </p>
    </div>

    <!-- Search Input -->
    <div class="relative max-w-lg mx-auto">
      <div
        class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted"
      >
        <IconSearch class="size-5 shrink-0" />
      </div>
      <input
        type="text"
        :value="modelValue"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        placeholder="Cari kendala atau pertanyaan Anda di sini..."
        class="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all placeholder:text-text-muted"
      />
    </div>
  </div>
</template>
