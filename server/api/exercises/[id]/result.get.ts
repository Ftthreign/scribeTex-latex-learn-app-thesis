import { defineEventHandler, createError } from "h3";
import { serverSupabaseUser } from "#supabase/server";
import { prisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const supabaseUser = await serverSupabaseUser(event).catch(() => null);

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

  const resultsList = await prisma.exerciseResult.findMany({
    where: {
      user_id: userId,
      exercise_id: exerciseId,
    },
    orderBy: { created_at: "desc" },
  });

  const latestSuccess = resultsList.find((r) => r.is_success) || null;
  const latestAny = resultsList.length > 0 ? resultsList[0] : null;

  return {
    statusCode: 200,
    data: latestSuccess || latestAny,
    latest: latestSuccess || latestAny,
    history: resultsList,
  };
});
