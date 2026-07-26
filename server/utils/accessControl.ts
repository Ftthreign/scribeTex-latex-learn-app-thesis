import { prisma } from "~~/server/utils/prisma";

export interface AccessCheckResult {
  canAccess: boolean;
  reason?: string;
  lockReason?: "module_locked" | "lesson_not_completed";
  prevModuleTitle?: string;
  prevLessonTitle?: string;
  prevLessonId?: number;
}

export async function checkModuleAccess(
  userId: string,
  userRole: string,
  moduleId: number,
): Promise<AccessCheckResult> {
  if (userRole === "ADMIN") return { canAccess: true };

  const targetModule = await prisma.module.findUnique({
    where: { id: moduleId },
  });

  if (!targetModule) {
    return {
      canAccess: false,
      reason: "Modul tidak ditemukan.",
      lockReason: "module_locked",
    };
  }

  // Modul pertama (sort_order terendah) selalu terbuka
  const firstModule = await prisma.module.findFirst({
    where: { is_published: true },
    orderBy: { sort_order: "asc" },
  });

  if (firstModule && targetModule.id === firstModule.id) {
    return { canAccess: true };
  }

  // Cari modul persis sebelumnya berdasarkan sort_order
  const prevModule = await prisma.module.findFirst({
    where: {
      is_published: true,
      sort_order: { lt: targetModule.sort_order },
    },
    orderBy: { sort_order: "desc" },
    include: {
      lessons: {
        where: { is_published: true },
        select: { id: true },
      },
    },
  });

  if (!prevModule) {
    return { canAccess: true };
  }

  // Cek apakah seluruh lesson pada prevModule sudah diselesaikan user
  const prevLessonIds = prevModule.lessons.map((l) => l.id);
  if (prevLessonIds.length === 0) {
    return { canAccess: true };
  }

  const completedCount = await prisma.userProgress.count({
    where: {
      user_id: userId,
      lesson_id: { in: prevLessonIds },
      is_completed: true,
    },
  });

  if (completedCount < prevLessonIds.length) {
    return {
      canAccess: false,
      lockReason: "module_locked",
      reason: `Modul "${targetModule.title}" masih terkunci. Selesaikan seluruh materi di "${prevModule.title}" terlebih dahulu.`,
      prevModuleTitle: prevModule.title,
    };
  }

  return { canAccess: true };
}

/**
 * Memeriksa apakah mahasiswa memiliki hak akses ke Lesson tertentu
 */
export async function checkLessonAccess(
  userId: string,
  userRole: string,
  lessonId: number,
): Promise<AccessCheckResult> {
  if (userRole === "ADMIN") return { canAccess: true };

  const targetLesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: true },
  });

  if (!targetLesson) {
    return {
      canAccess: false,
      reason: "Materi lesson tidak ditemukan.",
      lockReason: "module_locked",
    };
  }

  // 1. Cek dulu apakah Modul Induk lesson ini terbuka
  const moduleCheck = await checkModuleAccess(
    userId,
    userRole,
    targetLesson.module_id,
  );
  if (!moduleCheck.canAccess) {
    return { ...moduleCheck, lockReason: "module_locked" };
  }

  // 2. Cek lesson persis sebelumnya di dalam modul yang sama
  const prevLesson = await prisma.lesson.findFirst({
    where: {
      module_id: targetLesson.module_id,
      is_published: true,
      sort_order: { lt: targetLesson.sort_order },
    },
    orderBy: { sort_order: "desc" },
  });

  if (!prevLesson) {
    // Lesson pertama di dalam modul yang terbuka -> langsung unlocked
    return { canAccess: true };
  }

  // Cek apakah prevLesson sudah diselesaikan oleh user
  const userProg = await prisma.userProgress.findUnique({
    where: {
      user_id_lesson_id: {
        user_id: userId,
        lesson_id: prevLesson.id,
      },
    },
  });

  if (!userProg || !userProg.is_completed) {
    return {
      canAccess: false,
      lockReason: "module_locked",
      reason: `Materi "${targetLesson.title}" masih terkunci. Selesaikan pelajaran "${prevLesson.title}" terlebih dahulu.`,
      prevLessonTitle: prevLesson.title,
      prevLessonId: prevLesson.id,
    };
  }

  return { canAccess: true };
}

/**
 * Memeriksa apakah mahasiswa memiliki hak akses ke Exercise tertentu
 * Syarat: Lesson induk dapat diakses & naskah materi bab terkait telah diselesaikan 100% (is_completed)
 */
export async function checkExerciseAccess(
  userId: string,
  userRole: string,
  exerciseId: number,
): Promise<AccessCheckResult> {
  if (userRole === "ADMIN") return { canAccess: true };

  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
    select: {
      id: true,
      lesson_id: true,
      lesson: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!exercise) {
    return { canAccess: false, reason: "Soal latihan tidak ditemukan." };
  }

  const lessonAccess = await checkLessonAccess(
    userId,
    userRole,
    exercise.lesson_id,
  );
  if (!lessonAccess.canAccess) {
    return { ...lessonAccess, lockReason: "module_locked" };
  }

  const userProg = await prisma.userProgress.findUnique({
    where: {
      user_id_lesson_id: {
        user_id: userId,
        lesson_id: exercise.lesson_id,
      },
    },
  });

  if (!userProg || !userProg.is_completed) {
    return {
      canAccess: false,
      lockReason: "lesson_not_completed",
      reason: `Latihan bab "${exercise.lesson.title}" masih terkunci. Pelajari naskah materi bab ini hingga 100% tuntas terlebih dahulu.`,
      prevLessonTitle: exercise.lesson.title,
      prevLessonId: exercise.lesson.id,
    };
  }

  return { canAccess: true };
}
