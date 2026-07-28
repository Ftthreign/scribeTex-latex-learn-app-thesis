import { defineEventHandler, readBody, createError } from "h3";
import { serverSupabaseUser } from "#supabase/server";
import { AiService } from "~~/server/services/ai.service";
import { prisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const supabaseUser = await serverSupabaseUser(event).catch(() => null);

  if (!supabaseUser) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: Silakan login terlebih dahulu.",
    });
  }

  const userId = supabaseUser.id;

  const body = await readBody<{
    message?: string;
    codeContext?: Record<string, string> | string;
    errorLogs?: any[] | string;
    sessionId?: string;
    exerciseId?: number;
  }>(event);

  const message = body?.message;
  if (!message || typeof message !== "string" || message.trim() === "") {
    throw createError({
      statusCode: 400,
      statusMessage: "Pesan pertanyaan tidak boleh kosong.",
    });
  }

  const sessionId = body?.sessionId || "sandbox-session";
  const exerciseId = body?.exerciseId;

  let history: Array<{ message: string; response: string }> = [];
  try {
    // Ambil percakapan sebelumnya khusus milik user ini pada sesi ini
    const pastChats = await prisma.aiChatHistory.findMany({
      where: {
        user_id: userId,
        session_id: sessionId,
      },
      orderBy: { created_at: "asc" },
      take: 6,
    });
    history = pastChats.map((c) => ({
      message: c.message,
      response: c.response,
    }));
  } catch (err) {
    console.warn("[AiChatAPI] Prisma fetch history skipped:", err);
  }

  const aiResponse = await AiService.generateResponse({
    message,
    codeContext: body?.codeContext,
    errorLogs: body?.errorLogs,
    history,
  });

  try {
    // Simpan percakapan baru dengan user_id pengguna terautentikasi
    const savedRecord = await prisma.aiChatHistory.create({
      data: {
        user_id: userId,
        session_id: sessionId,
        exercise_id: exerciseId || null,
        message,
        response: aiResponse,
      },
    });
    console.log(
      `[AiChatAPI] Chat history saved successfully! Record ID: ${savedRecord.id} for User: ${userId}`,
    );
  } catch (err) {
    console.warn("[AiChatAPI] Save chat history to DB failed:", err);
  }

  return {
    statusCode: 200,
    message: "Respons Pembimbing AI berhasil didapatkan.",
    data: {
      message,
      response: aiResponse,
      sessionId,
      timestamp: new Date().toISOString(),
    },
  };
});
