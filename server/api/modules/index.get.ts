import { defineEventHandler } from "h3";
import { serverSupabaseUser } from "#supabase/server";
import { prisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
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

  const modules = await prisma.module.findMany({
    where: { is_published: true },
    orderBy: { sort_order: "asc" },
    include: {
      lessons: {
        where: { is_published: true },
        select: {
          id: true,
          title: true,
          sort_order: true,
        },
        orderBy: { sort_order: "asc" },
      },
    },
  });

  let previousModuleFullyCompleted = true;

  const formattedModules = modules.map((mod, index) => {
    const totalLessons = mod.lessons.length;
    const completedCount = mod.lessons.filter((l) =>
      completedLessonIds.has(l.id),
    ).length;
    const progressPercent =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    const isLocked =
      userRole === "ADMIN" ? false : index > 0 && !previousModuleFullyCompleted;

    previousModuleFullyCompleted =
      totalLessons > 0 && completedCount === totalLessons;

    return {
      id: mod.id,
      title: mod.title,
      description: mod.description,
      sort_order: mod.sort_order,
      is_published: mod.is_published,
      total_lessons: totalLessons,
      completed_lessons: completedCount,
      progress_percent: progressPercent,
      is_locked: isLocked,
      lessons: mod.lessons.map((l, lIdx) => {
        const prevLessonInMod = mod.lessons[lIdx - 1];
        const isLessonLocked =
          isLocked ||
          (lIdx > 0 &&
            prevLessonInMod &&
            !completedLessonIds.has(prevLessonInMod.id));
        return {
          ...l,
          is_completed: completedLessonIds.has(l.id),
          is_locked: userRole === "ADMIN" ? false : isLessonLocked,
        };
      }),
    };
  });

  return {
    statusCode: 200,
    data: formattedModules,
  };
});
