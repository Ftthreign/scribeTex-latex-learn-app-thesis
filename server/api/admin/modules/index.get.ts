/**
 * server/api/admin/modules/index.get.ts
 * GET /api/admin/modules — Ambil seluruh modul (termasuk draft) beserta jumlah lesson
 */

import { defineEventHandler } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (_event) => {
  const modules = await prisma.module.findMany({
    orderBy: { sort_order: 'asc' },
    include: {
      _count: { select: { lessons: true } },
    },
  })

  return {
    statusCode: 200,
    data: modules.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      sort_order: m.sort_order,
      is_published: m.is_published,
      lesson_count: m._count.lessons,
      created_at: m.created_at.toISOString(),
      updated_at: m.updated_at.toISOString(),
    })),
  }
})
