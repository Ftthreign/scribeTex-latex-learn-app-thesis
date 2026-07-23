<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
  IconUser,
  IconHelp,
  IconHome,
  IconLogout,
  IconChevronDown,
  IconShieldCheck,
} from "@tabler/icons-vue";
import { ROUTES } from "~/constants/route";

const emit = defineEmits<{
  (e: "requestLogout"): void;
}>();

const { user, role, userProfile } = useAuth();
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const userInitials = computed(() => {
  const name = userProfile.value?.name || user.value?.email || "U";
  return name.substring(0, 2).toUpperCase();
});

const displayName = computed(() => {
  return (
    userProfile.value?.name ||
    user.value?.user_metadata?.full_name ||
    user.value?.email?.split("@")[0] ||
    "Pengguna"
  );
});

const displayEmail = computed(() => user.value?.email || "");

const profileRoute = computed(() => {
  return role.value === "ADMIN" ? ROUTES.admin.profile : ROUTES.student.profile;
});

const helpRoute = computed(() => {
  return role.value === "ADMIN" ? ROUTES.admin.help : ROUTES.student.help;
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const handleOutsideClick = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

const handleLogoutClick = () => {
  closeDropdown();
  emit("requestLogout");
};

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener("click", handleOutsideClick);
});
</script>

<template>
  <div ref="dropdownRef" class="relative inline-block text-left">
    <!-- Trigger Button -->
    <button
      @click="toggleDropdown"
      type="button"
      class="flex items-center gap-2 p-1 rounded-full hover:bg-surface-alt transition-colors cursor-pointer focus:outline-none"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <div
        class="size-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0 select-none shadow-xs"
      >
        {{ userInitials }}
      </div>
      <IconChevronDown
        class="size-4 text-text-secondary transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-64 rounded-xl bg-surface border border-border shadow-lg z-50 py-2 overflow-hidden font-sans"
      >
        <!-- User Info Header -->
        <div class="px-4 py-3 border-b border-border space-y-1">
          <div class="flex items-center justify-between gap-2">
            <p class="text-sm font-bold text-text-primary truncate">
              {{ displayName }}
            </p>
            <span
              class="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0"
              :class="
                role === 'ADMIN'
                  ? 'bg-emerald-600 text- dark:bg-emerald-900/30 dark:text-emerald-300'
                  : 'bg-primary-light text-primary'
              "
            >
              <IconShieldCheck class="size-3" />
              {{ role === "ADMIN" ? "Admin" : "Siswa" }}
            </span>
          </div>
          <p class="text-xs text-text-muted truncate">
            {{ displayEmail }}
          </p>
        </div>

        <!-- Links -->
        <div class="py-1">
          <NuxtLink
            :to="profileRoute"
            @click="closeDropdown"
            class="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-text-primary hover:bg-surface-alt hover:text-primary transition-colors"
          >
            <IconUser class="size-4 shrink-0 text-text-secondary" />
            Edit Profil
          </NuxtLink>

          <NuxtLink
            :to="helpRoute"
            @click="closeDropdown"
            class="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-text-primary hover:bg-surface-alt hover:text-primary transition-colors"
          >
            <IconHelp class="size-4 shrink-0 text-text-secondary" />
            Pusat Bantuan
          </NuxtLink>

          <NuxtLink
            :to="ROUTES.landing"
            @click="closeDropdown"
            class="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-text-primary hover:bg-surface-alt hover:text-primary transition-colors"
          >
            <IconHome class="size-4 shrink-0 text-text-secondary" />
            Beranda Utama
          </NuxtLink>
        </div>

        <!-- Logout -->
        <div class="pt-1 border-t border-border">
          <button
            @click="handleLogoutClick"
            type="button"
            class="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-error hover:bg-error-light transition-colors cursor-pointer text-left"
          >
            <IconLogout class="size-4 shrink-0 text-error" />
            Keluar Sesi
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
