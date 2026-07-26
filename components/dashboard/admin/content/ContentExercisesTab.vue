<script setup lang="ts">
import { IconPlus, IconEdit, IconTrash, IconSearch } from "@tabler/icons-vue";

const props = defineProps<{
  exercises: any[];
}>();

const emit = defineEmits<{
  (e: "openCreateModal"): void;
  (e: "openEditModal", item: any): void;
  (e: "openDeleteModal", item: any): void;
}>();

const searchQuery = ref("");

const filteredExercises = computed(() => {
  const q = searchQuery.value.toLowerCase();
  if (!q) return props.exercises;
  return props.exercises.filter((e: any) =>
    (e.title || e.instruction || "").toLowerCase().includes(q) ||
    (e.lesson_title || e.lessons?.title || "").toLowerCase().includes(q) ||
    (e.module_title || "").toLowerCase().includes(q)
  );
});
</script>

<template>
  <div class="space-y-4 font-body">
    <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between font-sans">
      <div class="relative flex-1 max-w-md w-full">
        <IconSearch class="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-(--color-text-muted)" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari petunjuk latihan atau materi lesson..."
          class="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-xl text-xs font-semibold text-(--color-text-primary) placeholder:text-(--color-text-muted) outline-none focus:border-primary transition-all shadow-2xs"
        />
      </div>

      <button
        @click="emit('openCreateModal')"
        class="btn-primary btn-md gap-1.5 rounded-xl font-bold shadow-xs cursor-pointer"
      >
        <IconPlus class="size-4" />
        <span>Tambah Latihan Praktik Baru</span>
      </button>
    </div>

    <div class="bg-surface rounded-2xl border border-border shadow-xs overflow-hidden">
      <table class="w-full text-sm font-sans">
        <thead class="bg-surface-alt/70 border-b border-border">
          <tr>
            <th class="px-5 py-3.5 text-left text-xs font-bold text-(--color-text-muted) uppercase tracking-wider">Judul & Petunjuk Latihan</th>
            <th class="px-5 py-3.5 text-left text-xs font-bold text-(--color-text-muted) uppercase tracking-wider">Materi Lesson Terkait</th>
            <th class="px-5 py-3.5 text-center text-xs font-bold text-(--color-text-muted) uppercase tracking-wider">Tingkat Kesulitan</th>
            <th class="px-5 py-3.5 text-right text-xs font-bold text-(--color-text-muted) uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-if="filteredExercises.length === 0">
            <td colspan="4" class="py-16 text-center text-(--color-text-muted) text-xs">
              Tidak ada data latihan praktik yang ditemukan.
            </td>
          </tr>

          <tr
            v-for="e in filteredExercises"
            :key="e.id"
            class="hover:bg-surface-alt/50 transition-colors group"
          >
            <td class="px-5 py-4">
              <div class="font-bold text-(--color-text-primary) text-xs leading-tight font-display group-hover:text-primary transition-colors">
                {{ e.title || e.instruction_preview || e.instruction || "Latihan Praktik LaTeX" }}
              </div>
              <div class="text-[11px] text-(--color-text-muted) line-clamp-1 mt-0.5 font-mono">
                {{ e.instruction || e.instructions || e.instruction_preview || "Tanpa petunjuk pengerjaan." }}
              </div>
            </td>

            <td class="px-5 py-4">
              <div class="space-y-0.5">
                <span class="inline-block text-[11px] font-semibold text-text-secondary bg-surface-alt border border-border px-2.5 py-0.5 rounded-full">
                  {{ e.lesson_title || e.lessons?.title || "Lesson Terkait" }}
                </span>
                <div v-if="e.module_title" class="text-[10px] text-(--color-text-muted) font-semibold pl-1">
                  {{ e.module_title }}
                </div>
              </div>
            </td>

            <td class="px-5 py-4 text-center">
              <span class="inline-block text-[10px] font-bold border px-2.5 py-0.5 rounded-full uppercase tracking-wider text-primary bg-primary-light border-primary/20">
                {{ e.difficulty || 'SEDANG' }}
              </span>
            </td>

            <td class="px-5 py-4 text-right">
              <div class="flex items-center justify-end gap-1.5">
                <button
                  @click="emit('openEditModal', e)"
                  class="p-1.5 rounded-lg hover:bg-surface-alt text-primary border border-transparent hover:border-border transition-all cursor-pointer"
                  title="Edit Latihan"
                >
                  <IconEdit class="size-4" />
                </button>
                <button
                  @click="emit('openDeleteModal', e)"
                  class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 border border-transparent hover:border-red-200 transition-all cursor-pointer"
                  title="Hapus Latihan"
                >
                  <IconTrash class="size-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
