import { defineEventHandler } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  // Ambil user yang sedang login jika ada
  const supabaseUser = await serverSupabaseUser(event).catch(() => null)
  let completedLessonIds = new Set<number>()
  let userRole = 'STUDENT'

  if (supabaseUser) {
    const dbUser = await prisma.user.findUnique({
      where: { id: supabaseUser.id },
      select: { role: true },
    })
    if (dbUser) userRole = dbUser.role

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

  // Transformasi data modul dengan statistik jumlah lesson, progres user, & status penguncian berurutan
  let previousModuleFullyCompleted = true // Modul 1 selalu terbuka

  const formattedModules = modules.map((mod, index) => {
    const totalLessons = mod.lessons.length
    const completedCount = mod.lessons.filter((l) => completedLessonIds.has(l.id)).length
    const progressPercent =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

    // Modul terkunci jika modul sebelumnya belum selesai 100% (kecuali untuk ADMIN)
    const isLocked = userRole === 'ADMIN' ? false : index > 0 && !previousModuleFullyCompleted

    // Update flag kelulusan untuk modul berikutnya
    previousModuleFullyCompleted = totalLessons > 0 && completedCount === totalLessons

    return {
      id: mod.id,
      title: mod.title,
      description: mod.description,
      sort_order: mod.sort_order,
      is_published: mod.is_published,
      total_lessons: totalLessons,
      completed_lessons: completedCount,
      progress_percent: progressPercent,
      is_locked: isLocked,
      lessons: mod.lessons.map((l, lIdx) => {
        // Lesson terkunci jika modulnya terkunci, atau jika lesson sebelumnya dalam modul yang sama belum selesai
        const prevLessonInMod = mod.lessons[lIdx - 1]
        const isLessonLocked = isLocked || (lIdx > 0 && prevLessonInMod && !completedLessonIds.has(prevLessonInMod.id))
        return {
          ...l,
          is_completed: completedLessonIds.has(l.id),
          is_locked: userRole === 'ADMIN' ? false : isLessonLocked,
        }
      }),
    }
  })

  return {
    statusCode: 200,
    data: formattedModules,
  }
})
