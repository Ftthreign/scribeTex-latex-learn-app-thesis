/**
 * server/api/admin/articles/[id].put.ts
 * PUT /api/admin/articles/:id — Perbarui artikel
 */

import { defineEventHandler, readBody, createError, getRouterParam } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID artikel tidak valid.' })

  const body = await readBody<{
    title?: string
    content?: string
    is_published?: boolean
  }>(event)

  const existing = await prisma.article.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan.' })

  const updated = await prisma.article.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title.trim() }),
      ...(body.content !== undefined && { content: body.content }),
      ...(body.is_published !== undefined && { is_published: body.is_published }),
    },
  })

  return { statusCode: 200, message: 'Artikel berhasil diperbarui.', data: updated }
})
