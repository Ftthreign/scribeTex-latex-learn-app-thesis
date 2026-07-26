import { defineEventHandler, readBody, createError } from 'h3'
import { AiService } from '~~/server/services/ai.service'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    message?: string
    codeContext?: Record<string, string> | string
    errorLogs?: any[] | string
    sessionId?: string
    exerciseId?: number
  }>(event)

  const message = body?.message
  if (!message || typeof message !== 'string' || message.trim() === '') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Pesan pertanyaan tidak boleh kosong.',
    })
  }

  const sessionId = body?.sessionId || 'sandbox-session'
  const exerciseId = body?.exerciseId

  // 1. Ambil 5 riwayat chat terakhir untuk konteks berkelanjutan
  let history: Array<{ message: string; response: string }> = []
  try {
    const pastChats = await prisma.aiChatHistory.findMany({
      where: { session_id: sessionId },
      orderBy: { created_at: 'asc' },
      take: 6,
    })
    history = pastChats.map((c) => ({ message: c.message, response: c.response }))
  } catch (err) {
    console.warn('[AiChatAPI] Prisma fetch history skipped:', err)
  }

  // 2. Panggil AiService dengan Context Builder
  const aiResponse = await AiService.generateResponse({
    message,
    codeContext: body?.codeContext,
    errorLogs: body?.errorLogs,
    history,
  })

  // 3. Simpan riwayat percakapan ke basis data
  try {
    // Cari user aktif dari sesi, atau gunakan user pertama di database sebagai penampung riwayat
    let userId = event.context.user?.id
    if (!userId) {
      const firstUser = await prisma.user.findFirst()
      userId = firstUser?.id || '00000000-0000-0000-0000-000000000001'
    }

    const savedRecord = await prisma.aiChatHistory.create({
      data: {
        user_id: userId,
        session_id: sessionId,
        exercise_id: exerciseId || null,
        message,
        response: aiResponse,
      },
    })
    console.log(`[AiChatAPI] Chat history saved successfully! Record ID: ${savedRecord.id}`)
  } catch (err) {
    console.warn('[AiChatAPI] Save chat history to DB failed:', err)
  }

  return {
    statusCode: 200,
    message: 'Respons Pembimbing AI berhasil didapatkan.',
    data: {
      message,
      response: aiResponse,
      sessionId,
      timestamp: new Date().toISOString(),
    },
  }
})
