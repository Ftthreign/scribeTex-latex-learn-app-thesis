<script setup lang="ts">
import UiModal from '~/components/ui/Modal.vue'

defineProps<{
  showResetModal: boolean;
  showDeleteModal: boolean;
  showErrorModal: boolean;
  fileToDelete: string | null;
  errorMessage: string;
}>()

const emit = defineEmits<{
  (e: 'closeReset'): void;
  (e: 'confirmReset'): void;
  (e: 'closeDelete'): void;
  (e: 'confirmDelete'): void;
  (e: 'closeError'): void;
}>()
</script>

<template>
  <div class="font-body">
    <!-- Modal Konfirmasi Reset Workspace -->
    <UiModal
      :isOpen="showResetModal"
      title="Konfirmasi Reset Workspace"
      size="md"
      @close="emit('closeReset')"
    >
      <div class="space-y-3 font-sans text-sm text-(--color-text-secondary)">
        <p>
          Apakah Anda yakin ingin mengembalikan workspace ke draf awal? Semua berkas dan perubahan kode LaTeX yang telah Anda sunting akan hilang.
        </p>
      </div>
      <template #footer>
        <button @click="emit('closeReset')" class="btn-secondary btn-sm font-semibold cursor-pointer">
          Batal
        </button>
        <button @click="emit('confirmReset')" class="btn-primary btn-sm font-bold cursor-pointer shadow-xs">
          Ya, Reset Workspace
        </button>
      </template>
    </UiModal>

    <!-- Modal Konfirmasi Hapus Berkas -->
    <UiModal
      :isOpen="showDeleteModal"
      title="Konfirmasi Hapus Berkas"
      size="md"
      @close="emit('closeDelete')"
    >
      <div class="space-y-3 font-sans text-sm text-(--color-text-secondary)">
        <p>
          Apakah Anda yakin ingin menghapus berkas <strong class="text-(--color-text-primary) font-mono">{{ fileToDelete }}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
      </div>
      <template #footer>
        <button @click="emit('closeDelete')" class="btn-secondary btn-sm font-semibold cursor-pointer">
          Batal
        </button>
        <button @click="emit('confirmDelete')" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs font-sans">
          Ya, Hapus Berkas
        </button>
      </template>
    </UiModal>

    <!-- Modal Notification Error Operasi Berkas -->
    <UiModal
      :isOpen="showErrorModal"
      title="Pemberitahuan Operasi Berkas"
      size="md"
      @close="emit('closeError')"
    >
      <div class="space-y-3 font-sans text-sm text-(--color-text-secondary)">
        <p class="text-red-500 font-semibold">{{ errorMessage }}</p>
      </div>
      <template #footer>
        <button @click="emit('closeError')" class="btn-primary btn-sm font-bold cursor-pointer font-sans">
          Tutup
        </button>
      </template>
    </UiModal>
  </div>
</template>
