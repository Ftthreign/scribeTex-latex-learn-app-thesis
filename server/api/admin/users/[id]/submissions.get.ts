import { defineEventHandler, createError } from "h3";
import { prisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const userId = event.context.params?.id;

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID wajib disertakan.",
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "Pengguna tidak ditemukan.",
    });
  }

  const exerciseResults = await prisma.exerciseResult.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
    include: {
      exercise: {
        select: {
          id: true,
          instruction: true,
          lesson: {
            select: {
              id: true,
              title: true,
              module: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return {
    statusCode: 200,
    data: exerciseResults.map((res) => ({
      id: res.id,
      exercise_id: res.exercise_id,
      exercise_title: res.exercise?.instruction || "Latihan Praktik LaTeX",
      lesson_title: res.exercise?.lesson?.title || "Lesson Terkait",
      module_title: res.exercise?.lesson?.module?.title || "Modul Kurikulum",
      submitted_code: res.submitted_code,
      is_success: res.is_success,
      pdf_url: res.pdf_url,
      error_log: res.error_log,
      created_at: res.created_at.toISOString(),
    })),
  };
});
