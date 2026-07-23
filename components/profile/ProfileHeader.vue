<script setup lang="ts">
import { computed } from "vue";
import { IconShieldCheck, IconMail, IconCalendar } from "@tabler/icons-vue";

const { user, role, userProfile } = useAuth();

const displayName = computed(() => {
  return (
    userProfile.value?.name ||
    user.value?.user_metadata?.full_name ||
    user.value?.email?.split("@")[0] ||
    "Pengguna"
  );
});

const userInitials = computed(() => {
  return displayName.value.substring(0, 2).toUpperCase();
});

const joinedDate = computed(() => {
  const dateStr = userProfile.value?.created_at || user.value?.created_at;
  if (!dateStr) return "Baru Bergabung";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
});
</script>

<template>
  <div
    class="relative rounded-2xl bg-linear-to-r from-primary to-primary-hover p-6 sm:p-8 text-white shadow-(--shadow-card) overflow-hidden font-sans"
  >
    <!-- Background Decorative Glow -->
    <div
      class="absolute -right-10 -bottom-10 size-48 rounded-full bg-white/10 blur-2xl pointer-events-none"
    />

    <div
      class="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left"
    >
      <!-- Avatar Circle -->
      <div
        class="size-20 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-white text-2xl font-bold font-display shrink-0 shadow-inner"
      >
        {{ userInitials }}
      </div>

      <div class="space-y-2 flex-1 min-w-0">
        <div class="flex flex-col sm:flex-row items-center gap-2.5">
          <h1
            class="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white truncate"
          >
            {{ displayName }}
          </h1>
          <span
            class="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white shrink-0"
          >
            <IconShieldCheck class="size-3.5" />
            {{ role === "ADMIN" ? "Administrator" : "Siswa" }}
          </span>
        </div>

        <div
          class="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-white/80"
        >
          <span class="flex items-center gap-1.5">
            <IconMail class="size-4 shrink-0 text-white/70" />
            {{ user?.email }}
          </span>
          <span class="flex items-center gap-1.5">
            <IconCalendar class="size-4 shrink-0 text-white/70" />
            Anggota sejak {{ joinedDate }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
