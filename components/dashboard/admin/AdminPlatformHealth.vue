<script setup lang="ts">
import { 
  IconActivity, 
  IconSend, 
  IconCloudUpload,
  IconLoader2
} from '@tabler/icons-vue'

defineProps<{
  isEmailing: boolean
  isBackingUp: boolean
}>()

const emit = defineEmits<{
  (e: 'email-report'): void
  (e: 'backup-db'): void
}>()
</script>

<template>
  <div class="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border p-6 border-[var(--color-primary)]/30 shadow-sm flex flex-col justify-between h-full font-body">
    <div>
      <div class="flex items-center gap-2 text-[var(--color-primary)] font-bold mb-4 text-[13px] uppercase tracking-wider">
        <IconActivity class="size-4.5 shrink-0" />
        <span>Platform Analytics</span>
      </div>
      
      <div class="p-4 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-[var(--radius-md)] mb-6">
        <p class="text-[12.5px] text-[var(--color-text-primary)] leading-relaxed">
          System performance is optimal. Student engagement increased by 15% this session. Recommendation: Publish pending 'Tabel &amp; Figur' content.
        </p>
      </div>
    </div>
    
    <div class="space-y-3">
      <h4 class="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">
        Administrative Tools
      </h4>
      
      <button
        @click="emit('email-report')"
        :disabled="isEmailing"
        class="w-full flex items-center justify-between p-3 bg-white hover:bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-[var(--radius-md)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
      >
        <span class="text-[12.5px] font-bold text-[var(--color-text-primary)]">Email Weekly Report</span>
        <IconLoader2 v-if="isEmailing" class="size-4 animate-spin text-[var(--color-text-muted)]" />
        <IconSend v-else class="size-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors shrink-0" />
      </button>
      
      <button
        @click="emit('backup-db')"
        :disabled="isBackingUp"
        class="w-full flex items-center justify-between p-3 bg-white hover:bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-[var(--radius-md)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
      >
        <span class="text-[12.5px] font-bold text-[var(--color-text-primary)]">Database Backup</span>
        <IconLoader2 v-if="isBackingUp" class="size-4 animate-spin text-[var(--color-text-muted)]" />
        <IconCloudUpload v-else class="size-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors shrink-0" />
      </button>
    </div>
  </div>
</template>
