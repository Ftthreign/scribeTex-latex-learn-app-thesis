<script setup lang="ts">
import { ref, computed } from "vue";
import {
  IconUsers,
  IconSearch,
  IconRefresh,
  IconTrendingUp,
  IconCircleCheck,
  IconBrain,
  IconChartBar,
  IconUserCheck,
  IconShield,
  IconEye,
  IconX,
  IconCalendar,
  IconBook,
} from "@tabler/icons-vue";

definePageMeta({ layout: "admin", middleware: ["role-admin"] });
useHead({ title: "Monitoring Progres Siswa | ScribeTex Admin" });

// ─── Data Fetching ─────────────────────────────────────────────────────────
const { data: usersRes, refresh: refreshUsers, pending } = await useFetch<any>("/api/admin/users");

const users = computed(() => usersRes.value?.data || []);

// ─── Filter & Search State ────────────────────────────────────────────────
const searchQuery = ref("");
const roleFilter = ref<"ALL" | "STUDENT" | "ADMIN">("ALL");
const progressFilter = ref<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

const filteredUsers = computed(() => {
  return users.value.filter((u: any) => {
    // Search query
    const q = searchQuery.value.toLowerCase();
    const matchesSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);

    // Role filter
    const matchesRole = roleFilter.value === "ALL" || u.role === roleFilter.value;

    // Progress filter
    let matchesProgress = true;
    if (progressFilter.value === "ACTIVE") matchesProgress = u.progress.completed_lessons > 0;
    if (progressFilter.value === "INACTIVE") matchesProgress = u.progress.completed_lessons === 0;

    return matchesSearch && matchesRole && matchesProgress;
  });
});

// ─── Summary Stats ─────────────────────────────────────────────────────────
const totalStudents = computed(() => users.value.filter((u: any) => u.role === "STUDENT").length);
const totalAdmins = computed(() => users.value.filter((u: any) => u.role === "ADMIN").length);

const avgProgress = computed(() => {
  const students = users.value.filter((u: any) => u.role === "STUDENT");
  if (students.length === 0) return 0;
  const sum = students.reduce((acc: number, u: any) => acc + (u.progress.percentage || 0), 0);
  return Math.round(sum / students.length);
});

const totalCompilations = computed(() => {
  return users.value.reduce((acc: number, u: any) => acc + (u.activity.total_compilations || 0), 0);
});

const totalAiChats = computed(() => {
  return users.value.reduce((acc: number, u: any) => acc + (u.activity.total_ai_chats || 0), 0);
});

// ─── Student Detail Modal State ───────────────────────────────────────────
const selectedUser = ref<any>(null);
const showDetailModal = ref(false);

function openDetail(user: any) {
  selectedUser.value = user;
  showDetailModal.value = true;
}

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
  <div class="max-w-7xl mx-auto w-full pb-12 space-y-6 px-1">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-(--color-text-primary) font-display tracking-tight">
          Monitoring Progres Mahasiswa
        </h1>
        <p class="text-sm text-(--color-text-muted) mt-0.5">
          Pelacakan kemajuan belajar & aktivitas pengguna terdaftar di platform ScribeTex.
        </p>
      </div>
      <button
        @click="refreshUsers"
        :disabled="pending"
        class="flex items-center gap-2 px-4 py-2.5 bg-(--color-surface) hover:bg-(--color-surface-alt) border border-border rounded-xl text-sm font-semibold text-(--color-text-primary) transition-all cursor-pointer shadow-xs disabled:opacity-50"
      >
        <IconRefresh :class="['size-4', pending && 'animate-spin']" />
        <span>Muat Ulang Data</span>
      </button>
    </div>

    <!-- Summary Metric Cards Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-(--color-surface) rounded-2xl border border-border p-5 shadow-xs">
        <div class="flex items-start justify-between mb-3">
          <div class="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
            <IconUsers class="size-5" />
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200 font-mono">
            {{ totalAdmins }} Admin
          </span>
        </div>
        <div class="text-2xl font-bold text-(--color-text-primary) font-mono">{{ totalStudents }}</div>
        <div class="text-xs font-semibold text-(--color-text-primary) mt-0.5">Mahasiswa Terdaftar</div>
      </div>

      <div class="bg-(--color-surface) rounded-2xl border border-border p-5 shadow-xs">
        <div class="flex items-start justify-between mb-3">
          <div class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
            <IconTrendingUp class="size-5" />
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 font-mono">
            Rata-rata
          </span>
        </div>
        <div class="text-2xl font-bold text-emerald-600 font-mono">{{ avgProgress }}%</div>
        <div class="text-xs font-semibold text-(--color-text-primary) mt-0.5">Penyelesaian Materi</div>
      </div>

      <div class="bg-(--color-surface) rounded-2xl border border-border p-5 shadow-xs">
        <div class="flex items-start justify-between mb-3">
          <div class="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
            <IconChartBar class="size-5" />
          </div>
        </div>
        <div class="text-2xl font-bold text-(--color-text-primary) font-mono">{{ totalCompilations }}</div>
        <div class="text-xs font-semibold text-(--color-text-primary) mt-0.5">Total Kompilasi PDF</div>
      </div>

      <div class="bg-(--color-surface) rounded-2xl border border-border p-5 shadow-xs">
        <div class="flex items-start justify-between mb-3">
          <div class="p-2.5 rounded-xl bg-purple-500/10 text-purple-600">
            <IconBrain class="size-5" />
          </div>
        </div>
        <div class="text-2xl font-bold text-(--color-text-primary) font-mono">{{ totalAiChats }}</div>
        <div class="text-xs font-semibold text-(--color-text-primary) mt-0.5">Total Konsultasi AI</div>
      </div>
    </div>

    <!-- Filters & Search Bar -->
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <!-- Search Input -->
      <div class="relative flex-1 max-w-md w-full">
        <IconSearch class="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-(--color-text-muted)" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama atau email pengguna..."
          class="w-full pl-10 pr-4 py-2.5 bg-(--color-surface) border border-border rounded-xl text-sm text-(--color-text-primary) placeholder:text-(--color-text-muted) outline-none focus:border-primary transition-all font-sans"
        />
      </div>

      <!-- Filter Dropdowns -->
      <div class="flex items-center gap-2 flex-wrap">
        <select
          v-model="roleFilter"
          class="px-3 py-2 bg-(--color-surface) border border-border rounded-xl text-xs font-semibold text-(--color-text-primary) outline-none focus:border-primary transition-all"
        >
          <option value="ALL">Semua Peran (Role)</option>
          <option value="STUDENT">Mahasiswa (STUDENT)</option>
          <option value="ADMIN">Administrator (ADMIN)</option>
        </select>

        <select
          v-model="progressFilter"
          class="px-3 py-2 bg-(--color-surface) border border-border rounded-xl text-xs font-semibold text-(--color-text-primary) outline-none focus:border-primary transition-all"
        >
          <option value="ALL">Semua Status Progres</option>
          <option value="ACTIVE">Sudah Mulai Belajar (>0%)</option>
          <option value="INACTIVE">Belum Memulai (0%)</option>
        </select>
      </div>
    </div>

    <!-- Registered Users & Student Progress Table -->
    <div class="bg-(--color-surface) rounded-2xl border border-border shadow-xs overflow-hidden">
      <div v-if="pending" class="p-6 space-y-3">
        <div v-for="i in 5" :key="i" class="h-16 bg-(--color-surface-alt) animate-pulse rounded-xl"></div>
      </div>

      <table v-else class="w-full text-sm">
        <thead class="bg-(--color-surface-alt)/70 border-b border-border">
          <tr>
            <th class="px-5 py-3.5 text-left text-xs font-bold text-(--color-text-muted) uppercase tracking-wider">Pengguna</th>
            <th class="px-5 py-3.5 text-center text-xs font-bold text-(--color-text-muted) uppercase tracking-wider">Peran</th>
            <th class="px-5 py-3.5 text-left text-xs font-bold text-(--color-text-muted) uppercase tracking-wider">Progres Belajar</th>
            <th class="px-5 py-3.5 text-center text-xs font-bold text-(--color-text-muted) uppercase tracking-wider">Aktivitas</th>
            <th class="px-5 py-3.5 text-right text-xs font-bold text-(--color-text-muted) uppercase tracking-wider">Terdaftar</th>
            <th class="px-5 py-3.5 text-right text-xs font-bold text-(--color-text-muted) uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-if="filteredUsers.length === 0">
            <td colspan="6" class="py-16 text-center text-(--color-text-muted) text-sm">
              Tidak ada data pengguna yang sesuai dengan filter pencarian.
            </td>
          </tr>

          <tr
            v-for="u in filteredUsers"
            :key="u.id"
            class="hover:bg-(--color-surface-alt)/50 transition-colors group"
          >
            <!-- Name & Email -->
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'size-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 text-white shadow-xs',
                    u.role === 'ADMIN' ? 'bg-(--color-ai-primary)' : 'bg-primary',
                  ]"
                >
                  {{ u.name.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="font-semibold text-(--color-text-primary) text-sm leading-tight">{{ u.name }}</div>
                  <div class="text-xs text-(--color-text-muted) font-mono mt-0.5">{{ u.email }}</div>
                </div>
              </div>
            </td>

            <!-- Role Badge -->
            <td class="px-5 py-4 text-center">
              <span
                :class="[
                  u.role === 'ADMIN' ? 'badge-ai' : 'badge-neutral',
                ]"
              >
                <IconShield v-if="u.role === 'ADMIN'" class="size-3" />
                <IconUserCheck v-else class="size-3" />
                {{ u.role }}
              </span>
            </td>

            <!-- Learning Progress Bar -->
            <td class="px-5 py-4 min-w-48">
              <div class="space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-(--color-text-primary)">
                    {{ u.progress.completed_lessons }} / {{ u.progress.total_lessons }} Lesson
                  </span>
                  <span class="font-bold font-mono text-primary">{{ u.progress.percentage }}%</span>
                </div>
                <div class="w-full h-2 bg-(--color-surface-alt) rounded-full overflow-hidden border border-border/50">
                  <div
                    class="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-500"
                    :style="{ width: `${u.progress.percentage}%` }"
                  ></div>
                </div>
              </div>
            </td>

            <!-- Activity Badges -->
            <td class="px-5 py-4 text-center">
              <div class="flex items-center justify-center gap-2">
                <span
                  class="px-2 py-0.5 rounded-lg bg-(--color-surface-alt) border border-border text-[11px] font-mono font-medium text-(--color-text-secondary)"
                  title="Total kompilasi PDF"
                >
                  ⚡ {{ u.activity.total_compilations }} PDF
                </span>
                <span
                  class="px-2 py-0.5 rounded-lg bg-purple-500/10 text-purple-600 border border-purple-200 text-[11px] font-mono font-medium"
                  title="Total konsultasi AI"
                >
                  🤖 {{ u.activity.total_ai_chats }} AI
                </span>
              </div>
            </td>

            <!-- Created At -->
            <td class="px-5 py-4 text-right text-xs text-(--color-text-muted) font-mono">
              {{ formatDate(u.created_at) }}
            </td>

            <!-- Actions -->
            <td class="px-5 py-4 text-right">
              <button
                @click="openDetail(u)"
                class="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ml-auto"
              >
                <IconEye class="size-3.5" />
                <span>Detail</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ─── Student Progress Detail Modal ────────────────────────────────────── -->
    <Transition name="fade">
      <div
        v-if="showDetailModal && selectedUser"
        class="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
        @click.self="showDetailModal = false"
      >
        <div class="bg-(--color-surface) rounded-2xl border border-border shadow-2xl w-full max-w-md p-6 space-y-5">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-border pb-4">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm">
                {{ selectedUser.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <h3 class="font-bold text-(--color-text-primary) text-base font-display leading-tight">
                  {{ selectedUser.name }}
                </h3>
                <p class="text-xs text-(--color-text-muted) font-mono">{{ selectedUser.email }}</p>
              </div>
            </div>
            <button @click="showDetailModal = false" class="p-1.5 rounded-lg hover:bg-(--color-surface-alt) text-(--color-text-muted) cursor-pointer">
              <IconX class="size-4.5" />
            </button>
          </div>

          <!-- Progress Detail Breakdown -->
          <div class="space-y-4">
            <div class="p-4 bg-(--color-surface-alt) border border-border rounded-xl space-y-3">
              <div class="flex items-center justify-between text-xs font-bold">
                <span class="text-(--color-text-primary)">Capaian Pembelajaran</span>
                <span class="text-primary font-mono text-sm">{{ selectedUser.progress.percentage }}% Selesai</span>
              </div>

              <div class="w-full h-2.5 bg-(--color-surface) rounded-full overflow-hidden border border-border">
                <div
                  class="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full"
                  :style="{ width: `${selectedUser.progress.percentage}%` }"
                ></div>
              </div>

              <div class="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                <div class="p-2 bg-(--color-surface) rounded-lg border border-border">
                  <div class="font-bold text-emerald-600 font-mono">{{ selectedUser.progress.completed_lessons }} / {{ selectedUser.progress.total_lessons }}</div>
                  <div class="text-[10px] text-(--color-text-muted)">Materi Diselesaikan</div>
                </div>
                <div class="p-2 bg-(--color-surface) rounded-lg border border-border">
                  <div class="font-bold text-purple-600 font-mono">{{ selectedUser.activity.total_ai_chats }}</div>
                  <div class="text-[10px] text-(--color-text-muted)">Konsultasi AI</div>
                </div>
              </div>
            </div>

            <!-- Activity Info -->
            <div class="space-y-2 text-xs text-(--color-text-secondary)">
              <div class="flex items-center justify-between py-1 border-b border-border">
                <span class="flex items-center gap-1.5"><IconShield class="size-3.5 text-purple-500" /> Peran Sistem:</span>
                <span class="font-bold text-(--color-text-primary)">{{ selectedUser.role }}</span>
              </div>
              <div class="flex items-center justify-between py-1 border-b border-border">
                <span class="flex items-center gap-1.5"><IconChartBar class="size-3.5 text-amber-500" /> Eksekusi PDF Docker:</span>
                <span class="font-bold text-(--color-text-primary)">{{ selectedUser.activity.total_compilations }} Kali</span>
              </div>
              <div class="flex items-center justify-between py-1">
                <span class="flex items-center gap-1.5"><IconCalendar class="size-3.5 text-blue-500" /> Tanggal Bergabung:</span>
                <span class="font-mono text-(--color-text-primary)">{{ formatDate(selectedUser.created_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <button
            @click="showDetailModal = false"
            class="w-full py-2.5 bg-(--color-surface-alt) hover:bg-(--color-border) border border-border text-xs font-bold text-(--color-text-primary) rounded-xl transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
