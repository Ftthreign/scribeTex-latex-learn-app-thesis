import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const execAsync = promisify(exec);

async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

export interface CompileLogEntry {
  line?: number;
  message: string;
  raw?: string;
}

export interface CompileOutput {
  isSuccess: boolean;
  pdfBase64?: string;
  pdfUrl?: string;
  logs: CompileLogEntry[];
  errorText?: string;
}

export class CompileService {
  /**
   * Mengeksekusi kompilasi multi-file LaTeX di dalam lingkungan terisolasi Docker.
   * @param files  - Kamus nama_berkas => konten (mis. { "main.tex": "...", "preamble.tex": "..." })
   * @param entryFile - Berkas root yang dikompilasi (default: "main.tex")
   */
  static async compileDocument(
    files: Record<string, string>,
    entryFile: string = "main.tex",
  ): Promise<CompileOutput> {
    const uniqueId = crypto.randomBytes(8).toString("hex");
    const projectRoot = process.cwd();
    const tmpDir = path.join(projectRoot, "tmp", `scribetex-${uniqueId}`);
    const entryBasename = entryFile.replace(/\.tex$/, "");
    const pdfPath = path.join(tmpDir, `${entryBasename}.pdf`);
    const logPath = path.join(tmpDir, `${entryBasename}.log`);

    try {
      // 1. Buat direktori temporer
      await fs.mkdir(tmpDir, { recursive: true });
      await fs.chmod(tmpDir, 0o777);

      // 2. Tulis SEMUA berkas workspace ke direktori temporer (dukung subfolder seperti bab/bab1.tex)
      for (const [fileName, content] of Object.entries(files)) {
        // Normalisasi nama berkas dan cegah path traversal berbahaya (..)
        const cleanFileName = fileName
          .replace(/\\/g, "/")
          .replace(/\.\.\//g, "");
        const filePath = path.join(tmpDir, cleanFileName);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, content, "utf-8");
      }

      // 3. Cek apakah Docker daemon dapat diakses di mesin server / host
      const isDockerAvailable = await this.checkDockerAvailability();

      if (!isDockerAvailable) {
        // Fallback jika Docker daemon belum/tidak aktif di mesin dev lokal
        return await this.handleLocalFallbackCompile(files, entryFile, tmpDir);
      }

      // 4. Eksekusi Docker container terisolasi:
      // --rm: hapus kontainer setelah selesai
      // --network none: isolasi total dari internet
      // --memory 512m: batasi alokasi RAM maksimal 512MB
      // -e ENTRY_FILE: beritahu entrypoint.sh berkas mana yang dikompilasi
      // -v: mount direktori temporer sebagai workspace
      const dockerCmd = `docker run --rm --user root --network none --memory 512m -e ENTRY_FILE="${entryFile}" -v "${tmpDir}:/workspace" scribetex-compiler`;

      try {
        await execAsync(dockerCmd, { timeout: 60000 }); // timeout 60 detik
      } catch (execErr: any) {
        console.warn(
          "[CompileService] Exec Docker warning/error:",
          execErr?.message,
        );
      }

      // 5. Periksa apakah berkas PDF berhasil dihasilkan
      const pdfFileExists = await pathExists(pdfPath);

      if (pdfFileExists) {
        const pdfBuffer = await fs.readFile(pdfPath);
        const pdfBase64 = `data:application/pdf;base64,${pdfBuffer.toString("base64")}`;

        const logs = await this.parseLogFile(logPath);

        return {
          isSuccess: true,
          pdfBase64,
          logs,
        };
      } else {
        // Kompilasi gagal, ekstrak log kesalahan
        const logs = await this.parseLogFile(logPath);
        const firstError = logs.find((l) => l.message);
        const errorText = firstError
          ? `[Baris ${firstError.line || "?"}] ${firstError.message}`
          : "Kompilasi LaTeX gagal. Silakan periksa sintaks dokumen Anda.";

        return {
          isSuccess: false,
          logs,
          errorText,
        };
      }
    } catch (err: any) {
      console.error("[CompileService] Uncaught error during compile:", err);
      return {
        isSuccess: false,
        logs: [
          {
            message:
              err?.message || "Terjadi kesalahan pada server kompilator.",
          },
        ],
        errorText: err?.message || "Gagal memproses kompilasi dokumen.",
      };
    } finally {
      // 6. Selalu bersihkan direktori temporer
      try {
        await fs.rm(tmpDir, { recursive: true, force: true });
      } catch {
        /* ignore cleanup error */
      }
    }
  }

  /**
   * Memeriksa ketersediaan perintah `docker` di sistem operasi host.
   */
  private static async checkDockerAvailability(): Promise<boolean> {
    try {
      await execAsync("docker --version", { timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Handler kompilasi fallback apabila Docker daemon tidak tersedia di mesin lokal.
   */
  private static async handleLocalFallbackCompile(
    files: Record<string, string>,
    entryFile: string,
    tmpDir: string,
  ): Promise<CompileOutput> {
    console.warn(
      "[CompileService] Docker daemon tidak terdeteksi di host. Menggunakan mode fallback.",
    );

    const entryBasename = entryFile.replace(/\.tex$/, "");
    const pdfPath = path.join(tmpDir, `${entryBasename}.pdf`);

    // Cek apakah pdflatex terpasang langsung di host OS
    try {
      await execAsync(
        `pdflatex -interaction=nonstopmode -no-shell-escape -output-directory="${tmpDir}" "${path.join(tmpDir, entryFile)}"`,
        { timeout: 30000 },
      );

      if (await pathExists(pdfPath)) {
        const pdfBuffer = await fs.readFile(pdfPath);
        return {
          isSuccess: true,
          pdfBase64: `data:application/pdf;base64,${pdfBuffer.toString("base64")}`,
          logs: [{ message: "Kompilasi sukses via pdflatex lokal host." }],
        };
      }
    } catch {
      /* ignore */
    }

    // Jika Docker dan pdflatex lokal tidak ada, kembalikan respon pemberitahuan setup
    return {
      isSuccess: false,
      logs: [
        {
          message:
            "Docker daemon tidak aktif di mesin ini. Silakan jalankan Docker Desktop atau pasang pdflatex untuk mengaktifkan fitur kompilasi PDF.",
        },
      ],
      errorText:
        "Layanan kompilator Docker belum aktif di mesin lokal. Buka Docker Desktop lalu coba kembali.",
    };
  }

  /**
   * Membaca dan mengekstrak berkas .log hasil dari pdflatex
   * menjadi daftar pesan kesalahan terstruktur dengan nomor baris.
   */
  private static async parseLogFile(
    logPath: string,
  ): Promise<CompileLogEntry[]> {
    const logs: CompileLogEntry[] = [];
    try {
      if (!(await pathExists(logPath))) return logs;

      const content = await fs.readFile(logPath, "utf-8");
      const lines = content.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Deteksi pola baris error TeX yang diawali karakter "!"
        if (line.startsWith("!")) {
          const message = line.substring(1).trim();
          let lineNumber: number | undefined;

          // Cari nomor baris pada baris-baris berikutnya (mis. "l.24 \begin{document}")
          for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
            const lineMatch = lines[j].match(/^l\.(\d+)/);
            if (lineMatch) {
              lineNumber = Number(lineMatch[1]);
              break;
            }
          }

          logs.push({
            line: lineNumber,
            message,
            raw: line,
          });
        }
      }
    } catch (e) {
      console.warn("[CompileService] Gagal membaca berkas log:", e);
    }

    return logs;
  }
}
