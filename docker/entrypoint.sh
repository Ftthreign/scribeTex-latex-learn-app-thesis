#!/bin/bash
set -e

ENTRY_FILE="${ENTRY_FILE:-document.tex}"
ENTRY_BASENAME="${ENTRY_FILE%.tex}"

if [ ! -f "$ENTRY_FILE" ]; then
    echo "Error: Berkas entry '$ENTRY_FILE' tidak ditemukan di workspace!" >&2
    exit 1
fi

pdflatex -interaction=nonstopmode -no-shell-escape "$ENTRY_FILE" > /dev/null 2>&1 || true

if ls *.bib 1> /dev/null 2>&1; then
    bibtex "$ENTRY_BASENAME" > /dev/null 2>&1 || true
fi

pdflatex -interaction=nonstopmode -no-shell-escape "$ENTRY_FILE" > /dev/null 2>&1 || true

pdflatex -interaction=nonstopmode -no-shell-escape "$ENTRY_FILE" > /dev/null 2>&1 || true

OUTPUT_FILE="${ENTRY_BASENAME}.pdf"

if [ -f "$OUTPUT_FILE" ]; then
    exit 0
else
    echo "Kompilasi LaTeX gagal! Periksa berkas log ${ENTRY_BASENAME}.log" >&2
    exit 2
fi
