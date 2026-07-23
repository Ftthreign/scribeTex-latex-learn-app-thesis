<script setup lang="ts">
import type { Component } from "vue";

defineProps<{
  title: string;
  description: string;
  icon: Component;
  badge?: string;
}>();
</script>

<template>
  <div
    class="relative flex flex-col card-module group hover:border-primary/30 transition-all duration-300"
  >
    <div v-if="badge" class="absolute top-4 right-4">
      <span
        class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-light text-primary font-sans uppercase tracking-wider"
      >
        {{ badge }}
      </span>
    </div>

    <!-- Icon Container -->
    <div
      class="size-11 rounded-lg bg-primary-light text-primary flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-primary group-hover:text-white"
    >
      <component :is="icon" class="size-5 shrink-0" />
    </div>

    <div class="space-y-1.5 flex-1">
      <h3 class="text-[15px] font-bold text-text-primary font-display group-hover:text-primary transition-colors">
        {{ title }}
      </h3>
      <p class="text-xs sm:text-sm text-text-secondary font-sans leading-relaxed">
        {{ description }}
      </p>
    </div>
  </div>
</template>
