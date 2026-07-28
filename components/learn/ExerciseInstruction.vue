<script setup lang="ts">
import { IconBook, IconCode, IconInfoCircle, IconFileText } from '@tabler/icons-vue'
import type { ExerciseDetail } from '~/composables/useExercise'

defineProps<{
  exercise: ExerciseDetail;
  isCompleted?: boolean;
}>()

const emit = defineEmits<{
  (e: 'viewResult'): void;
}>()
</script>

<template>
  <div class="card p-6 space-y-4 font-body shadow-xs">
    <!-- Header Status Akademik jika Latihan Sudah Pernah Diselesaikan -->
    <div
      v-if="isCompleted"
      class="p-4 rounded-xl bg-(--color-surface-alt)/60 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all"
    >
      <div class="flex items-center gap-3">
        <span class="size-2.5 rounded-full bg-(--color-primary) shrink-0"></span>
        <div>
          <h4 class="text-xs sm:text-sm font-bold text-(--color-text-primary) font-display">Anda Telah Menyelesaikan Latihan Ini</h4>
          <p class="text-xs text-(--color-text-secondary) leading-relaxed font-sans">
            Kode jawaban Anda terverifikasi 100% tepat. Anda dapat meninjau riwayat kode & berkas PDF hasil pengerjaan Anda kapan saja.
          </p>
        </div>
      </div>

      <button
        @click="emit('viewResult')"
        class="btn-primary btn-sm flex items-center gap-1.5 shrink-0 self-end sm:self-auto cursor-pointer font-bold shadow-xs"
      >
        <IconFileText class="size-4" />
        <span>Lihat Hasil Pengerjaan Saya</span>
      </button>
    </div>

    <!-- Header Modul & Lesson -->
    <div class="flex items-center justify-between gap-2 border-b border-border pb-3">
      <div class="flex items-center gap-2 text-xs sm:text-sm font-bold text-(--color-primary)">
        <IconBook class="size-4 shrink-0" />
        <span class="truncate font-display tracking-tight">{{ exercise?.module_title || 'Modul Pembelajaran' }}</span>
      </div>
      <span class="px-3 py-1 text-xs font-semibold rounded-full bg-(--color-primary-light) text-(--color-primary) border border-(--color-primary)/20 font-sans">
        {{ exercise?.lesson_title || 'Latihan Kode' }}
      </span>
    </div>

    <!-- Instruksi Utama -->
    <div class="space-y-2">
      <h3 class="text-[15px] sm:text-base font-bold text-(--color-text-primary) flex items-center gap-2 font-display">
        <IconCode class="size-5 text-(--color-primary) shrink-0" />
        <span>Instruksi Latihan Kode</span>
      </h3>
      <p class="text-sm sm:text-[15px] text-(--color-text-primary) leading-relaxed font-sans font-medium bg-surface-alt/40 p-4 rounded-xl border border-border/60">
        {{ exercise?.instruction || 'Selesaikan perbaikan kode pada editor sesuai petunjuk materi.' }}
      </p>
    </div>

    <!-- Petunjuk Singkat -->
    <div class="pt-2 flex items-center gap-2 text-xs sm:text-[12.5px] text-(--color-text-muted) border-t border-border/60 font-sans">
      <IconInfoCircle class="size-4 text-(--color-primary) shrink-0" />
      <span>Edit sintaks pada editor di bawah lalu amati hasil pratinjau notasi matematika secara langsung pada panel sebelah kanan.</span>
    </div>
  </div>
</template>
