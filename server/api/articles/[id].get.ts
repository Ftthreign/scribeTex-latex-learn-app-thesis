import { defineEventHandler, createError } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const idParam = event.context.params?.id
  const id = Number(idParam)

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID Artikel tidak valid',
    })
  }

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  if (!article || !article.is_published) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Artikel regulasi tidak ditemukan',
    })
  }

  return {
    statusCode: 200,
    data: article,
  }
})
