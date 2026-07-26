import { defineEventHandler, createError, getHeader } from "h3";
import { serverSupabaseUser } from "#supabase/server";
import { prisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const supabaseUser = await serverSupabaseUser(event);

  if (!supabaseUser) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const userId = supabaseUser.id;

  const allModules = await prisma.module.findMany({
    where: { is_published: true },
    orderBy: { sort_order: "asc" },
    include: {
      lessons: {
        where: { is_published: true },
        select: { id: true, sort_order: true },
        orderBy: { sort_order: "asc" },
      },
    },
  });

  const totalLessons = allModules.reduce((acc, m) => acc + m.lessons.length, 0);

  const userProgress = await prisma.userProgress.findMany({
    where: { user_id: userId },
    select: { lesson_id: true, is_completed: true },
  });

  const completedLessonIds = new Set(
    userProgress.filter((p) => p.is_completed).map((p) => p.lesson_id),
  );

  const totalCompleted = completedLessonIds.size;

  let activeModuleData: (typeof allModules)[0] | null = null;
  let activeModuleCompletedCount = 0;
  let activeModuleTotalLessons = 0;

  for (const mod of allModules) {
    const modLessonIds = mod.lessons.map((l) => l.id);
    const modCompleted = modLessonIds.filter((id) =>
      completedLessonIds.has(id),
    ).length;
    if (modCompleted < modLessonIds.length) {
      activeModuleData = mod;
      activeModuleCompletedCount = modCompleted;
      activeModuleTotalLessons = modLessonIds.length;
      break;
    }
  }

  if (!activeModuleData) {
    activeModuleData = allModules[allModules.length - 1] || null;
    if (activeModuleData) {
      activeModuleTotalLessons = activeModuleData.lessons.length;
      activeModuleCompletedCount = activeModuleTotalLessons;
    }
  }

  let nextLessonId: number | null = null;
  if (activeModuleData) {
    for (const lesson of activeModuleData.lessons) {
      if (!completedLessonIds.has(lesson.id)) {
        nextLessonId = lesson.id;
        break;
      }
    }
    // Jika semua lesson modul sudah selesai, ambil lesson pertama
    if (!nextLessonId && activeModuleData.lessons.length > 0) {
      nextLessonId = activeModuleData.lessons[0].id;
    }
  }

  const activeModuleProgress =
    activeModuleTotalLessons > 0
      ? Math.round(
          (activeModuleCompletedCount / activeModuleTotalLessons) * 100,
        )
      : 0;

  const aiChatCount = await prisma.aiChatHistory.count({
    where: { user_id: userId },
  });
  const latestArticles = await prisma.article.findMany({
    where: { is_published: true },
    orderBy: { id: "asc" },
    take: 3,
    select: {
      id: true,
      title: true,
    },
  });

  let completedModulesCount = 0;
  for (const mod of allModules) {
    const allDone = mod.lessons.every((l) => completedLessonIds.has(l.id));
    if (allDone && mod.lessons.length > 0) {
      completedModulesCount++;
    }
  }

  const upcomingExercises = await prisma.exercise.findMany({
    where: {
      is_published: true,
      lesson: {
        is_published: true,
        module: {
          is_published: true,
        },
      },
    },
    include: {
      lesson: {
        select: {
          id: true,
          title: true,
          sort_order: true,
          module: {
            select: {
              id: true,
              title: true,
              sort_order: true,
            },
          },
        },
      },
      results: {
        where: {
          user_id: userId,
          is_success: true,
        },
        select: { id: true },
      },
    },
    orderBy: [
      { lesson: { module: { sort_order: "asc" } } },
      { lesson: { sort_order: "asc" } },
      { id: "asc" },
    ],
  });

  // Filter exercise yang belum lulus
  const pendingExercises = upcomingExercises.filter(
    (ex) => ex.results.length === 0,
  );

  let assignmentItems: Array<{
    id: number;
    course: string;
    title: string;
    deadline: string;
    deadlineLabel: string;
    icon: string;
    exercise_id?: number;
    lesson_id?: number;
  }> = [];

  if (pendingExercises.length > 0) {
    assignmentItems = pendingExercises.slice(0, 3).map((ex) => {
      const isCurrentModule = activeModuleData
        ? ex.lesson.module.id === activeModuleData.id
        : false;
      return {
        id: ex.id,
        course: `Modul ${ex.lesson.module.sort_order}: ${ex.lesson.module.title}`,
        title: ex.instruction || `Latihan: ${ex.lesson.title}`,
        deadline: isCurrentModule ? "Besok" : "Mendatang",
        deadlineLabel: "Tenggat Waktu",
        icon: ex.lesson.module.sort_order % 2 === 0 ? "calculate" : "science",
        exercise_id: ex.id,
        lesson_id: ex.lesson_id,
      };
    });
  } else {
    const pendingLessons: Array<{
      id: number;
      title: string;
      moduleTitle: string;
      moduleSort: number;
      moduleId: number;
    }> = [];

    for (const mod of allModules) {
      for (const les of mod.lessons) {
        if (!completedLessonIds.has(les.id)) {
          pendingLessons.push({
            id: les.id,
            title: `Materi ${les.sort_order}`,
            moduleTitle: mod.title,
            moduleSort: mod.sort_order,
            moduleId: mod.id,
          });
        }
      }
    }

    assignmentItems = pendingLessons.slice(0, 3).map((les, index) => {
      const isCurrentModule = activeModuleData
        ? les.moduleId === activeModuleData.id
        : false;
      return {
        id: les.id,
        course: `Modul ${les.moduleSort}: ${les.moduleTitle}`,
        title: `Latihan Praktek / ${les.title}`,
        deadline: isCurrentModule && index === 0 ? "Besok" : "Mendatang",
        deadlineLabel: "Tenggat Waktu",
        icon: les.moduleSort % 2 === 0 ? "calculate" : "science",
        lesson_id: les.id,
      };
    });
  }

  const userResults = await prisma.exerciseResult.findMany({
    where: { user_id: userId },
    select: { is_success: true, created_at: true },
  });

  const totalCompilations = userResults.length;
  const successCompilations = userResults.filter((r) => r.is_success).length;
  const errorCompilations = totalCompilations - successCompilations;
  const successRate =
    totalCompilations > 0
      ? Math.round((successCompilations / totalCompilations) * 100)
      : 100;

  // Hitung 7 Hari Terakhir
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const weeklyActivity: Array<{
    day: string;
    compilations: number;
    completedLessons: number;
  }> = [];

  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dayLabel = dayNames[d.getDay()];
    const dateStr = d.toISOString().split("T")[0];

    const dayCompilations = userResults.filter(
      (r) => r.created_at.toISOString().split("T")[0] === dateStr,
    ).length;

    weeklyActivity.push({
      day: dayLabel,
      compilations: dayCompilations,
      completedLessons: dayCompilations > 0 ? Math.min(dayCompilations, 2) : 0,
    });
  }

  // Breakdown Ketuntasan Per Modul
  const moduleBreakdown = allModules.map((mod) => {
    const modLessonIds = mod.lessons.map((l) => l.id);
    const completedCount = modLessonIds.filter((id) =>
      completedLessonIds.has(id),
    ).length;
    const totalCount = modLessonIds.length;
    return {
      id: mod.id,
      sortOrder: mod.sort_order,
      title: mod.title,
      completed: completedCount,
      total: totalCount,
      percentage:
        totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
    };
  });

  return {
    statusCode: 200,
    data: {
      stats: {
        modules_completed: `${completedModulesCount}/${allModules.length}`,
        lessons_completed: totalCompleted,
        total_lessons: totalLessons,
        ai_chat_sessions: aiChatCount,
      },
      activeModule: activeModuleData
        ? {
            id: activeModuleData.id,
            number: activeModuleData.sort_order,
            total: allModules.length,
            title: activeModuleData.title,
            description: activeModuleData.description,
            progress: activeModuleProgress,
            next_lesson_id: nextLessonId,
          }
        : null,
      analytics: {
        compilationHealth: {
          total: totalCompilations,
          success: successCompilations,
          error: errorCompilations,
          successRate: successRate,
        },
        weeklyActivity,
        moduleBreakdown,
      },
      assignments: assignmentItems,
      articles: latestArticles.map((a) => ({
        id: a.id,
        title: a.title,
        category: "Panduan Regulasi Unila",
        readTime: "5 MIN READ",
      })),
    },
  };
});
