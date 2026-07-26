<script setup lang="ts">
import {
  IconBook,
  IconCircleCheck,
  IconSchool,
  IconSparkles,
} from "@tabler/icons-vue";

interface StatItem {
  label: string;
  value: string | number;
  badge?: string;
  icon: string;
}

defineProps<{ stats: StatItem[] }>();

const themeMap: Record<
  string,
  {
    icon: any;
    bgSolid: string;
    textColor: string;
    badgeStyle: string;
  }
> = {
  menu_book: {
    icon: IconBook,
    bgSolid: "bg-[var(--color-primary)]",
    textColor: "text-[var(--color-primary)]",
    badgeStyle:
      "text-[var(--color-primary)] bg-[var(--color-primary-light)] border-[var(--color-primary)]/20",
  },
  task_alt: {
    icon: IconCircleCheck,
    bgSolid: "bg-[var(--color-success)]",
    textColor: "text-[var(--color-success)]",
    badgeStyle:
      "text-[var(--color-success)] bg-[var(--color-success-light)] border-[var(--color-success)]/20",
  },
  school: {
    icon: IconSchool,
    bgSolid: "bg-amber-500",
    textColor: "text-amber-600",
    badgeStyle: "text-amber-700 bg-amber-50 border-amber-200",
  },
  smart_toy: {
    icon: IconSparkles,
    bgSolid: "bg-[var(--color-ai-primary)]",
    textColor: "text-[var(--color-ai-primary)]",
    badgeStyle:
      "text-[var(--color-ai-primary)] bg-[var(--color-ai-light)] border-[var(--color-ai-primary)]/20",
  },
};
</script>

<template>
  <section class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 font-body">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="group relative overflow-hidden bg-(--color-surface) border border-border rounded-(--radius-lg) p-5 hover:-translate-y-1 hover:shadow-md hover:border-border-strong transition-all duration-300 cursor-default flex flex-col justify-between"
    >
      <div
        class="absolute -top-5 -right-5 w-28 h-28 rounded-2xl opacity-[0.08] rotate-12 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 pointer-events-none"
        :class="themeMap[stat.icon]?.bgSolid ?? 'bg-primary'"
      />

      <div class="relative z-10 flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-2">
            <p
              class="text-[11px] font-bold text-(--color-text-muted) uppercase tracking-wider truncate"
            >
              {{ stat.label }}
            </p>
          </div>

          <p
            class="text-[28px] lg:text-[32px] font-bold text-(--color-text-primary) leading-none font-display tracking-tight group-hover:text-primary transition-colors mb-2"
          >
            {{ stat.value }}
          </p>

          <span
            v-if="stat.badge"
            class="inline-block text-[9px] font-bold border px-2 py-0.5 rounded-full uppercase tracking-wider"
            :class="
              themeMap[stat.icon]?.badgeStyle ?? 'text-primary bg-primary-light'
            "
          >
            {{ stat.badge }}
          </span>
        </div>

        <!-- Right Side: Rotated Featured Icon Box -->
        <div
          class="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs rotate-6 transition-all duration-300 group-hover:rotate-0 group-hover:scale-105"
          :class="themeMap[stat.icon]?.bgSolid ?? 'bg-primary'"
        >
          <component
            :is="themeMap[stat.icon]?.icon ?? IconBook"
            class="size-5.5 -rotate-6 group-hover:rotate-0 transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  </section>
</template>
