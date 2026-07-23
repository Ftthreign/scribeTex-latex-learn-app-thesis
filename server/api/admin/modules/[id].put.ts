/**
 * server/api/admin/modules/[id].put.ts
 * PUT /api/admin/modules/:id — Perbarui data modul
 */

import { defineEventHandler, readBody, createError, getRouterParam } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID modul tidak valid.' })

  const body = await readBody<{
    title?: string
    description?: string
    sort_order?: number
    is_published?: boolean
  }>(event)

  const existing = await prisma.module.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Modul tidak ditemukan.' })

  const updated = await prisma.module.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title.trim() }),
      ...(body.description !== undefined && { description: body.description.trim() }),
      ...(body.sort_order !== undefined && { sort_order: body.sort_order }),
      ...(body.is_published !== undefined && { is_published: body.is_published }),
    },
  })

  return { statusCode: 200, message: 'Modul berhasil diperbarui.', data: updated }
})
