/**
 * server/api/admin/articles/[id].delete.ts
 * DELETE /api/admin/articles/:id — Hapus artikel regulasi
 */

import { defineEventHandler, createError, getRouterParam } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID artikel tidak valid.' })

  const existing = await prisma.article.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan.' })

  await prisma.article.delete({ where: { id } })

  return { statusCode: 200, message: `Artikel "${existing.title}" berhasil dihapus.` }
})
