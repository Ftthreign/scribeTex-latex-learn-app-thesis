<script setup lang="ts">
import { IconCheck, IconX } from "@tabler/icons-vue";

defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>

<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="p-4 rounded-(--radius-lg) bg-success-light border border-success/30 text-success text-xs font-semibold flex items-center justify-between gap-3 shadow-xs"
    >
      <div class="flex items-center gap-2">
        <IconCheck class="size-5 text-success shrink-0" />
        <span>Jawaban latihan berhasil tersimpan ke sistem database!</span>
      </div>
      <button
        @click="emit('close')"
        class="text-success hover:opacity-75 cursor-pointer"
      >
        <IconX class="size-4" />
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
