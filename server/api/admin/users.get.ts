/**
 * server/api/admin/users.get.ts
 * GET /api/admin/users — Mengambil daftar seluruh pengguna terdaftar beserta agregasi progres belajar, jumlah kompilasi, dan percakapan AI
 */

import { defineEventHandler } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (_event) => {
  // Total lesson terpublikasi untuk kalkulasi persentase
  const totalLessons = await prisma.lesson.count({ where: { is_published: true } })

  // Ambil pengguna beserta relasi progres dan aktivitas
  const users = await prisma.user.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      progress: {
        where: { is_completed: true },
        select: { lesson_id: true },
      },
      _count: {
        select: {
          exercise_results: true,
          ai_chats: true,
        },
      },
    },
  })

  return {
    statusCode: 200,
    data: users.map((u) => {
      const completedCount = u.progress.length
      const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

      return {
        id: u.id,
        email: u.email,
        name: u.name || u.email.split('@')[0],
        role: u.role,
        created_at: u.created_at.toISOString(),
        progress: {
          completed_lessons: completedCount,
          total_lessons: totalLessons,
          percentage,
        },
        activity: {
          total_compilations: u._count.exercise_results,
          total_ai_chats: u._count.ai_chats,
        },
      }
    }),
  }
})
