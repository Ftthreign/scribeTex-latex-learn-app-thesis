/**
 * server/api/admin/lessons/[id].put.ts
 * PUT /api/admin/lessons/:id — Perbarui isi naskah lesson
 */

import { defineEventHandler, readBody, createError, getRouterParam } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID lesson tidak valid.' })

  const body = await readBody<{
    title?: string
    content?: string
    module_id?: number
    sort_order?: number
    is_published?: boolean
  }>(event)

  const existing = await prisma.lesson.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Lesson tidak ditemukan.' })

  const updated = await prisma.lesson.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title.trim() }),
      ...(body.content !== undefined && { content: body.content }),
      ...(body.module_id !== undefined && { module_id: body.module_id }),
      ...(body.sort_order !== undefined && { sort_order: body.sort_order }),
      ...(body.is_published !== undefined && { is_published: body.is_published }),
    },
  })

  return { statusCode: 200, message: 'Lesson berhasil diperbarui.', data: updated }
})
