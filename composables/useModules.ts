import { ref } from 'vue'

export interface LessonSummary {
  id: number
  title: string
  sort_order: number
}

export interface ModuleData {
  id: number
  title: string
  description: string
  sort_order: number
  is_published: boolean
  total_lessons: number
  completed_lessons?: number
  progress_percent?: number
  lessons: LessonSummary[]
}

export interface ExerciseData {
  id: number
  instruction: string
  starter_code: string
  solution_code?: string
}

export interface LessonDetail {
  id: number
  module_id: number
  title: string
  content: string
  sort_order: number
  is_published: boolean
  module: {
    id: number
    title: string
  }
  exercises: ExerciseData[]
  next_lesson?: { id: number; title: string } | null
  prev_lesson?: { id: number; title: string } | null
}

export const useModules = () => {
  const modules = ref<ModuleData[]>([])
  const currentModule = ref<ModuleData | null>(null)
  const currentLesson = ref<LessonDetail | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchModules = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<{ statusCode: number; data: ModuleData[] }>('/api/modules')
      modules.value = response.data
    } catch (e: any) {
      error.value = e?.statusMessage || 'Gagal mengambil daftar modul'
    } finally {
      loading.value = false
    }
  }

  const fetchModuleById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<{ statusCode: number; data: ModuleData }>(`/api/modules/${id}`)
      currentModule.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e?.statusMessage || 'Gagal mengambil detail modul'
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchLessonById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<{ statusCode: number; data: LessonDetail }>(`/api/lessons/${id}`)
      currentLesson.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e?.statusMessage || 'Gagal mengambil naskah materi'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    modules,
    currentModule,
    currentLesson,
    loading,
    error,
    fetchModules,
    fetchModuleById,
    fetchLessonById,
  }
}
