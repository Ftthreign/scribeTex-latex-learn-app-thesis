/**
 * server/api/admin/articles/index.post.ts
 * POST /api/admin/articles — Buat artikel regulasi baru
 */

import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    title?: string
    content?: string
    is_published?: boolean
  }>(event)

  if (!body?.title?.trim()) throw createError({ statusCode: 400, statusMessage: 'Judul artikel tidak boleh kosong.' })
  if (!body?.content?.trim()) throw createError({ statusCode: 400, statusMessage: 'Konten artikel tidak boleh kosong.' })

  // Gunakan admin seeded sebagai author default
  const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
  if (!adminUser) throw createError({ statusCode: 500, statusMessage: 'Admin user tidak ditemukan di database.' })

  const article = await prisma.article.create({
    data: {
      title: body.title.trim(),
      content: body.content.trim(),
      author_id: adminUser.id,
      is_published: body.is_published ?? false,
    },
  })

  return { statusCode: 201, message: 'Artikel berhasil dibuat.', data: article }
})
