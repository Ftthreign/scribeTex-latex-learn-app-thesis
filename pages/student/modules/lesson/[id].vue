<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { IconArrowLeft } from '@tabler/icons-vue'
import { useModules } from '~/composables/useModules'
import LessonContent from '~/components/learn/LessonContent.vue'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const { currentLesson, loading, error, fetchLessonById } = useModules()

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
  <div class="w-full space-y-6">
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
  </div>
</template>

