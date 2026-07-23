/**
 * server/api/admin/lessons/index.get.ts
 * GET /api/admin/lessons — Ambil semua lesson beserta isi naskah dan modul induknya
 */

import { defineEventHandler } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (_event) => {
  const lessons = await prisma.lesson.findMany({
    orderBy: [{ module_id: 'asc' }, { sort_order: 'asc' }],
    include: { module: { select: { id: true, title: true } } },
  })

  return {
    statusCode: 200,
    data: lessons.map((l) => ({
      id: l.id,
      title: l.title,
      content: l.content,
      module_id: l.module_id,
      module_title: l.module.title,
      sort_order: l.sort_order,
      is_published: l.is_published,
      content_preview: l.content.slice(0, 120) + (l.content.length > 120 ? '…' : ''),
      created_at: l.created_at.toISOString(),
      updated_at: l.updated_at.toISOString(),
    })),
  }
})
