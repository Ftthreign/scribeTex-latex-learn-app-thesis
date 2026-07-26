import { defineEventHandler } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async () => {
  const articles = await prisma.article.findMany({
    where: { is_published: true },
    orderBy: { id: 'asc' },
    select: {
      id: true,
      title: true,
      created_at: true,
      updated_at: true,
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  return {
    statusCode: 200,
    data: articles,
  }
})
