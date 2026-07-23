<script setup lang="ts">
import { IconBug, IconAlertTriangle, IconInfoCircle } from '@tabler/icons-vue'
import type { CompileLogItem } from '~/composables/useCompile'

const props = defineProps<{
  logs: CompileLogItem[]
  securityWarning?: string | null
  errorText?: string | null
}>()
</script>

<template>
  <div class="h-full bg-(--color-surface) border border-border rounded-xl p-5 space-y-4 shadow-xs overflow-auto">
    <!-- Header Drawer Log -->
    <div class="flex items-center justify-between border-b border-border pb-3">
      <div class="flex items-center gap-2 text-xs font-bold text-red-500">
        <IconBug class="size-4 shrink-0" />
        <span>Log kesalahan kompilasi TeXLive</span>
      </div>
      <span class="text-[10px] text-(--color-text-muted) font-mono">
        {{ logs.length }} entri terdeteksi
      </span>
    </div>

    <!-- Peringatan Keamanan (Security Block) -->
    <div
      v-if="securityWarning"
      class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs space-y-1.5"
    >
      <div class="flex items-center gap-2 font-bold">
        <IconAlertTriangle class="size-4 shrink-0 text-amber-500" />
        <span>Peringatan Keamanan Sandbox</span>
      </div>
      <p class="text-[11px] leading-relaxed">
        {{ securityWarning }}
      </p>
    </div>

    <!-- Daftar Entri Log Kesalahan -->
    <div v-if="logs.length > 0" class="space-y-3 font-mono text-xs">
      <div
        v-for="(log, idx) in logs"
        :key="idx"
        class="p-3 rounded-lg bg-(--color-surface-alt) border border-border space-y-1"
      >
        <div class="flex items-center justify-between text-red-500 font-bold">
          <span>
            {{ log.line ? `Baris #${log.line}` : 'Kesalahan Sintaks LaTeX' }}
          </span>
        </div>
        <p class="text-(--color-text-primary) text-[11px] leading-relaxed">
          {{ log.message }}
        </p>
        <p v-if="log.raw" class="text-[10px] text-(--color-text-muted) truncate opacity-75">
          Raw: {{ log.raw }}
        </p>
      </div>
    </div>

    <!-- State Tanpa Log / Berhasil -->
    <div
      v-else-if="!errorText && !securityWarning"
      class="text-center py-12 text-(--color-text-muted) space-y-2"
    >
      <IconInfoCircle class="size-8 mx-auto opacity-30 text-emerald-500" />
      <p class="text-xs">Tidak ditemukan kesalahan sintaks pada kompilasi terakhir.</p>
    </div>

    <!-- General Error Text Fallback -->
    <div
      v-else
      class="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-xs leading-relaxed"
    >
      {{ errorText }}
    </div>
  </div>
</template>
