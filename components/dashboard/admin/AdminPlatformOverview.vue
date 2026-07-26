<script setup lang="ts">
import {
  IconActivity,
  IconFileText,
  IconCode,
  IconUsers,
} from "@tabler/icons-vue";

defineProps<{
  stats: any;
}>();
</script>

<template>
  <div
    class="gsap-admin-overview grid grid-cols-1 lg:grid-cols-3 gap-6 font-body"
  >
    <div
      class="lg:col-span-1 bg-(--color-surface) rounded-2xl border border-border shadow-xs p-6 space-y-4 flex flex-col justify-between"
    >
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <IconActivity class="size-5 text-primary" />
          <h3
            class="font-bold text-(--color-text-primary) font-display text-base"
          >
            Progres Belajar Platform
          </h3>
        </div>

        <div class="space-y-4 pt-1 font-sans">
          <div>
            <div class="flex justify-between text-xs font-semibold mb-1.5">
              <span class="text-text-secondary"
                >Rata-rata Kelulusan Mahasiswa</span
              >
              <span class="font-bold text-primary tabular-nums"
                >{{ stats?.activity?.progress_percentage ?? 0 }}%</span
              >
            </div>
            <div
              class="w-full h-2.5 bg-surface-alt rounded-full overflow-hidden border border-border/50"
            >
              <div
                class="h-full bg-primary rounded-full transition-all duration-700"
                :style="{
                  width: `${stats?.activity?.progress_percentage ?? 0}%`,
                }"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 pt-3 border-t border-border font-sans">
        <div
          class="text-center p-3 bg-surface-alt rounded-xl border border-border/50"
        >
          <div class="text-xl font-bold text-primary font-display tabular-nums">
            {{ stats?.activity?.completed_progress ?? 0 }}
          </div>
          <div
            class="text-[11px] text-(--color-text-muted) font-semibold mt-0.5"
          >
            Lesson Selesai
          </div>
        </div>
        <div
          class="text-center p-3 bg-surface-alt rounded-xl border border-border/50"
        >
          <div
            class="text-xl font-bold text-(--color-text-primary) font-display tabular-nums"
          >
            {{ stats?.activity?.progress_records ?? 0 }}
          </div>
          <div
            class="text-[11px] text-(--color-text-muted) font-semibold mt-0.5"
          >
            Total Record
          </div>
        </div>
      </div>
    </div>

    <div
      class="lg:col-span-2 bg-(--color-surface) rounded-2xl border border-border shadow-xs p-6 space-y-5 flex flex-col justify-between"
    >
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <IconFileText class="size-5 text-primary" />
          <h3
            class="font-bold text-(--color-text-primary) font-display text-base"
          >
            Ringkasan Konten Kurikulum
          </h3>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans">
          <div
            class="p-4 rounded-xl bg-primary-light border border-primary/20 text-center space-y-1"
          >
            <div
              class="text-2xl font-bold text-primary font-display tabular-nums"
            >
              {{ stats?.content?.modules ?? 0 }}
            </div>
            <div
              class="text-[11px] font-bold text-primary uppercase tracking-wider"
            >
              Modul
            </div>
          </div>
          <div
            class="p-4 rounded-xl bg-primary-light border border-primary/20 text-center space-y-1"
          >
            <div
              class="text-2xl font-bold text-primary font-display tabular-nums"
            >
              {{ stats?.content?.lessons ?? 0 }}
            </div>
            <div
              class="text-[11px] font-bold text-primary uppercase tracking-wider"
            >
              Materi Lesson
            </div>
          </div>
          <div
            class="p-4 rounded-xl bg-primary-light border border-primary/20 text-center space-y-1"
          >
            <div
              class="text-2xl font-bold text-primary font-display tabular-nums"
            >
              {{ stats?.content?.exercises ?? 0 }}
            </div>
            <div
              class="text-[11px] font-bold text-primary uppercase tracking-wider"
            >
              Latihan Praktik
            </div>
          </div>
          <div
            class="p-4 rounded-xl bg-primary-light border border-primary/20 text-center space-y-1"
          >
            <div
              class="text-2xl font-bold text-primary font-display tabular-nums"
            >
              {{ stats?.content?.articles ?? 0 }}
            </div>
            <div
              class="text-[11px] font-bold text-primary uppercase tracking-wider"
            >
              Artikel Regulasi
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="pt-4 border-t border-border font-sans">
        <p
          class="text-[11px] text-(--color-text-muted) font-bold uppercase tracking-wider mb-2.5"
        >
          Aksi Cepat Manajemen Admin
        </p>
        <div class="flex flex-wrap gap-2">
          <NuxtLink
            to="/admin/content"
            class="btn-primary btn-sm gap-1.5 rounded-lg cursor-pointer font-bold shadow-xs"
          >
            <IconCode class="size-3.5" />
            <span>Kelola Konten & Modul</span>
          </NuxtLink>
          <NuxtLink
            to="/admin/users"
            class="btn-secondary btn-sm gap-1.5 rounded-lg cursor-pointer font-semibold"
          >
            <IconUsers class="size-3.5" />
            <span>Manajemen Pengguna</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
