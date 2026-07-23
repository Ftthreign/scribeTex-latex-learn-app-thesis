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
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      >
        <div
          class="absolute inset-0 bg-[#0f1b2d]/50 backdrop-blur-xs"
          @click="emit('close')"
        ></div>

        <div
          class="relative w-full max-w-lg bg-(--color-surface) border border-border rounded-(--radius-lg) shadow-(--shadow-modal) overflow-hidden flex flex-col"
          @click.stop
        >
          <div
            class="px-6 py-4.5 border-b border-border flex items-center justify-between bg-(--color-surface) shrink-0"
          >
            <h3 class="text-lg font-bold text-(--color-text-primary)">
              {{ title }}
            </h3>
            <button
              @click="emit('close')"
              class="p-1.5 rounded-full hover:bg-surface-alt transition-colors text-(--color-text-muted) hover:text-(--color-text-primary) cursor-pointer"
            >
              <IconX class="size-5" />
            </button>
          </div>

          <!-- Body -->
          <div
            class="px-6 py-6 overflow-y-auto font-sans text-sm text-text-secondary leading-relaxed space-y-4"
          >
            <slot />
          </div>

          <!-- Footer -->
          <div
            class="px-6 py-4 bg-surface-alt/30 border-t border-border flex justify-end gap-2.5 shrink-0"
          >
            <slot name="footer">
              <button @click="emit('close')" class="btn-primary btn-md">
                Tutup
              </button>
            </slot>
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
