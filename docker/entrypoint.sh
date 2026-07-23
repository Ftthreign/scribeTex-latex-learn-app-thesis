#!/bin/bash
set -e

# ENTRY_FILE dapat di-override via environment variable Docker (-e ENTRY_FILE=main.tex)
# Default ke document.tex agar backward compatible dengan kompilasi single-file lama
ENTRY_FILE="${ENTRY_FILE:-document.tex}"
ENTRY_BASENAME="${ENTRY_FILE%.tex}"

if [ ! -f "$ENTRY_FILE" ]; then
    echo "Error: Berkas entry '$ENTRY_FILE' tidak ditemukan di workspace!" >&2
    exit 1
fi

# Eksekusi pdflatex tahap 1 — bangun struktur dokumen (TOC, label, dll.)
pdflatex -interaction=nonstopmode -no-shell-escape "$ENTRY_FILE" > /dev/null 2>&1 || true

# Eksekusi BibTeX jika terdapat berkas .bib di workspace (opsional, jangan gagalkan)
if ls *.bib 1> /dev/null 2>&1; then
    bibtex "$ENTRY_BASENAME" > /dev/null 2>&1 || true
fi

# Eksekusi pdflatex tahap 2 — resolve \cite, \ref setelah BibTeX
pdflatex -interaction=nonstopmode -no-shell-escape "$ENTRY_FILE" > /dev/null 2>&1 || true

# Eksekusi pdflatex tahap 3 — finalisasi cross-reference dan TOC
pdflatex -interaction=nonstopmode -no-shell-escape "$ENTRY_FILE" > /dev/null 2>&1 || true

OUTPUT_FILE="${ENTRY_BASENAME}.pdf"

if [ -f "$OUTPUT_FILE" ]; then
    exit 0
else
    echo "Kompilasi LaTeX gagal! Periksa berkas log ${ENTRY_BASENAME}.log" >&2
    exit 2
fi
