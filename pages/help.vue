<script setup lang="ts">
import { ref } from "vue";
import { IconBook, IconCode, IconMessage2 } from "@tabler/icons-vue";

definePageMeta({
  layout: false,
});

const { role } = useAuth();
const searchQuery = ref("");
</script>

<template>
  <NuxtLayout :name="role === 'ADMIN' ? 'admin' : 'default'">
    <div class="space-y-10 py-2 sm:py-4">
      <!-- Header -->
      <HelpHeader v-model="searchQuery" />

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
        <HelpCategoryCard
          title="Dasar LaTeX"
          description="Pelajari preamble, syntax dasar matematika, sectioning, dan penyisipan objek dasar."
          :icon="IconBook"
          badge="Modul"
        />
        <HelpCategoryCard
          title="Editor & PDF"
          description="Panduan cara mengompilasi kode LaTeX ke PDF, download PDF, dan membaca log error."
          :icon="IconCode"
          badge="Editor"
        />
        <HelpCategoryCard
          title="Asisten AI"
          description="Cara menggunakan asisten AI untuk membetulkan syntax error secara instan."
          :icon="IconMessage2"
          badge="Gemini"
        />
      </div>

      <!-- Accordion FAQ -->
      <HelpFaqAccordion :searchQuery="searchQuery" />

      <!-- Contact Support -->
      <HelpContactCard />
    </div>
  </NuxtLayout>
</template>
