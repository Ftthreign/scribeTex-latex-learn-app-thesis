<script setup lang="ts">
import { IconBooks, IconFileText, IconCode, IconArticle } from "@tabler/icons-vue";

type TabKey = "modules" | "lessons" | "exercises" | "articles";

const activeTab = defineModel<TabKey>("activeTab");

const tabs = [
  { key: "modules" as TabKey, label: "Modul Kurikulum", icon: IconBooks },
  { key: "lessons" as TabKey, label: "Materi Lesson", icon: IconFileText },
  { key: "exercises" as TabKey, label: "Latihan Praktik", icon: IconCode },
  { key: "articles" as TabKey, label: "Artikel Panduan", icon: IconArticle },
];
</script>

<template>
  <div class="gsap-admin-content-tabs grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-body">
    <button
      v-for="t in tabs"
      :key="t.key"
      @click="activeTab = t.key"
      :class="[
        'flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-xs font-bold transition-all duration-200 cursor-pointer shadow-2xs font-sans',
        activeTab === t.key
          ? 'bg-primary-light text-primary border-primary/30 shadow-xs'
          : 'bg-surface hover:bg-surface-alt text-text-secondary border-border hover:text-(--color-text-primary)'
      ]"
    >
      <component :is="t.icon" class="size-4.5 shrink-0 text-primary" />
      <span>{{ t.label }}</span>
    </button>
  </div>
</template>
