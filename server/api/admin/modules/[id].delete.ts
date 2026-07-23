/**
 * server/api/admin/modules/[id].delete.ts
 * DELETE /api/admin/modules/:id — Hapus modul (cascade ke lessons & exercises)
 */

import { defineEventHandler, createError, getRouterParam } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID modul tidak valid.' })

  const existing = await prisma.module.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Modul tidak ditemukan.' })

  await prisma.module.delete({ where: { id } })

  return { statusCode: 200, message: `Modul "${existing.title}" berhasil dihapus.` }
})
