<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useAdminAnimations } from "~/composables/admin/useAdminAnimations";
import AdminContentSkeleton from "~/components/skeleton/AdminContentSkeleton.vue";
import ContentHeader from "~/components/dashboard/admin/content/ContentHeader.vue";
import ContentTabBar from "~/components/dashboard/admin/content/ContentTabBar.vue";
import ContentModulesTab from "~/components/dashboard/admin/content/ContentModulesTab.vue";
import ContentLessonsTab from "~/components/dashboard/admin/content/ContentLessonsTab.vue";
import ContentExercisesTab from "~/components/dashboard/admin/content/ContentExercisesTab.vue";
import ContentArticlesTab from "~/components/dashboard/admin/content/ContentArticlesTab.vue";
import ContentModals from "~/components/dashboard/admin/content/ContentModals.vue";

definePageMeta({ layout: "admin", middleware: ["role-admin"] });
useHead({ title: "Manajemen Konten Kurikulum | ScribeTex Admin" });

const { animateAdminContentEntrance } = useAdminAnimations();

type TabKey = "modules" | "lessons" | "exercises" | "articles";
const activeTab = ref<TabKey>("modules");

const { data: modulesRes, refresh: refreshModules, pending: modulesPending } = await useFetch<any>("/api/admin/modules");
const { data: lessonsRes, refresh: refreshLessons, pending: lessonsPending } = await useFetch<any>("/api/admin/lessons");
const { data: exercisesRes, refresh: refreshExercises, pending: refreshExercisesPending } = await useFetch<any>("/api/admin/exercises");
const { data: articlesRes, refresh: refreshArticles, pending: articlesPending } = await useFetch<any>("/api/admin/articles");

const modules = computed(() => modulesRes.value?.data || []);
const lessons = computed(() => lessonsRes.value?.data || []);
const exercises = computed(() => exercisesRes.value?.data || []);
const articles = computed(() => articlesRes.value?.data || []);

const isPending = computed(() => modulesPending.value || lessonsPending.value || refreshExercisesPending.value || articlesPending.value);

function refreshAll() {
  refreshModules();
  refreshLessons();
  refreshExercises();
  refreshArticles();
}

const showModal = ref(false);
const modalType = ref<"module" | "lesson" | "exercise" | "article" | null>(null);
const editingItem = ref<any>(null);

const showDeleteModal = ref(false);
const deleteItemTarget = ref<{ type: string; item: any } | null>(null);

function openCreateModal(type: "module" | "lesson" | "exercise" | "article") {
  modalType.value = type;
  editingItem.value = null;
  showModal.value = true;
}

function openEditModal(type: "module" | "lesson" | "exercise" | "article", item: any) {
  modalType.value = type;
  editingItem.value = item;
  showModal.value = true;
}

function openDeleteModal(type: string, item: any) {
  deleteItemTarget.value = { type, item };
  showDeleteModal.value = true;
}

async function handleSaveItem({ type, data, id }: { type: string; data: any; id?: string }) {
  showModal.value = false;
  const endpoint = `/api/admin/${type}s`;
  const method = id ? "PUT" : "POST";
  const url = id ? `${endpoint}/${id}` : endpoint;

  await $fetch(url, { method, body: data });
  refreshAll();
}

async function handleConfirmDelete({ type, id }: { type: string; id: string }) {
  showDeleteModal.value = false;
  await $fetch(`/api/admin/${type}s/${id}`, { method: "DELETE" });
  refreshAll();
}

watch(
  isPending,
  (pendingState) => {
    if (!pendingState) {
      animateAdminContentEntrance();
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (!isPending.value) {
    animateAdminContentEntrance();
  }
});
</script>

<template>
  <div class="max-w-7xl mx-auto w-full pb-12 space-y-6 px-1 font-body">
    <AdminContentSkeleton v-if="isPending" />

    <div v-else class="w-full space-y-6">
      <ContentHeader :pending="isPending" @refresh="refreshAll" />

      <ContentTabBar v-model:activeTab="activeTab" />

      <div class="gsap-admin-content-body">
        <ContentModulesTab
          v-if="activeTab === 'modules'"
          :modules="modules"
          @openCreateModal="openCreateModal('module')"
          @openEditModal="(item) => openEditModal('module', item)"
          @openDeleteModal="(item) => openDeleteModal('module', item)"
        />

        <ContentLessonsTab
          v-else-if="activeTab === 'lessons'"
          :lessons="lessons"
          @openCreateModal="openCreateModal('lesson')"
          @openEditModal="(item) => openEditModal('lesson', item)"
          @openDeleteModal="(item) => openDeleteModal('lesson', item)"
        />

        <ContentExercisesTab
          v-else-if="activeTab === 'exercises'"
          :exercises="exercises"
          @openCreateModal="openCreateModal('exercise')"
          @openEditModal="(item) => openEditModal('exercise', item)"
          @openDeleteModal="(item) => openDeleteModal('exercise', item)"
        />

        <ContentArticlesTab
          v-else-if="activeTab === 'articles'"
          :articles="articles"
          @openCreateModal="openCreateModal('article')"
          @openEditModal="(item) => openEditModal('article', item)"
          @openDeleteModal="(item) => openDeleteModal('article', item)"
        />
      </div>

      <ContentModals
        :showModal="showModal"
        :modalType="modalType"
        :editingItem="editingItem"
        :modulesList="modules"
        :lessonsList="lessons"
        :showDeleteModal="showDeleteModal"
        :deleteItemTarget="deleteItemTarget"
        @closeModal="showModal = false"
        @closeDeleteModal="showDeleteModal = false"
        @saveItem="handleSaveItem"
        @confirmDelete="handleConfirmDelete"
      />
    </div>
  </div>
</template>
