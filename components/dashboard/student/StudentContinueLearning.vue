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
      <h3 class="text-[15px] font-bold text-(--color-text-primary)">
        Lanjutkan Belajar
      </h3>
      <button
        @click="emit('view-all')"
        class="flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline cursor-pointer"
      >
        View All <IconArrowRight class="size-3.5" />
      </button>
    </div>

    <div
      @click="emit('resume')"
      class="border border-border rounded-xl bg-(--color-surface) p-6 hover:shadow-md hover:border-primary/40 transition-all relative overflow-hidden cursor-pointer group"
    >
      <div class="flex flex-col md:flex-row gap-6 items-start">
        <div class="flex-1 min-w-0 order-2 md:order-1">
          <div class="flex items-center gap-3 mb-3">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 uppercase tracking-wide"
            >
              {{ activeModule.badge }}
            </span>
            <span class="text-[12px] text-(--color-text-muted) font-medium">
              Module {{ activeModule.number }} of {{ activeModule.total }}
            </span>
          </div>

          <h4
            class="font-display text-[22px] font-bold text-(--color-text-primary) leading-snug mb-3"
          >
            {{ activeModule.title }}
          </h4>
          <p class="text-[13.5px] text-text-secondary leading-relaxed mb-5">
            {{ activeModule.description }}
          </p>

          <div class="mb-5">
            <div class="flex justify-between text-[12px] font-semibold mb-1.5">
              <span class="text-text-secondary">Progress Kurikulum</span>
              <span class="text-primary">{{ activeModule.progress }}%</span>
            </div>
            <div class="h-2 bg-border rounded-full overflow-hidden">
              <div
                class="h-full bg-primary rounded-full transition-all duration-500"
                :style="{ width: activeModule.progress + '%' }"
              />
            </div>
          </div>

          <button
            @click="emit('resume')"
            class="inline-flex items-center gap-2.5 px-5 py-3 bg-primary hover:bg-primary-hover text-white font-semibold text-[14px] rounded-md transition-all cursor-pointer shadow-sm hover:shadow"
          >
            Teruskan Belajar
            <span
              class="flex items-center justify-center w-6 h-6 bg-white/20 rounded-full"
            >
              <IconPlayerPlay class="size-3 fill-white text-white" />
            </span>
          </button>
        </div>

        <div
          v-if="activeModule.imageUrl"
          class="w-full md:w-35 aspect-4/3 md:aspect-square shrink-0 rounded-xl overflow-hidden border border-border order-1 md:order-2"
        >
          <img
            :src="activeModule.imageUrl"
            alt="Module thumbnail"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          v-else
          class="hidden md:flex w-35 aspect-square shrink-0 rounded-xl border border-primary/20 bg-primary/5 items-center justify-center order-1 md:order-2"
        >
          <span class="text-5xl text-primary/60 select-none font-bold font-display">∑</span>
        </div>
      </div>
    </div>
  </div>
</template>
