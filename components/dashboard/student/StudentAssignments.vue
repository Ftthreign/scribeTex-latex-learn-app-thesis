<script setup lang="ts">
import { 
  IconFlask, 
  IconCalculator, 
  IconFileText 
} from '@tabler/icons-vue'

interface AssignmentItem {
  id: number
  course: string
  title: string
  deadline: string
  deadlineLabel: string
  icon: string
}

defineProps<{
  assignments: AssignmentItem[]
}>()

const getAssignmentIcon = (iconName: string) => {
  switch (iconName) {
    case 'science':
      return IconFlask
    case 'calculate':
      return IconCalculator
    default:
      return IconFileText
  }
}

const getDeadlineClass = (deadline: string) => {
  if (deadline === 'Besok') {
    return 'text-[var(--color-error)]'
  }
  return 'text-[var(--color-text-primary)]'
}
</script>

<template>
  <div class="font-body mt-12">
    <h3 class="text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-primary)] mb-6">
      Upcoming Assignments
    </h3>
    
    <div class="border border-[var(--color-border)] divide-y divide-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden shadow-sm">
      <div 
        v-for="item in assignments" 
        :key="item.id"
        class="p-5 flex items-center gap-5 bg-[var(--color-surface)] hover:bg-[var(--color-surface-alt)]/30 transition-colors"
      >
        <!-- Icon -->
        <div class="w-10 h-10 border border-[var(--color-border)] rounded-[var(--radius-md)] flex items-center justify-center text-[var(--color-text-secondary)] shrink-0 bg-[var(--color-surface-alt)]/40">
          <component :is="getAssignmentIcon(item.icon)" class="size-5" />
        </div>
        
        <!-- Assignment details -->
        <div class="flex-1 min-w-0">
          <h5 class="font-bold text-[13.5px] text-[var(--color-text-primary)] leading-tight truncate">
            {{ item.course }}
          </h5>
          <p class="text-[var(--color-text-muted)] text-[12.5px] mt-0.5 truncate">
            {{ item.title }}
          </p>
        </div>
        
        <!-- Deadline info -->
        <div class="text-right shrink-0">
          <div :class="['text-[12px] font-bold uppercase tracking-wider', getDeadlineClass(item.deadline)]">
            {{ item.deadline }}
          </div>
          <div class="text-[9px] text-[var(--color-text-muted)] uppercase font-bold tracking-wider mt-0.5">
            {{ item.deadlineLabel }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
