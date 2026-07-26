<script setup lang="ts">
defineProps<{
  exerciseId: string | number | string[];
}>();
</script>

<template>
  <div
    class="p-8 rounded-(--radius-lg) bg-(--color-surface) border border-border text-center space-y-3 shadow-xs font-body"
  >
    <p class="text-sm font-semibold text-(--color-text-primary)">
      Latihan #{{ exerciseId }} tidak ditemukan
    </p>
    <p class="text-xs text-(--color-text-muted)">
      Data latihan belum ada di database atau belum dipublikasikan.
    </p>
    <NuxtLink
      to="/student/exercises"
      class="inline-block px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-md transition-all"
    >
      Lihat Semua Latihan
    </NuxtLink>
  </div>
</template>
