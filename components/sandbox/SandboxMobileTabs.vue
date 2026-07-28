<script setup lang="ts">
import { IconFolder, IconCode, IconEye } from "@tabler/icons-vue";

defineProps<{
  activeTab: "files" | "editor" | "preview";
}>();

const emit = defineEmits<{
  (e: "update:activeTab", tab: "files" | "editor" | "preview"): void;
}>();
</script>

<template>
  <div
    class="flex lg:hidden bg-surface-alt p-1 rounded-xl border border-border shrink-0 font-sans"
  >
    <button
      @click="emit('update:activeTab', 'files')"
      :class="[
        'flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer',
        activeTab === 'files'
          ? 'bg-(--color-surface) text-primary shadow-xs'
          : 'text-(--color-text-muted)',
      ]"
    >
      <IconFolder class="size-4 shrink-0" />
      <span>Berkas</span>
    </button>

    <button
      @click="emit('update:activeTab', 'editor')"
      :class="[
        'flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer',
        activeTab === 'editor'
          ? 'bg-(--color-surface) text-primary shadow-xs'
          : 'text-(--color-text-muted)',
      ]"
    >
      <IconCode class="size-4 shrink-0" />
      <span>Editor</span>
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
      <IconEye class="size-4 shrink-0" />
      <span>Pratinjau & Log</span>
    </button>
  </div>
</template>
