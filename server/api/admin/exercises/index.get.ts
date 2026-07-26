/**
 * server/api/admin/exercises/index.get.ts
 * GET /api/admin/exercises — Ambil semua latihan beserta instruksi, starter_code, solution_code, dan nama lesson
 */

import { defineEventHandler } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (_event) => {
  const exercises = await prisma.exercise.findMany({
    orderBy: { id: 'asc' },
    include: {
      lesson: { select: { id: true, title: true, module_id: true, module: { select: { title: true } } } },
    },
  })

  return {
    statusCode: 200,
    data: exercises.map((e) => ({
      id: e.id,
      lesson_id: e.lesson_id,
      lesson_title: e.lesson.title,
      module_title: e.lesson.module.title,
      instruction: e.instruction,
      starter_code: e.starter_code,
      solution_code: e.solution_code,
      instruction_preview: e.instruction.slice(0, 100) + (e.instruction.length > 100 ? '…' : ''),
      is_published: e.is_published,
      created_at: e.created_at.toISOString(),
      updated_at: e.updated_at.toISOString(),
    })),
  }
})
