/**
 * server/api/admin/exercises/index.post.ts
 * POST /api/admin/exercises — Buat soal latihan baru
 */

import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    lesson_id?: number
    instruction?: string
    starter_code?: string
    solution_code?: string
    is_published?: boolean
  }>(event)

  if (!body?.lesson_id) throw createError({ statusCode: 400, statusMessage: 'lesson_id wajib diisi.' })
  if (!body?.instruction?.trim()) throw createError({ statusCode: 400, statusMessage: 'Instruksi latihan tidak boleh kosong.' })

  const lesson = await prisma.lesson.findUnique({ where: { id: body.lesson_id } })
  if (!lesson) throw createError({ statusCode: 404, statusMessage: 'Lesson tidak ditemukan.' })

  const exercise = await prisma.exercise.create({
    data: {
      lesson_id: body.lesson_id,
      instruction: body.instruction.trim(),
      starter_code: body.starter_code?.trim() || '\\documentclass{article}\n\\begin{document}\n% Kode Anda di sini\n\\end{document}',
      solution_code: body.solution_code?.trim() || '',
      is_published: body.is_published ?? false,
    },
  })

  return { statusCode: 201, message: 'Latihan berhasil dibuat.', data: exercise }
})
