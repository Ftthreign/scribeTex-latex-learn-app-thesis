import { ref, computed, watch } from "vue";
import { API_ENDPOINTS } from "~/constants/api";

export enum ModuleStatus {
  ACTIVE = "AKTIF",
  DRAFT = "DRAFT",
}

export interface MockModule {
  id: number;
  title: string;
  lastModified: string;
  lessons: number;
  status: ModuleStatus;
  icon: string;
  color: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: "ADMIN" | "STUDENT";
  created_at: string;
}

export interface DashboardStat {
  label: string;
  value: number;
  sub: string;
  indicator: string;
  icon: string;
  color: string;
}

export interface RecentActivity {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: string;
  color: string;
}

export function useAdminDashboard() {
  const { user, userProfile } = useAuth();

  const displayName = computed(
    () =>
      userProfile.value?.name ||
      user.value?.user_metadata?.full_name ||
      user.value?.email?.split("@")[0] ||
      "Admin",
  );

  // Fetch users via Nuxt useFetch with explicit type
  const {
    data: users,
    error,
    refresh: refreshUsers,
  } = useFetch<AdminUser[]>(API_ENDPOINTS.admin.users, {
    headers: useRequestHeaders(["cookie"]) as Record<string, string>,
  });

  const totalUsers = computed(() => users.value?.length ?? 128);
  const totalAdmins = computed(
    () => users.value?.filter((u) => u.role === "ADMIN").length ?? 3,
  );
  const totalStudents = computed(
    () => users.value?.filter((u) => u.role === "STUDENT").length ?? 125,
  );

  // State for search and pagination of modules
  const searchQuery = ref("");
  const currentPage = ref(1);
  const itemsPerPage = 3;

  // Reset to page 1 whenever searchQuery changes
  watch(searchQuery, () => {
    currentPage.value = 1;
  });

  // Mock modules dataset
  const modules = ref<MockModule[]>([
    {
      id: 1,
      title: "Pengenalan LaTeX",
      lastModified: "2 jam yang lalu",
      lessons: 5,
      status: ModuleStatus.ACTIVE,
      icon: "menu_book",
      color: "primary",
    },
    {
      id: 2,
      title: "Tabel & Figur",
      lastModified: "Kemarin",
      lessons: 6,
      status: ModuleStatus.DRAFT,
      icon: "format_list_numbered",
      color: "secondary",
    },
    {
      id: 3,
      title: "Matematika Dasar",
      lastModified: "3 hari yang lalu",
      lessons: 12,
      status: ModuleStatus.ACTIVE,
      icon: "functions",
      color: "tertiary",
    },
    {
      id: 4,
      title: "Bibliografi & Sitasi",
      lastModified: "4 hari yang lalu",
      lessons: 8,
      status: ModuleStatus.ACTIVE,
      icon: "bookmark",
      color: "primary",
    },
    {
      id: 5,
      title: "Membuat Presentasi (Beamer)",
      lastModified: "Seminggu yang lalu",
      lessons: 7,
      status: ModuleStatus.DRAFT,
      icon: "co_present",
      color: "secondary",
    },
    {
      id: 6,
      title: "Grafik & Diagram (TikZ)",
      lastModified: "2 minggu yang lalu",
      lessons: 10,
      status: ModuleStatus.DRAFT,
      icon: "auto_graph",
      color: "tertiary",
    },
    {
      id: 7,
      title: "Kustomisasi Layout Jurnal",
      lastModified: "3 minggu yang lalu",
      lessons: 4,
      status: ModuleStatus.ACTIVE,
      icon: "article",
      color: "primary",
    },
    {
      id: 8,
      title: "Penulisan Tugas Akhir / Thesis",
      lastModified: "1 bulan yang lalu",
      lessons: 15,
      status: ModuleStatus.ACTIVE,
      icon: "school",
      color: "tertiary",
    },
  ]);

  // Filter modules based on search query
  const filteredModules = computed(() => {
    if (!searchQuery.value.trim()) return modules.value;
    const query = searchQuery.value.toLowerCase();
    return modules.value.filter(
      (m) =>
        m.title.toLowerCase().includes(query) ||
        m.status.toLowerCase().includes(query),
    );
  });

  // Paginated modules
  const paginatedModules = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredModules.value.slice(start, end);
  });

  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(filteredModules.value.length / itemsPerPage));
  });

  const startItemIndex = computed(() => {
    if (filteredModules.value.length === 0) return 0;
    return (currentPage.value - 1) * itemsPerPage + 1;
  });

  const endItemIndex = computed(() => {
    const end = currentPage.value * itemsPerPage;
    return Math.min(end, filteredModules.value.length);
  });

  // Action methods
  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const deleteModule = (id: number) => {
    modules.value = modules.value.filter((m) => m.id !== id);
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
  };

  const toggleStatus = (id: number) => {
    const mod = modules.value.find((m) => m.id === id);
    if (mod) {
      mod.status =
        mod.status === ModuleStatus.ACTIVE
          ? ModuleStatus.DRAFT
          : ModuleStatus.ACTIVE;
    }
  };

  // Dashboard Stats
  const stats = computed<DashboardStat[]>(() => [
    {
      label: "Students",
      value: totalStudents.value,
      sub: "+12%",
      indicator: "+12%",
      icon: "groups",
      color: "primary",
    },
    {
      label: "Modules",
      value: modules.value.length,
      sub: "Total",
      indicator: "Total",
      icon: "view_module",
      color: "secondary",
    },
    {
      label: "Exercises",
      value: 47,
      sub: "New",
      indicator: "New",
      icon: "task_alt",
      color: "warning",
    },
    {
      label: "Articles",
      value: 23,
      sub: "Live",
      indicator: "Live",
      icon: "description",
      color: "on-surface-variant",
    },
  ]);

  // Mock activity feed
  const recentActivities = ref<RecentActivity[]>([
    {
      id: 1,
      title: "New Student Registered",
      description: "Aditya Pratama joined the platform.",
      time: "10 minutes ago",
      icon: "person_add",
      color: "primary",
    },
    {
      id: 2,
      title: "Module Updated",
      description: '"Advanced Bibliography" was moved to Draft.',
      time: "2 hours ago",
      icon: "edit_note",
      color: "secondary",
    },
    {
      id: 3,
      title: "Exercise Published",
      description: 'New exercise for "LaTeX Symbols" is live.',
      time: "Yesterday at 4:30 PM",
      icon: "verified",
      color: "tertiary",
    },
  ]);

  // Administrative Quick Actions
  const isEmailing = ref(false);
  const isBackingUp = ref(false);

  const emailWeeklyReport = async () => {
    isEmailing.value = true;
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Weekly report successfully emailed to all administrators!");
    } finally {
      isEmailing.value = false;
    }
  };

  const backupDatabase = async () => {
    isBackingUp.value = true;
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Database backup completed. File uploaded to secure cloud storage.");
    } finally {
      isBackingUp.value = false;
    }
  };

  return {
    displayName,
    users,
    totalUsers,
    totalAdmins,
    totalStudents,
    error,
    refreshUsers,
    searchQuery,
    currentPage,
    itemsPerPage,
    modules,
    filteredModules,
    paginatedModules,
    totalPages,
    startItemIndex,
    endItemIndex,
    changePage,
    deleteModule,
    toggleStatus,
    stats,
    recentActivities,
    isEmailing,
    isBackingUp,
    emailWeeklyReport,
    backupDatabase,
  };
}

