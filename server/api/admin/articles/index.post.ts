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

  let article
  try {
    article = await prisma.article.create({
      data: {
        title: body.title.trim(),
        content: body.content.trim(),
        author_id: adminUser.id,
        is_published: body.is_published ?? false,
      },
    })
  } catch (err: any) {
    if (err?.code === 'P2002' || err?.message?.includes('Unique constraint')) {
      const maxId = await prisma.article.findFirst({ orderBy: { id: 'desc' } })
      const nextId = (maxId?.id ?? 0) + 1
      article = await prisma.article.create({
        data: {
          id: nextId,
          title: body.title.trim(),
          content: body.content.trim(),
          author_id: adminUser.id,
          is_published: body.is_published ?? false,
        },
      })
    } else {
      throw err
    }
  }

  return { statusCode: 201, message: 'Artikel berhasil dibuat.', data: article }
})
