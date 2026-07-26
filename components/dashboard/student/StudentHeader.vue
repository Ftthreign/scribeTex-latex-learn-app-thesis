<script setup lang="ts">
defineProps<{ name: string }>();
</script>

<template>
  <header class="mb-8 font-body">
    <h1
      class="font-display text-[32px] md:text-[40px] font-bold text-(--color-text-primary) leading-tight tracking-tight mb-2"
    >
      Selamat datang, <span class="text-primary">{{ name }}</span
      >!
    </h1>
    <p class="text-text-secondary text-[14.5px] max-w-xl leading-relaxed">
      Mari lanjutkan perjalanan akademik Anda hari ini
    </p>
  </header>
</template>
