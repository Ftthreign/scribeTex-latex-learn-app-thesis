#!/bin/bash
set -e

ENTRY_FILE="${ENTRY_FILE:-document.tex}"
ENTRY_BASENAME="${ENTRY_FILE%.tex}"
LOG_FILE="${ENTRY_BASENAME}.log"
OUTPUT_FILE="${ENTRY_BASENAME}.pdf"

if [ ! -f "$ENTRY_FILE" ]; then
    echo "Error: Berkas entry '$ENTRY_FILE' tidak ditemukan di workspace!" >&2
    exit 1
fi

pdflatex -interaction=nonstopmode -no-shell-escape "$ENTRY_FILE" > /dev/null 2>&1 || true

HAS_BIB=false
if ls *.bib 1> /dev/null 2>&1; then
    HAS_BIB=true
    bibtex "$ENTRY_BASENAME" > /dev/null 2>&1 || true
fi

if [ "$HAS_BIB" = true ] || { [ -f "$LOG_FILE" ] && grep -qE "Rerun to get|Label\(s\) may have changed|Citation" "$LOG_FILE"; }; then
    pdflatex -interaction=nonstopmode -no-shell-escape "$ENTRY_FILE" > /dev/null 2>&1 || true
    pdflatex -interaction=nonstopmode -no-shell-escape "$ENTRY_FILE" > /dev/null 2>&1 || true
fi

if [ -f "$OUTPUT_FILE" ]; then
    exit 0
else
    echo "Kompilasi LaTeX gagal! Periksa berkas log ${LOG_FILE}" >&2
    exit 2
fi
