/**
 * server/api/admin/articles/index.get.ts
 * GET /api/admin/articles — Ambil semua artikel regulasi beserta isi naskah lengkap
 */

import { defineEventHandler } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (_event) => {
  const articles = await prisma.article.findMany({
    orderBy: { id: 'asc' },
    include: { author: { select: { name: true, email: true } } },
  })

  return {
    statusCode: 200,
    data: articles.map((a) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      author_name: a.author.name || a.author.email,
      is_published: a.is_published,
      content_preview: a.content.slice(0, 120) + (a.content.length > 120 ? '…' : ''),
      created_at: a.created_at.toISOString(),
      updated_at: a.updated_at.toISOString(),
    })),
  }
})
