import { defineEventHandler, getQuery } from "h3";
import { serverSupabaseUser } from "#supabase/server";
import { prisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const supabaseUser = await serverSupabaseUser(event).catch(() => null);

  if (!supabaseUser) {
    return {
      statusCode: 200,
      data: [],
    };
  }

  const query = getQuery(event);
  const sessionId = (query.sessionId as string) || "";

  try {
    const whereCondition: any = { user_id: supabaseUser.id };
    if (sessionId) {
      whereCondition.session_id = sessionId;
    }

    const history = await prisma.aiChatHistory.findMany({
      where: whereCondition,
      orderBy: { created_at: "desc" },
      take: 30,
    });

    return {
      statusCode: 200,
      data: history,
    };
  } catch (err) {
    console.warn(
      "[AiHistoryAPI] Database fetch error, returning empty list:",
      err,
    );
    return {
      statusCode: 200,
      data: [],
    };
  }
});
