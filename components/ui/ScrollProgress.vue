<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const progress = ref(0);

const updateScrollProgress = () => {
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  if (scrollHeight > 0) {
    progress.value = (window.scrollY / scrollHeight) * 100;
  }
};

onMounted(() => {
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  updateScrollProgress();
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateScrollProgress);
});
</script>

<template>
  <div
    class="fixed top-0 left-0 w-full h-[3px] z-1000 pointer-events-none bg-primary/5"
  >
    <div
      class="h-full bg-primary transition-all duration-75 ease-out shadow-[0_0_8px_rgba(26,86,219,0.4)]"
      :style="{ width: `${progress}%` }"
    ></div>
  </div>
</template>
