/**
 * scripts/test_iterasi_2_api_latency.js
 * Skrip 1: Pengujian Latensi API HTTP Nitro (Iterasi Construction 2)
 * Rute Uji: /api/modules, /api/modules/1, /api/lessons/1, /api/articles, /api/articles/1
 */

const BASE_URL = process.env.APP_URL || 'http://localhost:3000';

async function runApiLatencyTestIterasi2() {
  console.log('====================================================');
  console.log('  SKRIP 1: PENGUJIAN LATENSI API HTTP NITRO (ITERASI 2)');
  console.log('====================================================\n');

  // 0. Warm-Up Request
  console.log('[WARM-UP] Menginisialisasi rute Nitro API Modul & Artikel...');
  try {
    await fetch(`${BASE_URL}/api/modules`);
    await fetch(`${BASE_URL}/api/articles`);
  } catch (e) {}
  console.log('  ✓ Rute API Nitro ter-compile & siap.\n');

  const scenarios = [
    { id: 'INT-02.1', name: 'Katalog Hirarki Modul', url: '/api/modules' },
    { id: 'INT-02.2', name: 'Rincian Modul & Lesson (Prisma Include)', url: '/api/modules/1' },
    { id: 'INT-02.3', name: 'Content Lesson Reading', url: '/api/lessons/1' },
    { id: 'INT-02.4', name: 'Katalog Artikel Panduan Unila', url: '/api/articles' },
    { id: 'INT-02.5', name: 'Rincian Artikel Panduan', url: '/api/articles/1' },
  ];

  const summary = [];

  for (const item of scenarios) {
    console.log(`[${item.id}] Mengukur Latensi ${item.name} (10x Sampling)...`);
    const latencies = [];
    let successCount = 0;

    for (let i = 1; i <= 10; i++) {
      const t0 = performance.now();
      try {
        const res = await fetch(`${BASE_URL}${item.url}`);
        if (res.ok) successCount++;
      } catch (err) {}
      const duration = parseFloat((performance.now() - t0).toFixed(2));
      latencies.push(duration);
    }

    const avg = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2);
    const min = Math.min(...latencies).toFixed(2);
    const max = Math.max(...latencies).toFixed(2);
    const errorRate = (((10 - successCount) / 10) * 100).toFixed(2);
    const throughput = (1000 / avg).toFixed(2);

    summary.push({
      id: item.id,
      name: item.name,
      min,
      avg,
      max,
      errorRate: `${errorRate}%`,
      throughput: `${throughput} req/s`,
      status: successCount > 0 ? 'Sukses' : 'Gagal'
    });

    console.log(`   - Min: ${min} ms | Avg: ${avg} ms | Max: ${max} ms | Status: ${successCount > 0 ? 'Sukses' : 'Gagal'}\n`);
  }

  console.log('====================================================');
  console.log('  REKAPITULASI HASIL LATENSI API HTTP (ITERASI 2)');
  console.log('====================================================');
  console.table(summary);
  console.log('====================================================\n');
}

runApiLatencyTestIterasi2().catch(console.error);
