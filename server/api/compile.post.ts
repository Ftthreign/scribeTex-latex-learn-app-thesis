import { defineEventHandler, readBody, createError } from "h3";
import { sanitizeLatex } from "~~/server/utils/sanitizer";
import { CompileService } from "~~/server/services/compile.service";

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    files?: Record<string, string>; // Multi-file: { "main.tex": "...", "preamble.tex": "..." }
    entryFile?: string; // Root file kompilasi (default: "main.tex")
    code?: string; // Backward-compat: single-file format lama
  }>(event);

  let files: Record<string, string>;
  let entryFile: string;

  if (body?.files && typeof body.files === "object") {
    // Format baru: multi-file workspace
    files = body.files;
    entryFile = body.entryFile || "main.tex";
  } else if (body?.code && typeof body.code === "string") {
    // Format lama: single-file (backward compatible)
    files = { "document.tex": body.code };
    entryFile = "document.tex";
  } else {
    throw createError({
      statusCode: 400,
      statusMessage:
        'Payload tidak valid. Sertakan "files" (multi-file) atau "code" (single-file).',
    });
  }

  if (!files[entryFile]) {
    throw createError({
      statusCode: 400,
      statusMessage: `Berkas entry "${entryFile}" tidak ditemukan di dalam workspace.`,
    });
  }

  for (const [fileName, content] of Object.entries(files)) {
    if (fileName.endsWith(".tex")) {
      const securityCheck = sanitizeLatex(content);
      if (!securityCheck.isSafe) {
        throw createError({
          statusCode: 400,
          statusMessage: `[${fileName}] ${securityCheck.reason || "Perintah berisiko keamanan terdeteksi."}`,
        });
      }
    }
  }

  const result = await CompileService.compileDocument(files, entryFile);

  if (!result.isSuccess) {
    return {
      statusCode: 422,
      message: result.errorText || "Kompilasi dokumen LaTeX gagal.",
      data: {
        isSuccess: false,
        logs: result.logs,
        errorText: result.errorText,
      },
    };
  }

  return {
    statusCode: 200,
    message: "Kompilasi berkas PDF berhasil!",
    data: {
      isSuccess: true,
      pdfBase64: result.pdfBase64,
      logs: result.logs,
    },
  };
});
