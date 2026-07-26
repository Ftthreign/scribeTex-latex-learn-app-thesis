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

  let exercise
  try {
    exercise = await prisma.exercise.create({
      data: {
        lesson_id: body.lesson_id,
        instruction: body.instruction.trim(),
        starter_code: body.starter_code?.trim() || '\\documentclass{article}\n\\begin{document}\n% Kode Anda di sini\n\\end{document}',
        solution_code: body.solution_code?.trim() || '',
        is_published: body.is_published ?? false,
      },
    })
  } catch (err: any) {
    if (err?.code === 'P2002' || err?.message?.includes('Unique constraint')) {
      const maxId = await prisma.exercise.findFirst({ orderBy: { id: 'desc' } })
      const nextId = (maxId?.id ?? 0) + 1
      exercise = await prisma.exercise.create({
        data: {
          id: nextId,
          lesson_id: body.lesson_id,
          instruction: body.instruction.trim(),
          starter_code: body.starter_code?.trim() || '\\documentclass{article}\n\\begin{document}\n% Kode Anda di sini\n\\end{document}',
          solution_code: body.solution_code?.trim() || '',
          is_published: body.is_published ?? false,
        },
      })
    } else {
      throw err
    }
  }

  return { statusCode: 201, message: 'Latihan berhasil dibuat.', data: exercise }
})
