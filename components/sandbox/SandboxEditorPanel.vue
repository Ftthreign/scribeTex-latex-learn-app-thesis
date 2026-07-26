<script setup lang="ts">
import CodeMirrorEditor from "~/components/learn/CodeMirrorEditor.client.vue";

defineProps<{
  activeFileName: string;
  activeFileContent: string;
}>();

const emit = defineEmits<{
  (e: "updateContent", content: string): void;
}>();
</script>

<template>
  <div
    class="flex-1 flex flex-col min-w-0 bg-(--color-surface) h-full font-body"
  >
    <div
      class="flex items-center justify-between px-3 py-2 bg-surface-alt border-b border-border shrink-0 font-sans"
    >
      <div class="flex items-center gap-0">
        <div
          class="flex items-center gap-1.5 px-3 py-1.5 bg-(--color-surface) border border-border border-b-transparent rounded-t-lg text-xs font-mono font-semibold text-(--color-text-primary) -mb-px"
        >
          <span
            class="size-2 rounded-full bg-primary inline-block shrink-0"
          ></span>
          <span>{{ activeFileName }}</span>
        </div>
      </div>
      <span class="text-[10px] text-(--color-text-muted) font-mono"
        >Sintaks LaTeX</span
      >
    </div>

    <div class="flex-1 overflow-hidden relative">
      <ClientOnly>
        <CodeMirrorEditor
          :modelValue="activeFileContent"
          @update:modelValue="emit('updateContent', $event)"
        />
        <template #fallback>
          <div
            class="h-full w-full bg-surface-alt animate-pulse flex items-center justify-center text-xs text-(--color-text-muted) font-sans"
          >
            Memuat Editor Kode LaTeX…
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>
