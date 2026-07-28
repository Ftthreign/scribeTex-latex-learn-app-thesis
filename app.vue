<template>
  <div
    class="min-h-screen bg-background text-foreground selection:bg-primary/10 selection:text-primary"
  >
    <NuxtLoadingIndicator color="var(--color-primary)" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UiToastContainer />
  </div>
</template>

<script setup lang="ts"></script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
