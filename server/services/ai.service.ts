/**
 * server/services/ai.service.ts
 * Service pengelola komunikasi dengan Gemini REST API (Google Generative AI):
 * - Memanggil REST API resmi https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
 * - Menggunakan System Instruction bertipe Pedagogical Scaffolding
 * - Context Builder otomatis menggabungkan: kode LaTeX, error log, riwayat chat, dan pertanyaan
 * - Fallback handler yang informatif jika API Key belum dipasang / kuota terlampaui
 */

export interface ChatContextPayload {
  message: string
  codeContext?: Record<string, string> | string
  errorLogs?: any[] | string
  history?: Array<{ message: string; response: string }>
}

export class AiService {
  /**
   * Merancang System Instruction bertipe Pedagogical Scaffolding (Pembimbing Cerdas ScribeTex).
   * Sesuai spesifikasi Bab 4.6 Skripsi: AI TIDAK memberikan kode jawaban utuh instan.
   */
  private static getSystemInstruction(): string {
    return `Anda adalah "Pembimbing Cerdas ScribeTex" (AI Learning Buddy), asisten akademis interaktif yang membantu mahasiswa Indonesia belajar menyusun dokumen dan artikel ilmiah menggunakan LaTeX.

PRINSIP UTAMA (PEDAGOGICAL SCAFFOLDING):
1. BAHASA: Gunakan Bahasa Indonesia yang ramah, sopan, komunikatif, dan mudah dipahami oleh mahasiswa pemula.
2. JANGAN MEMBERIKAN JAWABAN KODE UTUH SECARA INSTAN: Jangan langsung menuliskan dokumen \\documentclass utuh jika tidak diminta secara spesifik. Fokus membantu pengguna memahami letak kesalahan mereka.
3. CARA PENJELASAN GALAT KOMPILASI:
   a. **Lokasi & Penyebab**: Jelaskan pada baris berapa kesalahan terjadi dan mengapa TeX menolak sintaks tersebut.
   b. **Konsep LaTeX**: Jelaskan konsep di balik perintah/paket tersebut (misalnya mengapa \\chapter memerlukan kelas report/book, bukan article).
   c. **Petunjuk Perbaikan (Step-by-step)**: Berikan potongan kode kecil (code snippet 2-5 baris) yang perlu dikoreksi.
4. FORMAT PENGELUARAN:
   - Gunakan format Markdown yang rapi (bold untuk istilah penting, inline code \`\\command\` untuk perintah TeX).
   - Sertakan ikon emoji yang relevan (💡, 🛠️, 📝, ⚠️) agar menarik.
`
  }

  /**
   * Menyusun konteks lengkap (Context Builder) sebelum dikirimkan ke Gemini REST API.
   */
  private static buildFullPrompt(payload: ChatContextPayload): string {
    const parts: string[] = []

    parts.push(`=== ATURAN PEMBIMBING CERDAS ===\n${this.getSystemInstruction()}\n=================================\n`)

    if (payload.codeContext) {
      parts.push('=== KODE LATEX DALAM WORKSPACE ===')
      if (typeof payload.codeContext === 'string') {
        parts.push(payload.codeContext)
      } else {
        for (const [filename, content] of Object.entries(payload.codeContext)) {
          parts.push(`--- Berkas: ${filename} ---`)
          parts.push(content)
        }
      }
      parts.push('===================================\n')
    }

    if (payload.errorLogs) {
      parts.push('=== LOG GALAT KOMPILASI (ERROR LOGS) ===')
      if (typeof payload.errorLogs === 'string') {
        parts.push(payload.errorLogs)
      } else if (Array.isArray(payload.errorLogs) && payload.errorLogs.length > 0) {
        payload.errorLogs.forEach((log) => {
          const lineStr = log.line ? `[Baris ${log.line}] ` : ''
          parts.push(`${lineStr}${log.message || log.raw || JSON.stringify(log)}`)
        })
      }
      parts.push('========================================\n')
    }

    if (payload.history && payload.history.length > 0) {
      parts.push('=== RIWAYAT PERCAKAPAN SEBELUMNYA ===')
      payload.history.slice(-4).forEach((h) => {
        parts.push(`Mahasiswa: ${h.message}`)
        parts.push(`Pembimbing AI: ${h.response}`)
      })
      parts.push('======================================\n')
    }

    parts.push(`PERTANYAAN MAHASISWA:\n${payload.message}`)

    return parts.join('\n')
  }

  /**
   * Mengirimkan instruksi & konteks ke Google Gemini REST API langsung via $fetch.
   */
  static async generateResponse(payload: ChatContextPayload): Promise<string> {
    const config = useRuntimeConfig()
    let apiKey = (config.geminiApiKey || process.env.GEMINI_API_KEY || process.env.NUXT_GEMINI_API_KEY || '').trim()

    // Bersihkan tanda kutip jika ada
    apiKey = apiKey.replace(/^["']|["']$/g, '')

    console.log(`[AiService] Invoking Gemini API... Key length: ${apiKey.length}, Key prefix: ${apiKey.substring(0, 6)}...`)

    if (!apiKey || apiKey.includes('your_gemini_api_key')) {
      console.warn('[AiService] GEMINI_API_KEY is empty or default. Using mock fallback.')
      return this.handleMockFallback(payload)
    }

    // Daftar endpoint model aktif resmi dari Google AI Studio REST API
    const models = [
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-3.6-flash',
      'gemini-3.1-flash-lite',
    ]

    const fullPrompt = this.buildFullPrompt(payload)
    let lastErrorMsg = ''

    for (const modelName of models) {
      try {
        const endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`

        const response = await $fetch<any>(endpointUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: {
            contents: [
              {
                parts: [{ text: fullPrompt }],
              },
            ],
          },
        })

        const textOutput = response?.candidates?.[0]?.content?.parts?.[0]?.text

        if (textOutput && textOutput.trim() !== '') {
          console.log(`[AiService] Success response received from model ${modelName}!`)
          return textOutput
        }
      } catch (err: any) {
        const status = err?.status || err?.statusCode
        const statusText = err?.data?.error?.message || err?.message || JSON.stringify(err?.data || {})
        lastErrorMsg = `[Status ${status}] ${statusText}`

        console.warn(`[AiService] Model ${modelName} REST call failed:`, lastErrorMsg)

        if (status === 400 || statusText.includes('API_KEY_INVALID') || statusText.includes('API key not valid')) {
          return '⚠️ **Konfigurasi Gemini API Key Tidak Valid**\n\nAPI Key yang dipasang pada `.env` belum aktif atau salah. Silakan buat kunci API baru di [Google AI Studio (aistudio.google.com/app/apikey)](https://aistudio.google.com/app/apikey).'
        }

        if (status === 429 || statusText.includes('Quota exceeded') || statusText.includes('RESOURCE_EXHAUSTED')) {
          return '⚠️ **Batas Kuota Gratisan Google Gemini API Terlampaui (429 Rate Limit)**\n\nGoogle Gemini API mendeteksi batas kuota gratisan per menit pada kunci API Anda telah tercapai.\n\n🛠️ **Solusi 10 Detik:**\nBuka [Google AI Studio (aistudio.google.com/app/apikey)](https://aistudio.google.com/app/apikey), klik **Create API Key in new project**, salin kunci `AIzaSy...` baru ke `.env`, lalu restart server (`bun run dev`).'
        }
      }
    }

    console.error('[AiService] All REST Gemini API endpoints failed:', lastErrorMsg)
    return this.handleMockFallback(payload, lastErrorMsg)
  }

  /**
   * Mock fallback jawaban edukatif jika API Key Gemini belum dipasang / koneksi bermasalah.
   */
  private static handleMockFallback(payload: ChatContextPayload, errorMessage?: string): string {
    const hasErrorLogs = payload.errorLogs && (
      (Array.isArray(payload.errorLogs) && payload.errorLogs.length > 0) ||
      (typeof payload.errorLogs === 'string' && payload.errorLogs.trim() !== '')
    )

    if (hasErrorLogs) {
      return `💡 **Analisis Galat Kompilasi \\LaTeX{} (Simulasi AI)**

 Halo! Saya telah menganalisis log kesalahan kompilasi Anda.

⚠️ **Penyebab Utama:**
Terjadi kesalahan sintaks pada berkas dokumen Anda. Dalam \\LaTeX{}, galat ini umumnya disebabkan oleh:
1. Penggunaan perintah kustom yang belum didefinisikan atau belum memuat paket terkait di \`preamble\`.
2. Penulisan tanda kurung kurawal \`{\` atau \`}\` yang tidak seimbang.
3. Penggunaan perintah \`\\chapter{}\` pada kelas dokumen \`article\` (gunakan \`report\` atau \`book\`).

🛠️ **Petunjuk Perbaikan Langkah-demi-Langkah:**
- Periksa kembali bagian *preamble* dokumen Anda (di atas \`\\begin{document}\`).
- Pastikan paket yang dibutuhkan sudah dimuat dengan \`\\usepackage{...}\`.
- Buka tab **Log Galat** untuk melihat nomor baris pasti lokasi kesalahan.

*(Catatan: Pasang kunci \`GEMINI_API_KEY\` pada berkas \`.env\` untuk mengaktifkan kecerdasan buatan Gemini API secara penuh).*`
    }

    return `💡 **Pembimbing Cerdas ScribeTex**

 Halo! Saya adalah asisten belajar \\LaTeX{} Anda.

Ada yang bisa saya bantu terkait penulisan artikel ilmiah, notasi matematika, atau struktur dokumen Anda hari ini? 

- 📝 **Tips:** Anda dapat langsung menekan tombol **"Tanyakan Galat Ini ke AI"** pada panel Log Galat jika kompilasi dokumen Anda mengalami kesalahan!

*(Sistem saat ini berjalan dalam mode simulasi. Tambahkan kunci \`GEMINI_API_KEY\` di \`.env\` untuk respons Gemini API langsung).*`
  }
}
