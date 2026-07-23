/**
 * server/utils/accessControl.ts
 * Helper & Security Guard Prerequisite Access Control (Sequential Locking)
 */

import { prisma } from '~~/server/utils/prisma'

export interface AccessCheckResult {
  canAccess: boolean
  reason?: string
  prevModuleTitle?: string
  prevLessonTitle?: string
  prevLessonId?: number
}

/**
 * Memeriksa apakah mahasiswa memiliki hak akses ke Modul tertentu
 */
export async function checkModuleAccess(
  userId: string,
  userRole: string,
  moduleId: number
): Promise<AccessCheckResult> {
  // Admin memiliki hak akses penuh ke seluruh modul
  if (userRole === 'ADMIN') return { canAccess: true }

  const targetModule = await prisma.module.findUnique({
    where: { id: moduleId },
  })

  if (!targetModule) {
    return { canAccess: false, reason: 'Modul tidak ditemukan.' }
  }

  // Modul pertama (sort_order terendah) selalu terbuka
  const firstModule = await prisma.module.findFirst({
    where: { is_published: true },
    orderBy: { sort_order: 'asc' },
  })

  if (firstModule && targetModule.id === firstModule.id) {
    return { canAccess: true }
  }

  // Cari modul persis sebelumnya berdasarkan sort_order
  const prevModule = await prisma.module.findFirst({
    where: {
      is_published: true,
      sort_order: { lt: targetModule.sort_order },
    },
    orderBy: { sort_order: 'desc' },
    include: {
      lessons: {
        where: { is_published: true },
        select: { id: true },
      },
    },
  })

  if (!prevModule) {
    return { canAccess: true }
  }

  // Cek apakah seluruh lesson pada prevModule sudah diselesaikan user
  const prevLessonIds = prevModule.lessons.map((l) => l.id)
  if (prevLessonIds.length === 0) {
    return { canAccess: true }
  }

  const completedCount = await prisma.userProgress.count({
    where: {
      user_id: userId,
      lesson_id: { in: prevLessonIds },
      is_completed: true,
    },
  })

  if (completedCount < prevLessonIds.length) {
    return {
      canAccess: false,
      reason: `Modul "${targetModule.title}" masih terkunci. Selesaikan seluruh materi di "${prevModule.title}" terlebih dahulu.`,
      prevModuleTitle: prevModule.title,
    }
  }

  return { canAccess: true }
}

/**
 * Memeriksa apakah mahasiswa memiliki hak akses ke Lesson tertentu
 */
export async function checkLessonAccess(
  userId: string,
  userRole: string,
  lessonId: number
): Promise<AccessCheckResult> {
  if (userRole === 'ADMIN') return { canAccess: true }

  const targetLesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: true },
  })

  if (!targetLesson) {
    return { canAccess: false, reason: 'Materi lesson tidak ditemukan.' }
  }

  // 1. Cek dulu apakah Modul Induk lesson ini terbuka
  const moduleCheck = await checkModuleAccess(userId, userRole, targetLesson.module_id)
  if (!moduleCheck.canAccess) {
    return moduleCheck
  }

  // 2. Cek lesson persis sebelumnya di dalam modul yang sama
  const prevLesson = await prisma.lesson.findFirst({
    where: {
      module_id: targetLesson.module_id,
      is_published: true,
      sort_order: { lt: targetLesson.sort_order },
    },
    orderBy: { sort_order: 'desc' },
  })

  if (!prevLesson) {
    // Lesson pertama di dalam modul yang terbuka -> langsung unlocked
    return { canAccess: true }
  }

  // Cek apakah prevLesson sudah diselesaikan oleh user
  const userProg = await prisma.userProgress.findUnique({
    where: {
      user_id_lesson_id: {
        user_id: userId,
        lesson_id: prevLesson.id,
      },
    },
  })

  if (!userProg || !userProg.is_completed) {
    return {
      canAccess: false,
      reason: `Materi "${targetLesson.title}" masih terkunci. Selesaikan pelajaran "${prevLesson.title}" terlebih dahulu.`,
      prevLessonTitle: prevLesson.title,
      prevLessonId: prevLesson.id,
    }
  }

  return { canAccess: true }
}

/**
 * Memeriksa apakah mahasiswa memiliki hak akses ke Exercise tertentu
 */
export async function checkExerciseAccess(
  userId: string,
  userRole: string,
  exerciseId: number
): Promise<AccessCheckResult> {
  if (userRole === 'ADMIN') return { canAccess: true }

  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
    select: { id: true, lesson_id: true },
  })

  if (!exercise) {
    return { canAccess: false, reason: 'Soal latihan tidak ditemukan.' }
  }

  // Soal latihan dapat diakses jika Lesson terkaitnya dapat diakses
  return checkLessonAccess(userId, userRole, exercise.lesson_id)
}
