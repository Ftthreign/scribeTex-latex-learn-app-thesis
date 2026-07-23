<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { IconArrowLeft, IconSparkles } from '@tabler/icons-vue'
import { useModules } from '~/composables/useModules'
import { useAiChat } from '~/composables/useAiChat'
import LessonContent from '~/components/learn/LessonContent.vue'
import AiChatDrawer from '~/components/sandbox/AiChatDrawer.vue'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const { currentLesson, loading, error, fetchLessonById } = useModules()

// ─── AI Chat State (Inkremen 5) ─────────────────────────────────────────────
const {
  isOpen: isAiOpen,
  messages: aiMessages,
  savedHistory: aiSavedHistory,
  loading: aiLoading,
  historyLoading: aiHistoryLoading,
  toggleDrawer: toggleAiDrawer,
  fetchHistory: fetchAiHistory,
  loadHistoryIntoChat: loadAiHistoryIntoChat,
  loadSingleHistoryItem: loadSingleAiHistoryItem,
  sendMessage: sendAiMessage,
  clearChat: clearAiChat,
} = useAiChat()

const loadLessonData = async (id: number) => {
  if (!isNaN(id)) {
    const data = await fetchLessonById(id)
    if (data) {
      useHead({ title: `${data.title} | ScribeTex` })
    }
  }
}

onMounted(async () => {
  const lessonId = Number(route.params.id)
  await loadLessonData(lessonId)
})

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await loadLessonData(Number(newId))
    }
  }
)

const handleNavigate = (targetLessonId: number) => {
  router.push(`/student/modules/lesson/${targetLessonId}`)
}

const handleStartExercise = (exerciseId: number) => {
  router.push(`/student/exercises/${exerciseId}`)
}
</script>

<template>
  <!-- w-full agar mengisi seluruh lebar main layout tanpa max-w pembatas -->
  <div class="w-full space-y-6 relative">
    <!-- Tombol Kembali ke Modul -->
    <button
      v-if="currentLesson?.module"
      @click="router.push(`/student/modules/${currentLesson.module.id}`)"
      class="flex items-center gap-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
    >
      <IconArrowLeft class="size-4" />
      Kembali ke Modul {{ currentLesson.module.title }}
    </button>

    <!-- State Loading -->
    <div v-if="loading" class="flex gap-8">
      <div class="flex-1 space-y-4">
        <div class="h-10 w-2/3 bg-border/40 rounded-lg animate-pulse"></div>
        <div class="h-1.5 w-full bg-border/40 rounded-full animate-pulse"></div>
        <div class="h-96 bg-border/40 rounded-xl animate-pulse"></div>
      </div>
      <div class="hidden xl:block w-56 h-64 bg-border/40 rounded-xl animate-pulse"></div>
    </div>

    <!-- State Error -->
    <div v-else-if="error" class="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
      {{ error }}
    </div>

    <!-- Konten Materi Utama -->
    <LessonContent
      v-else-if="currentLesson"
      :lesson="currentLesson"
      @navigate="handleNavigate"
      @start-exercise="handleStartExercise"
    />

    <!-- Floating Action Button (FAB) Pembimbing AI di Pojok Kanan Bawah Halaman Materi -->
    <div class="fixed bottom-6 right-6 z-40">
      <button
        @click="toggleAiDrawer(true)"
        class="btn-primary btn-md gap-2 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 border border-white/20 transition-all cursor-pointer font-bold"
        title="Buka Chatbot Pembimbing Cerdas AI"
      >
        <IconSparkles class="size-5 animate-pulse" />
        <span>Pembimbing AI</span>
      </button>
    </div>

    <!-- Drawer Chatbot AI (Inkremen 5) -->
    <ClientOnly>
      <AiChatDrawer
        :isOpen="isAiOpen"
        :messages="aiMessages"
        :savedHistory="aiSavedHistory"
        :loading="aiLoading"
        :historyLoading="aiHistoryLoading"
        :codeContext="currentLesson?.content"
        @close="toggleAiDrawer(false)"
        @send="sendAiMessage"
        @clear="clearAiChat"
        @fetchHistory="fetchAiHistory"
        @loadHistory="loadAiHistoryIntoChat"
        @selectHistory="loadSingleAiHistoryItem"
      />
    </ClientOnly>
  </div>
</template>
