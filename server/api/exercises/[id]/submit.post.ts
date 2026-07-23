import { defineEventHandler, createError, readBody } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const supabaseUser = await serverSupabaseUser(event)

  if (!supabaseUser) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const userId = supabaseUser.id
  const idParam = event.context.params?.id
  const exerciseId = Number(idParam)

  if (isNaN(exerciseId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID Latihan tidak valid',
    })
  }

  const body = await readBody(event)
  const { submitted_code, is_success, error_log } = body || {}

  if (!submitted_code || typeof submitted_code !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Kode jawaban (submitted_code) wajib diisi',
    })
  }

  // Simpan hasil pengerjaan koding mahasiswa ke tabel exercise_results
  const result = await prisma.exerciseResult.create({
    data: {
      user_id: userId,
      exercise_id: exerciseId,
      submitted_code: submitted_code,
      is_success: Boolean(is_success),
      error_log: error_log || null,
    },
  })

  return {
    statusCode: 200,
    message: 'Hasil pengerjaan latihan berhasil tersimpan',
    data: result,
  }
})
