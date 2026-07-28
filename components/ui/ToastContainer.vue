<script setup lang="ts">
import {
  IconCheck,
  IconAlertTriangle,
  IconAlertCircle,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-vue";
import { useToast } from "~/composables/useToast";

const { toasts, removeToast } = useToast();

function getToastIcon(type: string) {
  switch (type) {
    case "success":
      return IconCheck;
    case "error":
      return IconAlertCircle;
    case "warning":
      return IconAlertTriangle;
    case "info":
    default:
      return IconInfoCircle;
  }
}

function getToastStyles(type: string) {
  switch (type) {
    case "success":
      return {
        iconBg: "bg-(--color-success-light) text-(--color-success)",
        border: "border-(--color-success)/30",
        badge: "text-(--color-success)",
      };
    case "error":
      return {
        iconBg: "bg-(--color-error-light) text-(--color-error)",
        border: "border-(--color-error)/30",
        badge: "text-(--color-error)",
      };
    case "warning":
      return {
        iconBg: "bg-(--color-warning-light) text-(--color-warning)",
        border: "border-(--color-warning)/30",
        badge: "text-(--color-warning)",
      };
    case "info":
    default:
      return {
        iconBg: "bg-(--color-primary-light) text-(--color-primary)",
        border: "border-(--color-primary)/30",
        badge: "text-(--color-primary)",
      };
  }
}
</script>

<template>
  <div
    class="fixed top-5 right-5 z-9999 flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0 pointer-events-none font-body"
  >
    <TransitionGroup name="toast-slide">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'pointer-events-auto relative flex items-start gap-3 p-4 rounded-2xl bg-surface border shadow-lg transition-all duration-300',
          getToastStyles(toast.type).border,
        ]"
      >
        <!-- Icon -->
        <div
          :class="[
            'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs mt-0.5',
            getToastStyles(toast.type).iconBg,
          ]"
        >
          <component
            :is="getToastIcon(toast.type)"
            class="size-5 stroke-[2.5]"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0 pr-2">
          <h4
            class="text-xs font-bold text-(--color-text-primary) font-sans leading-snug"
          >
            {{ toast.title }}
          </h4>
          <p
            v-if="toast.message"
            class="text-[11.5px] text-text-secondary mt-0.5 leading-relaxed wrap-break-word"
          >
            {{ toast.message }}
          </p>
        </div>

        <!-- Close Button -->
        <button
          @click="removeToast(toast.id)"
          class="p-1 rounded-lg text-(--color-text-muted) hover:text-(--color-text-primary) hover:bg-surface-alt transition-colors cursor-pointer shrink-0"
          title="Tutup Notifikasi"
        >
          <IconX class="size-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-slide-enter-from {
  opacity: 0;
  transform: translateY(-16px) scale(0.95);
}
.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}
</style>
