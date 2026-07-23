/**
 * server/api/student/progress.get.ts
 * GET /api/student/progress — Mengambil data progres lesson user aktif lengkap dengan persentase
 */

import { defineEventHandler, createError } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const supabaseUser = await serverSupabaseUser(event)

  if (!supabaseUser) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const userId = supabaseUser.id

  // 1. Ambil semua lesson yang terpublikasi
  const allLessons = await prisma.lesson.findMany({
    where: { is_published: true },
    select: { id: true, title: true, module_id: true },
    orderBy: { sort_order: 'asc' },
  })

  // 2. Ambil semua progress user
  const userProgress = await prisma.userProgress.findMany({
    where: { user_id: userId },
    select: { lesson_id: true, is_completed: true, updated_at: true },
  })

  const progressMap = new Map(userProgress.map((p) => [p.lesson_id, p]))
  const totalLessons = allLessons.length
  const completedCount = userProgress.filter((p) => p.is_completed).length
  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  // 3. Kembalikan detail per lesson
  const lessonDetails = allLessons.map((lesson) => {
    const prog = progressMap.get(lesson.id)
    return {
      lesson_id: lesson.id,
      lesson_title: lesson.title,
      module_id: lesson.module_id,
      is_completed: prog?.is_completed ?? false,
      updated_at: prog?.updated_at?.toISOString() ?? null,
    }
  })

  return {
    statusCode: 200,
    data: {
      total_lessons: totalLessons,
      completed: completedCount,
      percentage,
      lessons: lessonDetails,
    },
  }
})
