<script setup lang="ts">
import { ref, watch } from "vue";
import { IconLoader2 } from "@tabler/icons-vue";
import LessonContentEditor from "./LessonContentEditor.vue";
import ExerciseCodeEditor from "./ExerciseCodeEditor.vue";

const props = defineProps<{
  showModal: boolean;
  modalType: "module" | "lesson" | "exercise" | "article" | null;
  editingItem: any;
  modulesList: any[];
  lessonsList: any[];
  showDeleteModal: boolean;
  deleteItemTarget: any;
  isSubmitting?: boolean;
}>();

const emit = defineEmits<{
  (e: "closeModal"): void;
  (e: "closeDeleteModal"): void;
  (e: "saveItem", payload: { type: string; data: any; id?: string }): void;
  (e: "confirmDelete", payload: { type: string; id: string }): void;
}>();

const formData = ref<any>({});
const initialFormDataStr = ref<string>("");
const showCancelGuardModal = ref(false);

watch(
  () => [props.showModal, props.editingItem, props.modalType],
  () => {
    let initialObj: any = {};
    if (props.editingItem) {
      initialObj = {
        ...props.editingItem,
        instruction:
          props.editingItem.instruction || props.editingItem.instructions || "",
        instructions:
          props.editingItem.instruction || props.editingItem.instructions || "",
        title:
          props.editingItem.title ||
          props.editingItem.instruction_preview ||
          props.editingItem.instruction ||
          "",
      };
    } else {
      initialObj = {
        title: "",
        description: "",
        summary: "",
        sort_order: 1,
        module_id: props.modulesList[0]?.id || "",
        lesson_id: props.lessonsList[0]?.id || "",
        instruction: "",
        instructions: "",
        difficulty: "SEDANG",
        starter_code:
          "\\documentclass{article}\n\\begin{document}\n\n\\end{document}",
        solution_code: "",
        category: "PANDUAN",
        excerpt: "",
        content: "",
        read_time: "5 min",
      };
    }
    formData.value = { ...initialObj };
    initialFormDataStr.value = JSON.stringify(initialObj);
  },
  { immediate: true },
);

function isFormDirty() {
  return JSON.stringify(formData.value) !== initialFormDataStr.value;
}

function handleRequestClose() {
  if (isFormDirty()) {
    showCancelGuardModal.value = true;
  } else {
    emit("closeModal");
  }
}

function confirmCloseForm() {
  showCancelGuardModal.value = false;
  emit("closeModal");
}

function handleSave() {
  if (!props.modalType) return;
  if (props.modalType === "exercise") {
    formData.value.instruction =
      formData.value.instruction ||
      formData.value.instructions ||
      formData.value.title;
    formData.value.instructions = formData.value.instruction;
  }
  emit("saveItem", {
    type: props.modalType,
    data: formData.value,
    id: props.editingItem?.id,
  });
}

function handleConfirmDelete() {
  if (!props.deleteItemTarget) return;
  emit("confirmDelete", {
    type: props.deleteItemTarget.type,
    id: props.deleteItemTarget.item.id,
  });
}
</script>

<template>
  <div>
    <!-- CRUD Form Modal (Spacious 4XL Container size) -->
    <UiModal
      :isOpen="showModal"
      :title="
        editingItem
          ? `Edit Data ${modalType?.toUpperCase()}`
          : `Tambah ${modalType?.toUpperCase()} Baru`
      "
      :size="
        modalType === 'exercise' ||
        modalType === 'lesson' ||
        modalType === 'article'
          ? '4xl'
          : '2xl'
      "
      @close="handleRequestClose"
    >
      <form
        @submit.prevent="handleSave"
        class="space-y-4 font-body max-h-[75vh] overflow-y-auto pr-1"
      >
        <!-- Title Field -->
        <div class="space-y-1 font-sans">
          <label class="text-xs font-bold text-(--color-text-primary)"
            >Judul Konten</label
          >
          <input
            v-model="formData.title"
            type="text"
            required
            placeholder="Masukkan judul..."
            class="w-full px-3.5 py-2 bg-surface border border-border rounded-xl text-xs font-semibold text-(--color-text-primary) outline-none focus:border-primary transition-all"
          />
        </div>

        <!-- MODUL SPECIFIC FIELDS -->
        <template v-if="modalType === 'module'">
          <div class="space-y-1 font-sans">
            <label class="text-xs font-bold text-(--color-text-primary)"
              >Deskripsi Modul</label
            >
            <textarea
              v-model="formData.description"
              rows="3"
              placeholder="Tuliskan deskripsi modul..."
              class="w-full px-3.5 py-2 bg-surface border border-border rounded-xl text-xs font-medium text-(--color-text-primary) outline-none focus:border-primary transition-all"
            />
          </div>
        </template>

        <!-- LESSON SPECIFIC FIELDS -->
        <template v-if="modalType === 'lesson'">
          <div class="space-y-1 font-sans">
            <label class="text-xs font-bold text-(--color-text-primary)"
              >Modul Kurikulum Terkait</label
            >
            <select
              v-model="formData.module_id"
              required
              class="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs font-semibold text-(--color-text-primary) outline-none focus:border-primary transition-all cursor-pointer"
            >
              <option v-for="m in modulesList" :key="m.id" :value="m.id">
                {{ m.title }}
              </option>
            </select>
          </div>

          <div class="space-y-1 font-sans">
            <label class="text-xs font-bold text-(--color-text-primary)"
              >Ringkasan Singkat</label
            >
            <input
              v-model="formData.summary"
              type="text"
              placeholder="Ringkasan singkat materi..."
              class="w-full px-3.5 py-2 bg-surface border border-border rounded-xl text-xs font-semibold text-(--color-text-primary) outline-none focus:border-primary transition-all"
            />
          </div>

          <LessonContentEditor v-model="formData.content" />
        </template>

        <!-- EXERCISE SPECIFIC FIELDS -->
        <template v-if="modalType === 'exercise'">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
            <div class="space-y-1">
              <label class="text-xs font-bold text-(--color-text-primary)"
                >Materi Lesson Terkait</label
              >
              <select
                v-model="formData.lesson_id"
                required
                class="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs font-semibold text-(--color-text-primary) outline-none focus:border-primary transition-all cursor-pointer"
              >
                <option v-for="l in lessonsList" :key="l.id" :value="l.id">
                  {{ l.title }}
                </option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-(--color-text-primary)"
                >Tingkat Kesulitan</label
              >
              <select
                v-model="formData.difficulty"
                class="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs font-semibold text-(--color-text-primary) outline-none focus:border-primary transition-all cursor-pointer"
              >
                <option value="MUDAH">MUDAH</option>
                <option value="SEDANG">SEDANG</option>
                <option value="SULIT">SULIT</option>
              </select>
            </div>
          </div>

          <div class="space-y-1 font-sans">
            <label class="text-xs font-bold text-(--color-text-primary)"
              >Petunjuk Pengerjaan (Instructions)</label
            >
            <textarea
              v-model="formData.instruction"
              rows="3"
              placeholder="Tuliskan petunjuk latihan..."
              class="w-full px-3.5 py-2 bg-surface border border-border rounded-xl text-xs font-medium text-(--color-text-primary) outline-none focus:border-primary transition-all"
            />
          </div>

          <ExerciseCodeEditor
            v-model:starterCode="formData.starter_code"
            v-model:solutionCode="formData.solution_code"
          />
        </template>

        <!-- ARTICLE SPECIFIC FIELDS -->
        <template v-if="modalType === 'article'">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
            <div class="space-y-1">
              <label class="text-xs font-bold text-(--color-text-primary)"
                >Kategori Artikel</label
              >
              <select
                v-model="formData.category"
                class="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs font-semibold text-(--color-text-primary) outline-none focus:border-primary transition-all cursor-pointer"
              >
                <option value="PANDUAN">PANDUAN</option>
                <option value="REGULASI">REGULASI</option>
                <option value="TIPS">TIPS</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-(--color-text-primary)"
                >Estimasi Waktu Baca</label
              >
              <input
                v-model="formData.read_time"
                type="text"
                placeholder="Contoh: 5 min"
                class="w-full px-3.5 py-2 bg-surface border border-border rounded-xl text-xs font-semibold text-(--color-text-primary) outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          <div class="space-y-1 font-sans">
            <label class="text-xs font-bold text-(--color-text-primary)"
              >Ringkasan Artikel (Excerpt)</label
            >
            <textarea
              v-model="formData.excerpt"
              rows="2"
              placeholder="Ringkasan singkat artikel..."
              class="w-full px-3.5 py-2 bg-surface border border-border rounded-xl text-xs font-medium text-(--color-text-primary) outline-none focus:border-primary transition-all"
            />
          </div>

          <LessonContentEditor v-model="formData.content" />
        </template>

        <!-- Sort Order Field -->
        <div v-if="modalType !== 'article'" class="space-y-1 font-sans">
          <label class="text-xs font-bold text-(--color-text-primary)"
            >Urutan Tampilan (Sort Order)</label
          >
          <input
            v-model.number="formData.sort_order"
            type="number"
            min="1"
            required
            class="w-28 px-3.5 py-2 bg-surface border border-border rounded-xl text-xs font-semibold text-(--color-text-primary) outline-none focus:border-primary transition-all"
          />
        </div>
      </form>

      <template #footer>
        <button
          @click="handleRequestClose"
          :disabled="isSubmitting"
          class="btn-secondary btn-md cursor-pointer font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Batal
        </button>
        <button
          @click="handleSave"
          :disabled="isSubmitting"
          class="btn-primary btn-md cursor-pointer font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconLoader2 v-if="isSubmitting" class="size-4 animate-spin" />
          <span>{{ isSubmitting ? "Menyimpan..." : "Simpan Perubahan" }}</span>
        </button>
      </template>
    </UiModal>

    <!-- Delete Confirmation Modal -->
    <UiModal
      :isOpen="showDeleteModal"
      title="Konfirmasi Penghapusan Konten"
      size="md"
      @close="emit('closeDeleteModal')"
    >
      <div class="space-y-3 font-body">
        <p class="text-xs text-text-secondary leading-relaxed">
          Apakah Anda yakin ingin menghapus data konten
          <strong class="text-(--color-text-primary)">{{
            deleteItemTarget?.item?.title ||
            deleteItemTarget?.item?.instruction_preview ||
            deleteItemTarget?.item?.instruction
          }}</strong
          >? Tindakan ini tidak dapat dibatalkan.
        </p>
      </div>

      <template #footer>
        <button
          @click="emit('closeDeleteModal')"
          :disabled="isSubmitting"
          class="btn-secondary btn-md cursor-pointer font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Batal
        </button>
        <button
          @click="handleConfirmDelete"
          :disabled="isSubmitting"
          class="btn-danger btn-md cursor-pointer font-bold font-sans flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconLoader2 v-if="isSubmitting" class="size-4 animate-spin" />
          <span>{{ isSubmitting ? "Menghapus..." : "Hapus Permanen" }}</span>
        </button>
      </template>
    </UiModal>

    <UiModal
      :isOpen="showCancelGuardModal"
      title="Konfirmasi Pembatalan Pengeditan"
      size="md"
      @close="showCancelGuardModal = false"
    >
      <div class="space-y-3 font-sans text-sm text-text-secondary">
        <p>
          Anda memiliki perubahan formulir yang belum disimpan. Apakah Anda
          yakin ingin membatalkan dan mengabaikan seluruh perubahan?
        </p>
      </div>
      <template #footer>
        <button
          @click="showCancelGuardModal = false"
          class="btn-secondary btn-sm font-semibold cursor-pointer"
        >
          Lanjutkan Edit
        </button>
        <button
          @click="confirmCloseForm"
          class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs font-sans"
        >
          Ya, Batalkan & Tutup
        </button>
      </template>
    </UiModal>
  </div>
</template>
