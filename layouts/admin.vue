<script setup lang="ts">
import { ref } from "vue";
import {
  IconLayoutDashboard,
  IconBook,
  IconFileText,
  IconTrendingUp,
  IconLogout,
  IconMenu2,
  IconX,
  IconBell,
  IconSettings,
  IconPlus,
  IconHelp,
  IconHome,
  IconDatabase,
  IconChartBar,
  IconEye,
} from "@tabler/icons-vue";
import { ROUTES } from "~/constants/route";

const isSidebarOpen = ref(false);
const { logout } = useAuth();
const route = useRoute();

const menuItems = [
  {
    name: "Monitoring Dashboard",
    icon: IconChartBar,
    path: ROUTES.admin.dashboard,
  },
  {
    name: "Progress Siswa",
    icon: IconTrendingUp,
    path: ROUTES.admin.users,
  },
  {
    name: "Manajemen Konten",
    icon: IconDatabase,
    path: ROUTES.admin.content,
  },
];

const showLogoutModal = ref(false);
const handleLogout = () => {
  showLogoutModal.value = true;
};
const confirmLogout = async () => {
  showLogoutModal.value = false;
  await logout();
};
</script>

<template>
  <div
    class="h-screen overflow-hidden bg-(--color-bg) text-(--color-text-primary) flex font-body"
  >
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 flex flex-col bg-(--color-surface) border-r border-border',
        'transition-transform duration-300 ease-in-out w-55 shrink-0',
        'lg:sticky lg:top-0 lg:translate-x-0 lg:h-screen',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <div class="px-5 pt-5 pb-4 shrink-0">
        <NuxtLink
          :to="ROUTES.admin.dashboard"
          class="flex items-center gap-2.5"
        >
          <div
            class="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0"
          >
            ∑
          </div>
          <div>
            <p
              class="text-[15px] font-bold text-(--color-text-primary) leading-none"
            >
              ScribeTex
            </p>
            <p
              class="text-[11px] text-(--color-text-muted) mt-0.5 leading-none"
            >
              Academic Editor
            </p>
          </div>
        </NuxtLink>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto px-3 space-y-0.5">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-md text-[13.5px] transition-all duration-150',
            route.path === item.path
              ? 'bg-primary-light text-primary font-semibold'
              : 'font-medium text-text-secondary hover:bg-surface-alt hover:text-(--color-text-primary)',
          ]"
          @click="isSidebarOpen = false"
        >
          <component :is="item.icon" class="size-4.5 shrink-0" />
          {{ item.name }}
        </NuxtLink>
      </nav>

      <div class="px-4 py-4 shrink-0">
        <button
          class="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-hover text-white rounded-md py-2.5 text-[13px] font-semibold transition-colors cursor-pointer"
        >
          <IconPlus class="size-4 shrink-0" />
          New Project
        </button>
      </div>

      <!-- Kembali ke Beranda -->
      <div class="px-3 pb-2 shrink-0">
        <NuxtLink
          :to="ROUTES.landing"
          class="flex items-center gap-3 px-3 py-2.5 rounded-md text-[13.5px] font-medium text-text-secondary hover:bg-surface-alt hover:text-(--color-text-primary) transition-colors"
        >
          <IconHome class="size-4.5 shrink-0" />
          Beranda Utama
        </NuxtLink>
      </div>

      <!-- Footer -->
      <div class="shrink-0 border-t border-border px-3 py-3 space-y-0.5">
        <NuxtLink
          :to="ROUTES.admin.help"
          class="flex items-center gap-3 px-3 py-2.5 rounded-md text-[13.5px] font-medium text-text-secondary hover:bg-surface-alt hover:text-(--color-text-primary) transition-colors"
        >
          <IconHelp class="size-4.5 shrink-0" />
          Help
        </NuxtLink>
        <button
          @click="handleLogout"
          class="flex items-center gap-3 px-3 py-2.5 rounded-md text-[13.5px] font-medium text-(--color-error) hover:bg-error-light transition-colors cursor-pointer w-full text-left"
        >
          <IconLogout class="size-4.5 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>

    <Transition name="fade">
      <div
        v-if="isSidebarOpen"
        @click="isSidebarOpen = false"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
      />
    </Transition>

    <div class="flex-1 flex flex-col min-w-0 min-h-0 h-full">
      <header
        class="h-15 bg-(--color-surface) border-b border-border flex items-center justify-between px-5 lg:px-6 sticky top-0 z-30 shrink-0"
      >
        <div class="flex items-center gap-3">
          <button
            @click="isSidebarOpen = !isSidebarOpen"
            class="lg:hidden p-1.5 text-text-secondary hover:text-(--color-text-primary) transition-colors"
          >
            <IconMenu2 v-if="!isSidebarOpen" class="size-5" />
            <IconX v-else class="size-5" />
          </button>
          <span
            class="font-bold text-[17px] text-(--color-text-primary) tracking-tight"
            >ScribeTex</span
          >
        </div>
        <!-- Right -->
        <div class="flex items-center gap-1.5">
          <NuxtLink
            to="/student/modules"
            class="px-3 py-1.5 rounded-lg bg-primary-light text-primary hover:bg-primary/10 border border-primary/25 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer mr-1 shadow-2xs hover:-translate-y-0.5"
            title="Pratinjau antarmuka & materi kurikulum dari kacamata siswa"
          >
            <IconEye class="size-4 stroke-[2.5]" />
            <span class="hidden sm:inline">Pratinjau POV Siswa</span>
          </NuxtLink>
          <button
            class="p-2 text-text-secondary hover:text-(--color-text-primary) hover:bg-surface-alt rounded-lg transition-colors"
          >
            <IconBell class="size-5" />
          </button>
          <button
            class="p-2 text-text-secondary hover:text-(--color-text-primary) hover:bg-surface-alt rounded-lg transition-colors"
          >
            <IconSettings class="size-5" />
          </button>
          <DashboardHeaderProfileDropdown @requestLogout="handleLogout" />
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-5 lg:p-8 min-h-0">
        <slot />
      </main>
    </div>

    <!-- Logout Modal -->
    <UiModal
      :isOpen="showLogoutModal"
      title="Konfirmasi Keluar Sesi Admin"
      @close="showLogoutModal = false"
    >
      <p class="text-sm">
        Apakah Anda yakin ingin keluar dari Panel CMS ScribeTex? Sesi
        administrator Anda akan dihentikan.
      </p>
      <template #footer>
        <button
          @click="showLogoutModal = false"
          class="btn-secondary btn-md cursor-pointer"
        >
          Batal
        </button>
        <button @click="confirmLogout" class="btn-danger btn-md cursor-pointer">
          Keluar
        </button>
      </template>
    </UiModal>
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
