<script setup lang="ts">
import { computed } from "vue";
import { IconShieldCheck, IconClock, IconCircleCheck } from "@tabler/icons-vue";

const { user, role, userProfile } = useAuth();

const lastSignDate = computed(() => {
  const dateStr = user.value?.last_sign_in_at || userProfile.value?.updated_at;
  if (!dateStr) return "Aktif saat ini";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});
</script>

<template>
  <div
    class="bg-(--color-surface) border border-border rounded-2xl p-6 space-y-5 shadow-(--shadow-card) font-sans"
  >
    <div class="space-y-1">
      <h3 class="text-base font-bold font-display text-(--color-text-primary)">
        Ringkasan Akun
      </h3>
      <p class="text-xs text-text-secondary">
        Status keamanan dan rincian identifikasi sesi.
      </p>
    </div>

    <div class="space-y-3.5 text-xs">
      <div
        class="flex items-center justify-between p-3 rounded-xl bg-surface-alt"
      >
        <span class="flex items-center gap-2 text-text-secondary font-medium">
          <IconCircleCheck class="size-4 text-success" />
          Status Akun
        </span>
        <span class="font-bold text-success">Terverifikasi</span>
      </div>

      <!-- User Role -->
      <div
        class="flex items-center justify-between p-3 rounded-xl bg-surface-alt"
      >
        <span class="flex items-center gap-2 text-text-secondary font-medium">
          <IconShieldCheck class="size-4 text-primary" />
          Hak Akses
        </span>
        <span class="font-bold text-(--color-text-primary)">
          {{ role === "ADMIN" ? "Administrator" : "Siswa" }}
        </span>
      </div>

      <!-- Last Active -->
      <div
        class="flex items-center justify-between p-3 rounded-xl bg-surface-alt"
      >
        <span class="flex items-center gap-2 text-text-secondary font-medium">
          <IconClock class="size-4 text-(--color-text-muted)" />
          Sesi Terakhir
        </span>
        <span class="font-medium text-text-secondary">
          {{ lastSignDate }}
        </span>
      </div>
    </div>
  </div>
</template>
