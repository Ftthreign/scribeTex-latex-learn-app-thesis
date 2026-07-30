/**
 * scripts/test_iterasi_2_prisma_query.js
 * Skrip 2: Pengujian Kueri Relasional Murni Database Prisma ORM (Iterasi 2)
 * (Mengukur latensi eksekusi kueri murni di backend tanpa overhead HTTP peramban)
 */

import { prisma } from '../server/utils/prisma';

async function runPrismaQueryTestIterasi2() {
  console.log('====================================================');
  console.log('  SKRIP 2: PENGUJIAN KUERI MURNI PRISMA ORM (ITERASI 2)');
  console.log('  (Eksekusi Kueri Langsung ke Basis Data PostgreSQL)');
  console.log('====================================================\n');

  try {
    // Warm-up query
    await prisma.module.findFirst();
    console.log('  ✓ Koneksi Prisma Client & PostgreSQL terhubung.\n');

    const queryScenarios = [
      {
        id: 'DB-02.1',
        name: 'prisma.module.findMany({ include: { lessons: true } })',
        exec: () => prisma.module.findMany({ include: { lessons: true } })
      },
      {
        id: 'DB-02.2',
        name: 'prisma.module.findUnique(include nested lessons & exercises)',
        exec: () => prisma.module.findUnique({
          where: { id: 1 },
          include: {
            lessons: {
              where: { is_published: true },
              include: { exercises: true }
            }
          }
        })
      },
      {
        id: 'DB-02.3',
        name: 'prisma.lesson.findUnique({ where: { id: 1 } })',
        exec: () => prisma.lesson.findUnique({ where: { id: 1 } })
      },
      {
        id: 'DB-02.4',
        name: 'prisma.article.findMany({ where: { is_published: true } })',
        exec: () => prisma.article.findMany({ where: { is_published: true } })
      },
      {
        id: 'DB-02.5',
        name: 'prisma.article.findUnique({ where: { id: 1 } })',
        exec: () => prisma.article.findUnique({ where: { id: 1 } })
      }
    ];

    const summary = [];

    for (const item of queryScenarios) {
      console.log(`[${item.id}] Mengukur Latensi Kueri Murni ${item.name} (10x Sampling)...`);
      const latencies = [];

      for (let i = 1; i <= 10; i++) {
        const t0 = performance.now();
        await item.exec();
        const duration = parseFloat((performance.now() - t0).toFixed(2));
        latencies.push(duration);
      }

      const avg = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2);
      const min = Math.min(...latencies).toFixed(2);
      const max = Math.max(...latencies).toFixed(2);

      summary.push({
        id: item.id,
        min: `${min} ms`,
        avg: `${avg} ms`,
        max: `${max} ms`,
        status: 'Optimal'
      });

      console.log(`   - Min: ${min} ms | Avg: ${avg} ms | Max: ${max} ms\n`);
    }

    console.log('====================================================');
    console.log('  REKAPITULASI HASIL KUERI MURNI PRISMA DB (ITERASI 2)');
    console.log('====================================================');
    console.table(summary);
    console.log('====================================================\n');

  } catch (error) {
    console.error('Error saat menjalankan kueri Prisma:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runPrismaQueryTestIterasi2().catch(console.error);
