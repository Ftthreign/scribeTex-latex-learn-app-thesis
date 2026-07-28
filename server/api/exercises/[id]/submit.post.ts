import { defineEventHandler, createError, readBody } from "h3";
import {
  serverSupabaseUser,
  serverSupabaseClient,
  serverSupabaseServiceRole,
} from "#supabase/server";
import { prisma } from "~~/server/utils/prisma";
import { uploadExercisePdfToSupabase } from "~~/server/utils/supabaseStorage";

function normalizeLatexCode(code: string): string {
  if (!code) return "";
  return code
    .replace(/%.*$/gm, "") // Hapus komentar LaTeX (% ...)
    .replace(/\s+/g, " ") // Padatkan seluruh whitespace & newline menjadi 1 spasi
    .trim();
}

export default defineEventHandler(async (event) => {
  const supabaseUser = await serverSupabaseUser(event);

  if (!supabaseUser) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const userId = supabaseUser.id;
  const idParam = event.context.params?.id;
  const exerciseId = Number(idParam);

  if (isNaN(exerciseId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID Latihan tidak valid",
    });
  }

  const body = await readBody(event);
  const { submitted_code, is_success, error_log, pdf_base64 } = body || {};

  if (!submitted_code || typeof submitted_code !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "Kode jawaban (submitted_code) wajib diisi",
    });
  }

  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
    include: { lesson: true },
  });

  if (!exercise) {
    throw createError({
      statusCode: 404,
      statusMessage: "Soal latihan tidak ditemukan",
    });
  }

  const normalizedSubmitted = normalizeLatexCode(submitted_code);
  const normalizedSolution = normalizeLatexCode(exercise.solution_code);

  let isMatch = false;
  if (normalizedSolution) {
    isMatch = normalizedSubmitted === normalizedSolution;
  } else {
    // Fallback jika admin belum mengisi solution_code
    isMatch = Boolean(is_success);
  }

  let nextLessonId: number | null = null;

  if (isMatch && exercise.lesson_id) {
    await prisma.userProgress.upsert({
      where: {
        user_id_lesson_id: {
          user_id: userId,
          lesson_id: exercise.lesson_id,
        },
      },
      update: { is_completed: true },
      create: {
        user_id: userId,
        lesson_id: exercise.lesson_id,
        is_completed: true,
      },
    });

    // Cari lesson berikutnya dalam modul yang sama
    const nextLesson = await prisma.lesson.findFirst({
      where: {
        module_id: exercise.lesson.module_id,
        sort_order: { gt: exercise.lesson.sort_order },
      },
      orderBy: { sort_order: "asc" },
    });
    nextLessonId = nextLesson?.id || null;
  }

  // 4. Unggah PDF ke Supabase Object Storage jika jawaban tepat & pdf_base64 tersedia
  let pdfUrl: string | null = null;
  if (isMatch) {
    if (
      pdf_base64 &&
      typeof pdf_base64 === "string" &&
      pdf_base64.trim().length > 0
    ) {
      try {
        let supabase;
        try {
          supabase = await serverSupabaseServiceRole(event);
        } catch {
          supabase = await serverSupabaseClient(event);
        }
        pdfUrl = await uploadExercisePdfToSupabase(
          supabase,
          userId,
          exerciseId,
          pdf_base64,
        );
      } catch (uploadErr) {
        console.warn(
          "[SubmitExercise] Gagal mengunggah PDF ke Supabase Storage:",
          uploadErr,
        );
      }
    } else {
      console.warn(
        "[SubmitExercise] Jawaban tepat tetapi pdf_base64 tidak dikirim dari client.",
      );
    }
  }

  // 5. Simpan hasil pengerjaan koding mahasiswa ke tabel exercise_results
  const result = await prisma.exerciseResult.create({
    data: {
      user_id: userId,
      exercise_id: exerciseId,
      submitted_code: submitted_code,
      is_success: isMatch,
      pdf_url: pdfUrl,
      error_log: isMatch
        ? null
        : error_log || "Kode jawaban belum sesuai dengan kode solusi.",
    },
  });

  return {
    statusCode: 200,
    message: isMatch
      ? "Selamat! Kode jawaban Anda 100% tepat dan sesuai dengan solusi."
      : "Jawaban Anda belum sesuai dengan kode solusi. Silakan periksa kembali.",
    data: {
      ...result,
      is_match: isMatch,
      next_lesson_id: nextLessonId,
    },
  };
});
