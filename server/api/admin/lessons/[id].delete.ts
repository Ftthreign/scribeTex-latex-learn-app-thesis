/**
 * server/api/admin/lessons/[id].delete.ts
 * DELETE /api/admin/lessons/:id — Hapus lesson
 */

import { defineEventHandler, createError, getRouterParam } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID lesson tidak valid.' })

  const existing = await prisma.lesson.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Lesson tidak ditemukan.' })

  await prisma.lesson.delete({ where: { id } })

  return { statusCode: 200, message: `Lesson "${existing.title}" berhasil dihapus.` }
})
