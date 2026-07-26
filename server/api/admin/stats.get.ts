/**
 * server/api/admin/stats.get.ts
 * GET /api/admin/stats — Mengagregasi metrik statistik operasional platform
 */

import { defineEventHandler } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (_event) => {
  // Jalankan semua kueri agregasi secara paralel
  const [
    totalUsers,
    totalStudents,
    totalAdmins,
    totalModules,
    totalLessons,
    totalExercises,
    totalArticles,
    totalCompilations,
    totalAiChats,
    totalProgressRecords,
    totalCompletedProgress,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.module.count(),
    prisma.lesson.count({ where: { is_published: true } }),
    prisma.exercise.count({ where: { is_published: true } }),
    prisma.article.count({ where: { is_published: true } }),
    prisma.exerciseResult.count(),
    prisma.aiChatHistory.count(),
    prisma.userProgress.count(),
    prisma.userProgress.count({ where: { is_completed: true } }),
  ])

  const progressPercentage =
    totalProgressRecords > 0
      ? Math.round((totalCompletedProgress / totalProgressRecords) * 100)
      : 0

  return {
    statusCode: 200,
    data: {
      users: {
        total: totalUsers,
        students: totalStudents,
        admins: totalAdmins,
      },
      content: {
        modules: totalModules,
        lessons: totalLessons,
        exercises: totalExercises,
        articles: totalArticles,
      },
      activity: {
        compilations: totalCompilations,
        ai_chats: totalAiChats,
        progress_records: totalProgressRecords,
        completed_progress: totalCompletedProgress,
        progress_percentage: progressPercentage,
      },
    },
  }
})
