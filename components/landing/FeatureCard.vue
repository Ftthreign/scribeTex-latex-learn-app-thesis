<template>
  <div
    class="bg-surface border border-border p-8 rounded-2xl shadow-card hover:shadow-modal hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col justify-between relative overflow-hidden"
  >
    <div
      class="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-primary transition-colors duration-300"
    ></div>

    <div>
      <div
        class="size-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 shadow-xs"
        :class="[resolvedColorClass]"
      >
        <slot name="icon">
          <component :is="icon" v-if="icon" class="size-6" />
          <IconCircle v-else class="size-6" />
        </slot>
      </div>

      <h3
        class="text-xl font-sans font-bold mb-3 tracking-tight text-text-primary group-hover:text-primary transition-colors duration-200"
      >
        {{ title }}
      </h3>

      <p
        class="text-text-secondary leading-relaxed text-sm sm:text-base font-sans"
      >
        {{ description }}
      </p>
    </div>

    <button
      @click="$emit('learn-more')"
      class="w-full pt-6 mt-4 border-t border-border/40 flex items-center gap-2 text-primary text-sm font-bold tracking-wide opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 cursor-pointer"
    >
      <span>Pelajari Fitur</span>
      <IconArrowRight
        class="size-4 transition-transform group-hover:translate-x-0.5"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from "vue";
import { IconCircle, IconArrowRight } from "@tabler/icons-vue";

const props = defineProps<{
  title: string;
  description: string;
  icon?: Component | any;
  color?: string;
  colorClass?: string;
}>();

defineEmits(["learn-more"]);

const colorMap: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  "ai-primary": "bg-primary/10 text-primary",
};

const resolvedColorClass = computed(() => {
  if (props.color && colorMap[props.color]) {
    return colorMap[props.color];
  }
  return props.color || props.colorClass || "bg-primary/10 text-primary";
});
</script>
