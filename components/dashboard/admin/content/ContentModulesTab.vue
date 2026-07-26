<script setup lang="ts">
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconBooks,
  IconSearch,
} from "@tabler/icons-vue";

const props = defineProps<{
  modules: any[];
}>();

const emit = defineEmits<{
  (e: "openCreateModal"): void;
  (e: "openEditModal", item: any): void;
  (e: "openDeleteModal", item: any): void;
}>();

const searchQuery = ref("");

const filteredModules = computed(() => {
  const q = searchQuery.value.toLowerCase();
  if (!q) return props.modules;
  return props.modules.filter(
    (m: any) =>
      (m.title || "").toLowerCase().includes(q) ||
      (m.description || "").toLowerCase().includes(q),
  );
});
</script>

<template>
  <div class="space-y-4 font-body">
    <div
      class="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between font-sans"
    >
      <div class="relative flex-1 max-w-md w-full">
        <IconSearch
          class="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-(--color-text-muted)"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari judul atau deskripsi modul..."
          class="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-xl text-xs font-semibold text-(--color-text-primary) placeholder:text-(--color-text-muted) outline-none focus:border-primary transition-all shadow-2xs"
        />
      </div>

      <button
        @click="emit('openCreateModal')"
        class="btn-primary btn-md gap-1.5 rounded-xl font-bold shadow-xs cursor-pointer"
      >
        <IconPlus class="size-4" />
        <span>Tambah Modul Baru</span>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-if="filteredModules.length === 0"
        class="col-span-full py-16 text-center text-(--color-text-muted) text-xs bg-surface border border-border rounded-2xl"
      >
        Tidak ada data modul kurikulum yang ditemukan.
      </div>

      <div
        v-for="m in filteredModules"
        :key="m.id"
        class="group relative overflow-hidden bg-surface border border-border rounded-2xl p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
      >
        <div class="space-y-3 font-sans">
          <div class="flex items-start justify-between gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs"
            >
              <IconBooks class="size-5" />
            </div>
            <span
              class="text-[10px] font-bold border px-2 py-0.5 rounded-full uppercase tracking-wider text-primary bg-primary-light border-primary/20"
            >
              Urutan #{{ m.sort_order || 1 }}
            </span>
          </div>

          <div class="space-y-1">
            <h4
              class="font-bold text-(--color-text-primary) text-base font-display leading-tight group-hover:text-primary transition-colors"
            >
              {{ m.title }}
            </h4>
            <p class="text-xs text-text-secondary line-clamp-2 leading-relaxed">
              {{ m.description || "Tidak ada deskripsi modul." }}
            </p>
          </div>
        </div>

        <div
          class="pt-4 mt-4 border-t border-border flex items-center justify-between font-sans"
        >
          <span class="text-[11px] text-(--color-text-muted) font-semibold">
            {{ m.lesson_count ?? m.lessons?.length ?? 0 }} Lesson Materi
          </span>

          <div class="flex items-center gap-1.5">
            <button
              @click="emit('openEditModal', m)"
              class="p-1.5 rounded-lg hover:bg-surface-alt text-primary border border-transparent hover:border-border transition-all cursor-pointer"
              title="Edit Modul"
            >
              <IconEdit class="size-4" />
            </button>
            <button
              @click="emit('openDeleteModal', m)"
              class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 border border-transparent hover:border-red-200 transition-all cursor-pointer"
              title="Hapus Modul"
            >
              <IconTrash class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
