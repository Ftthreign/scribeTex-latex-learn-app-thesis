<template>
  <header
    ref="navbarRef"
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-15 bg-surface border-b border-border flex items-center"
    :class="{ 'shadow-sm bg-surface/95 backdrop-blur-md': isScrolled }"
  >
    <div
      class="container mx-auto px-6 h-full flex items-center justify-between"
    >
      <a href="#" class="flex items-center gap-2.5 group cursor-pointer">
        <div
          class="size-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm group-hover:rotate-6 transition-transform duration-300"
        >
          <IconMathIntegrals class="size-5" stroke-width="2.5" />
        </div>
        <span class="text-xl font-display font-bold tracking-tight">
          <span class="text-text-primary">Scribe</span
          ><span class="text-primary">Tex</span>
        </span>
      </a>

      <nav class="hidden lg:flex items-center gap-8 font-medium">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="text-text-secondary hover:text-primary transition-colors text-[14px] font-sans relative py-1 group"
        >
          {{ link.label }}
          <span
            class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"
          ></span>
        </a>
      </nav>

      <div class="hidden lg:flex items-center gap-4">
        <button
          v-if="user"
          class="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-surface-alt transition-colors relative cursor-pointer"
          aria-label="Notifikasi"
        >
          <IconBell class="size-5" />
          <span
            class="absolute top-1.5 right-1.5 size-2 bg-warning rounded-full border border-surface"
          ></span>
        </button>

        <div v-if="user" class="h-4 w-px bg-border"></div>

        <template v-if="user">
          <span class="text-[13px] font-medium text-text-secondary mr-1">
            Halo,
            <strong class="text-text-primary font-bold">{{
              userProfile?.name || user.email?.split("@")[0]
            }}</strong>
          </span>
          <NuxtLink
            :to="
              role === 'ADMIN'
                ? ROUTES.admin.dashboard
                : ROUTES.student.dashboard
            "
            class="btn-primary btn-sm shadow-sm shadow-primary/20"
          >
            Ke Dashboard
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="btn-ghost btn-sm">Masuk</NuxtLink>
          <NuxtLink
            to="/register"
            class="btn-primary btn-sm shadow-sm shadow-primary/20"
          >
            Mulai Belajar
          </NuxtLink>
        </template>
      </div>

      <button
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="lg:hidden p-1.5 rounded-md hover:bg-surface-alt transition-colors text-text-secondary cursor-pointer"
        aria-label="Menu"
      >
        <IconMenu2 v-if="!isMobileMenuOpen" class="size-6" />
        <IconX v-else class="size-6" />
      </button>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden absolute top-full left-0 right-0 bg-surface border-b border-border shadow-lg"
      >
        <div class="p-4 space-y-4">
          <div class="flex flex-col gap-2">
            <a
              v-for="link in navLinks"
              :key="link.href"
              :href="link.href"
              @click="isMobileMenuOpen = false"
              class="px-4 py-2.5 rounded-md text-[15px] font-medium text-text-secondary hover:bg-surface-alt hover:text-primary transition-colors block"
            >
              {{ link.label }}
            </a>
          </div>
          <div class="h-px bg-border w-full"></div>
          <div class="flex flex-col gap-2 p-2">
            <template v-if="user">
              <NuxtLink
                :to="
                  role === 'ADMIN'
                    ? ROUTES.admin.dashboard
                    : ROUTES.student.dashboard
                "
                class="btn-primary btn-md w-full justify-center"
                @click="isMobileMenuOpen = false"
              >
                Ke Dashboard
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink
                to="/login"
                class="btn-ghost btn-md w-full justify-center"
                @click="isMobileMenuOpen = false"
              >
                Masuk
              </NuxtLink>
              <NuxtLink
                to="/register"
                class="btn-primary btn-md w-full justify-center"
                @click="isMobileMenuOpen = false"
              >
                Mulai Belajar
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import {
  IconMathIntegrals,
  IconBell,
  IconMenu2,
  IconX,
} from "@tabler/icons-vue";
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { ROUTES } from "~/constants/route";

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);
const navbarRef = ref<HTMLElement | null>(null);

const { user, role, userProfile } = useAuth();

const navLinks = [
  { label: "Fitur", href: "#features" },
  { label: "Keunggulan", href: "#comparison" },
  { label: "Cara Kerja", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);

  gsap.fromTo(
    navbarRef.value!,
    { y: -60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      delay: 0.1,
    },
  );
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
