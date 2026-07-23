import { defineEventHandler } from 'h3'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async () => {
  const exercises = await prisma.exercise.findMany({
    where: { is_published: true },
    orderBy: { id: 'asc' },
    include: {
      lesson: {
        select: {
          id: true,
          title: true,
          module_id: true,
          module: {
            select: {
              id: true,
              title: true,
              sort_order: true,
            },
          },
        },
      },
    },
  })

  const formatted = exercises.map((ex) => ({
    id: ex.id,
    instruction: ex.instruction,
    starter_code: ex.starter_code,
    solution_code: ex.solution_code,
    lesson_id: ex.lesson_id,
    lesson_title: ex.lesson.title,
    module_id: ex.lesson.module_id,
    module_title: ex.lesson.module.title,
    module_sort_order: ex.lesson.module.sort_order,
  }))

  return {
    statusCode: 200,
    data: formatted,
  }
})
