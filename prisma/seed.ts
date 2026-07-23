import { PrismaClient } from '../app/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import * as fs from 'fs'
import * as path from 'path'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('[Prisma] DATABASE_URL environment variable is not set.')
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

// Definition of 8 Modules
const MODULES_DATA = [
  {
    id: 1,
    title: 'Modul 1: Mengenal LaTeX',
    description: 'Fondasi teoritis: apa itu LaTeX, sejarah, ekosistem tools & cara kerja kompilasi.',
    sort_order: 1,
    is_published: true,
  },
  {
    id: 2,
    title: 'Modul 2: Struktur Dokumen Dasar',
    description: 'Anatomi dokumen LaTeX: preamble, body, kelas dokumen & karakter khusus.',
    sort_order: 2,
    is_published: true,
  },
  {
    id: 3,
    title: 'Modul 3: Pemformatan Teks & Struktur Logis',
    description: 'Pemformatan konten: penekanan teks, seksi/bab, daftar, spasi & tipografi.',
    sort_order: 3,
    is_published: true,
  },
  {
    id: 4,
    title: 'Modul 4: Gambar, Tabel & Referensi Silang',
    description: 'Elemen visual & navigasi dokumen: gambar, tabel, posisi float & referensi silang.',
    sort_order: 4,
    is_published: true,
  },
  {
    id: 5,
    title: 'Modul 5: Penulisan Rumus Matematika',
    description: 'Mode matematika LaTeX: inline math, display math, persamaan & paket amsmath.',
    sort_order: 5,
    is_published: true,
  },
  {
    id: 6,
    title: 'Modul 6: Sitasi & Daftar Pustaka',
    description: 'Manajemen referensi akademik: database BibTeX, BibLaTeX & biblatex.',
    sort_order: 6,
    is_published: true,
  },
  {
    id: 7,
    title: 'Modul 7: Dokumen Panjang & Font Unicode',
    description: 'Manajemen dokumen kompleks: input, include, font OpenType & dukungan Unicode.',
    sort_order: 7,
    is_published: true,
  },
  {
    id: 8,
    title: 'Modul 8: Penanganan Galat & Sumber Daya LaTeX',
    description: 'Debugging & literasi dokumentasi: jenis pesan galat, pembacaan log & pencarian bantuan.',
    sort_order: 8,
    is_published: true,
  },
]

// Mapping of 16 Lessons to Modules
const LESSONS_META = [
  { id: 1, lesson_file: 'lesson-01.md', module_id: 1, sort_order: 1 },
  { id: 2, lesson_file: 'lesson-02.md', module_id: 1, sort_order: 2 },
  { id: 3, lesson_file: 'lesson-03.md', module_id: 2, sort_order: 1 },
  { id: 4, lesson_file: 'lesson-05.md', module_id: 2, sort_order: 2 },
  { id: 5, lesson_file: 'lesson-06.md', module_id: 2, sort_order: 3 },
  { id: 6, lesson_file: 'lesson-04.md', module_id: 3, sort_order: 1 },
  { id: 7, lesson_file: 'lesson-11.md', module_id: 3, sort_order: 2 },
  { id: 8, lesson_file: 'lesson-07.md', module_id: 4, sort_order: 1 },
  { id: 9, lesson_file: 'lesson-08.md', module_id: 4, sort_order: 2 },
  { id: 10, lesson_file: 'lesson-09.md', module_id: 4, sort_order: 3 },
  { id: 11, lesson_file: 'lesson-10.md', module_id: 5, sort_order: 1 },
  { id: 12, lesson_file: 'lesson-12.md', module_id: 6, sort_order: 1 },
  { id: 13, lesson_file: 'lesson-13.md', module_id: 7, sort_order: 1 },
  { id: 14, lesson_file: 'lesson-14.md', module_id: 7, sort_order: 2 },
  { id: 15, lesson_file: 'lesson-15.md', module_id: 8, sort_order: 1 },
  { id: 16, lesson_file: 'lesson-16.md', module_id: 8, sort_order: 2 },
]

// 5 Unila Academic Guide Articles
const ARTICLES_DATA = [
  {
    id: 1,
    title: 'Panduan Format Halaman & Margin Skripsi Unila',
    content: `# Panduan Format Halaman & Margin Skripsi Unila

Berdasarkan **Buku Pedoman Penulisan Karya Ilmiah Universitas Lampung**, format halaman fisik naskah skripsi diatur sebagai berikut:

- **Ukuran Kertas:** A4 (210 mm x 297 mm), 80 gram.
- **Margin Halaman:**
  - **Kiri (*Left*):** 4 cm (untuk batas jilid).
  - **Atas (*Top*):** 3 cm.
  - **Kanan (*Right*):** 3 cm.
  - **Bawah (*Bottom*):** 3 cm.
- **Jenis & Ukuran Font:** *Times New Roman* 12 pt untuk narasi utama.
- **Spasi Antarbaris:** 1.5 baris (*\onehalfspacing*).

\`\`\`latex
% Penerapan Preamble LaTeX Standar Unila:
\\documentclass[12pt, a4paper, oneside]{report}
\\usepackage[left=4cm, right=3cm, top=3cm, bottom=3cm]{geometry}
\\usepackage{setspace}
\\onehalfspacing
\`\`\``,
    is_published: true,
  },
  {
    id: 2,
    title: 'Panduan Struktur Bab & Penomoran Seksi',
    content: `# Panduan Struktur Bab & Penomoran Seksi

Format penulisan struktur bab dan seksi karya ilmiah Universitas Lampung:

- **Judul Bab (\`\\chapter\`):** Ditulis dengan huruf kapital tegak, cetak tebal, di tengah halaman, menggunakan angka Romawi (\`BAB I\`, \`BAB II\`, dst.).
- **Sub-seksi (\`\\section\`):** Ditulis dengan penomoran berurut (\`1.1 Latar Belakang\`, \`1.2 Rumus Masalah\`).
- **Sub-sub-seksi (\`\\subsection\`):** Ditulis dengan penomoran tiga tingkat (\`1.2.1 Identifikasi Masalah\`).

\`\`\`latex
\\chapter{PENDAHULUAN}
\\section{Latar Belakang}
\\subsection{Identifikasi Masalah}
\`\`\``,
    is_published: true,
  },
  {
    id: 3,
    title: 'Panduan Standar Pembuatan Tabel & Gambar Akademik',
    content: `# Panduan Standar Pembuatan Tabel & Gambar Akademik

Ketentuan penyajian elemen visual di lingkungan Universitas Lampung:

- **Judul Tabel:** Ditempatkan di **bagian atas tabel**, rata tengah, cetak tebal.
- **Estetika Tabel:** Sangat disarankan **tidak menggunakan garis vertikal** dan menggunakan paket \`booktabs\` (\`\\toprule\`, \`\\midrule\`, \`\\bottomrule\`).
- **Judul Gambar:** Ditempatkan di **bagian bawah gambar**, rata tengah.

\`\`\`latex
% Contoh Tabel Akademik Clean:
\\begin{table}[H]
  \\centering
  \\caption{Matriks Hasil Pengujian Black Box}
  \\begin{tabular}{clc}
    \\toprule
    \\textbf{ID} & \\textbf{Fitur} & \\textbf{Status} \\\\
    \\midrule
    TC-01 & Autentikasi Sesi & Lulus \\\\
    \\bottomrule
  \\end{tabular}
\\end{table}
\`\`\``,
    is_published: true,
  },
  {
    id: 4,
    title: 'Panduan Penulisan Rumus Matematika & Persamaan',
    content: `# Panduan Penulisan Rumus Matematika & Persamaan

Pedoman penulisan formula matematika dan persamaan komputasi:

- **Inline Math (\`$...$\`):** Digunakan untuk simbol matematika di tengah kalimat narasi (misal: $E=mc^2$).
- **Display Math (\`equation\`):** Digunakan untuk persamaan utama, ditempatkan di baris terpisah di tengah halaman dengan nomor persamaan rata kanan otomatis \`(3.1)\`.

\`\`\`latex
\\begin{equation}
  x_{1,2} = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
  \\label{eq:rumus_abc}
\\end{equation}
\`\`\``,
    is_published: true,
  },
  {
    id: 5,
    title: 'Panduan Sitasi & Daftar Pustaka Unila',
    content: `# Panduan Sitasi & Daftar Pustaka Unila

Ketentuan pengutipan dan penyusunan Bab DAFTAR PUSTAKA:

- **Format Sitasi:** Menggunakan gaya penulisan *IEEE* atau *APA*.
- **Otomatisasi BibTeX:** Seluruh referensi wajib disimpan dalam berkas \`pustaka.bib\` dan dipanggil via \`\\cite{key}\`.
- **Hanya Yang Dikutip:** Hanya referensi yang benar-benar dirujuk di narasi yang boleh muncul di Bab Daftar Pustaka.

\`\`\`latex
\\usepackage[style=ieee, backend=biber]{biblatex}
\\addbibresource{pustaka.bib}

% Di narasi:
Menurut Lamport~\\cite{Lamport1994}, \\LaTeX{} sangat stabil...

\\printbibliography[title={DAFTAR PUSTAKA}]
\`\`\``,
    is_published: true,
  },
]

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/
  const match = fileContent.match(frontmatterRegex)

  let metadata: Record<string, any> = {}
  let content = fileContent

  if (match) {
    const yamlBlock = match[1]
    content = fileContent.replace(match[0], '')

    yamlBlock.split('\n').forEach((line) => {
      const parts = line.split(':')
      if (parts.length >= 2) {
        const key = parts[0].trim()
        const value = parts.slice(1).join(':').trim().replace(/^"|"$/g, '')
        metadata[key] = value
      }
    })
  }

  return { metadata, content }
}

async function main() {
  const shouldClean =
    process.argv.includes('--clean') ||
    process.argv.includes('--reset') ||
    process.env.CLEAN_SEED === 'true'

  if (shouldClean) {
    console.log('🧹 [MODE RESET] Opsi --reset aktif. Membersihkan data lama di tabel articles, exercises, lessons, dan modules...')
    await prisma.article.deleteMany({})
    await prisma.exercise.deleteMany({})
    await prisma.lesson.deleteMany({})
    await prisma.module.deleteMany({})
    console.log('✨ Tabel berhasil dikosongkan 100%.')
  } else {
    console.log('🔄 [MODE UPDATE] Opsi bawaan (Upsert). Memperbarui materi & artikel tanpa menghapus data tabel...')
  }

  console.log('🚀 Memulai Seeding Data Admin, Modul, Lesson & Articles...')

  // 0. Seed Default Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@unila.ac.id' },
    update: {
      name: 'Administrator ScribeTex Unila',
      role: 'ADMIN',
    },
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin@unila.ac.id',
      name: 'Administrator ScribeTex Unila',
      role: 'ADMIN',
    },
  })
  console.log(`👤 Admin User seeded: ${adminUser.email}`)

  // 1. Seed Modules (Upsert)
  for (const mod of MODULES_DATA) {
    await prisma.module.upsert({
      where: { id: mod.id },
      update: {
        title: mod.title,
        description: mod.description,
        sort_order: mod.sort_order,
        is_published: mod.is_published,
      },
      create: mod,
    })
    console.log(`✅ Module seeded: ${mod.title}`)
  }

  // 2. Seed Lessons & Exercises (Upsert)
  const docsDir = path.join(process.cwd(), 'content', 'scraped-docs')

  for (const meta of LESSONS_META) {
    const filePath = path.join(docsDir, meta.lesson_file)
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Berkas tidak ditemukan: ${filePath}`)
      continue
    }

    const rawText = fs.readFileSync(filePath, 'utf-8')
    const { metadata, content } = parseFrontmatter(rawText)

    const title = metadata.title || `Lesson ${meta.id}`

    // Upsert Lesson
    const lesson = await prisma.lesson.upsert({
      where: { id: meta.id },
      update: {
        module_id: meta.module_id,
        title,
        content,
        sort_order: meta.sort_order,
        is_published: true,
      },
      create: {
        id: meta.id,
        module_id: meta.module_id,
        title,
        content,
        sort_order: meta.sort_order,
        is_published: true,
      },
    })

    console.log(`  📘 Lesson seeded: [ID: ${lesson.id}] ${title}`)

    // Create / Upsert Exercise for this lesson
    const exerciseInstruction = `Praktikkan latihan interaktif untuk ${title}. Selesaikan perbaikan kode pada starter_code sesuai instruksi.`
    const starterCode = `\\documentclass{article}\n\\begin{document}\n\\section{Latihan ${title}}\n% Tuliskan kode perbaikan Anda di sini\n\\end{document}`
    const solutionCode = `\\documentclass{article}\n\\begin{document}\n\\section{Latihan ${title}}\nSolusi latihan berhasil dikompilasi.\n\\end{document}`

    await prisma.exercise.upsert({
      where: { id: meta.id },
      update: {
        lesson_id: lesson.id,
        instruction: exerciseInstruction,
        starter_code: starterCode,
        solution_code: solutionCode,
        is_published: true,
      },
      create: {
        id: meta.id,
        lesson_id: lesson.id,
        instruction: exerciseInstruction,
        starter_code: starterCode,
        solution_code: solutionCode,
        is_published: true,
      },
    })
  }

  // 3. Seed Unila Guide Articles (Upsert)
  for (const article of ARTICLES_DATA) {
    await prisma.article.upsert({
      where: { id: article.id },
      update: {
        title: article.title,
        content: article.content,
        author_id: adminUser.id,
        is_published: article.is_published,
      },
      create: {
        id: article.id,
        title: article.title,
        content: article.content,
        author_id: adminUser.id,
        is_published: article.is_published,
      },
    })
    console.log(`  📜 Article seeded: [ID: ${article.id}] ${article.title}`)
  }

  console.log('🎉 Seeding Selesai 100%! Data kurikulum & artikel regulasi Unila terbaru telah aktif.')
}

main()
  .catch((e) => {
    console.error('❌ Terjadi Galat saat Seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
