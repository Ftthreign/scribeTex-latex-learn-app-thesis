<script setup lang="ts">
import { IconBook, IconPlayerPlay } from "@tabler/icons-vue";

defineProps<{
  activeModule?: {
    id: number;
    title: string;
    description: string;
    progress: number;
    badge?: string;
  } | null;
}>();
</script>

<template>
  <div v-if="activeModule" class="space-y-4 font-body">
    <div class="flex justify-between items-center">
      <h3
        class="text-[15px] font-bold text-(--color-text-primary) font-display"
      >
        Fokus Pembelajaran Aktif
      </h3>
    </div>

    <div
      class="border border-border rounded-(--radius-lg) bg-(--color-surface) p-6 hover:-translate-y-0.5 hover:border-border-strong transition-all duration-200 relative overflow-hidden cursor-pointer group shadow-xs hover:shadow-sm"
    >
      <div class="flex flex-col md:flex-row gap-6 items-start">
        <div class="flex-1 min-w-0 order-2 md:order-1">
          <div class="flex items-center gap-3 mb-3">
            <span
              class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-primary-light text-primary border border-primary/20 uppercase tracking-wider"
            >
              {{ activeModule.badge || "PROSES" }}
            </span>
            <span
              class="text-[12px] text-(--color-text-muted) font-medium font-sans"
            >
              Modul Pembelajaran
            </span>
          </div>

          <h4
            class="font-display text-[22px] font-bold text-(--color-text-primary) leading-snug mb-3 group-hover:text-primary transition-colors"
          >
            {{ activeModule.title }}
          </h4>
          <p
            class="text-[13.5px] text-text-secondary leading-relaxed mb-5 font-sans"
          >
            {{ activeModule.description }}
          </p>

          <div class="mb-5 font-sans">
            <div class="flex justify-between text-[12px] font-semibold mb-1.5">
              <span class="text-text-secondary">Progress Modul Ini</span>
              <span class="text-primary font-bold tabular-nums"
                >{{ activeModule.progress }}%</span
              >
            </div>
            <div
              class="h-2 bg-surface-alt rounded-full overflow-hidden border border-border/50"
            >
              <div
                class="h-full rounded-full transition-all duration-500 bg-primary"
                :style="{ width: activeModule.progress + '%' }"
              />
            </div>
          </div>

          <NuxtLink
            :to="`/student/modules/${activeModule.id}`"
            class="inline-flex items-center gap-2.5 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold text-[14px] rounded-md transition-all cursor-pointer shadow-xs hover:shadow-sm font-sans"
          >
            Lanjutkan Belajar
            <span
              class="flex items-center justify-center w-5 h-5 bg-white/20 rounded-full"
            >
              <IconPlayerPlay class="size-3 fill-white text-white" />
            </span>
          </NuxtLink>
        </div>

        <!-- Thumbnail Watermark Σ -->
        <div
          class="hidden md:flex w-35 aspect-square shrink-0 rounded-md border border-primary/20 bg-primary-light/40 items-center justify-center order-1 md:order-2"
        >
          <span
            class="text-5xl text-primary/70 select-none font-bold font-display"
            >∑</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
