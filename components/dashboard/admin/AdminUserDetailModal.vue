<script setup lang="ts">
import { IconShield, IconChartBar, IconCalendar } from "@tabler/icons-vue";

const props = defineProps<{
  isOpen: boolean;
  user: any;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
</script>

<template>
  <UiModal
    :isOpen="isOpen"
    title="Rincian Progres Pembelajaran Siswa"
    @close="emit('close')"
  >
    <div v-if="user" class="space-y-4 font-body">
      <div
        class="flex items-center gap-3 p-3 bg-surface-alt rounded-xl border border-border"
      >
        <div
          class="size-11 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs"
        >
          {{ user.name.charAt(0).toUpperCase() }}
        </div>
        <div class="min-w-0 font-sans">
          <h4
            class="font-bold text-(--color-text-primary) text-sm font-display truncate"
          >
            {{ user.name }}
          </h4>
          <p class="text-xs text-(--color-text-muted) font-mono truncate">
            {{ user.email }}
          </p>
        </div>
      </div>

      <div
        class="p-4 bg-surface border border-border rounded-xl space-y-3 font-sans"
      >
        <div class="flex items-center justify-between text-xs font-bold">
          <span class="text-(--color-text-primary)"
            >Capaian Pembelajaran Kurikulum</span
          >
          <span class="text-primary font-mono text-xs tabular-nums"
            >{{ user.progress?.percentage || 0 }}% Selesai</span
          >
        </div>

        <div
          class="w-full h-2.5 bg-surface-alt rounded-full overflow-hidden border border-border"
        >
          <div
            class="h-full bg-primary rounded-full transition-all duration-500"
            :style="{ width: `${user.progress?.percentage || 0}%` }"
          ></div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-center text-xs pt-1">
          <div class="p-2.5 bg-surface-alt rounded-lg border border-border">
            <div
              class="font-bold text-primary font-display text-base tabular-nums"
            >
              {{ user.progress?.completed_lessons || 0 }} /
              {{ user.progress?.total_lessons || 0 }}
            </div>
            <div
              class="text-[10px] text-(--color-text-muted) font-semibold mt-0.5"
            >
              Materi Diselesaikan
            </div>
          </div>
          <div class="p-2.5 bg-surface-alt rounded-lg border border-border">
            <div
              class="font-bold text-primary font-display text-base tabular-nums"
            >
              {{ user.activity?.total_ai_chats || 0 }}
            </div>
            <div
              class="text-[10px] text-(--color-text-muted) font-semibold mt-0.5"
            >
              Konsultasi AI
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-2 text-xs text-text-secondary font-sans">
        <div
          class="flex items-center justify-between py-1.5 border-b border-border"
        >
          <span class="flex items-center gap-1.5"
            ><IconShield class="size-4 text-primary" /> Peran Sistem:</span
          >
          <span class="font-bold text-(--color-text-primary)">{{
            user.role
          }}</span>
        </div>
        <div
          class="flex items-center justify-between py-1.5 border-b border-border"
        >
          <span class="flex items-center gap-1.5"
            ><IconChartBar class="size-4 text-primary" /> Eksekusi PDF
            Docker:</span
          >
          <span class="font-bold text-(--color-text-primary) tabular-nums"
            >{{ user.activity?.total_compilations || 0 }} Kali</span
          >
        </div>
        <div class="flex items-center justify-between py-1.5">
          <span class="flex items-center gap-1.5"
            ><IconCalendar class="size-4 text-primary" /> Tanggal
            Bergabung:</span
          >
          <span class="font-mono text-(--color-text-primary) tabular-nums">{{
            formatDate(user.created_at)
          }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <button
        @click="emit('close')"
        class="btn-secondary btn-md w-full font-bold cursor-pointer"
      >
        Tutup
      </button>
    </template>
  </UiModal>
</template>
