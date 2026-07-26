import { ref, computed } from "vue";

export interface ProjectFile {
  isDirty: boolean;
  name: string;
  content: string;
}

const DEFAULT_PREAMBLE = `% preamble.tex — Pengaturan dokumen global
\\usepackage[utf8]{inputenc}
\\usepackage[english]{babel}
\\usepackage{amsmath, amssymb}
\\usepackage{graphicx}
\\usepackage{geometry}
\\geometry{margin=2.5cm}
`;

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
`;

export function useProjectFiles() {
  const files = ref<ProjectFile[]>([
    {
      name: "main.tex",
      content: DEFAULT_MAIN,
      isDirty: false,
    },
    {
      name: "preamble.tex",
      content: DEFAULT_PREAMBLE,
      isDirty: false,
    },
  ]);

  const activeFileName = ref<string>("main.tex");

  const activeFile = computed<ProjectFile>(
    () =>
      files.value.find((f) => f.name === activeFileName.value) ??
      files.value[0],
  );

  const ENTRY_FILE = "main.tex";

  function switchFile(name: string) {
    if (files.value.some((f) => f.name === name)) {
      activeFileName.value = name;
    }
  }

  function updateContent(name: string, content: string) {
    const file = files.value.find((f) => f.name === name);
    if (file) file.content = content;
  }

  function addFile(name: string, content: string = "") {
    const trimmedName = name.trim();
    if (!trimmedName) return { error: "Nama berkas tidak boleh kosong." };
    if (files.value.some((f) => f.name === trimmedName)) {
      return { error: `Berkas "${trimmedName}" sudah ada di workspace.` };
    }
    const allowedExtensions = [".tex", ".bib", ".sty", ".cls", ".bst"];
    const ext = trimmedName.includes(".")
      ? `.${trimmedName.split(".").pop()}`
      : "";
    if (!allowedExtensions.includes(ext)) {
      return {
        error: `Ekstensi "${ext || "tidak ada"}" tidak didukung. Gunakan: ${allowedExtensions.join(", ")}`,
      };
    }
    files.value.push({
      name: trimmedName,
      content,
      isDirty: false,
    });
    activeFileName.value = trimmedName;
    return { error: null };
  }

  function deleteFile(name: string) {
    if (name === ENTRY_FILE)
      return { error: 'Berkas "main.tex" tidak dapat dihapus.' };
    const index = files.value.findIndex((f) => f.name === name);
    if (index === -1) return { error: `Berkas "${name}" tidak ditemukan.` };

    files.value.splice(index, 1);
    if (activeFileName.value === name) {
      activeFileName.value = ENTRY_FILE;
    }
    return { error: null };
  }

  /** Rename berkas (main.tex tidak bisa di-rename) */
  function renameFile(oldName: string, newName: string) {
    if (oldName === ENTRY_FILE)
      return { error: 'Berkas "main.tex" tidak dapat di-rename.' };
    const file = files.value.find((f) => f.name === oldName);
    if (!file) return { error: `Berkas "${oldName}" tidak ditemukan.` };
    if (files.value.some((f) => f.name === newName)) {
      return { error: `Nama "${newName}" sudah digunakan.` };
    }
    file.name = newName;
    if (activeFileName.value === oldName) activeFileName.value = newName;
    return { error: null };
  }

  /** Konversi state ke payload API: Record<string, string> */
  function toPayload(): Record<string, string> {
    return Object.fromEntries(files.value.map((f) => [f.name, f.content]));
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
  };
}
