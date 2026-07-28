<script setup lang="ts">
import { ref, watch } from "vue";
import {
  IconCalendar,
  IconCheck,
  IconAlertCircle,
  IconChevronDown,
  IconChevronUp,
  IconCode,
  IconLoader2,
  IconTerminal2,
  IconExternalLink,
} from "@tabler/icons-vue";

const props = defineProps<{
  isOpen: boolean;
  user: any;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const activeTab = ref<"submissions" | "overview">("submissions");
const submissions = ref<any[]>([]);
const pendingSubmissions = ref(false);
const expandedSubmissionId = ref<number | null>(null);

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function toggleExpandSubmission(id: number) {
  if (expandedSubmissionId.value === id) {
    expandedSubmissionId.value = null;
  } else {
    expandedSubmissionId.value = id;
  }
}

watch(
  () => [props.isOpen, props.user?.id],
  async ([open, userId]) => {
    if (open && userId) {
      pendingSubmissions.value = true;
      expandedSubmissionId.value = null;
      try {
        const res = await $fetch<any>(`/api/admin/users/${userId}/submissions`);
        submissions.value = res?.data || [];
      } catch (err) {
        submissions.value = [];
      } finally {
        pendingSubmissions.value = false;
      }
    } else if (!open) {
      submissions.value = [];
    }
  },
  { immediate: true },
);
</script>

<template>
  <UiModal
    :isOpen="isOpen"
    title="Rincian Progres & Riwayat Submit Siswa"
    size="4xl"
    @close="emit('close')"
  >
    <div v-if="user" class="space-y-5 font-body">
      <!-- Profile & Summary Card Header -->
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-surface-alt rounded-2xl border border-border"
      >
        <div class="flex items-center gap-3.5 min-w-0">
          <div
            class="size-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs"
          >
            {{ user.name?.charAt(0).toUpperCase() || "S" }}
          </div>
          <div class="min-w-0 font-sans">
            <div class="flex items-center gap-2 flex-wrap">
              <h4
                class="font-bold text-(--color-text-primary) text-base font-display truncate"
              >
                {{ user.name }}
              </h4>
              <span
                :class="[
                  'text-[10px] font-bold border px-2.5 py-0.5 rounded-full uppercase tracking-wider',
                  user.role === 'ADMIN'
                    ? 'bg-primary-light text-primary border-primary/20'
                    : 'bg-surface text-text-secondary border-border',
                ]"
              >
                {{ user.role }}
              </span>
            </div>
            <p
              class="text-xs text-(--color-text-muted) font-mono truncate mt-0.5"
            >
              {{ user.email }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 text-xs font-sans shrink-0">
          <div
            class="px-3 py-1.5 bg-surface rounded-xl border border-border flex items-center gap-1.5 text-(--color-text-muted)"
          >
            <IconCalendar class="size-4 text-primary" />
            <span>Bergabung: {{ formatDate(user.created_at) }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans">
        <div class="p-3 bg-surface border border-border rounded-xl space-y-1">
          <div class="text-[11px] font-semibold text-(--color-text-muted)">
            Progres Belajar
          </div>
          <div class="flex items-baseline justify-between">
            <span
              class="text-lg font-bold text-primary font-display tabular-nums"
            >
              {{ user.progress?.percentage || 0 }}%
            </span>
            <span class="text-[10px] text-text-secondary font-mono">
              {{ user.progress?.completed_lessons || 0 }}/{{
                user.progress?.total_lessons || 0
              }}
              Materi
            </span>
          </div>
          <div class="w-full h-1.5 bg-surface-alt rounded-full overflow-hidden">
            <div
              class="h-full bg-primary rounded-full transition-all duration-500"
              :style="{ width: `${user.progress?.percentage || 0}%` }"
            ></div>
          </div>
        </div>

        <div class="p-3 bg-surface border border-border rounded-xl space-y-1">
          <div class="text-[11px] font-semibold text-(--color-text-muted)">
            Total Submit Latihan
          </div>
          <div
            class="text-lg font-bold text-(--color-text-primary) font-display tabular-nums"
          >
            {{ user.activity?.total_compilations || 0 }} Kali
          </div>
          <div class="text-[10px] text-text-secondary">Eksekusi Docker</div>
        </div>

        <div class="p-3 bg-surface border border-border rounded-xl space-y-1">
          <div class="text-[11px] font-semibold text-(--color-text-muted)">
            Konsultasi AI
          </div>
          <div
            class="text-lg font-bold text-(--color-text-primary) font-display tabular-nums"
          >
            {{ user.activity?.total_ai_chats || 0 }} Sesi
          </div>
          <div class="text-[10px] text-text-secondary">Gemini AI Chat</div>
        </div>

        <div class="p-3 bg-surface border border-border rounded-xl space-y-1">
          <div class="text-[11px] font-semibold text-(--color-text-muted)">
            Peran Akun
          </div>
          <div
            class="text-lg font-bold text-(--color-text-primary) font-display"
          >
            {{ user.role }}
          </div>
          <div class="text-[10px] text-text-secondary">Hak Akses Sistem</div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center gap-2 border-b border-border font-sans">
        <button
          @click="activeTab = 'submissions'"
          :class="[
            'px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2',
            activeTab === 'submissions'
              ? 'border-primary text-primary'
              : 'border-transparent text-(--color-text-muted) hover:text-(--color-text-primary)',
          ]"
        >
          <IconTerminal2 class="size-4" />
          <span>Riwayat Submit Latihan</span>
          <span
            class="px-2 py-0.2 rounded-full text-[10px] bg-primary-light text-primary font-mono"
          >
            {{ submissions.length }}
          </span>
        </button>
      </div>

      <!-- Submissions Tab Content -->
      <div v-if="activeTab === 'submissions'" class="space-y-3">
        <!-- Loading State -->
        <div
          v-if="pendingSubmissions"
          class="py-12 flex flex-col items-center justify-center text-center space-y-2 text-(--color-text-muted)"
        >
          <IconLoader2 class="size-6 animate-spin text-primary" />
          <span class="text-xs font-semibold font-sans"
            >Memuat riwayat submit pengerjaan siswa...</span
          >
        </div>

        <!-- Empty State -->
        <div
          v-else-if="submissions.length === 0"
          class="py-12 text-center text-xs text-(--color-text-muted) bg-surface border border-border rounded-2xl font-sans"
        >
          Siswa ini belum pernah mengirimkan (*submit*) pengerjaan latihan
          praktik LaTeX.
        </div>

        <!-- Submissions List Table -->
        <div
          v-else
          class="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs"
        >
          <div class="overflow-x-auto">
            <table class="w-full text-xs font-sans min-w-162.5">
              <thead class="bg-surface-alt/70 border-b border-border">
                <tr>
                  <th
                    class="px-4 py-3 text-left font-bold text-(--color-text-muted) uppercase tracking-wider"
                  >
                    Petunjuk & Soal Latihan
                  </th>
                  <th
                    class="px-4 py-3 text-left font-bold text-(--color-text-muted) uppercase tracking-wider"
                  >
                    Lesson Terkait
                  </th>
                  <th
                    class="px-4 py-3 text-center font-bold text-(--color-text-muted) uppercase tracking-wider"
                  >
                    Hasil Kompilasi
                  </th>
                  <th
                    class="px-4 py-3 text-right font-bold text-(--color-text-muted) uppercase tracking-wider"
                  >
                    Waktu Submit
                  </th>
                  <th
                    class="px-4 py-3 text-center font-bold text-(--color-text-muted) uppercase tracking-wider"
                  >
                    Kode & Log
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <template v-for="sub in submissions" :key="sub.id">
                  <tr
                    class="hover:bg-surface-alt/40 transition-colors group cursor-pointer"
                    @click="toggleExpandSubmission(sub.id)"
                  >
                    <td class="px-4 py-3.5">
                      <div
                        class="font-bold text-(--color-text-primary) text-xs line-clamp-1 group-hover:text-primary transition-colors"
                      >
                        {{ sub.exercise_title }}
                      </div>
                    </td>

                    <td class="px-4 py-3.5">
                      <div class="space-y-0.5">
                        <span
                          class="inline-block text-[10.5px] font-semibold text-primary bg-primary-light border border-primary/20 px-2 py-0.5 rounded-md"
                        >
                          {{ sub.lesson_title }}
                        </span>
                        <div
                          class="text-[10px] text-(--color-text-muted) font-semibold"
                        >
                          {{ sub.module_title }}
                        </div>
                      </div>
                    </td>

                    <td class="px-4 py-3.5 text-center">
                      <span
                        :class="[
                          'inline-flex items-center gap-1 text-[10px] font-bold border px-2.5 py-0.5 rounded-full uppercase tracking-wider',
                          sub.is_success
                            ? 'bg-success-light text-success border-success/30'
                            : 'bg-error-light text-(--color-error) border-(--color-error)/30',
                        ]"
                      >
                        <IconCheck
                          v-if="sub.is_success"
                          class="size-3 stroke-3"
                        />
                        <IconAlertCircle v-else class="size-3 stroke-[2.5]" />
                        <span>{{ sub.is_success ? "BERHASIL" : "GAGAL" }}</span>
                      </span>
                    </td>

                    <td
                      class="px-4 py-3.5 text-right font-mono text-[11px] text-(--color-text-muted) tabular-nums"
                    >
                      {{ formatDate(sub.created_at) }}
                    </td>

                    <td class="px-4 py-3.5 text-center">
                      <div class="flex items-center justify-center gap-1">
                        <NuxtLink
                          v-if="sub.exercise_id"
                          :to="`/student/exercises/${sub.exercise_id}`"
                          target="_blank"
                          @click.stop
                          class="p-1.5 rounded-lg text-primary hover:bg-primary-light border border-transparent hover:border-primary/20 transition-all cursor-pointer inline-flex items-center font-semibold text-[11px]"
                          title="Buka Soal Latihan di POV Siswa"
                        >
                          <IconExternalLink class="size-3.5" />
                        </NuxtLink>

                        <button
                          @click.stop="toggleExpandSubmission(sub.id)"
                          class="p-1.5 rounded-lg text-primary hover:bg-surface-alt border border-transparent hover:border-border transition-all cursor-pointer inline-flex items-center gap-1 font-semibold text-[11px]"
                          title="Lihat Kode LaTeX & Error Log"
                        >
                          <IconCode class="size-3.5" />
                          <IconChevronUp
                            v-if="expandedSubmissionId === sub.id"
                            class="size-3.5"
                          />
                          <IconChevronDown v-else class="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Expandable Detail Row (Submitted Code & Error Log) -->
                  <tr
                    v-if="expandedSubmissionId === sub.id"
                    class="bg-surface-alt/20"
                  >
                    <td colspan="5" class="p-4 space-y-3">
                      <!-- Submitted LaTeX Code Section -->
                      <div class="space-y-1.5">
                        <div
                          class="flex items-center justify-between text-[11px] font-bold text-(--color-text-primary) font-mono"
                        >
                          <span class="flex items-center gap-1.5">
                            <IconCode class="size-4 text-primary" />
                            Kode LaTeX yang Disubmit Siswa:
                          </span>
                        </div>

                        <pre
                          class="p-3.5 bg-code-bg text-code-text rounded-xl text-xs font-mono overflow-x-auto max-h-48 leading-relaxed border border-border shadow-inner"
                        ><code>{{ sub.submitted_code }}</code></pre>
                      </div>

                      <!-- Error Log Section (if failed) -->
                      <div
                        v-if="!sub.is_success && sub.error_log"
                        class="space-y-1.5"
                      >
                        <div
                          class="flex items-center gap-1.5 text-[11px] font-bold text-(--color-error) font-mono"
                        >
                          <IconAlertCircle class="size-4" />
                          <span>Pesan Error Kompilasi Docker:</span>
                        </div>
                        <pre
                          class="p-3.5 bg-error-light/50 text-(--color-error) rounded-xl text-xs font-mono overflow-x-auto max-h-36 leading-relaxed border border-(--color-error)/30"
                        ><code>{{ sub.error_log }}</code></pre>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <button
        @click="emit('close')"
        class="btn-secondary btn-md font-bold cursor-pointer min-w-28"
      >
        Tutup
      </button>
    </template>
  </UiModal>
</template>
