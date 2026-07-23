import { defineEventHandler, readBody, createError } from 'h3'
import { sanitizeLatex } from '~~/server/utils/sanitizer'
import { CompileService } from '~~/server/services/compile.service'

export default defineEventHandler(async (event) => {
  // 1. Baca payload body — mendukung format multi-file
  const body = await readBody<{
    files?: Record<string, string>  // Multi-file: { "main.tex": "...", "preamble.tex": "..." }
    entryFile?: string              // Root file kompilasi (default: "main.tex")
    code?: string                   // Backward-compat: single-file format lama
  }>(event)

  let files: Record<string, string>
  let entryFile: string

  // 2. Normalisasi payload: dukung format lama (code) dan baru (files)
  if (body?.files && typeof body.files === 'object') {
    // Format baru: multi-file workspace
    files = body.files
    entryFile = body.entryFile || 'main.tex'
  } else if (body?.code && typeof body.code === 'string') {
    // Format lama: single-file (backward compatible)
    files = { 'document.tex': body.code }
    entryFile = 'document.tex'
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payload tidak valid. Sertakan "files" (multi-file) atau "code" (single-file).',
    })
  }

  // 3. Validasi: entry file wajib ada di dalam kamus files
  if (!files[entryFile]) {
    throw createError({
      statusCode: 400,
      statusMessage: `Berkas entry "${entryFile}" tidak ditemukan di dalam workspace.`,
    })
  }

  // 4. Sanitasi keamanan pada semua berkas .tex (Sanitizer lapis 1)
  for (const [fileName, content] of Object.entries(files)) {
    if (fileName.endsWith('.tex')) {
      const securityCheck = sanitizeLatex(content)
      if (!securityCheck.isSafe) {
        throw createError({
          statusCode: 400,
          statusMessage: `[${fileName}] ${securityCheck.reason || 'Perintah berisiko keamanan terdeteksi.'}`,
        })
      }
    }
  }

  // 5. Jalankan service kompilasi Docker LaTeX multi-file
  const result = await CompileService.compileDocument(files, entryFile)

  if (!result.isSuccess) {
    return {
      statusCode: 422,
      message: result.errorText || 'Kompilasi dokumen LaTeX gagal.',
      data: {
        isSuccess: false,
        logs: result.logs,
        errorText: result.errorText,
      },
    }
  }

  return {
    statusCode: 200,
    message: 'Kompilasi berkas PDF berhasil!',
    data: {
      isSuccess: true,
      pdfBase64: result.pdfBase64,
      logs: result.logs,
    },
  }
})
