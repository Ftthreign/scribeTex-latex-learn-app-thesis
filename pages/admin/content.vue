<script setup lang="ts">
import { ref, computed } from "vue";
import { marked } from "marked";
import {
  IconBooks,
  IconFileText,
  IconCode,
  IconArticle,
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconSearch,
  IconLoader2,
  IconEye,
  IconEyeOff,
  IconFileTypePdf,
  IconAlertTriangle,
  IconDeviceTv,
  IconPencil,
} from "@tabler/icons-vue";
import CompileResultModal from "~/components/learn/CompileResultModal.vue";

definePageMeta({ layout: "admin", middleware: ["role-admin"] });
useHead({ title: "Manajemen Konten | ScribeTex Admin" });

// Configure marked parser for GFM markdown rendering
marked.setOptions({ gfm: true, breaks: true });
function renderMarkdown(content: string): string {
  try {
    return marked.parse(content || "") as string;
  } catch {
    return content || "";
  }
}

// ─── Tab State ────────────────────────────────────────────────────────────
type TabKey = "modules" | "lessons" | "exercises" | "articles";
const activeTab = ref<TabKey>("modules");
const searchQuery = ref("");

const tabs = [
  {
    key: "modules" as TabKey,
    label: "Modul",
    icon: IconBooks,
    color: "text-blue-600",
    bg: "bg-blue-500/10 border-blue-200",
  },
  {
    key: "lessons" as TabKey,
    label: "Materi Lesson",
    icon: IconFileText,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10 border-emerald-200",
  },
  {
    key: "exercises" as TabKey,
    label: "Latihan Praktik",
    icon: IconCode,
    color: "text-amber-600",
    bg: "bg-amber-500/10 border-amber-200",
  },
  {
    key: "articles" as TabKey,
    label: "Artikel Panduan",
    icon: IconArticle,
    color: "text-purple-600",
    bg: "bg-purple-500/10 border-purple-200",
  },
];

// ─── Data Fetching ─────────────────────────────────────────────────────────
const {
  data: modulesRes,
  refresh: refreshModules,
  pending: modulesPending,
} = await useFetch<any>("/api/admin/modules");
const {
  data: lessonsRes,
  refresh: refreshLessons,
  pending: lessonsPending,
} = await useFetch<any>("/api/admin/lessons");
const {
  data: exercisesRes,
  refresh: refreshExercises,
  pending: exercisesPending,
} = await useFetch<any>("/api/admin/exercises");
const {
  data: articlesRes,
  refresh: refreshArticles,
  pending: articlesPending,
} = await useFetch<any>("/api/admin/articles");

const modules = computed(() => modulesRes.value?.data || []);
const lessons = computed(() => lessonsRes.value?.data || []);
const exercises = computed(() => exercisesRes.value?.data || []);
const articles = computed(() => articlesRes.value?.data || []);

const currentPending = computed(() => {
  const map: Record<TabKey, boolean> = {
    modules: modulesPending.value,
    lessons: lessonsPending.value,
    exercises: exercisesPending.value,
    articles: articlesPending.value,
  };
  return map[activeTab.value];
});

// Filtered data based on search query
const filteredModules = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return q
    ? modules.value.filter((m: any) => m.title.toLowerCase().includes(q))
    : modules.value;
});
const filteredLessons = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return q
    ? lessons.value.filter(
        (l: any) =>
          l.title.toLowerCase().includes(q) ||
          l.module_title?.toLowerCase().includes(q),
      )
    : lessons.value;
});
const filteredExercises = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return q
    ? exercises.value.filter(
        (e: any) =>
          e.lesson_title?.toLowerCase().includes(q) ||
          e.module_title?.toLowerCase().includes(q),
      )
    : exercises.value;
});
const filteredArticles = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return q
    ? articles.value.filter((a: any) => a.title.toLowerCase().includes(q))
    : articles.value;
});

// ─── Modal State ───────────────────────────────────────────────────────────
const showModal = ref(false);
const modalMode = ref<"create" | "edit">("create");
const editorViewMode = ref<"write" | "preview" | "split">("split");
const savePending = ref(false);
const deleteTarget = ref<any>(null);
const showDeleteConfirm = ref(false);
const formError = ref("");

// ─── LaTeX Test Compile State ──────────────────────────────────────────────
const isCompiling = ref(false);
const compileResult = ref<{
  isSuccess: boolean;
  pdfBase64?: string;
  errorText?: string;
  target?: string;
} | null>(null);

// ─── Textarea Refs & Toolbar Formatting Action ──────────────────────────────
const lessonTextareaRef = ref<HTMLTextAreaElement | null>(null);
const exerciseInstructionTextareaRef = ref<HTMLTextAreaElement | null>(null);
const articleTextareaRef = ref<HTMLTextAreaElement | null>(null);

function applyFormatting(
  targetField: "content" | "instruction",
  prefix: string,
  suffix = "",
  placeholder = ""
) {
  let el: HTMLTextAreaElement | null = null;
  if (targetField === "content" && activeTab.value === "lessons")
    el = lessonTextareaRef.value;
  else if (targetField === "instruction" && activeTab.value === "exercises")
    el = exerciseInstructionTextareaRef.value;
  else if (targetField === "content" && activeTab.value === "articles")
    el = articleTextareaRef.value;

  const text = form.value[targetField] || "";
  if (!el) {
    form.value[targetField] = text + prefix + placeholder + suffix;
    return;
  }

  const start = el.selectionStart;
  const end = el.selectionEnd;
  const selected = text.substring(start, end) || placeholder;

  form.value[targetField] =
    text.substring(0, start) + prefix + selected + suffix + text.substring(end);

  nextTick(() => {
    el?.focus();
    const newPos = start + prefix.length + selected.length + suffix.length;
    el?.setSelectionRange(newPos, newPos);
  });
}

const form = ref({
  id: 0,
  title: "",
  description: "",
  content: "",
  module_id: 0,
  lesson_id: 0,
  instruction: "",
  starter_code: "",
  solution_code: "",
  sort_order: 1,
  is_published: true,
});

function resetForm() {
  form.value = {
    id: 0,
    title: "",
    description: "",
    content: "",
    module_id: 0,
    lesson_id: 0,
    instruction: "",
    starter_code: "",
    solution_code: "",
    sort_order: 1,
    is_published: true,
  };
  formError.value = "";
  compileResult.value = null;
  editorViewMode.value = "split";
}

function openCreate() {
  resetForm();
  modalMode.value = "create";
  showModal.value = true;
}

function openEdit(item: any) {
  resetForm();
  form.value = {
    id: item.id,
    title: item.title || "",
    description: item.description || "",
    content: item.content || "",
    module_id: item.module_id || 0,
    lesson_id: item.lesson_id || 0,
    instruction: item.instruction || "",
    starter_code: item.starter_code || "",
    solution_code: item.solution_code || "",
    sort_order: item.sort_order || 1,
    is_published: item.is_published ?? true,
  };
  modalMode.value = "edit";
  showModal.value = true;
}

function confirmDelete(item: any) {
  deleteTarget.value = item;
  showDeleteConfirm.value = true;
}

// ─── LaTeX Single-File Test Compiler ──────────────────────────────────────
const showAdminCompileModal = ref(false);

async function testCompileLatex(target: "solution" | "starter") {
  const latexCode =
    target === "solution" ? form.value.solution_code : form.value.starter_code;
  if (!latexCode || !latexCode.trim()) {
    alert(`Kode ${target === "solution" ? "Solusi" : "Starter"} masih kosong.`);
    return;
  }

  isCompiling.value = true;
  compileResult.value = null;
  showAdminCompileModal.value = true;

  try {
    const res = await $fetch<{
      statusCode: number;
      data: { isSuccess: boolean; pdfBase64?: string; errorText?: string };
    }>("/api/compile", {
      method: "POST",
      body: { code: latexCode },
    });

    if (res?.data?.isSuccess && res.data.pdfBase64) {
      compileResult.value = {
        isSuccess: true,
        pdfBase64: res.data.pdfBase64,
        target,
      };
    } else {
      compileResult.value = {
        isSuccess: false,
        errorText: res?.data?.errorText || "Gagal mengompilasi berkas LaTeX.",
        target,
      };
    }
  } catch (err: any) {
    compileResult.value = {
      isSuccess: false,
      errorText:
        err?.data?.statusMessage ||
        err?.data?.message ||
        "Terjadi galat koneksi Docker TeXLive.",
      target,
    };
  } finally {
    isCompiling.value = false;
  }
}

// ─── API Actions ─────────────────────────────────────────────────────────
const endpointMap: Record<TabKey, string> = {
  modules: "/api/admin/modules",
  lessons: "/api/admin/lessons",
  exercises: "/api/admin/exercises",
  articles: "/api/admin/articles",
};

function buildBody(): Record<string, any> {
  const tab = activeTab.value;
  if (tab === "modules")
    return {
      title: form.value.title,
      description: form.value.description,
      sort_order: form.value.sort_order,
      is_published: form.value.is_published,
    };
  if (tab === "lessons")
    return {
      module_id: form.value.module_id,
      title: form.value.title,
      content: form.value.content,
      sort_order: form.value.sort_order,
      is_published: form.value.is_published,
    };
  if (tab === "exercises")
    return {
      lesson_id: form.value.lesson_id,
      instruction: form.value.instruction,
      starter_code: form.value.starter_code,
      solution_code: form.value.solution_code,
      is_published: form.value.is_published,
    };
  if (tab === "articles")
    return {
      title: form.value.title,
      content: form.value.content,
      is_published: form.value.is_published,
    };
  return {};
}

async function saveForm() {
  savePending.value = true;
  formError.value = "";
  try {
    const base = endpointMap[activeTab.value];
    const url = modalMode.value === "edit" ? `${base}/${form.value.id}` : base;
    const method = modalMode.value === "edit" ? "PUT" : "POST";
    await $fetch(url, { method, body: buildBody() });
    showModal.value = false;
    await refreshCurrent();
  } catch (err: any) {
    formError.value =
      err?.data?.statusMessage || "Terjadi kesalahan saat menyimpan.";
  } finally {
    savePending.value = false;
  }
}

async function doDelete() {
  if (!deleteTarget.value) return;
  try {
    const base = endpointMap[activeTab.value];
    await $fetch(`${base}/${deleteTarget.value.id}`, { method: "DELETE" });
    showDeleteConfirm.value = false;
    deleteTarget.value = null;
    await refreshCurrent();
  } catch (err: any) {
    alert(err?.data?.statusMessage || "Gagal menghapus data.");
  }
}

async function togglePublish(item: any) {
  const base = endpointMap[activeTab.value];
  await $fetch(`${base}/${item.id}`, {
    method: "PUT",
    body: { is_published: !item.is_published },
  });
  await refreshCurrent();
}

async function refreshCurrent() {
  const refreshMap: Record<TabKey, () => void> = {
    modules: refreshModules,
    lessons: refreshLessons,
    exercises: refreshExercises,
    articles: refreshArticles,
  };
  refreshMap[activeTab.value]();
}
</script>

<template>
  <div class="max-w-7xl mx-auto w-full pb-12 space-y-6 px-1">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1
          class="text-2xl font-bold text-(--color-text-primary) font-display tracking-tight"
        >
          Manajemen Konten
        </h1>
        <p class="text-sm text-(--color-text-muted) mt-0.5">
          CRUD Data Master: Modul, Materi Lesson, Latihan Praktik & Artikel
          Panduan Unila.
        </p>
      </div>
      <button
        @click="openCreate"
        class="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer"
      >
        <IconPlus class="size-4" />
        <span>Tambah {{ tabs.find((t) => t.key === activeTab)?.label }}</span>
      </button>
    </div>

    <!-- Tab Bar & Search -->
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <!-- Tabs -->
      <div
        class="flex bg-(--color-surface) p-1 rounded-xl border border-border gap-1 flex-wrap"
      >
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="
            activeTab = tab.key;
            searchQuery = '';
          "
          :class="[
            'flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer',
            activeTab === tab.key
              ? `${tab.bg} ${tab.color} border`
              : 'text-(--color-text-muted) hover:text-(--color-text-primary)',
          ]"
        >
          <component :is="tab.icon" class="size-3.5" />
          {{ tab.label }}
        </button>
      </div>

      <!-- Search -->
      <div class="relative flex-1 min-w-48">
        <IconSearch
          class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-(--color-text-muted)"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari konten..."
          class="w-full pl-9 pr-4 py-2 bg-(--color-surface) border border-border rounded-xl text-sm text-(--color-text-primary) placeholder:text-(--color-text-muted) outline-none focus:border-primary transition-all"
        />
      </div>
    </div>

    <!-- Data Table -->
    <div
      class="bg-(--color-surface) rounded-2xl border border-border shadow-xs overflow-hidden"
    >
      <!-- Loading Skeleton -->
      <div v-if="currentPending" class="p-6 space-y-3">
        <div
          v-for="i in 5"
          :key="i"
          class="h-14 bg-(--color-surface-alt) animate-pulse rounded-xl"
        ></div>
      </div>

      <!-- Modules Table -->
      <table v-else-if="activeTab === 'modules'" class="w-full text-sm">
        <thead class="bg-(--color-surface-alt)/70 border-b border-border">
          <tr>
            <th
              class="px-5 py-3.5 text-left text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
            >
              ID
            </th>
            <th
              class="px-5 py-3.5 text-left text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
            >
              Judul Modul
            </th>
            <th
              class="px-5 py-3.5 text-center text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
            >
              Materi
            </th>
            <th
              class="px-5 py-3.5 text-center text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-5 py-3.5 text-right text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-if="filteredModules.length === 0">
            <td
              colspan="5"
              class="py-12 text-center text-(--color-text-muted) text-sm"
            >
              Tidak ada modul ditemukan.
            </td>
          </tr>
          <tr
            v-for="item in filteredModules"
            :key="item.id"
            class="hover:bg-(--color-surface-alt)/50 transition-colors group"
          >
            <td class="px-5 py-4 font-mono text-xs text-(--color-text-muted)">
              {{ item.id }}
            </td>
            <td class="px-5 py-4">
              <div class="font-semibold text-(--color-text-primary)">
                {{ item.title }}
              </div>
              <div
                class="text-xs text-(--color-text-muted) line-clamp-1 mt-0.5"
              >
                {{ item.description }}
              </div>
            </td>
            <td class="px-5 py-4 text-center">
              <span
                class="px-2 py-0.5 bg-blue-500/10 text-blue-600 border border-blue-200 rounded-full text-xs font-bold"
                >{{ item.lesson_count }}</span
              >
            </td>
            <td class="px-5 py-4 text-center">
              <button
                @click="togglePublish(item)"
                :class="[
                  'flex items-center gap-1 mx-auto px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer',
                  item.is_published
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
                    : 'bg-amber-500/10 text-amber-600 border-amber-200',
                ]"
              >
                <IconCheck v-if="item.is_published" class="size-3" />
                <IconEyeOff v-else class="size-3" />
                {{ item.is_published ? "Aktif" : "Draft" }}
              </button>
            </td>
            <td class="px-5 py-4 text-right">
              <div
                class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button
                  @click="openEdit(item)"
                  class="p-1.5 rounded-lg hover:bg-primary/10 text-(--color-text-muted) hover:text-primary transition-colors cursor-pointer"
                >
                  <IconEdit class="size-4" />
                </button>
                <button
                  @click="confirmDelete(item)"
                  class="p-1.5 rounded-lg hover:bg-red-500/10 text-(--color-text-muted) hover:text-red-500 transition-colors cursor-pointer"
                >
                  <IconTrash class="size-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Lessons Table -->
      <table v-else-if="activeTab === 'lessons'" class="w-full text-sm">
        <thead class="bg-(--color-surface-alt)/70 border-b border-border">
          <tr>
            <th
              class="px-5 py-3.5 text-left text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
            >
              ID
            </th>
            <th
              class="px-5 py-3.5 text-left text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
            >
              Judul Materi
            </th>
            <th
              class="px-5 py-3.5 text-left text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
            >
              Modul
            </th>
            <th
              class="px-5 py-3.5 text-center text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-5 py-3.5 text-right text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-if="filteredLessons.length === 0">
            <td
              colspan="5"
              class="py-12 text-center text-(--color-text-muted) text-sm"
            >
              Tidak ada materi ditemukan.
            </td>
          </tr>
          <tr
            v-for="item in filteredLessons"
            :key="item.id"
            class="hover:bg-(--color-surface-alt)/50 transition-colors group"
          >
            <td class="px-5 py-4 font-mono text-xs text-(--color-text-muted)">
              {{ item.id }}
            </td>
            <td class="px-5 py-4">
              <div
                class="font-semibold text-(--color-text-primary) line-clamp-1"
              >
                {{ item.title }}
              </div>
              <div
                class="text-xs text-(--color-text-muted) line-clamp-1 mt-0.5 font-mono"
              >
                {{ item.content_preview }}
              </div>
            </td>
            <td class="px-5 py-4">
              <span
                class="text-xs text-(--color-text-secondary) bg-(--color-surface-alt) border border-border px-2 py-0.5 rounded-full"
                >{{ item.module_title }}</span
              >
            </td>
            <td class="px-5 py-4 text-center">
              <button
                @click="togglePublish(item)"
                :class="[
                  'flex items-center gap-1 mx-auto px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer',
                  item.is_published
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
                    : 'bg-amber-500/10 text-amber-600 border-amber-200',
                ]"
              >
                <IconCheck v-if="item.is_published" class="size-3" />
                <IconEyeOff v-else class="size-3" />
                {{ item.is_published ? "Aktif" : "Draft" }}
              </button>
            </td>
            <td class="px-5 py-4 text-right">
              <div
                class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button
                  @click="openEdit(item)"
                  class="p-1.5 rounded-lg hover:bg-primary/10 text-(--color-text-muted) hover:text-primary transition-colors cursor-pointer"
                >
                  <IconEdit class="size-4" />
                </button>
                <button
                  @click="confirmDelete(item)"
                  class="p-1.5 rounded-lg hover:bg-red-500/10 text-(--color-text-muted) hover:text-red-500 transition-colors cursor-pointer"
                >
                  <IconTrash class="size-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Exercises Table -->
      <table v-else-if="activeTab === 'exercises'" class="w-full text-sm">
        <thead class="bg-(--color-surface-alt)/70 border-b border-border">
          <tr>
            <th
              class="px-5 py-3.5 text-left text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
            >
              ID
            </th>
            <th
              class="px-5 py-3.5 text-left text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
            >
              Instruksi Latihan
            </th>
            <th
              class="px-5 py-3.5 text-left text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
            >
              Lesson / Modul
            </th>
            <th
              class="px-5 py-3.5 text-center text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-5 py-3.5 text-right text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-if="filteredExercises.length === 0">
            <td
              colspan="5"
              class="py-12 text-center text-(--color-text-muted) text-sm"
            >
              Tidak ada latihan ditemukan.
            </td>
          </tr>
          <tr
            v-for="item in filteredExercises"
            :key="item.id"
            class="hover:bg-(--color-surface-alt)/50 transition-colors group"
          >
            <td class="px-5 py-4 font-mono text-xs text-(--color-text-muted)">
              {{ item.id }}
            </td>
            <td class="px-5 py-4">
              <div class="text-xs text-(--color-text-primary) line-clamp-2">
                {{ item.instruction_preview }}
              </div>
            </td>
            <td class="px-5 py-4">
              <div
                class="text-xs font-semibold text-(--color-text-primary) line-clamp-1"
              >
                {{ item.lesson_title }}
              </div>
              <div class="text-[11px] text-(--color-text-muted) mt-0.5">
                {{ item.module_title }}
              </div>
            </td>
            <td class="px-5 py-4 text-center">
              <button
                @click="togglePublish(item)"
                :class="[
                  'flex items-center gap-1 mx-auto px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer',
                  item.is_published
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
                    : 'bg-amber-500/10 text-amber-600 border-amber-200',
                ]"
              >
                <IconCheck v-if="item.is_published" class="size-3" />
                <IconEyeOff v-else class="size-3" />
                {{ item.is_published ? "Aktif" : "Draft" }}
              </button>
            </td>
            <td class="px-5 py-4 text-right">
              <div
                class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button
                  @click="openEdit(item)"
                  class="p-1.5 rounded-lg hover:bg-primary/10 text-(--color-text-muted) hover:text-primary transition-colors cursor-pointer"
                >
                  <IconEdit class="size-4" />
                </button>
                <button
                  @click="confirmDelete(item)"
                  class="p-1.5 rounded-lg hover:bg-red-500/10 text-(--color-text-muted) hover:text-red-500 transition-colors cursor-pointer"
                >
                  <IconTrash class="size-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Articles Table -->
      <table v-else-if="activeTab === 'articles'" class="w-full text-sm">
        <thead class="bg-(--color-surface-alt)/70 border-b border-border">
          <tr>
            <th
              class="px-5 py-3.5 text-left text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
            >
              ID
            </th>
            <th
              class="px-5 py-3.5 text-left text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
            >
              Judul Artikel
            </th>
            <th
              class="px-5 py-3.5 text-left text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
            >
              Penulis
            </th>
            <th
              class="px-5 py-3.5 text-center text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-5 py-3.5 text-right text-xs font-bold text-(--color-text-muted) uppercase tracking-wider"
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-if="filteredArticles.length === 0">
            <td
              colspan="5"
              class="py-12 text-center text-(--color-text-muted) text-sm"
            >
              Tidak ada artikel ditemukan.
            </td>
          </tr>
          <tr
            v-for="item in filteredArticles"
            :key="item.id"
            class="hover:bg-(--color-surface-alt)/50 transition-colors group"
          >
            <td class="px-5 py-4 font-mono text-xs text-(--color-text-muted)">
              {{ item.id }}
            </td>
            <td class="px-5 py-4">
              <div
                class="font-semibold text-(--color-text-primary) line-clamp-1"
              >
                {{ item.title }}
              </div>
              <div
                class="text-xs text-(--color-text-muted) line-clamp-1 mt-0.5"
              >
                {{ item.content_preview }}
              </div>
            </td>
            <td
              class="px-5 py-4 text-xs text-(--color-text-secondary) font-medium"
            >
              {{ item.author_name }}
            </td>
            <td class="px-5 py-4 text-center">
              <button
                @click="togglePublish(item)"
                :class="[
                  'flex items-center gap-1 mx-auto px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer',
                  item.is_published
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
                    : 'bg-amber-500/10 text-amber-600 border-amber-200',
                ]"
              >
                <IconCheck v-if="item.is_published" class="size-3" />
                <IconEyeOff v-else class="size-3" />
                {{ item.is_published ? "Aktif" : "Draft" }}
              </button>
            </td>
            <td class="px-5 py-4 text-right">
              <div
                class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button
                  @click="openEdit(item)"
                  class="p-1.5 rounded-lg hover:bg-primary/10 text-(--color-text-muted) hover:text-primary transition-colors cursor-pointer"
                >
                  <IconEdit class="size-4" />
                </button>
                <button
                  @click="confirmDelete(item)"
                  class="p-1.5 rounded-lg hover:bg-red-500/10 text-(--color-text-muted) hover:text-red-500 transition-colors cursor-pointer"
                >
                  <IconTrash class="size-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ─── Create/Edit Modal dengan Live Markdown WYSIWYG & LaTeX Compiler ──────────────── -->
    <Transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-xs"
        @click.self="showModal = false"
      >
        <div
          :class="[
            'bg-(--color-surface) rounded-2xl border border-border shadow-2xl w-full flex flex-col overflow-hidden transition-all duration-300',
            activeTab === 'modules'
              ? 'max-w-xl max-h-[90vh]'
              : 'max-w-[96vw] h-[94vh]',
          ]"
        >
          <!-- Modal Header -->
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-border bg-(--color-surface-alt)/50 shrink-0"
          >
            <div class="flex items-center gap-2">
              <div
                class="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold"
              >
                <component
                  :is="tabs.find((t) => t.key === activeTab)?.icon"
                  class="size-4"
                />
              </div>
              <div>
                <h3
                  class="font-bold text-(--color-text-primary) font-display tracking-tight text-base"
                >
                  {{ modalMode === "create" ? "Tambah" : "Edit" }}
                  {{ tabs.find((t) => t.key === activeTab)?.label }}
                </h3>
                <p class="text-[11px] text-(--color-text-muted)">
                  Form pengisian data master platform
                </p>
              </div>
            </div>

            <!-- Editor View Mode Toggle (untuk Lesson, Exercise, Article) -->
            <div v-if="activeTab !== 'modules'" class="flex items-center gap-2">
              <div
                class="flex bg-(--color-surface) p-1 rounded-xl border border-border"
              >
                <button
                  @click="editorViewMode = 'write'"
                  :class="[
                    'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer',
                    editorViewMode === 'write'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-(--color-text-muted)',
                  ]"
                  title="Hanya Tampilkan Editor"
                >
                  <IconPencil class="size-3.5" />
                  <span class="hidden sm:inline">Tulis</span>
                </button>
                <button
                  @click="editorViewMode = 'split'"
                  :class="[
                    'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer',
                    editorViewMode === 'split'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-(--color-text-muted)',
                  ]"
                  title="Side-by-Side Editor & Pratinjau Live"
                >
                  <IconDeviceTv class="size-3.5" />
                  <span class="hidden sm:inline">Split Live</span>
                </button>
                <button
                  @click="editorViewMode = 'preview'"
                  :class="[
                    'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer',
                    editorViewMode === 'preview'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-(--color-text-muted)',
                  ]"
                  title="Hanya Tampilkan Pratinjau Markdown"
                >
                  <IconEye class="size-3.5" />
                  <span class="hidden sm:inline">Pratinjau</span>
                </button>
              </div>

              <button
                @click="showModal = false"
                class="p-1.5 rounded-lg hover:bg-(--color-surface-alt) text-(--color-text-muted) cursor-pointer"
              >
                <IconX class="size-4.5" />
              </button>
            </div>

            <button
              v-else
              @click="showModal = false"
              class="p-1.5 rounded-lg hover:bg-(--color-surface-alt) text-(--color-text-muted) cursor-pointer"
            >
              <IconX class="size-4.5" />
            </button>
          </div>

          <!-- Modal Body (Scrollable Content) -->
          <div class="flex-1 overflow-y-auto p-6 space-y-5">
            <p
              v-if="formError"
              class="text-xs text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl flex items-center gap-2"
            >
              <IconAlertTriangle class="size-4 shrink-0" />
              <span>{{ formError }}</span>
            </p>

            <!-- ─── MODULE FORM ─────────────────────────────────────────────── -->
            <template v-if="activeTab === 'modules'">
              <div class="space-y-1.5">
                <label
                  class="text-xs font-bold text-(--color-text-secondary) uppercase tracking-wider"
                  >Judul Modul *</label
                >
                <input
                  v-model="form.title"
                  class="w-full px-4 py-2.5 bg-(--color-surface-alt) border border-border rounded-xl text-sm outline-none focus:border-primary transition-all font-sans"
                  placeholder="cth: Modul 9 — Lanjutan LaTeX"
                />
              </div>
              <div class="space-y-1.5">
                <label
                  class="text-xs font-bold text-(--color-text-secondary) uppercase tracking-wider"
                  >Deskripsi</label
                >
                <textarea
                  v-model="form.description"
                  rows="3"
                  class="w-full px-4 py-2.5 bg-(--color-surface-alt) border border-border rounded-xl text-sm outline-none focus:border-primary transition-all resize-none font-sans"
                  placeholder="Deskripsi singkat modul..."
                ></textarea>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label
                    class="text-xs font-bold text-(--color-text-secondary) uppercase tracking-wider"
                    >Urutan</label
                  >
                  <input
                    v-model.number="form.sort_order"
                    type="number"
                    min="1"
                    class="w-full px-4 py-2.5 bg-(--color-surface-alt) border border-border rounded-xl text-sm outline-none focus:border-primary transition-all font-mono"
                  />
                </div>
                <div class="space-y-1.5">
                  <label
                    class="text-xs font-bold text-(--color-text-secondary) uppercase tracking-wider"
                    >Status</label
                  >
                  <select
                    v-model="form.is_published"
                    class="w-full px-4 py-2.5 bg-(--color-surface-alt) border border-border rounded-xl text-sm outline-none focus:border-primary transition-all"
                  >
                    <option :value="true">Aktif (Dipublikasi)</option>
                    <option :value="false">Draft</option>
                  </select>
                </div>
              </div>
            </template>

            <!-- ─── LESSON FORM WITH LIVE MARKDOWN PREVIEW ──────────────────── -->
            <template v-else-if="activeTab === 'lessons'">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="sm:col-span-1 space-y-1.5">
                  <label
                    class="text-xs font-bold text-(--color-text-secondary) uppercase tracking-wider"
                    >Modul Induk *</label
                  >
                  <select
                    v-model="form.module_id"
                    class="w-full px-3 py-2 bg-(--color-surface-alt) border border-border rounded-xl text-xs outline-none focus:border-primary transition-all"
                  >
                    <option :value="0" disabled>-- Pilih Modul --</option>
                    <option v-for="m in modules" :key="m.id" :value="m.id">
                      {{ m.title }}
                    </option>
                  </select>
                </div>
                <div class="sm:col-span-2 space-y-1.5">
                  <label
                    class="text-xs font-bold text-(--color-text-secondary) uppercase tracking-wider"
                    >Judul Lesson *</label
                  >
                  <input
                    v-model="form.title"
                    class="w-full px-3 py-2 bg-(--color-surface-alt) border border-border rounded-xl text-xs outline-none focus:border-primary transition-all"
                    placeholder="cth: Pengenalan Lingkungan LaTeX"
                  />
                </div>
              </div>

              <!-- Content Editor & Live Markdown Split View -->
              <div class="space-y-1.5">
                <label
                  class="text-xs font-bold text-(--color-text-secondary) uppercase tracking-wider flex items-center justify-between"
                >
                  <span>Konten Naskah Materi (Markdown & LaTeX Snippets)</span>
                  <span class="text-[10px] text-primary font-mono lowercase"
                    >WYSIWYG Live Render</span
                  >
                </label>

                <div
                  :class="[
                    'grid gap-4',
                    editorViewMode === 'split'
                      ? 'grid-cols-1 md:grid-cols-2'
                      : 'grid-cols-1',
                  ]"
                >
                  <!-- Editor Pane -->
                  <div v-if="editorViewMode !== 'preview'" class="space-y-2">
                    <div class="flex items-center justify-between">
                      <div
                        class="text-[11px] text-(--color-text-muted) font-semibold flex items-center gap-1"
                      >
                        <IconPencil class="size-3 text-primary" /> Editor Teks
                      </div>
                    </div>
                    <UiMarkdownToolbar @action="(p, s, ph) => applyFormatting('content', p, s, ph)" />
                    <textarea
                      ref="lessonTextareaRef"
                      v-model="form.content"
                      class="w-full min-h-[52vh] p-4 bg-(--color-code-bg) text-(--color-code-text) border border-(--color-code-border) rounded-2xl text-xs font-mono outline-none focus:border-primary transition-all resize-y leading-relaxed"
                      placeholder="# Judul Utama&#10;&#10;Penjelasan materi...&#10;&#10;```latex&#10;\documentclass{article}&#10;\begin{document}&#10;  Hello World&#10;\end{document}&#10;```"
                    ></textarea>
                  </div>

                  <!-- Live Markdown Preview Pane -->
                  <div v-if="editorViewMode !== 'write'" class="space-y-2">
                    <div
                      class="text-[11px] text-emerald-600 font-semibold flex items-center gap-1"
                    >
                      <IconEye class="size-3 text-emerald-500" /> Pratinjau Live
                      Markdown
                    </div>
                    <div
                      class="p-4 bg-(--color-surface-alt) border border-border rounded-2xl min-h-[58vh] max-h-[58vh] overflow-y-auto"
                    >
                      <div
                        v-if="form.content.trim()"
                        class="ai-markdown prose max-w-none text-xs leading-relaxed text-(--color-text-primary)"
                        v-html="renderMarkdown(form.content)"
                      ></div>
                      <div
                        v-else
                        class="text-center py-12 text-(--color-text-muted) text-xs italic"
                      >
                        Ketikkan konten markdown di sebelah kiri untuk melihat
                        pratinjau hasil di sini.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- ─── EXERCISE FORM WITH LATEX TEST COMPILER ──────────────────── -->
            <template v-else-if="activeTab === 'exercises'">
              <div class="space-y-1.5">
                <label
                  class="text-xs font-bold text-(--color-text-secondary) uppercase tracking-wider"
                  >Lesson Terkait *</label
                >
                <select
                  v-model="form.lesson_id"
                  class="w-full px-3 py-2 bg-(--color-surface-alt) border border-border rounded-xl text-xs outline-none focus:border-primary transition-all"
                >
                  <option :value="0" disabled>-- Pilih Lesson --</option>
                  <option v-for="l in lessons" :key="l.id" :value="l.id">
                    {{ l.title }}
                  </option>
                </select>
              </div>

              <!-- Instruction & Live Markdown Preview -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <label
                    class="text-xs font-bold text-(--color-text-secondary) uppercase tracking-wider"
                    >Instruksi Soal Latihan (Markdown) *</label
                  >
                </div>
                <UiMarkdownToolbar @action="(p, s, ph) => applyFormatting('instruction', p, s, ph)" />
                <div
                  :class="[
                    'grid gap-4',
                    editorViewMode === 'split'
                      ? 'grid-cols-1 md:grid-cols-2'
                      : 'grid-cols-1',
                  ]"
                >
                  <textarea
                    v-if="editorViewMode !== 'preview'"
                    ref="exerciseInstructionTextareaRef"
                    v-model="form.instruction"
                    rows="6"
                    class="w-full p-3 bg-(--color-surface-alt) border border-border rounded-xl text-xs font-sans outline-none focus:border-primary transition-all resize-y"
                    placeholder="Tuliskan instruksi latihan..."
                  ></textarea>
                  <div
                    v-if="editorViewMode !== 'write'"
                    class="p-3 bg-(--color-surface-alt) border border-border rounded-xl text-xs min-h-24 max-h-36 overflow-y-auto"
                  >
                    <div
                      class="ai-markdown prose max-w-none text-xs"
                      v-html="renderMarkdown(form.instruction)"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- LaTeX Codes & Single-File Compiler Testing Box -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Starter Code -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <label
                      class="text-xs font-bold text-(--color-text-secondary) uppercase tracking-wider"
                      >Kode Starter (LaTeX)</label
                    >
                    <button
                      @click="testCompileLatex('starter')"
                      :disabled="isCompiling"
                      class="btn-secondary btn-sm gap-1 rounded-xl cursor-pointer disabled:opacity-50"
                    >
                      <IconLoader2 v-if="isCompiling" class="size-3.5 animate-spin" />
                      <span>⚡ Uji Starter</span>
                    </button>
                  </div>
                  <textarea
                    v-model="form.starter_code"
                    rows="16"
                    class="w-full p-4 bg-(--color-code-bg) text-(--color-code-text) border border-(--color-code-border) rounded-2xl text-[13px] font-mono outline-none focus:border-primary transition-all resize-y min-h-[380px] leading-relaxed"
                    placeholder="\documentclass{article}&#10;\begin{document}&#10;% Starter code&#10;\end{document}"
                  ></textarea>
                </div>

                <!-- Solution Code -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <label
                      class="text-xs font-bold text-emerald-600 uppercase tracking-wider"
                      >Kode Solusi (LaTeX)</label
                    >
                    <button
                      @click="testCompileLatex('solution')"
                      :disabled="isCompiling"
                      class="btn-primary btn-sm gap-1 rounded-xl cursor-pointer disabled:opacity-50"
                    >
                      <IconLoader2 v-if="isCompiling" class="size-3.5 animate-spin" />
                      <span>⚡ Uji Kompilasi Solusi</span>
                    </button>
                  </div>
                  <textarea
                    v-model="form.solution_code"
                    rows="16"
                    class="w-full p-4 bg-(--color-code-bg) text-(--color-code-text) border border-(--color-code-border) rounded-2xl text-[13px] font-mono outline-none focus:border-primary transition-all resize-y min-h-[380px] leading-relaxed"
                    placeholder="\documentclass{article}&#10;\begin{document}&#10;% Solusi lengkap...&#10;\end{document}"
                  ></textarea>
                </div>
              </div>

              <!-- LaTeX Single-File Test Compile Output Panel -->
              <div
                v-if="isCompiling"
                class="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center gap-3"
              >
                <IconLoader2 class="size-5 text-purple-600 animate-spin" />
                <span class="text-xs font-semibold text-purple-700"
                  >Memproses kompilasi Docker TeXLive (Single-File
                  Test)...</span
                >
              </div>

              <div
                v-else-if="compileResult"
                class="p-4 bg-(--color-surface-alt) border border-border rounded-2xl space-y-3"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <IconFileTypePdf
                      :class="[
                        'size-5',
                        compileResult.isSuccess
                          ? 'text-emerald-600'
                          : 'text-red-500',
                      ]"
                    />
                    <span class="text-xs font-bold text-(--color-text-primary)">
                      Hasil Pengujian Kompilasi ({{
                        compileResult.target === "solution"
                          ? "Kode Solusi"
                          : "Kode Starter"
                      }})
                    </span>
                  </div>
                  <span
                    :class="[
                      'text-[11px] font-bold px-2 py-0.5 rounded-full border',
                      compileResult.isSuccess
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
                        : 'bg-red-500/10 text-red-500 border-red-200',
                    ]"
                  >
                    {{
                      compileResult.isSuccess
                        ? "✅ Berhasil Sempurna"
                        : "❌ Galat Kompilasi"
                    }}
                  </span>
                </div>

                <!-- PDF Embedded Preview if Success -->
                <div
                  v-if="compileResult.isSuccess && compileResult.pdfBase64"
                  class="space-y-2"
                >
                  <iframe
                    :src="compileResult.pdfBase64.startsWith('data:') ? compileResult.pdfBase64 : `data:application/pdf;base64,${compileResult.pdfBase64}`"
                    class="w-full h-[460px] border border-border rounded-xl bg-white shadow-xs"
                  ></iframe>
                </div>

                <!-- Error Log if Compile Failed -->
                <div
                  v-else-if="!compileResult.isSuccess"
                  class="p-3 bg-red-950 text-red-200 border border-red-800 rounded-xl text-xs font-mono overflow-x-auto max-h-40"
                >
                  <pre class="whitespace-pre-wrap">{{
                    compileResult.errorText
                  }}</pre>
                </div>
              </div>
            </template>

            <!-- ─── ARTICLE FORM WITH LIVE MARKDOWN PREVIEW ──────────────────── -->
            <template v-else-if="activeTab === 'articles'">
              <div class="space-y-1.5">
                <label
                  class="text-xs font-bold text-(--color-text-secondary) uppercase tracking-wider"
                  >Judul Artikel *</label
                >
                <input
                  v-model="form.title"
                  class="w-full px-4 py-2.5 bg-(--color-surface-alt) border border-border rounded-xl text-sm outline-none focus:border-primary transition-all"
                  placeholder="cth: Panduan Format Margin Skripsi Unila"
                />
              </div>

              <!-- Content Editor & Live Markdown Split View -->
              <div class="space-y-1.5">
                <label
                  class="text-xs font-bold text-(--color-text-secondary) uppercase tracking-wider flex items-center justify-between"
                >
                  <span>Konten Panduan Regulasi (Markdown) *</span>
                  <span class="text-[10px] text-purple-600 font-mono lowercase"
                    >Live Markdown Render</span
                  >
                </label>
                <UiMarkdownToolbar @action="(p, s, ph) => applyFormatting('content', p, s, ph)" />

                <div
                  :class="[
                    'grid gap-4',
                    editorViewMode === 'split'
                      ? 'grid-cols-1 md:grid-cols-2'
                      : 'grid-cols-1',
                  ]"
                >
                  <!-- Editor Pane -->
                  <textarea
                    v-if="editorViewMode !== 'preview'"
                    ref="articleTextareaRef"
                    v-model="form.content"
                    class="w-full min-h-[52vh] p-4 bg-(--color-surface-alt) border border-border rounded-2xl text-xs font-mono outline-none focus:border-primary transition-all resize-y leading-relaxed"
                    placeholder="# Panduan Format Margin Skripsi Unila&#10;&#10;Tulis isi panduan regulasi..."
                  ></textarea>

                  <!-- Live Markdown Preview Pane -->
                  <div
                    v-if="editorViewMode !== 'write'"
                    class="p-4 bg-(--color-surface-alt) border border-border rounded-2xl min-h-64 max-h-[380px] overflow-y-auto"
                  >
                    <div
                      v-if="form.content.trim()"
                      class="ai-markdown prose max-w-none text-xs leading-relaxed text-(--color-text-primary)"
                      v-html="renderMarkdown(form.content)"
                    ></div>
                    <div
                      v-else
                      class="text-center py-12 text-(--color-text-muted) text-xs italic"
                    >
                      Ketikkan naskah panduan di sebelah kiri untuk melihat
                      pratinjau tampilan di sini.
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Modal Footer -->
          <div
            class="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-(--color-surface-alt)/50 shrink-0"
          >
            <button
              @click="showModal = false"
              class="px-4 py-2 text-sm font-semibold text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              @click="saveForm"
              :disabled="savePending"
              class="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold transition-all cursor-pointer disabled:opacity-60 shadow-xs"
            >
              <IconLoader2 v-if="savePending" class="size-4 animate-spin" />
              <IconCheck v-else class="size-4" />
              {{
                modalMode === "create" ? "Buat Sekarang" : "Simpan Perubahan"
              }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ─── Delete Confirm Modal ──────────────────────────────────────────── -->
    <Transition name="fade">
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 bg-slate-950/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
      >
        <div
          class="bg-(--color-surface) rounded-2xl border border-border shadow-2xl w-full max-w-sm p-6 text-center space-y-4"
        >
          <div
            class="size-12 rounded-full bg-red-100 flex items-center justify-center mx-auto"
          >
            <IconTrash class="size-6 text-red-500" />
          </div>
          <div>
            <h3 class="font-bold text-(--color-text-primary) mb-1">
              Konfirmasi Hapus
            </h3>
            <p class="text-sm text-(--color-text-muted)">
              Apakah Anda yakin ingin menghapus
              <strong class="text-(--color-text-primary)">{{
                deleteTarget?.title ||
                deleteTarget?.instruction_preview ||
                "data ini"
              }}</strong
              >? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <div class="flex gap-3">
            <button
              @click="
                showDeleteConfirm = false;
                deleteTarget = null;
              "
              class="flex-1 py-2 border border-border rounded-xl text-sm font-semibold text-(--color-text-muted) hover:bg-(--color-surface-alt) cursor-pointer transition-all"
            >
              Batal
            </button>
            <button
              @click="doDelete"
              class="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold cursor-pointer transition-all"
            >
              Hapus Permanen
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Admin Compile Result Modal -->
    <CompileResultModal
      :isOpen="showAdminCompileModal"
      :isCompiling="isCompiling"
      :isSuccess="compileResult?.isSuccess || false"
      :pdfBase64="compileResult?.pdfBase64"
      :errorLogs="compileResult?.errorText"
      :title="`Pengujian Kompilasi Admin: ${compileResult?.target === 'solution' ? 'Kode Solusi' : 'Kode Starter'}`"
      @close="showAdminCompileModal = false"
    />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
