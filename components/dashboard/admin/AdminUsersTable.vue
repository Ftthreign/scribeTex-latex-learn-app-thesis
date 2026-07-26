<script setup lang="ts">
import { IconShield, IconUserCheck, IconEye } from "@tabler/icons-vue";

defineProps<{
  users: any[];
}>();

const emit = defineEmits<{
  (e: "openDetail", user: any): void;
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
  <div
    class="gsap-admin-users-table bg-(--color-surface) rounded-2xl border border-border shadow-xs overflow-hidden font-body"
  >
    <table class="w-full text-sm">
      <thead class="bg-surface-alt/70 border-b border-border font-sans">
        <tr>
          <th
            class="px-5 py-3.5 text-left text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
          >
            Pengguna
          </th>
          <th
            class="px-5 py-3.5 text-center text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
          >
            Peran
          </th>
          <th
            class="px-5 py-3.5 text-left text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
          >
            Progres Belajar
          </th>
          <th
            class="px-5 py-3.5 text-center text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
          >
            Aktivitas
          </th>
          <th
            class="px-5 py-3.5 text-right text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
          >
            Terdaftar
          </th>
          <th
            class="px-5 py-3.5 text-right text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
          >
            Aksi
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-border font-sans">
        <tr v-if="users.length === 0">
          <td
            colspan="6"
            class="py-16 text-center text-(--color-text-muted) text-xs"
          >
            Tidak ada data pengguna yang sesuai dengan kriteria filter
            pencarian.
          </td>
        </tr>

        <tr
          v-for="u in users"
          :key="u.id"
          class="hover:bg-surface-alt/50 transition-colors group"
        >
          <td class="px-5 py-4">
            <div class="flex items-center gap-3">
              <div
                class="size-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs"
              >
                {{ u.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <div
                  class="font-bold text-(--color-text-primary) text-xs leading-tight font-display"
                >
                  {{ u.name }}
                </div>
                <div
                  class="text-[11px] text-(--color-text-muted) font-mono mt-0.5"
                >
                  {{ u.email }}
                </div>
              </div>
            </div>
          </td>

          <td class="px-5 py-4 text-center">
            <span
              :class="[
                'inline-flex items-center gap-1 text-[10px] font-bold border px-2.5 py-0.5 rounded-full uppercase tracking-wider',
                u.role === 'ADMIN'
                  ? 'bg-primary-light text-primary border-primary/20'
                  : 'bg-surface-alt text-text-secondary border-border',
              ]"
            >
              <IconShield v-if="u.role === 'ADMIN'" class="size-3" />
              <IconUserCheck v-else class="size-3" />
              <span>{{ u.role }}</span>
            </span>
          </td>

          <td class="px-5 py-4 min-w-48">
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="font-semibold text-(--color-text-primary)">
                  {{ u.progress.completed_lessons }} /
                  {{ u.progress.total_lessons }} Lesson
                </span>
                <span class="font-bold font-mono text-primary tabular-nums"
                  >{{ u.progress.percentage }}%</span
                >
              </div>
              <div
                class="w-full h-2 bg-surface-alt rounded-full overflow-hidden border border-border/50"
              >
                <div
                  class="h-full bg-primary rounded-full transition-all duration-500"
                  :style="{ width: `${u.progress.percentage}%` }"
                ></div>
              </div>
            </div>
          </td>

          <td class="px-5 py-4 text-center">
            <div class="flex items-center justify-center gap-2">
              <span
                class="px-2 py-0.5 rounded-lg bg-surface-alt border border-border text-[11px] font-mono font-semibold text-text-secondary"
                title="Total kompilasi PDF Docker"
              >
                {{ u.activity.total_compilations }} PDF
              </span>
              <span
                class="px-2 py-0.5 rounded-lg bg-primary-light border border-primary/20 text-[11px] font-mono font-semibold text-primary"
                title="Total percakapan konsultasi AI"
              >
                {{ u.activity.total_ai_chats }} AI
              </span>
            </div>
          </td>

          <td
            class="px-5 py-4 text-right text-xs text-(--color-text-muted) font-mono tabular-nums"
          >
            {{ formatDate(u.created_at) }}
          </td>

          <td class="px-5 py-4 text-right">
            <button
              @click="emit('openDetail', u)"
              class="btn-secondary btn-sm gap-1 rounded-lg cursor-pointer font-bold ml-auto shadow-2xs"
            >
              <IconEye class="size-3.5 text-primary" />
              <span>Detail</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
