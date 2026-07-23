import { ref, computed } from 'vue'

export interface ExerciseDetail {
  id: number
  instruction: string
  starter_code: string
  solution_code: string
  lesson_id: number
  lesson_title: string
  module_id: number
  module_title: string
  module_sort_order?: number
}

export interface ExerciseSubmissionResult {
  id: number
  exercise_id: number
  submitted_code: string
  is_success: boolean
  created_at: string
}

export const useExercise = () => {
  const exercisesList = ref<ExerciseDetail[]>([])
  const currentExercise = ref<ExerciseDetail | null>(null)
  const userCode = ref<string>('')
  const starterCode = ref<string>('')
  // loading dimulai dari true agar skeleton tampil sebelum data tiba
  const loading = ref<boolean>(true)
  const submitting = ref<boolean>(false)
  const error = ref<string | null>(null)
  const submissionResult = ref<ExerciseSubmissionResult | null>(null)

  // Mengambil daftar seluruh 16 latihan dari API /api/exercises
  const fetchExercises = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<{ statusCode: number; data: ExerciseDetail[] }>(
        '/api/exercises'
      )
      if (response?.data) {
        exercisesList.value = response.data
      }
      return response?.data ?? []
    } catch (e: any) {
      error.value = e?.data?.statusMessage || e?.statusMessage || 'Gagal mengambil daftar latihan'
      return []
    } finally {
      loading.value = false
    }
  }

  // Computed state untuk mendeteksi apakah kode telah diubah dari starter_code
  const isDirty = computed(() => {
    return userCode.value.trim() !== starterCode.value.trim()
  })

  // Mengambil detail latihan berdasarkan ID dari API /api/exercises/[id]
  const fetchExerciseById = async (id: number) => {
    loading.value = true
    error.value = null
    submissionResult.value = null
    try {
      const response = await $fetch<{ statusCode: number; data: ExerciseDetail }>(
        `/api/exercises/${id}`
      )
      if (response?.data) {
        currentExercise.value = response.data
        starterCode.value = response.data.starter_code || ''
        userCode.value = response.data.starter_code || ''
        return response.data
      }
      return null
    } catch (e: any) {
      error.value = e?.data?.statusMessage || e?.statusMessage || 'Gagal mengambil data latihan'
      return null
    } finally {
      loading.value = false
    }
  }

  // Meng-update koding pengguna dari editor CodeMirror
  const updateCode = (newCode: string) => {
    userCode.value = newCode
  }

  // Mengembalikan kode ke starter_code awal
  const resetCode = () => {
    userCode.value = starterCode.value
  }

  // Mengirim jawaban pengerjaan ke Nitro API /api/exercises/[id]/submit
  const submitSolution = async (isSuccess: boolean = true, errorLog: string | null = null) => {
    if (!currentExercise.value) return null
    submitting.value = true
    error.value = null
    try {
      const response = await $fetch<{
        statusCode: number
        message: string
        data: ExerciseSubmissionResult
      }>(`/api/exercises/${currentExercise.value.id}/submit`, {
        method: 'POST',
        body: {
          submitted_code: userCode.value,
          is_success: isSuccess,
          error_log: errorLog,
        },
      })
      submissionResult.value = response.data
      return response.data
    } catch (e: any) {
      error.value = e?.data?.statusMessage || e?.statusMessage || 'Gagal menyimpan jawaban latihan'
      return null
    } finally {
      submitting.value = false
    }
  }

  return {
    exercisesList,
    currentExercise,
    userCode,
    starterCode,
    isDirty,
    loading,
    submitting,
    error,
    submissionResult,
    fetchExercises,
    fetchExerciseById,
    updateCode,
    resetCode,
    submitSolution,
  }
}
