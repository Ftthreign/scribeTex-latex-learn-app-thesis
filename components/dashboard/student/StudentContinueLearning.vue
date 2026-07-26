<script setup lang="ts">
import { IconArrowRight, IconPlayerPlay } from "@tabler/icons-vue";

interface ActiveModule {
  id: number
  number: number
  total: number
  title: string
  description: string
  progress: number
  badge: string
  next_lesson_id?: number | null
  imageUrl?: string
}

defineProps<{ activeModule: ActiveModule }>();
const emit = defineEmits<{ (e: "resume"): void; (e: "view-all"): void }>();
</script>

<template>
  <div class="space-y-4 font-body">
    <div class="flex justify-between items-center">
      <h3 class="text-[15px] font-bold text-[var(--color-text-primary)]">
        Lanjutkan Belajar
      </h3>
      <button
        @click="emit('view-all')"
        class="flex items-center gap-1 text-[13px] font-semibold text-[var(--color-primary)] hover:underline cursor-pointer"
      >
        Lihat Semua Modul <IconArrowRight class="size-3.5" />
      </button>
    </div>

    <div
      @click="emit('resume')"
      class="border border-[var(--color-border)] rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-6 hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] transition-all duration-200 relative overflow-hidden cursor-pointer group shadow-xs hover:shadow-sm"
    >
      <div class="flex flex-col md:flex-row gap-6 items-start">
        <div class="flex-1 min-w-0 order-2 md:order-1">
          <div class="flex items-center gap-3 mb-3">
            <span
              class="inline-flex items-center px-2.5 py-1 rounded-[var(--radius-md)] text-[10px] font-bold bg-[var(--color-warning-light)] text-[var(--color-warning)] border border-[var(--color-warning)]/20 uppercase tracking-wider"
            >
              {{ activeModule.badge }}
            </span>
            <span class="text-[12px] text-[var(--color-text-muted)] font-medium">
              Modul {{ activeModule.number }} dari {{ activeModule.total }}
            </span>
          </div>

          <h4
            class="font-display text-[22px] font-bold text-[var(--color-text-primary)] leading-snug mb-3 group-hover:text-[var(--color-primary)] transition-colors"
          >
            {{ activeModule.title }}
          </h4>
          <p class="text-[13.5px] text-[var(--color-text-secondary)] leading-relaxed mb-5">
            {{ activeModule.description }}
          </p>

          <div class="mb-5">
            <div class="flex justify-between text-[12px] font-semibold mb-1.5">
              <span class="text-[var(--color-text-secondary)]">Progress Kurikulum</span>
              <span class="text-[var(--color-primary)]">{{ activeModule.progress }}%</span>
            </div>
            <div class="h-2 bg-[var(--color-surface-alt)] rounded-full overflow-hidden border border-[var(--color-border)]/50">
              <div
                class="h-full rounded-full transition-all duration-500"
                :style="{ width: activeModule.progress + '%', background: 'linear-gradient(90deg, var(--color-primary), #4f8eff)' }"
              />
            </div>
          </div>

          <button
            @click="emit('resume')"
            class="inline-flex items-center gap-2.5 px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold text-[14px] rounded-[var(--radius-md)] transition-all cursor-pointer shadow-xs hover:shadow-sm"
          >
            Teruskan Belajar
            <span
              class="flex items-center justify-center w-5 h-5 bg-white/20 rounded-full"
            >
              <IconPlayerPlay class="size-3 fill-white text-white" />
            </span>
          </button>
        </div>

        <div
          v-if="activeModule.imageUrl"
          class="w-full md:w-35 aspect-4/3 md:aspect-square shrink-0 rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border)] order-1 md:order-2"
        >
          <img
            :src="activeModule.imageUrl"
            alt="Module thumbnail"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          v-else
          class="hidden md:flex w-35 aspect-square shrink-0 rounded-[var(--radius-md)] border border-[var(--color-primary)]/20 bg-[var(--color-primary-light)]/40 items-center justify-center order-1 md:order-2"
        >
          <span class="text-5xl text-[var(--color-primary)]/70 select-none font-bold font-display">∑</span>
        </div>
      </div>
    </div>
  </div>
</template>
