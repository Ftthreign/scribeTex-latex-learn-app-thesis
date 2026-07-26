<script setup lang="ts">
import { IconRobot } from "@tabler/icons-vue";

const emit = defineEmits<{
  (e: "openDrawer"): void;
}>();
</script>

<template>
  <button
    @click="emit('openDrawer')"
    class="px-4.5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border border-white/20 transition-all cursor-pointer flex items-center gap-2 font-sans shrink-0"
    title="Buka Chatbot Pembimbing Cerdas AI"
  >
    <IconRobot class="size-5" />
  </button>
</template>
