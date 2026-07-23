<script setup lang="ts">
import { 
  IconUserPlus, 
  IconEdit, 
  IconCircleCheck, 
  IconBell 
} from '@tabler/icons-vue'

interface ActivityItem {
  id: number
  title: string
  description: string
  time: string
  icon: string
  color: string
}

defineProps<{
  activities: ActivityItem[]
}>()

const getActivityIcon = (iconName: string) => {
  switch (iconName) {
    case 'person_add':
      return IconUserPlus
    case 'edit_note':
      return IconEdit
    case 'verified':
      return IconCircleCheck
    default:
      return IconBell
  }
}

const getIconColorClass = (color: string) => {
  switch (color) {
    case 'primary':
      return 'text-[var(--color-primary)] bg-[var(--color-primary-light)] border-[var(--color-primary)]/10'
    case 'secondary':
      return 'text-[var(--color-secondary,purple)] bg-[var(--color-secondary-light,lavender)] border-[var(--color-secondary,purple)]/10'
    case 'tertiary':
      return 'text-amber-600 bg-amber-50 border-amber-200'
    default:
      return 'text-blue-600 bg-blue-50 border-blue-200'
  }
}
</script>

<template>
  <div class="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 shadow-sm">
    <h3 class="text-[15px] font-bold mb-6 text-[var(--color-text-primary)] uppercase tracking-wider font-display border-b border-[var(--color-border)]/60 pb-3">
      Recent System Activity
    </h3>
    
    <div class="space-y-6 font-body">
      <div 
        v-for="(activity, index) in activities" 
        :key="activity.id"
        class="flex gap-4 relative"
      >
        <!-- Timeline vertical connector line -->
        <div 
          v-if="index < activities.length - 1"
          class="absolute top-8 bottom-[-24px] left-4 w-[1px] bg-[var(--color-border)]"
        />
        
        <div class="relative shrink-0">
          <div :class="['w-8 h-8 rounded-[var(--radius-md)] border flex items-center justify-center bg-white z-10 relative shadow-sm', getIconColorClass(activity.color)]">
            <component :is="getActivityIcon(activity.icon)" class="size-4 shrink-0" />
          </div>
        </div>
        
        <div class="flex-1 min-w-0">
          <div class="font-bold text-[var(--color-text-primary)] text-[13.5px] leading-tight">
            {{ activity.title }}
          </div>
          <div class="text-[var(--color-text-secondary)] text-[12.5px] mt-1 leading-snug">
            {{ activity.description }}
          </div>
          <div class="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider mt-1.5 font-body">
            {{ activity.time }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
