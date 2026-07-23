import { defineEventHandler, createError, getHeader } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const supabaseUser = await serverSupabaseUser(event)

  if (!supabaseUser) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const userId = supabaseUser.id

  // 1. Ambil semua modul yang terpublikasi beserta lesson-nya
  const allModules = await prisma.module.findMany({
    where: { is_published: true },
    orderBy: { sort_order: 'asc' },
    include: {
      lessons: {
        where: { is_published: true },
        select: { id: true, sort_order: true },
        orderBy: { sort_order: 'asc' },
      },
    },
  })

  const totalLessons = allModules.reduce((acc, m) => acc + m.lessons.length, 0)

  // 2. Ambil progress lesson user
  const userProgress = await prisma.userProgress.findMany({
    where: { user_id: userId },
    select: { lesson_id: true, is_completed: true },
  })

  const completedLessonIds = new Set(
    userProgress.filter((p) => p.is_completed).map((p) => p.lesson_id)
  )

  const totalCompleted = completedLessonIds.size

  // 3. Cari modul aktif: modul pertama yang memiliki lesson belum selesai
  let activeModuleData: (typeof allModules)[0] | null = null
  let activeModuleCompletedCount = 0
  let activeModuleTotalLessons = 0

  for (const mod of allModules) {
    const modLessonIds = mod.lessons.map((l) => l.id)
    const modCompleted = modLessonIds.filter((id) => completedLessonIds.has(id)).length
    if (modCompleted < modLessonIds.length) {
      activeModuleData = mod
      activeModuleCompletedCount = modCompleted
      activeModuleTotalLessons = modLessonIds.length
      break
    }
  }

  // Fallback: jika semua selesai, tampilkan modul terakhir
  if (!activeModuleData) {
    activeModuleData = allModules[allModules.length - 1] || null
    if (activeModuleData) {
      activeModuleTotalLessons = activeModuleData.lessons.length
      activeModuleCompletedCount = activeModuleTotalLessons
    }
  }

  // 4. Cari ID lesson berikutnya yang belum diselesaikan dalam activeModule
  let nextLessonId: number | null = null
  if (activeModuleData) {
    for (const lesson of activeModuleData.lessons) {
      if (!completedLessonIds.has(lesson.id)) {
        nextLessonId = lesson.id
        break
      }
    }
    // Jika semua lesson modul sudah selesai, ambil lesson pertama
    if (!nextLessonId && activeModuleData.lessons.length > 0) {
      nextLessonId = activeModuleData.lessons[0].id
    }
  }

  // 5. Hitung progress modul aktif dalam persentase
  const activeModuleProgress =
    activeModuleTotalLessons > 0
      ? Math.round((activeModuleCompletedCount / activeModuleTotalLessons) * 100)
      : 0

  // 6. Hitung jumlah AI chat sessions user
  const aiChatCount = await prisma.aiChatHistory.count({
    where: { user_id: userId },
  })

  // 7. Ambil 3 artikel panduan Unila terbaru
  const latestArticles = await prisma.article.findMany({
    where: { is_published: true },
    orderBy: { id: 'asc' },
    take: 3,
    select: {
      id: true,
      title: true,
    },
  })

  // 8. Hitung jumlah modul yang sudah selesai semua lesson-nya
  let completedModulesCount = 0
  for (const mod of allModules) {
    const allDone = mod.lessons.every((l) => completedLessonIds.has(l.id))
    if (allDone && mod.lessons.length > 0) {
      completedModulesCount++
    }
  }

  return {
    statusCode: 200,
    data: {
      stats: {
        modules_completed: `${completedModulesCount}/${allModules.length}`,
        lessons_completed: totalCompleted,
        total_lessons: totalLessons,
        ai_chat_sessions: aiChatCount,
      },
      activeModule: activeModuleData
        ? {
            id: activeModuleData.id,
            number: activeModuleData.sort_order,
            total: allModules.length,
            title: activeModuleData.title,
            description: activeModuleData.description,
            progress: activeModuleProgress,
            next_lesson_id: nextLessonId,
          }
        : null,
      articles: latestArticles.map((a) => ({
        id: a.id,
        title: a.title,
        category: 'Panduan Regulasi Unila',
        readTime: '5 MIN READ',
      })),
    },
  }
})
