import { defineEventHandler, createError, readBody } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const supabaseUser = await serverSupabaseUser(event)

  if (!supabaseUser) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const userId = supabaseUser.id
  const body = await readBody(event)
  const { lesson_id, is_completed } = body || {}

  if (!lesson_id || typeof lesson_id !== 'number') {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID Lesson tidak valid',
    })
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })

  // Mode Pratinjau Admin: Jangan catat tracking progres untuk akun Admin
  if (dbUser?.role === 'ADMIN') {
    return {
      statusCode: 200,
      message: 'Mode Pratinjau Admin: Tracking progres belajar dilewati.',
      data: null,
    }
  }

  // Upsert progress belajar di tabel user_progress untuk siswa
  const progress = await prisma.userProgress.upsert({
    where: {
      user_id_lesson_id: {
        user_id: userId,
        lesson_id: lesson_id,
      },
    },
    update: {
      is_completed: is_completed !== undefined ? Boolean(is_completed) : true,
    },
    create: {
      user_id: userId,
      lesson_id: lesson_id,
      is_completed: is_completed !== undefined ? Boolean(is_completed) : true,
    },
  })

  return {
    statusCode: 200,
    message: 'Progress belajar berhasil diperbarui',
    data: progress,
  }
})
