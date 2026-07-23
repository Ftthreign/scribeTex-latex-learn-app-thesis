<script setup lang="ts">
import { IconCode } from '@tabler/icons-vue'

interface Exercise {
  id: number
  instruction: string
}

const props = defineProps<{
  exercises?: Exercise[]
}>()

const emit = defineEmits<{
  (e: 'start-exercise', exerciseId: number): void
}>()
</script>

<template>
  <div
    v-if="exercises && exercises.length > 0"
    class="bg-primary/5 border border-primary/25 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
  >
    <div class="space-y-1 text-center md:text-left">
      <h4 class="text-base font-bold text-(--color-text-primary) flex items-center gap-2 justify-center md:justify-start">
        <IconCode class="size-5 text-primary" />
        Latihan Interaktif ScribeTex
      </h4>
      <p class="text-xs text-(--color-text-muted) max-w-sm">
        Praktikkan materi ini secara langsung di Editor Kode interaktif dengan dukungan kompilasi instan.
      </p>
    </div>

    <button
      @click="emit('start-exercise', exercises[0].id)"
      class="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-sm"
    >
      <IconCode class="size-4" />
      Mulai Latihan Kode
    </button>
  </div>
</template>
