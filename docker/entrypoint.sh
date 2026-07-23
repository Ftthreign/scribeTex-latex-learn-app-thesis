#!/bin/bash

INPUT_FILE="document.tex"
OUTPUT_FILE="document.pdf"

if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: Berkas input $INPUT_FILE tidak ditemukan di workspace!" >&2
    exit 1
fi

pdflatex -interaction=nonstopmode -halt-on-error -no-shell-escape "$INPUT_FILE" > /dev/null 2>&1
COMPILE_STATUS=$?

if [ -f "$OUTPUT_FILE" ]; then
    exit 0
else
    echo "Kompilasi LaTeX gagal. Periksa log kesalahan." >&2
    exit 2
fi
