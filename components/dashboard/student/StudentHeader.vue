<script setup lang="ts">
defineProps<{ name: string }>();
</script>

<template>
  <header class="mb-8 font-body">
    <h1
      class="font-display text-[36px] md:text-[44px] font-bold text-(--color-text-primary) leading-tight tracking-tight mb-2"
    >
      Selamat datang, <span class="text-primary">{{ name }}</span
      >!
    </h1>
    <p class="text-text-secondary text-[15px] max-w-xl leading-relaxed">
      Mari lanjutkan perjalanan akademik Anda hari ini. AI Assistant kami siap
      membantu penyusunan bibliografi Anda.
    </p>
  </header>
</template>
