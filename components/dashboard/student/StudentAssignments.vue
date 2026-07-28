<script setup lang="ts">
import { IconFlask, IconCalculator, IconFileText } from "@tabler/icons-vue";

interface AssignmentItem {
  id: number;
  course: string;
  title: string;
  deadline: string;
  deadlineLabel: string;
  icon: string;
  exercise_id?: number;
  lesson_id?: number;
}

defineProps<{
  assignments: AssignmentItem[];
}>();

const emit = defineEmits<{
  (e: "select", item: AssignmentItem): void;
}>();

const getAssignmentIcon = (iconName: string) => {
  switch (iconName) {
    case "science":
      return IconFlask;
    case "calculate":
      return IconCalculator;
    default:
      return IconFileText;
  }
};

const getDeadlineClass = (deadline: string) => {
  if (deadline === "Besok") {
    return "text-[var(--color-error)]";
  }
  return "text-[var(--color-text-primary)]";
};

const handleClick = (item: AssignmentItem) => {
  emit("select", item);
};
</script>

<template>
  <div class="font-body mt-8">
    <h3 class="text-[15px] font-bold text-(--color-text-primary) mb-4">
      Tugas yang mendatang
    </h3>

    <div
      v-if="assignments && assignments.length > 0"
      class="border border-border divide-y divide-border rounded-(--radius-lg) overflow-hidden shadow-sm"
    >
      <div
        v-for="item in assignments"
        :key="item.id"
        @click="handleClick(item)"
        class="p-5 flex items-center gap-5 bg-(--color-surface) hover:bg-surface-alt/50 transition-all cursor-pointer group"
      >
        <div
          class="w-10 h-10 border border-border rounded-md flex items-center justify-center text-text-secondary group-hover:text-primary shrink-0 bg-surface-alt/60 transition-colors"
        >
          <component :is="getAssignmentIcon(item.icon)" class="size-5" />
        </div>

        <div class="flex-1 min-w-0">
          <h5
            class="font-bold text-[13.5px] text-(--color-text-primary) leading-tight truncate group-hover:text-primary transition-colors"
          >
            {{ item.course }}
          </h5>
          <p class="text-(--color-text-muted) text-[12.5px] mt-0.5 truncate">
            {{ item.title }}
          </p>
        </div>

        <!-- <div class="text-right shrink-0">
          <div
            :class="[
              'text-[12px] font-bold uppercase tracking-wider',
              getDeadlineClass(item.deadline),
            ]"
          >
            {{ item.deadline }}
          </div>
          <div
            class="text-[9px] text-(--color-text-muted) uppercase font-bold tracking-wider mt-0.5"
          >
            {{ item.deadlineLabel }}
          </div>
        </div> -->
      </div>
    </div>

    <div
      v-else
      class="border border-border rounded-(--radius-lg) p-6 text-center bg-(--color-surface) shadow-sm"
    >
      <p class="text-[13px] text-(--color-text-muted) font-medium">
        Tidak ada tugas atau latihan mendatang. Semua latihan modul saat ini
        telah Anda selesaikan.
      </p>
    </div>
  </div>
</template>
