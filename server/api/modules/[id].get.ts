import { defineEventHandler, createError } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const idParam = event.context.params?.id
  const id = Number(idParam)

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID Modul tidak valid',
    })
  }

  const moduleData = await prisma.module.findUnique({
    where: { id },
    include: {
      lessons: {
        where: { is_published: true },
        orderBy: { sort_order: 'asc' },
        include: {
          exercises: {
            where: { is_published: true },
            select: {
              id: true,
              instruction: true,
              starter_code: true,
            },
          },
        },
      },
    },
  })

  if (!moduleData || !moduleData.is_published) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Modul tidak ditemukan',
    })
  }

  return {
    statusCode: 200,
    data: moduleData,
  }
})
