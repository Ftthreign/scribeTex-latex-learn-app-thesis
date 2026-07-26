import { ref, computed } from "vue";

export interface ExerciseDetail {
  id: number;
  instruction: string;
  starter_code: string;
  solution_code: string;
  lesson_id: number;
  lesson_title: string;
  module_id: number;
  module_title: string;
  module_sort_order?: number;
  is_locked?: boolean;
  lock_reason?: "module_locked" | "lesson_not_completed" | null;
}

export interface ExerciseSubmissionResult {
  id: number;
  exercise_id: number;
  submitted_code: string;
  is_success: boolean;
  is_match?: boolean;
  pdf_url?: string | null;
  next_lesson_id?: number | null;
  created_at: string;
}

export const useExercise = () => {
  const exercisesList = ref<ExerciseDetail[]>([]);
  const currentExercise = ref<ExerciseDetail | null>(null);
  const userCode = ref<string>("");
  const starterCode = ref<string>("");
  const loading = ref<boolean>(true);
  const submitting = ref<boolean>(false);
  const error = ref<string | null>(null);
  const submissionResult = ref<ExerciseSubmissionResult | null>(null);
  const userSuccessResult = ref<ExerciseSubmissionResult | null>(null);
  const compiling = ref<boolean>(false);
  const pdfBase64 = ref<string | null>(null);
  const compileError = ref<string | null>(null);
  const compileLogs = ref<any[] | null>(null);

  const fetchExercises = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await $fetch<{
        statusCode: number;
        data: ExerciseDetail[];
      }>("/api/exercises");
      if (response?.data) {
        exercisesList.value = response.data;
      }
      return response?.data ?? [];
    } catch (e: any) {
      error.value =
        e?.data?.statusMessage ||
        e?.statusMessage ||
        "Gagal mengambil daftar latihan";
      return [];
    } finally {
      loading.value = false;
    }
  };

  const isDirty = computed(() => {
    return userCode.value.trim() !== starterCode.value.trim();
  });

  const fetchExerciseById = async (id: number) => {
    loading.value = true;
    error.value = null;
    submissionResult.value = null;
    pdfBase64.value = null;
    compileError.value = null;
    try {
      const response = await $fetch<{
        statusCode: number;
        data: ExerciseDetail;
      }>(`/api/exercises/${id}`);
      if (response?.data) {
        currentExercise.value = response.data;
        starterCode.value = response.data.starter_code || "";
        userCode.value = response.data.starter_code || "";
        return response.data;
      }
      return null;
    } catch (e: any) {
      error.value =
        e?.data?.statusMessage ||
        e?.statusMessage ||
        "Gagal mengambil data latihan";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateCode = (newCode: string) => {
    userCode.value = newCode;
  };

  const resetCode = () => {
    userCode.value = starterCode.value;
    pdfBase64.value = null;
    compileError.value = null;
  };

  const compileCode = async () => {
    if (!userCode.value || !userCode.value.trim()) return false;
    compiling.value = true;
    compileError.value = null;
    pdfBase64.value = null;
    compileLogs.value = null;

    try {
      const res = await $fetch<{
        statusCode: number;
        data: {
          isSuccess: boolean;
          pdfBase64?: string;
          errorText?: string;
          logs?: any[];
        };
      }>("/api/compile", {
        method: "POST",
        body: { code: userCode.value },
      });

      if (res?.data?.isSuccess && res.data.pdfBase64) {
        pdfBase64.value = res.data.pdfBase64;
        compileLogs.value = res.data.logs || [];
        return true;
      } else {
        compileError.value = res?.data?.errorText || "Galat kompilasi TeXLive";
        compileLogs.value = res?.data?.logs || [];
        return false;
      }
    } catch (e: any) {
      compileError.value =
        e?.data?.statusMessage ||
        e?.data?.message ||
        "Gagal terhubung ke layanan kompilasi LaTeX";
      return false;
    } finally {
      compiling.value = false;
    }
  };

  const submitSolution = async (
    isSuccess: boolean = true,
    errorLog: string | null = null,
    pdfBase64Data: string | null = null,
  ) => {
    if (!currentExercise.value) return null;
    submitting.value = true;
    error.value = null;
    try {
      const response = await $fetch<{
        statusCode: number;
        message: string;
        data: ExerciseSubmissionResult;
      }>(`/api/exercises/${currentExercise.value.id}/submit`, {
        method: "POST",
        body: {
          submitted_code: userCode.value,
          is_success: isSuccess,
          error_log: errorLog,
          pdf_base64: pdfBase64Data || pdfBase64.value,
        },
      });
      submissionResult.value = response.data;
      return response.data;
    } catch (e: any) {
      error.value =
        e?.data?.statusMessage ||
        e?.statusMessage ||
        "Gagal menyimpan jawaban latihan";
      return null;
    } finally {
      submitting.value = false;
    }
  };

  const userSuccessHistory = ref<ExerciseSubmissionResult[]>([]);

  const fetchSuccessResult = async (exerciseId: number) => {
    try {
      const res = await $fetch<{
        statusCode: number;
        data: ExerciseSubmissionResult | null;
        latest: ExerciseSubmissionResult | null;
        history: ExerciseSubmissionResult[];
      }>(`/api/exercises/${exerciseId}/result`);
      userSuccessResult.value = res?.latest || res?.data || null;
      userSuccessHistory.value = res?.history || [];
      return res?.latest || res?.data || null;
    } catch {
      userSuccessResult.value = null;
      userSuccessHistory.value = [];
      return null;
    }
  };

  return {
    exercisesList,
    currentExercise,
    userCode,
    starterCode,
    isDirty,
    loading,
    submitting,
    compiling,
    pdfBase64,
    compileError,
    compileLogs,
    error,
    submissionResult,
    userSuccessResult,
    userSuccessHistory,
    fetchExercises,
    fetchExerciseById,
    fetchSuccessResult,
    updateCode,
    resetCode,
    compileCode,
    submitSolution,
  };
};
