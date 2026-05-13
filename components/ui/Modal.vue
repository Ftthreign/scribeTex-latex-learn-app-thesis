<script setup lang="ts">
import { onUnmounted, watch } from "vue";
import { IconX } from "@tabler/icons-vue";

const props = defineProps<{
  isOpen: boolean;
  title: string;
}>();

const emit = defineEmits(["close"]);

// Prevent scroll when modal is open
const toggleScroll = (open: boolean) => {
  if (typeof document !== "undefined") {
    document.body.style.overflow = open ? "hidden" : "auto";
  }
};

watch(
  () => props.isOpen,
  (val) => toggleScroll(val),
  { immediate: true },
);

onUnmounted(() => toggleScroll(false));
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6"
      >
        <div
          class="absolute inset-0 bg-text-primary/60 backdrop-blur-sm"
          @click="emit('close')"
        ></div>

        <div
          class="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
          @click.stop
        >
          <div
            class="px-8 py-6 border-b border-border/50 flex items-center justify-between bg-surface shrink-0"
          >
            <h3 class="text-2xl font-display font-bold text-text-primary">
              {{ title }}
            </h3>
            <button
              @click="emit('close')"
              class="p-2 rounded-full hover:bg-surface-alt transition-colors text-text-muted hover:text-text-primary"
            >
              <IconX class="size-6" />
            </button>
          </div>

          <div
            class="px-8 py-10 overflow-y-auto font-sans text-text-secondary leading-relaxed space-y-6"
          >
            <slot />
          </div>

          <div
            class="px-8 py-6 bg-surface-alt/30 border-t border-border/50 flex justify-end shrink-0"
          >
            <button @click="emit('close')" class="btn-primary btn-md px-8">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
