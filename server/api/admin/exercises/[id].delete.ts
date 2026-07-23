/**
 * server/api/admin/exercises/[id].delete.ts
 * DELETE /api/admin/exercises/:id — Hapus latihan
 */

import { defineEventHandler, createError, getRouterParam } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID latihan tidak valid.' })

  const existing = await prisma.exercise.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Latihan tidak ditemukan.' })

  await prisma.exercise.delete({ where: { id } })

  return { statusCode: 200, message: 'Latihan berhasil dihapus.' }
})
