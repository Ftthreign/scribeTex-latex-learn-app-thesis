import { defineEventHandler } from "h3";
import { serverSupabaseUser } from "#supabase/server";
import { prisma } from "~~/server/utils/prisma";
import { checkExerciseAccess } from "~~/server/utils/accessControl";

export default defineEventHandler(async (event) => {
  const supabaseUser = await serverSupabaseUser(event).catch(() => null);
  let userRole = "STUDENT";
  let userId = "";

  if (supabaseUser) {
    userId = supabaseUser.id;
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (dbUser) userRole = dbUser.role;
  }

  const exercises = await prisma.exercise.findMany({
    where: { is_published: true },
    orderBy: { id: "asc" },
    include: {
      lesson: {
        select: {
          id: true,
          title: true,
          module_id: true,
          module: {
            select: {
              id: true,
              title: true,
              sort_order: true,
            },
          },
        },
      },
    },
  });

  const formatted = await Promise.all(
    exercises.map(async (ex) => {
      let isLocked = false;
      let lockReason: "module_locked" | "lesson_not_completed" | null = null;

      if (userId) {
        const access = await checkExerciseAccess(userId, userRole, ex.id);
        isLocked = !access.canAccess;
        if (isLocked) {
          lockReason = access.lockReason || "module_locked";
        }
      } else {
        // Jika belum login, latihan selain pada modul pertama akan terkunci
        isLocked = ex.lesson.module.sort_order !== 1;
        if (isLocked) {
          lockReason = "module_locked";
        }
      }

      return {
        id: ex.id,
        instruction: ex.instruction,
        starter_code: ex.starter_code,
        solution_code: ex.solution_code,
        lesson_id: ex.lesson_id,
        lesson_title: ex.lesson.title,
        module_id: ex.lesson.module_id,
        module_title: ex.lesson.module.title,
        module_sort_order: ex.lesson.module.sort_order,
        is_locked: isLocked,
        lock_reason: lockReason,
      };
    })
  );

  return {
    statusCode: 200,
    data: formatted,
  };
});
