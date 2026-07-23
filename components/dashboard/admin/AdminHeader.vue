<script setup lang="ts">
import { IconPlus } from "@tabler/icons-vue";

defineProps<{
  title?: string;
  subtitle?: string;
}>();

const emit = defineEmits<{
  (e: "add-module"): void;
}>();
</script>

<template>
  <header
    class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
  >
    <div>
      <h1
        class="text-[30px] font-bold text-(--color-text-primary) font-display tracking-tight leading-tight"
      >
        <slot name="title">{{ title || "Admin Dashboard" }}</slot>
      </h1>
      <p
        class="text-text-secondary text-[14px] mt-1.5 leading-relaxed font-body"
      >
        {{ subtitle || "Manage modules, students, and platform performance." }}
      </p>
    </div>

    <button
      @click="emit('add-module')"
      class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold text-[13.5px] rounded-md border border-transparent shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer shrink-0"
    >
      <IconPlus class="size-4 shrink-0" />
      <span>Tambah Modul</span>
    </button>
  </header>
</template>
