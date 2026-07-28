<script setup lang="ts">
import { computed } from "vue";
import { IconEye, IconLayoutDashboard } from "@tabler/icons-vue";

const { role } = useAuth();
const route = useRoute();
const router = useRouter();

const isAdmin = computed(() => role.value === "ADMIN");
const isStudentRoute = computed(
  () => route.path.startsWith("/student") || route.path === "/help",
);

function returnToAdmin() {
  router.push("/admin/dashboard");
}
</script>

<template>
  <div
    v-if="isAdmin && isStudentRoute"
    class="sticky top-0 z-50 w-full bg-primary-light/95 border-b border-primary/25 backdrop-blur-md px-4 py-2.5 shadow-xs font-sans transition-all duration-300"
  >
    <div
      class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs"
    >
      <div class="flex items-center gap-2 text-primary font-medium">
        <span
          class="px-2.5 py-0.5 rounded-full bg-primary text-white font-bold text-[10.5px] uppercase tracking-wider flex items-center gap-1 shadow-2xs"
        >
          <IconEye class="size-3.5 stroke-[2.5]" />
          <span>Mode Pratinjau Admin</span>
        </span>
        <span class="hidden md:inline text-text-secondary text-[11.5px]">
          Anda sedang mengakses tampilan kurikulum dari POV siswa. Seluruh modul & latihan
          <strong class="text-primary font-bold">100% Terbuka (Unlocked)</strong> tanpa pelacakan progres.
        </span>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <button
          @click="returnToAdmin"
          class="btn-primary btn-sm font-bold flex items-center gap-1.5 cursor-pointer shadow-xs hover:scale-[1.02] active:scale-95 transition-all"
        >
          <IconLayoutDashboard class="size-3.5" />
          <span>Kembali ke Panel Admin</span>
        </button>
      </div>
    </div>
  </div>
</template>
