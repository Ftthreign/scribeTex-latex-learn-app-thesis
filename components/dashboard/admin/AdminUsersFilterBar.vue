<script setup lang="ts">
import { IconSearch } from "@tabler/icons-vue";

const searchQuery = defineModel<string>("searchQuery");
const roleFilter = defineModel<"ALL" | "STUDENT" | "ADMIN">("roleFilter");
const progressFilter = defineModel<"ALL" | "ACTIVE" | "INACTIVE">("progressFilter");
</script>

<template>
  <div class="gsap-admin-users-filter flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between font-body">
    <div class="relative flex-1 max-w-md w-full font-sans">
      <IconSearch class="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-(--color-text-muted)" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari nama atau email mahasiswa..."
        class="w-full pl-10 pr-4 py-2 bg-(--color-surface) border border-border rounded-xl text-xs font-semibold text-(--color-text-primary) placeholder:text-(--color-text-muted) outline-none focus:border-primary transition-all shadow-2xs"
      />
    </div>

    <div class="flex items-center gap-2 flex-wrap font-sans">
      <select
        v-model="roleFilter"
        class="px-3 py-2 bg-(--color-surface) border border-border rounded-xl text-xs font-semibold text-(--color-text-primary) outline-none focus:border-primary transition-all shadow-2xs cursor-pointer"
      >
        <option value="ALL">Semua Peran (Role)</option>
        <option value="STUDENT">Mahasiswa (STUDENT)</option>
        <option value="ADMIN">Administrator (ADMIN)</option>
      </select>

      <select
        v-model="progressFilter"
        class="px-3 py-2 bg-(--color-surface) border border-border rounded-xl text-xs font-semibold text-(--color-text-primary) outline-none focus:border-primary transition-all shadow-2xs cursor-pointer"
      >
        <option value="ALL">Semua Status Progres</option>
        <option value="ACTIVE">Sudah Mulai Belajar (>0%)</option>
        <option value="INACTIVE">Belum Memulai (0%)</option>
      </select>
    </div>
  </div>
</template>
