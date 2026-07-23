import { defineEventHandler, createError } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const idParam = event.context.params?.id
  const id = Number(idParam)

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID Lesson tidak valid',
    })
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      module: {
        select: {
          id: true,
          title: true,
        },
      },
      exercises: {
        where: { is_published: true },
        select: {
          id: true,
          instruction: true,
          starter_code: true,
          solution_code: true,
        },
      },
    },
  })

  if (!lesson || !lesson.is_published) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Materi pembelajaran tidak ditemukan',
    })
  }

  // Mengambil ID lesson sebelumnya dan berikutnya untuk navigasi
  const nextLesson = await prisma.lesson.findFirst({
    where: {
      module_id: lesson.module_id,
      sort_order: { gt: lesson.sort_order },
      is_published: true,
    },
    orderBy: { sort_order: 'asc' },
    select: { id: true, title: true },
  })

  const prevLesson = await prisma.lesson.findFirst({
    where: {
      module_id: lesson.module_id,
      sort_order: { lt: lesson.sort_order },
      is_published: true,
    },
    orderBy: { sort_order: 'desc' },
    select: { id: true, title: true },
  })

  return {
    statusCode: 200,
    data: {
      ...lesson,
      next_lesson: nextLesson,
      prev_lesson: prevLesson,
    },
  }
})
