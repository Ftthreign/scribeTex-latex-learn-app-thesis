<script setup lang="ts">
import { IconCode, IconEye } from "@tabler/icons-vue";

defineProps<{
  activeTab: "editor" | "preview";
}>();

const emit = defineEmits<{
  (e: "update:activeTab", tab: "editor" | "preview"): void;
}>();
</script>

<template>
  <div
    class="flex lg:hidden bg-surface-alt p-1 rounded-xl border border-border shrink-0 font-sans"
  >
    <button
      @click="emit('update:activeTab', 'editor')"
      :class="[
        'flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer',
        activeTab === 'editor'
          ? 'bg-(--color-surface) text-primary shadow-xs'
          : 'text-(--color-text-muted)',
      ]"
    >
      <IconCode class="size-4" />
      <span>Editor Kode</span>
    </button>
    <button
      @click="emit('update:activeTab', 'preview')"
      :class="[
        'flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer',
        activeTab === 'preview'
          ? 'bg-(--color-surface) text-primary shadow-xs'
          : 'text-(--color-text-muted)',
      ]"
    >
      <IconEye class="size-4" />
      <span>Pratinjau & Log</span>
    </button>
  </div>
</template>
