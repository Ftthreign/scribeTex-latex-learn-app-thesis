<script setup lang="ts">
import { IconTrendingUp, IconBook, IconCheckCircle } from '@tabler/icons-vue'
import { useStudentDashboard } from '~/composables/useStudentDashboard'

definePageMeta({ layout: 'default' })
useHead({ title: 'Progress Belajar | ScribeTex' })

const { stats, activeModule, isLoading } = useStudentDashboard()
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
    <!-- Header Halaman -->
    <div class="space-y-2">
      <h1 class="text-2xl lg:text-3xl font-bold text-(--color-text-primary)">
        Progress Belajar Mahasiswa
      </h1>
      <p
        class="text-xs lg:text-sm text-(--color-text-muted) max-w-2xl leading-relaxed"
      >
        Statistik pelacakan pencapaian materi, kelulusan modul pembelajaran, dan
        aktivitas belajar Anda secara real-time.
      </p>
    </div>

    <!-- State Loading -->
    <div v-if="isLoading" class="space-y-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="i in 4"
          :key="i"
          class="h-28 rounded-xl bg-border/40 animate-pulse"
        ></div>
      </div>
      <div class="h-48 rounded-xl bg-border/40 animate-pulse"></div>
    </div>

    <!-- Konten Stat & Progress -->
    <div v-else class="space-y-8">
      <!-- Grid Cards Summary Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-(--color-surface) border border-border rounded-xl p-5 space-y-2"
          style="box-shadow: var(--shadow-card)"
        >
          <div
            class="flex items-center justify-between text-xs text-(--color-text-muted)"
          >
            <span>{{ stat.label }}</span>
            <span
              class="material-symbols-outlined text-base text-primary"
              v-if="stat.icon"
            >
              {{ stat.icon }}
            </span>
          </div>
          <p
            class="text-2xl font-bold text-(--color-text-primary) tabular-nums"
          >
            {{ stat.value }}
          </p>
          <span
            v-if="stat.badge"
            class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary border border-primary/20"
          >
            {{ stat.badge }}
          </span>
        </div>
      </div>

      <!-- Detail Modul Aktif -->
      <div
        v-if="activeModule"
        class="bg-(--color-surface) border border-border rounded-xl p-6 lg:p-8 space-y-4"
        style="box-shadow: var(--shadow-card)"
      >
        <div
          class="flex items-center justify-between border-b border-border pb-4 flex-wrap gap-3"
        >
          <div>
            <span
              class="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary border border-primary/20"
            >
              {{ activeModule.badge }}
            </span>
            <h3 class="text-lg font-bold text-(--color-text-primary) mt-1">
              {{ activeModule.title }}
            </h3>
          </div>
          <div class="flex items-center gap-2">
            <IconTrendingUp class="size-4 text-primary" />
            <span class="text-sm font-bold text-primary tabular-nums">
              {{ activeModule.progress }}% Selesai
            </span>
          </div>
        </div>

        <!-- Progress Bar Modul -->
        <div
          class="h-2 w-full bg-(--color-surface-alt) rounded-full overflow-hidden border border-border"
        >
          <div
            class="h-full bg-primary rounded-full transition-all duration-700"
            :style="{ width: activeModule.progress + '%' }"
          />
        </div>

        <p class="text-xs text-(--color-text-muted) leading-relaxed">
          {{ activeModule.description }}
        </p>

        <div class="pt-2">
          <NuxtLink
            :to="`/student/modules/${activeModule.id}`"
            class="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <IconBook class="size-4" />
            Lanjutkan Belajar Modul Ini
          </NuxtLink>
        </div>
      </div>

      <!-- Kosong State -->
      <div v-else class="text-center py-16 text-(--color-text-muted) space-y-3">
        <IconCheckCircle class="size-10 mx-auto opacity-30" />
        <p class="text-sm">
          Belum ada data progres. Mulai belajar materi di Modul LaTeX!
        </p>
        <NuxtLink
          to="/student/modules"
          class="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors"
        >
          Lihat Modul Pembelajaran
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
