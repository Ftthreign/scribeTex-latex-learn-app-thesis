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

// Data Master 16 Latihan Praktik Interaktif Spesifik per Lesson
const EXERCISES_DATA: Record<number, { instruction: string; starter_code: string; solution_code: string }> = {
  1: {
    instruction: 'Praktikkan pembuatan dokumen LaTeX paling mendasar. Lengkapi kode awal dengan menentukan kelas dokumen \\documentclass{article} dan memasukkan kalimat "Hello World dari ScribeTex Unila!" di dalam lingkungan document.',
    starter_code: '% TODO: Tentukan kelas dokumen article\n% \\documentclass{...}\n\n\\begin{document}\n  % TODO: Tuliskan kalimat Hello World di bawah ini\n\n\\end{document}',
    solution_code: '\\documentclass{article}\n\n\\begin{document}\n  Hello World dari ScribeTex Unila!\n\\end{document}',
  },
  2: {
    instruction: 'Praktikkan konsep pemisahan Preamble dan Body. Masukkan judul dokumen "Pengenalan LaTeX Skripsi" menggunakan perintah \\title{} di Preamble, lalu panggil \\maketitle di dalam lingkungan document.',
    starter_code: '\\documentclass{article}\n% TODO: Tambahkan judul dokumen di area Preamble\n% \\title{...}\n\\author{Mahasiswa Unila}\n\n\\begin{document}\n  % TODO: Tampilkan judul dokumen dengan perintah \\maketitle\n\n  Dokumen pertama berhasil dibuat.\n\\end{document}',
    solution_code: '\\documentclass{article}\n\\title{Pengenalan LaTeX Skripsi}\n\\author{Mahasiswa Unila}\n\n\\begin{document}\n  \\maketitle\n  Dokumen pertama berhasil dibuat.\n\\end{document}',
  },
  3: {
    instruction: 'Praktikkan pengaturan margin naskah skripsi Unila (Top 3cm, Left 4cm, Right 3cm, Bottom 3cm) menggunakan paket geometry di area Preamble.',
    starter_code: '\\documentclass{article}\n\\usepackage{geometry}\n% TODO: Atur konfigurasi margin geometry (top=3cm, left=4cm, right=3cm, bottom=3cm)\n% \\geometry{...}\n\n\\begin{document}\n  Naskah skripsi Universitas Lampung dengan margin standar 4-3-3-3 cm.\n\\end{document}',
    solution_code: '\\documentclass{article}\n\\usepackage{geometry}\n\\geometry{top=3cm, left=4cm, right=3cm, bottom=3cm}\n\n\\begin{document}\n  Naskah skripsi Universitas Lampung dengan margin standar 4-3-3-3 cm.\n\\end{document}',
  },
  4: {
    instruction: 'Praktikkan pemformatan teks akademik. Cetak tebal kata "Universitas Lampung" menggunakan \\textbf{}, miringkan kata "Typesetting" dengan \\textit{}, dan beri garis bawah kata "ScribeTex" dengan \\underline{}.',
    starter_code: '\\documentclass{article}\n\\begin{document}\n  % TODO: Format teks berikut: Universitas Lampung (tebal), Typesetting (miring), ScribeTex (garis bawah)\n  Sistem ini dikembangkan di Universitas Lampung menggunakan teknologi Typesetting ScribeTex.\n\\end{document}',
    solution_code: '\\documentclass{article}\n\\begin{document}\n  Sistem ini dikembangkan di \\textbf{Universitas Lampung} menggunakan teknologi \\textit{Typesetting} \\underline{ScribeTex}.\n\\end{document}',
  },
  5: {
    instruction: 'Praktikkan pembuatan struktur bab dan seksi logis. Buat seksi \\section{Pendahuluan} dan sub-seksi \\subsection{Latar Belakang}.',
    starter_code: '\\documentclass{article}\n\\begin{document}\n  % TODO: Buat seksi Pendahuluan dan sub-seksi Latar Belakang\n\n  Penulisan karya ilmiah membutuhkan struktur seksi yang teratur.\n\\end{document}',
    solution_code: '\\documentclass{article}\n\\begin{document}\n  \\section{Pendahuluan}\n  \\subsection{Latar Belakang}\n  Penulisan karya ilmiah membutuhkan struktur seksi yang teratur.\n\\end{document}',
  },
  6: {
    instruction: 'Praktikkan pembuatan daftar berurut (enumerate) dan daftar poin (itemize). Buat daftar bertingkat dengan 2 poin utama.',
    starter_code: '\\documentclass{article}\n\\begin{document}\n  % TODO: Buat lingkungan itemize dengan 2 item: "Metode Penelitian" dan "Hasil Pembahasan"\n\n\\end{document}',
    solution_code: '\\documentclass{article}\n\\begin{document}\n  \\begin{itemize}\n    \\item Metode Penelitian\n    \\item Hasil Pembahasan\n  \\end{itemize}\n\\end{document}',
  },
  7: {
    instruction: 'Praktikkan penyisipan gambar akademik menggunakan lingkungan figure, paket graphicx, dan caption.',
    starter_code: '\\documentclass{article}\n\\usepackage{graphicx}\n\n\\begin{document}\n  % TODO: Buat lingkungan figure, tampilkan gambar dengan width=0.5\\textwidth, caption "Logo Unila"\n\n\\end{document}',
    solution_code: '\\documentclass{article}\n\\usepackage{graphicx}\n\n\\begin{document}\n  \\begin{figure}[h]\n    \\centering\n    \\includegraphics[width=0.5\\textwidth]{example-image}\n    \\caption{Logo Unila}\n    \\label{fig:logo}\n  \\end{figure}\n\\end{document}',
  },
  8: {
    instruction: 'Praktikkan pembuatan tabel akademik clean menggunakan lingkungan tabular dengan 3 kolom.',
    starter_code: '\\documentclass{article}\n\\begin{document}\n  % TODO: Buat tabel tabular dengan header: No | Nama | Nilai dan 2 baris data\n\n\\end{document}',
    solution_code: '\\documentclass{article}\n\\begin{document}\n  \\begin{table}[h]\n    \\centering\n    \\begin{tabular}{|c|l|r|}\n      \\hline\n      No & Nama & Nilai \\\\\n      \\hline\n      1 & Fadhil & 95 \\\\\n      2 & Ahmad & 90 \\\\\n      \\hline\n    \\end{tabular}\n    \\caption{Tabel Hasil Ujian}\n  \\end{table}\n\\end{document}',
  },
  9: {
    instruction: 'Praktikkan referensi silang (cross-referencing). Buat seksi dengan \\label{sec:metode} lalu sebutkan kembali menggunakan \\ref{sec:metode}.',
    starter_code: '\\documentclass{article}\n\\begin{document}\n  \\section{Metodologi}\n  % TODO: Tambahkan label sec:metode pada seksi ini\n\n  \\section{Pembahasan}\n  % TODO: Rujuk seksi metodologi di atas dengan perintah \\ref{}\n  Sesuai dengan penjelasan pada Seksi ...\n\\end{document}',
    solution_code: '\\documentclass{article}\n\\begin{document}\n  \\section{Metodologi}\n  \\label{sec:metode}\n\n  \\section{Pembahasan}\n  Sesuai dengan penjelasan pada Seksi \\ref{sec:metode}.\n\\end{document}',
  },
  10: {
    instruction: 'Praktikkan penulisan notasi matematika inline ($ ... $). Tulis persamaan energi E = mc^2 dan teori Phytagoras a^2 + b^2 = c^2 di dalam narasi.',
    starter_code: '\\documentclass{article}\n\\begin{document}\n  % TODO: Sisipkan notasi matematika inline E = mc^2 dan a^2 + b^2 = c^2 dalam kalimat\n  Persamaan Einstein adalah ... dan rumus Pythagoras adalah ...\n\\end{document}',
    solution_code: '\\documentclass{article}\n\\begin{document}\n  Persamaan Einstein adalah $E = mc^2$ dan rumus Pythagoras adalah $a^2 + b^2 = c^2$.\n\\end{document}',
  },
  11: {
    instruction: 'Praktikkan penulisan mode matematika display menggunakan lingkungan equation. Tulis rumus kuadratik abc secara terpisah dan terpusat.',
    starter_code: '\\documentclass{article}\n\\usepackage{amsmath}\n\n\\begin{document}\n  % TODO: Buat lingkungan equation untuk rumus abc: x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\n\n\\end{document}',
    solution_code: '\\documentclass{article}\n\\usepackage{amsmath}\n\n\\begin{document}\n  \\begin{equation}\n    x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\n  \\end{equation}\n\\end{document}',
  },
  12: {
    instruction: 'Praktikkan penulisan pecahan (\\frac) dan bentuk akar (\\sqrt). Tuliskan turunan fungsi limit pecahan.',
    starter_code: '\\documentclass{article}\n\\usepackage{amsmath}\n\n\\begin{document}\n  % TODO: Tulis pecahan 1/2 dan akar kuadrat \\sqrt{x + 1} dalam mode matematika\n\n\\end{document}',
    solution_code: '\\documentclass{article}\n\\usepackage{amsmath}\n\n\\begin{document}\n  Hasil kalkulasi nilai $\\frac{1}{2}$ dan akar $\\sqrt{x + 1}$.\n\\end{document}',
  },
  13: {
    instruction: 'Praktikkan pembuatan matriks menggunakan lingkungan bmatrix dari paket amsmath.',
    starter_code: '\\documentclass{article}\n\\usepackage{amsmath}\n\n\\begin{document}\n  % TODO: Buat matriks 2x2 dengan bmatrix: [1 0; 0 1]\n\n\\end{document}',
    solution_code: '\\documentclass{article}\n\\usepackage{amsmath}\n\n\\begin{document}\n  Matriks Identitas $I$:\n  \\begin{equation}\n    I = \\begin{bmatrix}\n      1 & 0 \\\\\n      0 & 1\n    \\end{bmatrix}\n  \\end{equation}\n\\end{document}',
  },
  14: {
    instruction: 'Praktikkan pengutipan otomatis dengan perintah \\cite{key} untuk merujuk entitas pustaka di naskah akademik.',
    starter_code: '\\documentclass{article}\n\\begin{document}\n  % TODO: Tambahkan kutipan sitasi \\cite{Lamport1994} pada kalimat berikut\n  Menurut penelitian Lamport ..., LaTeX sangat efisien untuk naskah ilmiah.\n\\end{document}',
    solution_code: '\\documentclass{article}\n\\begin{document}\n  Menurut penelitian Lamport~\\cite{Lamport1994}, LaTeX sangat efisien untuk naskah ilmiah.\n\\end{document}',
  },
  15: {
    instruction: 'Praktikkan pengorganisasian naskah panjang dengan membagi berkas menggunakan perintah \\input{}.',
    starter_code: '\\documentclass{article}\n\\begin{document}\n  % TODO: Panggil file terpisah bab1.tex dengan perintah \\input{bab1}\n\n\\end{document}',
    solution_code: '\\documentclass{article}\n\\begin{document}\n  \\input{bab1}\n\\end{document}',
  },
  16: {
    instruction: 'Praktikkan debugging sintaks LaTeX. Perbaiki kesalahan tag penutup lingkungan yang saling bertabrakan (LIFO error).',
    starter_code: '\\documentclass{article}\n\\begin{document}\n  % TODO: Perbaiki urutan penutupan lingkungan center dan quote di bawah ini\n  \\begin{center}\n    \\begin{quote}\n      Teks Kutipan\n    \\end{center}\n    \\end{quote}\n\\end{document}',
    solution_code: '\\documentclass{article}\n\\begin{document}\n  \\begin{center}\n    \\begin{quote}\n      Teks Kutipan\n    \\end{quote}\n  \\end{center}\n\\end{document}',
  },
}

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
    const specificEx = EXERCISES_DATA[meta.id] || {
      instruction: `Praktikkan latihan interaktif untuk ${title}. Selesaikan perbaikan kode pada starter_code sesuai instruksi.`,
      starter_code: `\\documentclass{article}\n\\begin{document}\n\\section{Latihan ${title}}\n% Tuliskan kode perbaikan Anda di sini\n\\end{document}`,
      solution_code: `\\documentclass{article}\n\\begin{document}\n\\section{Latihan ${title}}\nSolusi latihan berhasil dikompilasi.\n\\end{document}`,
    }

    await prisma.exercise.upsert({
      where: { id: meta.id },
      update: {
        lesson_id: lesson.id,
        instruction: specificEx.instruction,
        starter_code: specificEx.starter_code,
        solution_code: specificEx.solution_code,
        is_published: true,
      },
      create: {
        id: meta.id,
        lesson_id: lesson.id,
        instruction: specificEx.instruction,
        starter_code: specificEx.starter_code,
        solution_code: specificEx.solution_code,
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
