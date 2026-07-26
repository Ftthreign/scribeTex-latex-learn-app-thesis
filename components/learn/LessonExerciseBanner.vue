<script setup lang="ts">
import { IconCode } from '@tabler/icons-vue'

interface Exercise {
  id: number
  instruction: string
}

defineProps<{
  exercises?: Exercise[]
}>()

const emit = defineEmits<{
  (e: 'start-exercise', exerciseId: number): void
}>()
</script>

<template>
  <div
    v-if="exercises && exercises.length > 0"
    class="card p-6 flex flex-col md:flex-row items-center justify-between gap-4 font-body border-l-4 border-l-(--color-primary)"
  >
    <div class="space-y-1 text-center md:text-left">
      <h4 class="text-base font-bold text-(--color-text-primary) font-display flex items-center gap-2 justify-center md:justify-start">
        <IconCode class="size-5 text-(--color-primary)" />
        Latihan Interaktif ScribeTex
      </h4>
      <p class="text-xs text-(--color-text-secondary) max-w-md leading-relaxed font-sans">
        Praktikkan materi ini secara langsung di editor kode interaktif dengan dukungan pratinjau dan kompilasi dokumen PDF instan.
      </p>
    </div>

    <button
      @click="exercises[0]?.id && emit('start-exercise', exercises[0].id)"
      class="btn-primary btn-md flex items-center gap-2 whitespace-nowrap shadow-xs cursor-pointer font-bold shrink-0 font-sans"
    >
      <IconCode class="size-4" />
      <span>Mulai Latihan Kode</span>
    </button>
  </div>
</template>
