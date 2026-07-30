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

// Mapping of 27 Lessons to Modules
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
  { id: 17, lesson_file: 'lesson-17.md', module_id: 3, sort_order: 3 },
  { id: 18, lesson_file: 'lesson-18.md', module_id: 4, sort_order: 4 },
  { id: 19, lesson_file: 'lesson-19.md', module_id: 4, sort_order: 5 },
  { id: 20, lesson_file: 'lesson-20.md', module_id: 4, sort_order: 6 },
  { id: 21, lesson_file: 'lesson-21.md', module_id: 5, sort_order: 2 },
  { id: 22, lesson_file: 'lesson-22.md', module_id: 5, sort_order: 3 },
  { id: 23, lesson_file: 'lesson-23.md', module_id: 6, sort_order: 2 },
  { id: 24, lesson_file: 'lesson-24.md', module_id: 7, sort_order: 3 },
  { id: 25, lesson_file: 'lesson-25.md', module_id: 7, sort_order: 4 },
  { id: 26, lesson_file: 'lesson-26.md', module_id: 7, sort_order: 5 },
  { id: 27, lesson_file: 'lesson-27.md', module_id: 4, sort_order: 7 },
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
  17: {
    instruction: 'Praktikkan penggunaan kontrol jarak spasi vertikal \\vspace{} dan perintah pemutusan halaman \\clearpage sebelum bab baru.',
    starter_code: '\\documentclass{report}\n\\begin{document}\n  \\chapter{Bab Pertama}\n  Paragraf pertama.\n  % TODO: Tambahkan vspace{1cm} dan \\clearpage di sini\n  \n  \\chapter{Bab Kedua}\n  Paragraf di bab baru.\n\\end{document}',
    solution_code: '\\documentclass{report}\n\\begin{document}\n  \\chapter{Bab Pertama}\n  Paragraf pertama.\n  \\vspace{1cm}\n  \\clearpage\n  \n  \\chapter{Bab Kedua}\n  Paragraf di bab baru.\n\\end{document}',
  },
  18: {
    instruction: 'Praktikkan penggabungan sel horizontal menggunakan \\multicolumn{2}{c}{\\textbf{Header Gabungan}} pada tabel.',
    starter_code: '\\documentclass{article}\n\\begin{document}\n  \\begin{tabular}{|c|c|c|}\n    \\hline\n    % TODO: Gunakan \\multicolumn{2}{c}{Metrik} pada 2 kolom pertama\n    No & Nilai A & Nilai B \\\\\n    \\hline\n    1 & 85 & 90 \\\\\n    \\hline\n  \\end{tabular}\n\\end{document}',
    solution_code: '\\documentclass{article}\n\\begin{document}\n  \\begin{tabular}{|c|c|c|}\n    \\hline\n    \\multicolumn{2}{|c|}{\\textbf{Metrik}} & Status \\\\\n    \\hline\n    1 & 85 & Valid \\\\\n    \\hline\n  \\end{tabular}\n\\end{document}',
  },
  19: {
    instruction: 'Praktikkan pembuatan gambar berdampingan (sub-figure) menggunakan paket subcaption.',
    starter_code: '\\documentclass{article}\n\\usepackage{graphicx}\n\\usepackage{caption}\n\\usepackage{subcaption}\n\n\\begin{document}\n  % TODO: Buat lingkungan figure yang memuat 2 subfigure 0.45\\textwidth dengan \\hfill\n\n\\end{document}',
    solution_code: '\\documentclass{article}\n\\usepackage{graphicx}\n\\usepackage{caption}\n\\usepackage{subcaption}\n\n\\begin{document}\n  \\begin{figure}[h]\n    \\centering\n    \\begin{subfigure}[b]{0.45\\textwidth}\n      \\includegraphics[width=\\textwidth]{example-image-a}\n      \\caption{Gambar A}\n    \\end{subfigure}\n    \\hfill\n    \\begin{subfigure}[b]{0.45\\textwidth}\n      \\includegraphics[width=\\textwidth]{example-image-b}\n      \\caption{Gambar B}\n    \\end{subfigure}\n    \\caption{Perbandingan Dua Gambar}\n  \\end{figure}\n\\end{document}',
  },
  20: {
    instruction: 'Praktikkan penyajian cuplikan kode program menggunakan paket listings dengan opsi numbers=left dan frame=single.',
    starter_code: '\\documentclass{article}\n\\usepackage{listings}\n\n\\begin{document}\n  % TODO: Buat lingkungan lstlisting ber-bahasa Python\n\n\\end{document}',
    solution_code: '\\documentclass{article}\n\\usepackage{listings}\n\n\\begin{document}\n  \\begin{lstlisting}[language=Python, numbers=left, frame=single]\n  def hello():\n      print("Hello dari ScribeTex Unila")\n  \\end{lstlisting}\n\\end{document}',
  },
  21: {
    instruction: 'Praktikkan penulisan alfabet Yunani \\alpha, \\beta, \\sigma, dan operator relasional \\leq, \\geq di mode matematika.',
    starter_code: '\\documentclass{article}\n\\begin{document}\n  % TODO: Sisipkan alfabet Yunani alpha, beta, sigma dan operator <= di dalam kalimat\n\n\\end{document}',
    solution_code: '\\documentclass{article}\n\\begin{document}\n  Fungsi aktivasi $\\sigma(z)$ dengan parameter $\\alpha \\le \\beta$.\n\\end{document}',
  },
  22: {
    instruction: 'Praktikkan penulisan persamaan multi-baris sejajar menggunakan lingkungan align dari amsmath.',
    starter_code: '\\documentclass{article}\n\\usepackage{amsmath}\n\n\\begin{document}\n  % TODO: Buat lingkungan align multi-baris yang sejajar pada tanda sama dengan =\n\n\\end{document}',
    solution_code: '\\documentclass{article}\n\\usepackage{amsmath}\n\n\\begin{document}\n  \\begin{align}\n    f(x) &= (x + 2)^2 \\\\\n         &= x^2 + 4x + 4\n  \\end{align}\n\\end{document}',
  },
  23: {
    instruction: 'Praktikkan pemanggilan sitasi naratif \\textcite{key} dan sitasi dalam kurung \\parencite{key} via paket biblatex.',
    starter_code: '\\documentclass{article}\n\\usepackage[style=ieee]{biblatex}\n\\addbibresource{references.bib}\n\n\\begin{document}\n  % TODO: Gunakan \\textcite{Knuth1974} dan \\parencite{Lamport1994} di kalimat\n\n\\end{document}',
    solution_code: '\\documentclass{article}\n\\usepackage[style=ieee]{biblatex}\n\\addbibresource{references.bib}\n\n\\begin{document}\n  Menurut \\textcite{Knuth1974}, sistem ini sangat efisien \\parencite{Lamport1994}.\n\\end{document}',
  },
  24: {
    instruction: 'Praktikkan penambahan perintah \\tableofcontents dan entri manual \\addcontentsline{toc}{chapter}{ABSTRAK}.',
    starter_code: '\\documentclass{report}\n\\begin{document}\n  % TODO: Tambahkan \\tableofcontents dan \\addcontentsline untuk ABSTRAK\n  \\chapter*{ABSTRAK}\n  Teks abstrak.\n\n  \\chapter{PENDAHULUAN}\n\\end{document}',
    solution_code: '\\documentclass{report}\n\\begin{document}\n  \\tableofcontents\n  \\chapter*{ABSTRAK}\n  \\addcontentsline{toc}{chapter}{ABSTRAK}\n  Teks abstrak.\n\n  \\chapter{PENDAHULUAN}\n\\end{document}',
  },
  25: {
    instruction: 'Praktikkan pengaturan penomoran halaman Romawi \\pagenumbering{roman} untuk halaman awal dan Arab \\pagenumbering{arabic} untuk Bab I.',
    starter_code: '\\documentclass{report}\n\\begin{document}\n  % TODO: Set pagenumbering roman di awal, lalu set pagenumbering arabic dan reset counter page ke 1 di Bab I\n  \\chapter*{Kata Pengantar}\n\n  \\chapter{Pendahuluan}\n\\end{document}',
    solution_code: '\\documentclass{report}\n\\begin{document}\n  \\pagenumbering{roman}\n  \\setcounter{page}{1}\n  \\chapter*{Kata Pengantar}\n\n  \\cleardoublepage\n  \\pagenumbering{arabic}\n  \\setcounter{page}{1}\n  \\chapter{Pendahuluan}\n\\end{document}',
  },
  26: {
    instruction: 'Praktikkan penggunaan sakelar \\appendix untuk mengubah penomoran bab menjadi Lampiran A dan Lampiran B.',
    starter_code: '\\documentclass{report}\n\\begin{document}\n  \\chapter{Kesimpulan}\n  % TODO: Tambahkan sakelar \\appendix di sini\n  \\chapter{Kode Program}\n\\end{document}',
    solution_code: '\\documentclass{report}\n\\begin{document}\n  \\chapter{Kesimpulan}\n  \\appendix\n  \\chapter{Kode Program}\n\\end{document}',
  },
  27: {
    instruction: 'Praktikkan pembuatan diagram TikZ sederhana dengan meletakkan satu node berbingkai dan ber-latar warna.',
    starter_code: '\\documentclass{article}\n\\usepackage{tikz}\n\n\\begin{document}\n  % TODO: Buat tikzpicture dengan node[draw, fill=blue!10] {Mulai Penelitian}\n\n\\end{document}',
    solution_code: '\\documentclass{article}\n\\usepackage{tikz}\n\n\\begin{document}\n  \\begin{tikzpicture}\n    \\node[draw, rectangle, fill=blue!10] {Mulai Penelitian};\n  \\end{tikzpicture}\n\\end{document}',
  },
}

// 7 Unila Academic Guide Articles (Strictly Conforming to Unila 2020 preamble.tex)
const ARTICLES_DATA = [
  {
    id: 1,
    title: 'Panduan Format Halaman & Margin Skripsi Unila',
    content: `# Panduan Format Halaman & Margin Skripsi Unila

Berdasarkan **Buku Pedoman Penulisan Karya Ilmiah Universitas Lampung 2020**, format fisik naskah skripsi diatur sebagai berikut:

- **Ukuran Kertas:** A4 (210 mm x 297 mm), 80 gram.
- **Margin Halaman:**
  - **Kiri (*Left*):** 4 cm (untuk batas jilid baku).
  - **Atas (*Top*):** 3 cm.
  - **Kanan (*Right*):** 3 cm.
  - **Bawah (*Bottom*):** 3 cm.
- **Jenis & Ukuran Font:** *Times New Roman* 12 pt untuk narasi utama. Pada mesin \`pdfLaTeX\`, gunakan paket \`mathptmx\`. Pada mesin \`XeLaTeX\`, gunakan paket \`fontspec\` dengan \`\\setmainfont{Times New Roman}\`.
- **Spasi Antarbaris:** 1.5 baris (\`\\setstretch{1.5}\`).
- **Paragraf:** Tanpa indentasi awal (\`\\setlength{\\parindent}{0pt}\`) dan jarak spasi antar-paragraf (\`\\setlength{\\parskip}{0.5\\baselineskip plus 2pt}\`).

\`\`\`latex
% Konfigurasi Preamble Standar Unila 2020:
\\documentclass[12pt,a4paper]{report}

\\usepackage{iftex}
\\ifPDFTeX
  \\usepackage[T1]{fontenc}
  \\usepackage{mathptmx}  % Font Times New Roman untuk pdfLaTeX
\\else
  \\usepackage{fontspec}
  \\setmainfont{Times New Roman} % Font Times New Roman untuk XeLaTeX
\\fi

\\usepackage[a4paper,left=4cm,right=3cm,top=3cm,bottom=3cm]{geometry}
\\usepackage[english,indonesian]{babel}
\\selectlanguage{indonesian}

\\usepackage{setspace}
\\setstretch{1.5}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0.5\\baselineskip plus 2pt}
\`\`\``,
    is_published: true,
  },
  {
    id: 2,
    title: 'Panduan Struktur Bab & Penomoran Seksi Unila',
    content: `# Panduan Struktur Bab & Penomoran Seksi Unila

Format penulisan struktur bab dan penomoran seksi karya ilmiah Universitas Lampung 2020:

- **Penomoran Bab (\`\\thechapter\`):** Menggunakan angka **Romawi Kapital** (\`BAB I\`, \`BAB II\`, dst.).
- **Penomoran Seksi (\`\\thesection\`):** Menggunakan angka Arab bertingkat (\`1.1 Latar Belakang\`, \`1.2 Rumusan Masalah\`).
- **Penomoran Sub-seksi (\`\\thesubsection\`):** Tiga tingkat (\`1.2.1 Identifikasi Masalah\`).
- **Judul Bab:** Rata tengah, cetak tebal, huruf kapital tegak.

\`\`\`latex
% Konfigurasi Penomoran Bab & Seksi Unila di Preamble:
\\renewcommand{\\thechapter}{\\Roman{chapter}}
\\renewcommand{\\thesection}{\\arabic{chapter}.\\arabic{section}}
\\renewcommand{\\thesubsection}{\\thesection.\\arabic{subsection}}

% Penerapan di area Body:
\\chapter{PENDAHULUAN}
\\section{Latar Belakang}
\\subsection{Identifikasi Masalah}
\`\`\``,
    is_published: true,
  },
  {
    id: 3,
    title: 'Panduan Standar Pembuatan Tabel & Gambar Akademik Unila',
    content: `# Panduan Standar Pembuatan Tabel & Gambar Akademik Unila

Ketentuan penyajian elemen visual di Universitas Lampung 2020:

- **Judul Gambar:** Ditempatkan di **bagian bawah gambar**, penomoran menggunakan kata \`Gambar\` (bukan *Figure*) yang berjalan secara kontinu (\`Gambar 1\`, \`Gambar 2\`, dst.) via \`\\counterwithout{figure}{chapter}\`.
- **Judul Tabel:** Ditempatkan di **bagian atas tabel**, rata kiri/tengah, penomoran menggunakan kata \`Tabel\` (\`Tabel 1\`, \`Tabel 2\`, dst.) via \`\\counterwithout{table}{chapter}\`.
- **Estetika Tabel:** Sangat disarankan **tanpa garis vertikal** menggunakan paket \`booktabs\` (\`\\toprule\`, \`\\midrule\`, \`\\bottomrule\`).

\`\`\`latex
% Preamble Konfigurasi Gambar & Tabel Unila:
\\usepackage{graphicx}
\\usepackage{caption}
\\usepackage{booktabs}
\\usepackage{float}

\\renewcommand{\\figurename}{Gambar}
\\renewcommand{\\tablename}{Tabel}
\\counterwithout{figure}{chapter}
\\counterwithout{table}{chapter}

% Contoh Tabel Akademik Clean:
\\begin{table}[H]
  \\centering
  \\caption{Matriks Hasil Pengujian Black Box System}
  \\label{tab:blackbox}
  \\begin{tabular}{clc}
    \\toprule
    \\textbf{ID Uji} & \\textbf{Fitur Utama} & \\textbf{Hasil Evaluasi} \\\\
    \\midrule
    TC-01 & Autentikasi Supabase & Valid \\\\
    TC-02 & Kompilator Docker Sandbox & Valid \\\\
    \\bottomrule
  \\end{tabular}
\\end{table}
\`\`\``,
    is_published: true,
  },
  {
    id: 4,
    title: 'Panduan Penulisan Rumus Matematika & Persamaan Unila',
    content: `# Panduan Penulisan Rumus Matematika & Persamaan Unila

Pedoman penulisan formula matematika dan persamaan komputasi:

- **Paket Wajib:** Menggunakan pustaka \`amsmath\` dan \`amssymb\`.
- **Inline Math (\`$...$\`):** Digunakan untuk variabel atau rumus pendek di tengah kalimat narasi (misal: $E = mc^2$).
- **Display Math (\`equation\`):** Digunakan untuk persamaan utama, ditempatkan di baris terpisah terpusat dengan nomor persamaan otomatis di kanan.
- **Persamaan Multi-baris (\`align\`):** Digunakan untuk penjabaran fungsi bertingkat yang sejajar pada simbol \`&=\`.

\`\`\`latex
\\usepackage{amsmath,amssymb}

% Persamaan Tunggal Bernomor:
\\begin{equation}
  x_{1,2} = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
  \\label{eq:rumus_abc}
\\end{equation}

% Penjabaran Multi-baris Sejajar:
\\begin{align}
  f(x) &= (x + 3)^2 - 5 \\\\
       &= x^2 + 6x + 4
\\end{align}
\`\`\``,
    is_published: true,
  },
  {
    id: 5,
    title: 'Panduan Sitasi & Daftar Pustaka Unila (BibLaTeX)',
    content: `# Panduan Sitasi & Daftar Pustaka Unila (BibLaTeX)

Ketentuan pengutipan dan penyusunan Bab **DAFTAR PUSTAKA** Universitas Lampung:

- **Mesin & Gaya Sitasi:** Menggunakan \`biblatex\` dengan \`backend=biber\` dan gaya penulisan \`style=ieee\` (\`sorting=none\`).
- **Otomatisasi:** Seluruh referensi disimpan di berkas \`references.bib\` dan dipanggil di narasi via \`\\cite{key}\` atau \`\\textcite{key}\`.
- **Format Judul Pustaka:** Bab Daftar Pustaka dicetak otomatis menggunakan \`\\printbibliography[heading=bibintoc, title={\\textbf{DAFTAR PUSTAKA}}]\`.

\`\`\`latex
% Preamble Bibliografi Unila:
\\usepackage{csquotes}
\\usepackage[backend=biber,style=ieee,sorting=none]{biblatex}
\\addbibresource{references.bib}

% Di dalam Body:
Menurut penelitian \\textcite{Knuth1974}, pemrograman terstruktur menjamin kualitas sistem. Penggunaan \\LaTeX{} terbukti menjaga konsistensi naskah skripsi~\\cite{Lamport1994}.

% Render Bab Daftar Pustaka:
\\cleardoublepage
\\printbibliography[heading=bibintoc, title={\\textbf{DAFTAR PUSTAKA}}]
\`\`\``,
    is_published: true,
  },
  {
    id: 6,
    title: 'Panduan Header, Footer & Penomoran Halaman Unila',
    content: `# Panduan Header, Footer & Penomoran Halaman Unila

Ketentuan penomoran halaman naskah skripsi berdasarkan Panduan Unila 2020:

- **Bagian Awal (Halaman Sampul s.d. Daftar Tabel):** Menggunakan **angka Romawi kecil (i, ii, iii)** di bagian bawah tengah (\`\\pagenumbering{roman}\`).
- **Bagian Utama (Bab I s.d. Daftar Pustaka):** Menggunakan **angka Arab (1, 2, 3)** yang diletakkan di **pojok kanan atas** (\`\\pagenumbering{arabic}\` + reset \`\\setcounter{page}{1}\`).
- **Header Kustom (\`fancyhdr\`):** Menggunakan nomor halaman abu-abu tebal (\`\\textcolor{gray}{\\textbf{\\thepage}}\`) tanpa garis header.

\`\`\`latex
% Preamble Fancyhdr Unila:
\\usepackage{fancyhdr}
\\usepackage{xcolor}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[R]{\\textcolor{gray}{\\textbf{\\thepage}}}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\fancypagestyle{plain}{
  \\fancyhf{}
  \\renewcommand{\\headrulewidth}{0pt}
  \\renewcommand{\\footrulewidth}{0pt}
}
\`\`\``,
    is_published: true,
  },
  {
    id: 7,
    title: 'Panduan Daftar Isi, Gambar & Tabel Otomatis (tocloft)',
    content: `# Panduan Daftar Isi, Gambar & Tabel Otomatis (tocloft)

Ketentuan penyusunan halaman navigasi otomatis naskah skripsi Unila:

- **Format Titik Penghubung (*Leader Dots*):** Seluruh entri Bab di Daftar Isi wajib dihubungkan dengan titik-titik sampai nomor halaman via paket \`tocloft\`.
- **Prefiks Gambar & Tabel:** Daftar Gambar dan Daftar Tabel wajib memiliki kata prefiks \`Gambar X.\` dan \`Tabel X.\`.
- **Entri Non-Bab ke TOC:** Halaman khusus seperti ABSTRAK dan KATA PENGANTAR dimasukkan ke Daftar Isi via \`\\addcontentsline{toc}{chapter}{...}\`.

\`\`\`latex
% Konfigurasi tocloft Preamble Unila:
\\usepackage{tocloft}

\\renewcommand{\\cftchapdotsep}{\\cftdotsep}
\\renewcommand{\\cftchapleader}{\\cftdotfill{\\cftdotsep}}

\\renewcommand{\\cftfigpresnum}{Gambar\\ }
\\renewcommand{\\cftfigaftersnum}{.\\hspace{0.5em}}
\\setlength{\\cftfignumwidth}{5em}

\\renewcommand{\\cfttabpresnum}{Tabel\\ }
\\renewcommand{\\cfttabaftersnum}{.\\hspace{0.5em}}
\\setlength{\\cfttabnumwidth}{5em}

% Di area Body:
\\tableofcontents
\\listoffigures
\\listoftables
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

  // Sinkronisasi PostgreSQL Auto-Increment Sequence agar tidak terjadi Unique Constraint Error (id) saat Admin membuat data baru
  try {
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"modules"', 'id'), coalesce(max(id), 1)) FROM "modules";`)
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"lessons"', 'id'), coalesce(max(id), 1)) FROM "lessons";`)
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"exercises"', 'id'), coalesce(max(id), 1)) FROM "exercises";`)
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"articles"', 'id'), coalesce(max(id), 1)) FROM "articles";`)
    console.log('🔄 PostgreSQL Auto-increment sequences berhasil disinkronkan!')
  } catch (seqErr) {
    console.warn('⚠️ Peringatan saat sinkronisasi sequence PostgreSQL:', seqErr)
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
