<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useAdminAnimations } from "~/composables/admin/useAdminAnimations";
import AdminUsersSkeleton from "~/components/skeleton/AdminUsersSkeleton.vue";
import AdminUsersHeader from "~/components/dashboard/admin/AdminUsersHeader.vue";
import AdminUsersStats from "~/components/dashboard/admin/AdminUsersStats.vue";
import AdminUsersFilterBar from "~/components/dashboard/admin/AdminUsersFilterBar.vue";
import AdminUsersTable from "~/components/dashboard/admin/AdminUsersTable.vue";
import AdminUserDetailModal from "~/components/dashboard/admin/AdminUserDetailModal.vue";

definePageMeta({ layout: "admin", middleware: ["role-admin"] });
useHead({ title: "Monitoring Progres Siswa | ScribeTex Admin" });

const { animateAdminUsersEntrance } = useAdminAnimations();
const { data: usersRes, refresh: refreshUsers, pending } = await useFetch<any>("/api/admin/users");

const users = computed(() => usersRes.value?.data || []);

const searchQuery = ref("");
const roleFilter = ref<"ALL" | "STUDENT" | "ADMIN">("STUDENT");
const progressFilter = ref<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

const filteredUsers = computed(() => {
  return users.value.filter((u: any) => {
    const q = searchQuery.value.toLowerCase();
    const matchesSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchesRole = roleFilter.value === "ALL" || u.role === roleFilter.value;

    let matchesProgress = true;
    if (progressFilter.value === "ACTIVE") matchesProgress = u.progress.completed_lessons > 0;
    if (progressFilter.value === "INACTIVE") matchesProgress = u.progress.completed_lessons === 0;

    return matchesSearch && matchesRole && matchesProgress;
  });
});

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

const selectedUser = ref<any>(null);
const showDetailModal = ref(false);

function openDetail(user: any) {
  selectedUser.value = user;
  showDetailModal.value = true;
}

watch(
  pending,
  (isPending) => {
    if (!isPending) {
      animateAdminUsersEntrance();
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (!pending.value) {
    animateAdminUsersEntrance();
  }
});
</script>

<template>
  <div class="max-w-7xl mx-auto w-full pb-12 space-y-6 px-1 font-body">
    <AdminUsersSkeleton v-if="pending" />

    <div v-else class="w-full space-y-6">
      <AdminUsersHeader :pending="pending" @refresh="refreshUsers" />

      <AdminUsersStats
        :totalStudents="totalStudents"
        :totalAdmins="totalAdmins"
        :avgProgress="avgProgress"
        :totalCompilations="totalCompilations"
        :totalAiChats="totalAiChats"
      />

      <AdminUsersFilterBar
        v-model:searchQuery="searchQuery"
        v-model:roleFilter="roleFilter"
        v-model:progressFilter="progressFilter"
      />

      <AdminUsersTable
        :users="filteredUsers"
        @openDetail="openDetail"
      />

      <AdminUserDetailModal
        :isOpen="showDetailModal"
        :user="selectedUser"
        @close="showDetailModal = false"
      />
    </div>
  </div>
</template>
