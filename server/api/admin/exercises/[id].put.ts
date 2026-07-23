/**
 * server/api/admin/exercises/[id].put.ts
 * PUT /api/admin/exercises/:id — Perbarui kode starter & solusi latihan
 */

import { defineEventHandler, readBody, createError, getRouterParam } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID latihan tidak valid.' })

  const body = await readBody<{
    instruction?: string
    starter_code?: string
    solution_code?: string
    lesson_id?: number
    is_published?: boolean
  }>(event)

  const existing = await prisma.exercise.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Latihan tidak ditemukan.' })

  const updated = await prisma.exercise.update({
    where: { id },
    data: {
      ...(body.instruction !== undefined && { instruction: body.instruction.trim() }),
      ...(body.starter_code !== undefined && { starter_code: body.starter_code }),
      ...(body.solution_code !== undefined && { solution_code: body.solution_code }),
      ...(body.lesson_id !== undefined && { lesson_id: body.lesson_id }),
      ...(body.is_published !== undefined && { is_published: body.is_published }),
    },
  })

  return { statusCode: 200, message: 'Latihan berhasil diperbarui.', data: updated }
})
