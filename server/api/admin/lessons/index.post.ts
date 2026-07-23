/**
 * server/api/admin/lessons/index.post.ts
 * POST /api/admin/lessons — Buat lesson materi baru
 */

import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    module_id?: number
    title?: string
    content?: string
    sort_order?: number
    is_published?: boolean
  }>(event)

  if (!body?.title?.trim()) throw createError({ statusCode: 400, statusMessage: 'Judul lesson tidak boleh kosong.' })
  if (!body?.module_id) throw createError({ statusCode: 400, statusMessage: 'module_id wajib diisi.' })

  const module = await prisma.module.findUnique({ where: { id: body.module_id } })
  if (!module) throw createError({ statusCode: 404, statusMessage: 'Modul tidak ditemukan.' })

  const maxOrder = await prisma.lesson.findFirst({
    where: { module_id: body.module_id },
    orderBy: { sort_order: 'desc' },
  })

  const lesson = await prisma.lesson.create({
    data: {
      module_id: body.module_id,
      title: body.title.trim(),
      content: body.content?.trim() || '',
      sort_order: body.sort_order ?? (maxOrder?.sort_order ?? 0) + 1,
      is_published: body.is_published ?? false,
    },
  })

  return { statusCode: 201, message: 'Lesson berhasil dibuat.', data: lesson }
})
