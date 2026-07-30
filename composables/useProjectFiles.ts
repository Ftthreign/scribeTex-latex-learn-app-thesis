import { ref, computed } from "vue";

export interface ProjectFile {
  isDirty: boolean;
  name: string;
  content: string;
}

const DEFAULT_PREAMBLE = `% preamble.tex — Pengaturan Baku Skripsi Unila 2020
\\usepackage{iftex}
\\ifPDFTeX
  \\usepackage[T1]{fontenc}
  \\usepackage{mathptmx}
\\else
  \\usepackage{fontspec}
  \\setmainfont{Times New Roman}
\\fi
\\usepackage[a4paper,left=4cm,right=3cm,top=3cm,bottom=3cm]{geometry}
\\usepackage[english,indonesian]{babel}
\\selectlanguage{indonesian}

\\usepackage{setspace}
\\setstretch{1.5}
\\setlength{\parindent}{0pt}
\\setlength{\parskip}{0.5\\baselineskip plus 2pt}

\\usepackage{amsmath, amssymb}
\\usepackage{graphicx}
\\usepackage{caption}
\\usepackage{float}
\\usepackage{booktabs}
\\usepackage{fancyhdr}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[R]{\\textcolor{gray}{\\textbf{\\thepage}}}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\renewcommand{\\figurename}{Gambar}
\\renewcommand{\\tablename}{Tabel}
\\counterwithout{figure}{chapter}
\\counterwithout{table}{chapter}

\\usepackage{csquotes}
\\usepackage[backend=biber,style=ieee,sorting=none]{biblatex}
\\addbibresource{references.bib}
\\usepackage{hyperref}
`;

const DEFAULT_MAIN = `% main.tex — Berkas utama kompilasi Skripsi ScribeTex
\\documentclass[12pt,a4paper]{report}
\\input{preamble}

\\begin{document}

\\pagenumbering{roman}
\\setcounter{page}{1}

\\title{PENGEMBANGAN APLIKASI WEB PEMBELAJARAN LATEX}
\\author{Fadhil Abdul Fattah \\\\ NPM: 2215061019}
\\date{2026}

\\maketitle

\\cleardoublepage
\\pagenumbering{arabic}
\\setcounter{page}{1}

\\chapter{PENDAHULUAN}

\\section{Latar Belakang}
Penulisan naskah skripsi Universitas Lampung menggunakan standar penataan letak berbasis \\LaTeX{} untuk menjamin konsistensi format dan stabilitas dokumen.

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
    if (file && file.content !== content) {
      file.content = content;
      file.isDirty = true;
    }
  }

  const hasUnsavedChanges = computed(() => files.value.some((f) => f.isDirty));

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
    hasUnsavedChanges,
  };
}
