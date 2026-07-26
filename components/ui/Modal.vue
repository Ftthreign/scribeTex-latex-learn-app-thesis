<script setup lang="ts">
import { computed, onUnmounted, watch } from "vue";
import { IconX } from "@tabler/icons-vue";

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    title: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "5xl" | "6xl" | "full";
  }>(),
  {
    size: "lg",
  }
);

const emit = defineEmits(["close"]);

const modalSizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "max-w-sm";
    case "md":
      return "max-w-md";
    case "lg":
      return "max-w-lg";
    case "xl":
      return "max-w-xl";
    case "2xl":
      return "max-w-2xl";
    case "4xl":
      return "max-w-4xl";
    case "5xl":
      return "max-w-5xl";
    case "6xl":
      return "max-w-6xl";
    case "full":
      return "max-w-[95vw]";
    default:
      return "max-w-lg";
  }
});

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
          :class="[
            'relative w-full bg-(--color-surface) border border-border rounded-(--radius-lg) shadow-(--shadow-modal) overflow-hidden flex flex-col max-h-[90vh]',
            modalSizeClass
          ]"
          @click.stop
        >
          <div
            class="px-6 py-4 border-b border-border flex items-center justify-between bg-(--color-surface) shrink-0 font-body"
          >
            <h3 class="text-base sm:text-lg font-bold text-(--color-text-primary) font-display tracking-tight">
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
            class="px-6 py-5 overflow-y-auto font-sans text-sm text-text-secondary leading-relaxed space-y-4 flex-1"
          >
            <slot />
          </div>

          <!-- Footer -->
          <div
            class="px-6 py-3.5 bg-surface-alt/30 border-t border-border flex justify-end gap-2.5 shrink-0 font-sans"
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
