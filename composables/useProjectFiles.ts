/**
 * composables/useProjectFiles.ts
 * State management untuk Multi-File Project Workspace pada Sandbox.
 * Mengelola daftar berkas, konten, dan berkas yang sedang aktif di editor.
 */

import { ref, computed } from 'vue'

export interface ProjectFile {
  /** Nama berkas lengkap, mis. "main.tex", "preamble.tex", "references.bib" */
  name: string
  /** Konten teks berkas */
  content: string
}

// ─── Default Workspace (2 berkas awal) ───────────────────────────────────────

const DEFAULT_PREAMBLE = `% preamble.tex — Pengaturan dokumen global
\\usepackage[utf8]{inputenc}
\\usepackage[english]{babel}
\\usepackage{amsmath, amssymb}
\\usepackage{graphicx}
\\usepackage{geometry}
\\geometry{margin=2.5cm}
`

const DEFAULT_MAIN = `% main.tex — Berkas utama kompilasi (jangan hapus)
\\documentclass[12pt]{report}
\\input{preamble}

\\title{Dokumen Eksperimen ScribeTex Sandbox}
\\author{Mahasiswa Pembelajaran \\LaTeX{}}
\\date{\\today}

\\begin{document}

\\maketitle

\\chapter{Pendahuluan}

Tulis konten Bab 1 di sini. Anda dapat membagi konten ke berkas terpisah
seperti \\texttt{bab1.tex} lalu memuatnya dengan perintah:

\\begin{verbatim}
\\input{bab1}
\\end{verbatim}

\\end{document}
`

// ─── Composable ──────────────────────────────────────────────────────────────

export function useProjectFiles() {
  /** Daftar seluruh berkas di workspace */
  const files = ref<ProjectFile[]>([
    { name: 'main.tex', content: DEFAULT_MAIN },
    { name: 'preamble.tex', content: DEFAULT_PREAMBLE },
  ])

  /** Nama berkas yang saat ini terbuka di editor */
  const activeFileName = ref<string>('main.tex')

  /** Berkas yang sedang aktif (computed dari activeFileName) */
  const activeFile = computed<ProjectFile>(
    () => files.value.find((f) => f.name === activeFileName.value) ?? files.value[0]
  )

  /** Berkas root yang dikompilasi Docker — selalu main.tex */
  const ENTRY_FILE = 'main.tex'

  // ─── Actions ───────────────────────────────────────────────────────────────

  /** Beralih ke berkas lain di editor */
  function switchFile(name: string) {
    if (files.value.some((f) => f.name === name)) {
      activeFileName.value = name
    }
  }

  /** Update konten berkas aktif saat editor berubah */
  function updateContent(name: string, content: string) {
    const file = files.value.find((f) => f.name === name)
    if (file) file.content = content
  }

  /** Tambah berkas baru ke workspace */
  function addFile(name: string, content: string = '') {
    const trimmedName = name.trim()
    if (!trimmedName) return { error: 'Nama berkas tidak boleh kosong.' }
    if (files.value.some((f) => f.name === trimmedName)) {
      return { error: `Berkas "${trimmedName}" sudah ada di workspace.` }
    }
    // Pastikan berkas memiliki ekstensi yang wajar
    const allowedExtensions = ['.tex', '.bib', '.sty', '.cls', '.bst']
    const ext = trimmedName.includes('.') ? `.${trimmedName.split('.').pop()}` : ''
    if (!allowedExtensions.includes(ext)) {
      return { error: `Ekstensi "${ext || 'tidak ada'}" tidak didukung. Gunakan: ${allowedExtensions.join(', ')}` }
    }
    files.value.push({ name: trimmedName, content })
    activeFileName.value = trimmedName
    return { error: null }
  }

  /** Hapus berkas dari workspace (main.tex tidak bisa dihapus) */
  function deleteFile(name: string) {
    if (name === ENTRY_FILE) return { error: 'Berkas "main.tex" tidak dapat dihapus.' }
    const index = files.value.findIndex((f) => f.name === name)
    if (index === -1) return { error: `Berkas "${name}" tidak ditemukan.` }

    files.value.splice(index, 1)
    // Jika berkas yang dihapus adalah yang aktif, beralih ke main.tex
    if (activeFileName.value === name) {
      activeFileName.value = ENTRY_FILE
    }
    return { error: null }
  }

  /** Rename berkas (main.tex tidak bisa di-rename) */
  function renameFile(oldName: string, newName: string) {
    if (oldName === ENTRY_FILE) return { error: 'Berkas "main.tex" tidak dapat di-rename.' }
    const file = files.value.find((f) => f.name === oldName)
    if (!file) return { error: `Berkas "${oldName}" tidak ditemukan.` }
    if (files.value.some((f) => f.name === newName)) {
      return { error: `Nama "${newName}" sudah digunakan.` }
    }
    file.name = newName
    if (activeFileName.value === oldName) activeFileName.value = newName
    return { error: null }
  }

  /** Konversi state ke payload API: Record<string, string> */
  function toPayload(): Record<string, string> {
    return Object.fromEntries(files.value.map((f) => [f.name, f.content]))
  }

  return {
    files,
    activeFileName,
    activeFile,
    ENTRY_FILE,
    switchFile,
    updateContent,
    addFile,
    deleteFile,
    renameFile,
    toPayload,
  }
}
