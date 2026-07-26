<script setup lang="ts">
import {
  IconFile,
  IconFileText,
  IconBook,
  IconSettings,
  IconPlus,
  IconTrash,
  IconPencil,
  IconCheck,
  IconX,
  IconChevronRight,
} from "@tabler/icons-vue";
import type { ProjectFile } from "~/composables/useProjectFiles";

const props = defineProps<{
  files: ProjectFile[];
  activeFileName: string;
  entryFile: string;
}>();

const emit = defineEmits<{
  (e: "switch", name: string): void;
  (e: "add", name: string): void;
  (e: "delete", name: string): void;
  (e: "rename", oldName: string, newName: string): void;
}>();

const showAddInput = ref(false);
const newFileName = ref("");
const addError = ref<string | null>(null);
const renamingFile = ref<string | null>(null);
const renameValue = ref("");
const renameError = ref<string | null>(null);
const addInputRef = ref<HTMLInputElement | null>(null);

function getFileIcon(name: string) {
  if (name.endsWith(".bib")) return IconBook;
  if (name.endsWith(".sty") || name.endsWith(".cls") || name.endsWith(".bst"))
    return IconSettings;
  if (name.endsWith(".tex")) return IconFileText;
  return IconFile;
}

function getFileIconColor(name: string) {
  if (name.endsWith(".bib")) return "text-amber-500";
  if (name.endsWith(".sty") || name.endsWith(".cls")) return "text-purple-400";
  if (name === props.entryFile) return "text-green-400";
  return "text-blue-400";
}

function openAddInput() {
  showAddInput.value = true;
  newFileName.value = "";
  addError.value = null;
  nextTick(() => addInputRef.value?.focus());
}

function confirmAdd() {
  const name = newFileName.value.trim();
  if (!name) {
    addError.value = "Nama berkas tidak boleh kosong.";
    return;
  }
  emit("add", name);
  showAddInput.value = false;
  newFileName.value = "";
  addError.value = null;
}

function cancelAdd() {
  showAddInput.value = false;
  newFileName.value = "";
  addError.value = null;
}

function startRename(name: string) {
  if (name === props.entryFile) return;
  renamingFile.value = name;
  renameValue.value = name;
  renameError.value = null;
  nextTick(() => {
    const input = document.querySelector<HTMLInputElement>(
      `[data-rename="${name}"]`,
    );
    input?.focus();
    input?.select();
  });
}

function confirmRename(oldName: string) {
  const newName = renameValue.value.trim();
  if (!newName || newName === oldName) {
    renamingFile.value = null;
    return;
  }
  emit("rename", oldName, newName);
  renamingFile.value = null;
}

function cancelRename() {
  renamingFile.value = null;
  renameError.value = null;
}
</script>

<template>
  <div
    class="w-48 shrink-0 flex flex-col bg-surface-alt border-r border-border h-full min-h-0 select-none"
  >
    <!-- Panel Header -->
    <div
      class="flex items-center justify-between px-3 py-2.5 border-b border-border shrink-0"
    >
      <div class="flex items-center gap-1.5">
        <IconChevronRight class="size-3 text-(--color-text-muted)" />
        <span
          class="text-[11px] font-bold uppercase tracking-widest text-(--color-text-muted)"
          >Berkas</span
        >
      </div>
      <button
        @click="openAddInput"
        class="p-0.5 rounded hover:bg-primary/10 hover:text-primary text-(--color-text-muted) transition-colors cursor-pointer"
        title="Tambah Berkas Baru"
      >
        <IconPlus class="size-3.5" />
      </button>
    </div>

    <!-- File List -->
    <div class="flex-1 overflow-y-auto py-1">
      <!-- Add File Input Row -->
      <div v-if="showAddInput" class="px-2 py-1">
        <div
          class="flex items-center gap-1 bg-(--color-surface) rounded border border-primary/40 px-1.5 py-1"
        >
          <IconFileText class="size-3 text-primary shrink-0" />
          <input
            ref="addInputRef"
            v-model="newFileName"
            type="text"
            placeholder="nama.tex"
            class="flex-1 bg-transparent text-xs text-(--color-text-primary) outline-none w-0"
            @keydown.enter="confirmAdd"
            @keydown.escape="cancelAdd"
          />
          <button
            @click="confirmAdd"
            class="text-green-500 hover:text-green-400 cursor-pointer"
          >
            <IconCheck class="size-3" />
          </button>
          <button
            @click="cancelAdd"
            class="text-red-400 hover:text-red-300 cursor-pointer"
          >
            <IconX class="size-3" />
          </button>
        </div>
        <p v-if="addError" class="text-[10px] text-red-400 mt-0.5 px-1">
          {{ addError }}
        </p>
      </div>

      <!-- File Items -->
      <div
        v-for="file in files"
        :key="file.name"
        :class="[
          'group flex items-center gap-1.5 px-2.5 py-1.5 cursor-pointer transition-colors',
          activeFileName === file.name
            ? 'bg-primary/10 text-primary border-r-2 border-primary'
            : 'text-text-secondary hover:bg-(--color-surface) hover:text-(--color-text-primary)',
        ]"
        @click="emit('switch', file.name)"
      >
        <component
          :is="getFileIcon(file.name)"
          :class="['size-3.5 shrink-0', getFileIconColor(file.name)]"
        />

        <input
          v-if="renamingFile === file.name"
          :data-rename="file.name"
          v-model="renameValue"
          type="text"
          class="flex-1 bg-(--color-surface) rounded px-1 text-xs text-(--color-text-primary) outline-none border border-primary/40 min-w-0"
          @keydown.enter="confirmRename(file.name)"
          @keydown.escape="cancelRename"
          @click.stop
        />

        <span v-else class="flex-1 text-xs truncate font-mono">{{
          file.name
        }}</span>

        <span
          v-if="file.name === entryFile"
          class="text-[9px] px-1 py-0.5 rounded bg-green-500/15 text-green-500 font-bold uppercase shrink-0"
        >
          MAIN
        </span>

        <div
          v-if="file.name !== entryFile && renamingFile !== file.name"
          class="hidden group-hover:flex items-center gap-0.5 shrink-0"
        >
          <button
            @click.stop="startRename(file.name)"
            class="p-0.5 rounded hover:bg-primary/10 hover:text-primary text-(--color-text-muted) cursor-pointer"
            title="Rename"
          >
            <IconPencil class="size-3" />
          </button>
          <button
            @click.stop="emit('delete', file.name)"
            class="p-0.5 rounded hover:bg-red-500/10 hover:text-red-400 text-(--color-text-muted) cursor-pointer"
            title="Hapus"
          >
            <IconTrash class="size-3" />
          </button>
        </div>
      </div>
    </div>

    <div class="px-3 py-2 border-t border-border shrink-0">
      <p class="text-[10px] text-(--color-text-muted) leading-relaxed">
        Gunakan <code class="font-mono">\input{"{nama}"}</code> di
        <code class="font-mono">main.tex</code> untuk memuat berkas lain.
      </p>
    </div>
  </div>
</template>
