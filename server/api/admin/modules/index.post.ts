/**
 * server/api/admin/modules/index.post.ts
 * POST /api/admin/modules — Buat modul baru
 */

import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    title?: string
    description?: string
    sort_order?: number
    is_published?: boolean
  }>(event)

  if (!body?.title?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Judul modul tidak boleh kosong.' })
  }

  const maxOrder = await prisma.module.findFirst({ orderBy: { sort_order: 'desc' } })
  const nextOrder = (maxOrder?.sort_order ?? 0) + 1

  let module
  try {
    module = await prisma.module.create({
      data: {
        title: body.title.trim(),
        description: body.description?.trim() || '',
        sort_order: body.sort_order ?? nextOrder,
        is_published: body.is_published ?? false,
      },
    })
  } catch (err: any) {
    if (err?.code === 'P2002' || err?.message?.includes('Unique constraint')) {
      const maxId = await prisma.module.findFirst({ orderBy: { id: 'desc' } })
      const nextId = (maxId?.id ?? 0) + 1
      module = await prisma.module.create({
        data: {
          id: nextId,
          title: body.title.trim(),
          description: body.description?.trim() || '',
          sort_order: body.sort_order ?? nextOrder,
          is_published: body.is_published ?? false,
        },
      })
    } else {
      throw err
    }
  }

  return { statusCode: 201, message: 'Modul berhasil dibuat.', data: module }
})
