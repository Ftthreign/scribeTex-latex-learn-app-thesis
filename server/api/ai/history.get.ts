import { defineEventHandler, getQuery } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const sessionId = (query.sessionId as string) || ''

  try {
    // Ambil riwayat percakapan dari database
    const history = await prisma.aiChatHistory.findMany({
      where: sessionId ? { session_id: sessionId } : undefined,
      orderBy: { created_at: 'desc' },
      take: 30,
    })

    return {
      statusCode: 200,
      data: history,
    }
  } catch (err) {
    console.warn('[AiHistoryAPI] Database fetch error, returning empty list:', err)
    return {
      statusCode: 200,
      data: [],
    }
  }
})
