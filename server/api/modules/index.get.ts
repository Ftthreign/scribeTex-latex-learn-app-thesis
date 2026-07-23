import { defineEventHandler } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  // Ambil user yang sedang login jika ada
  const supabaseUser = await serverSupabaseUser(event).catch(() => null)
  let completedLessonIds = new Set<number>()

  if (supabaseUser) {
    const userProgress = await prisma.userProgress.findMany({
      where: { user_id: supabaseUser.id, is_completed: true },
      select: { lesson_id: true },
    })
    completedLessonIds = new Set(userProgress.map((p) => p.lesson_id))
  }

  const modules = await prisma.module.findMany({
    where: { is_published: true },
    orderBy: { sort_order: 'asc' },
    include: {
      lessons: {
        where: { is_published: true },
        select: {
          id: true,
          title: true,
          sort_order: true,
        },
        orderBy: { sort_order: 'asc' },
      },
    },
  })

  // Transformasi data modul dengan statistik jumlah lesson & progres user
  const formattedModules = modules.map((mod) => {
    const totalLessons = mod.lessons.length
    const completedCount = mod.lessons.filter((l) => completedLessonIds.has(l.id)).length
    const progressPercent =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

    return {
      id: mod.id,
      title: mod.title,
      description: mod.description,
      sort_order: mod.sort_order,
      is_published: mod.is_published,
      total_lessons: totalLessons,
      completed_lessons: completedCount,
      progress_percent: progressPercent,
      lessons: mod.lessons,
    }
  })

  return {
    statusCode: 200,
    data: formattedModules,
  }
})
