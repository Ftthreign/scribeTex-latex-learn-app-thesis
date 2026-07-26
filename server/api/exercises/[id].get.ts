import { defineEventHandler, createError } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '~~/server/utils/prisma'
import { checkExerciseAccess } from '~~/server/utils/accessControl'

export default defineEventHandler(async (event) => {
  const idParam = event.context.params?.id
  const id = Number(idParam)

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID Latihan tidak valid',
    })
  }

  const supabaseUser = await serverSupabaseUser(event)
  let userRole = 'STUDENT'
  let userId = ''

  if (supabaseUser) {
    userId = supabaseUser.id
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })
    if (dbUser) userRole = dbUser.role
  }

  // Enforcement Prerequisite Access Control pada Latihan Praktik
  if (userId) {
    const access = await checkExerciseAccess(userId, userRole, id)
    if (!access.canAccess) {
      throw createError({
        statusCode: 403,
        statusMessage: access.reason || 'Latihan ini masih terkunci. Selesaikan materi pembelajaran terkait terlebih dahulu.',
        data: access,
      })
    }
  }

  const exercise = await prisma.exercise.findUnique({
    where: { id },
    include: {
      lesson: {
        select: {
          id: true,
          title: true,
          module_id: true,
          module: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  })

  if (!exercise || !exercise.is_published) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Latihan tidak ditemukan',
    })
  }

  return {
    statusCode: 200,
    data: {
      id: exercise.id,
      instruction: exercise.instruction,
      starter_code: exercise.starter_code,
      solution_code: exercise.solution_code,
      lesson_id: exercise.lesson_id,
      lesson_title: exercise.lesson.title,
      module_id: exercise.lesson.module_id,
      module_title: exercise.lesson.module.title,
    },
  }
})
