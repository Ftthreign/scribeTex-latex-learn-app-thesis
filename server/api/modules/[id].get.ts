import { defineEventHandler, createError } from "h3";
import { serverSupabaseUser } from "#supabase/server";
import { prisma } from "~~/server/utils/prisma";
import { checkModuleAccess } from "~~/server/utils/accessControl";

export default defineEventHandler(async (event) => {
  const idParam = event.context.params?.id;
  const id = Number(idParam);

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID Modul tidak valid",
    });
  }

  const supabaseUser = await serverSupabaseUser(event).catch(() => null);
  let completedLessonIds = new Set<number>();
  let userRole = "STUDENT";

  if (supabaseUser) {
    const dbUser = await prisma.user.findUnique({
      where: { id: supabaseUser.id },
      select: { role: true },
    });
    if (dbUser) userRole = dbUser.role;

    const userProgress = await prisma.userProgress.findMany({
      where: { user_id: supabaseUser.id, is_completed: true },
      select: { lesson_id: true },
    });
    completedLessonIds = new Set(userProgress.map((p) => p.lesson_id));
  }

  const moduleData = await prisma.module.findUnique({
    where: { id },
    include: {
      lessons: {
        where: { is_published: true },
        orderBy: { sort_order: "asc" },
        select: {
          id: true,
          title: true,
          sort_order: true,
        },
      },
    },
  });

  if (!moduleData || !moduleData.is_published) {
    throw createError({
      statusCode: 404,
      statusMessage: "Modul tidak ditemukan",
    });
  }

  // Cek apakah modul ini terkunci bagi user
  let isModuleLocked = false;
  let moduleLockReason = "";
  if (supabaseUser) {
    const moduleCheck = await checkModuleAccess(supabaseUser.id, userRole, id);
    isModuleLocked = !moduleCheck.canAccess;
    moduleLockReason = moduleCheck.reason || "";
  }

  const formattedLessons = moduleData.lessons.map((lesson, idx) => {
    const isCompleted = completedLessonIds.has(lesson.id);
    const prevLesson = moduleData.lessons[idx - 1];

    let isLocked = false;
    let lockReason = "";

    if (userRole !== "ADMIN") {
      if (isModuleLocked) {
        isLocked = true;
        lockReason = moduleLockReason || "Modul ini masih terkunci.";
      } else if (
        idx > 0 &&
        prevLesson &&
        !completedLessonIds.has(prevLesson.id)
      ) {
        isLocked = true;
        lockReason = `Selesaikan Bab ${prevLesson.sort_order} ("${prevLesson.title}") terlebih dahulu.`;
      }
    }

    return {
      id: lesson.id,
      title: lesson.title,
      sort_order: lesson.sort_order,
      is_completed: isCompleted,
      is_locked: isLocked,
      lock_reason: lockReason,
    };
  });

  const totalLessons = moduleData.lessons.length;
  const completedCount = formattedLessons.filter((l) => l.is_completed).length;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return {
    statusCode: 200,
    data: {
      id: moduleData.id,
      title: moduleData.title,
      description: moduleData.description,
      sort_order: moduleData.sort_order,
      is_published: moduleData.is_published,
      total_lessons: totalLessons,
      completed_lessons: completedCount,
      progress_percent: progressPercent,
      is_locked: isModuleLocked,
      lock_reason: moduleLockReason,
      lessons: formattedLessons,
    },
  };
});
