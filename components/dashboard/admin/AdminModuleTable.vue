<script setup lang="ts">
import { 
  IconSearch, 
  IconEdit, 
  IconTrash, 
  IconChevronLeft, 
  IconChevronRight,
  IconBook,
  IconListNumbers,
  IconMathFunction
} from '@tabler/icons-vue'

interface MockModule {
  id: number
  title: string
  lastModified: string
  lessons: number
  status: 'AKTIF' | 'DRAFT'
  icon: string
  color: string
}

defineProps<{
  modules: MockModule[]
  searchQuery: string
  currentPage: number
  totalPages: number
  startItemIndex: number
  endItemIndex: number
  totalCount: number
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'change-page', page: number): void
  (e: 'edit', id: number): void
  (e: 'delete', id: number): void
  (e: 'toggle-status', id: number): void
}>()

const getModuleIcon = (iconName: string) => {
  switch (iconName) {
    case 'menu_book':
      return IconBook
    case 'format_list_numbered':
      return IconListNumbers
    case 'functions':
      return IconMathFunction
    default:
      return IconBook
  }
}

const getModuleIconColorClass = (color: string) => {
  switch (color) {
    case 'primary':
      return 'text-[var(--color-primary)] bg-[var(--color-primary-light)] border-[var(--color-primary)]/10'
    case 'secondary':
      return 'text-[var(--color-secondary,purple)] bg-[var(--color-secondary-light,lavender)] border-[var(--color-secondary,purple)]/10'
    case 'tertiary':
      return 'text-amber-600 bg-amber-50 border-amber-200'
    default:
      return 'text-blue-600 bg-blue-50 border-blue-200'
  }
}
</script>

<template>
  <div class="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden shadow-sm">
    <!-- Search and Header -->
    <div class="p-6 border-b border-[var(--color-border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <h3 class="text-[16px] font-bold text-[var(--color-text-primary)] uppercase tracking-wider font-display">
        Manajemen Modul
      </h3>
      <div class="relative w-full md:w-64">
        <IconSearch class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] size-[18px]" />
        <input
          :value="searchQuery"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          class="w-full pl-9 pr-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all placeholder:text-[var(--color-text-muted)] text-[13.5px] font-body"
          placeholder="Cari modul..."
          type="text"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse font-body">
        <thead>
          <tr class="bg-[var(--color-surface-alt)]/50 border-b border-[var(--color-border)]">
            <th class="px-6 py-3.5 text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider w-[60px]">#</th>
            <th class="px-6 py-3.5 text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Judul Modul</th>
            <th class="px-6 py-3.5 text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider w-[120px]">Lessons</th>
            <th class="px-6 py-3.5 text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider w-[120px]">Status</th>
            <th class="px-6 py-3.5 text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider text-right w-[120px]">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--color-border)] text-[13.5px]">
          <tr v-if="modules.length === 0">
            <td colspan="5" class="px-6 py-10 text-center text-[var(--color-text-secondary)] font-medium">
              Tidak ada modul yang ditemukan.
            </td>
          </tr>
          <tr
            v-for="(mod, index) in modules"
            :key="mod.id"
            class="hover:bg-[var(--color-surface-alt)]/30 transition-colors"
          >
            <td class="px-6 py-4 text-[var(--color-text-secondary)] font-medium">
              {{ startItemIndex + index }}
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div :class="['w-8 h-8 rounded-[var(--radius-md)] border flex items-center justify-center shrink-0', getModuleIconColorClass(mod.color)]">
                  <component :is="getModuleIcon(mod.icon)" class="size-4.5" />
                </div>
                <div>
                  <div class="font-bold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer">
                    {{ mod.title }}
                  </div>
                  <div class="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wide mt-0.5">
                    Terakhir diubah: {{ mod.lastModified }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[11px] font-bold bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]">
                {{ mod.lessons }} lessons
              </span>
            </td>
            <td class="px-6 py-4">
              <button
                @click="emit('toggle-status', mod.id)"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] text-[11px] font-bold border transition-colors cursor-pointer"
                :class="mod.status === 'AKTIF'
                  ? 'border-emerald-200/60 text-emerald-600 bg-emerald-50/40 hover:bg-emerald-50'
                  : 'border-[var(--color-border)] text-[var(--color-text-muted)] bg-white hover:bg-[var(--color-surface-alt)]'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="mod.status === 'AKTIF' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'" />
                {{ mod.status }}
              </button>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-1.5">
                <button
                  @click="emit('edit', mod.id)"
                  class="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] border border-transparent hover:border-[var(--color-border)] rounded-[var(--radius-sm)] transition-colors cursor-pointer"
                  title="Ubah Modul"
                >
                  <IconEdit class="size-4.5" />
                </button>
                <button
                  @click="emit('delete', mod.id)"
                  class="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] border border-transparent hover:border-[var(--color-border)] rounded-[var(--radius-sm)] transition-colors cursor-pointer"
                  title="Hapus Modul"
                >
                  <IconTrash class="size-4.5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="p-6 border-t border-[var(--color-border)] flex items-center justify-between font-body"
    >
      <div class="text-[12.5px] text-[var(--color-text-muted)]">
        Showing <span class="font-bold text-[var(--color-text-primary)]">{{ startItemIndex }}-{{ endItemIndex }}</span> of <span class="font-bold text-[var(--color-text-primary)]">{{ totalCount }}</span> modules
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="emit('change-page', currentPage - 1)"
          :disabled="currentPage === 1"
          class="p-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <IconChevronLeft class="size-4" />
        </button>
        <div class="flex items-center gap-1">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="emit('change-page', page)"
            class="w-7.5 h-7.5 rounded-[var(--radius-sm)] text-[12.5px] font-bold transition-all cursor-pointer"
            :class="page === currentPage
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)]'"
          >
            {{ page }}
          </button>
        </div>
        <button
          @click="emit('change-page', currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="p-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <IconChevronRight class="size-4" />
        </button>
      </div>
    </div>
  </div>
</template>
