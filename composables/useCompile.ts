import { ref } from 'vue'

export interface CompileLogItem {
  line?: number
  message: string
  raw?: string
}

export interface CompileApiResponse {
  statusCode: number
  message: string
  data: {
    isSuccess: boolean
    pdfBase64?: string
    logs: CompileLogItem[]
    errorText?: string
  }
}

export const compileSteps = [
  { step: 1, message: 'Validasi keamanan sintaks TeX & sanitasi skrip...' },
  { step: 2, message: 'Menulis berkas workspace ke direktori terisolasi /tmp/scribetex-*...' },
  { step: 3, message: 'Meluncurkan kontainer Docker TeXLive (scribetex-compiler)...' },
  { step: 4, message: 'Mengeksekusi pdflatex & mengekstraksi log...' },
  { step: 5, message: 'Membangun dokumen PDF resmi & merender pratinjau...' },
]

export const useCompile = () => {
  const compiling = ref<boolean>(false)
  const compileStep = ref<number>(1)
  const compileStepMessage = ref<string>(compileSteps[0].message)
  const pdfUrl = ref<string | null>(null)
  const compileError = ref<string | null>(null)
  const securityWarning = ref<string | null>(null)
  const logs = ref<CompileLogItem[]>([])

  /**
   * Mengirimkan multi-file workspace ke backend Nitro API /api/compile untuk dikompilasi via Docker TeXLive.
   * @param files     - Kamus { "main.tex": "...", "preamble.tex": "..." }
   * @param entryFile - Berkas root kompilasi (default: "main.tex")
   */
  const compileLatex = async (
    files: Record<string, string>,
    entryFile: string = 'main.tex'
  ) => {
    if (!files || !files[entryFile]?.trim()) {
      compileError.value = `Berkas entry "${entryFile}" tidak boleh kosong.`
      return null
    }

    compiling.value = true
    compileStep.value = 1
    compileStepMessage.value = compileSteps[0].message
    compileError.value = null
    securityWarning.value = null
    logs.value = []

    // Progress Timer Ticks untuk simulasi status alur eksekusi Docker
    const t2 = setTimeout(() => {
      if (compiling.value) {
        compileStep.value = 2
        compileStepMessage.value = compileSteps[1].message
      }
    }, 150)

    const t3 = setTimeout(() => {
      if (compiling.value) {
        compileStep.value = 3
        compileStepMessage.value = compileSteps[2].message
      }
    }, 450)

    const t4 = setTimeout(() => {
      if (compiling.value) {
        compileStep.value = 4
        compileStepMessage.value = compileSteps[3].message
      }
    }, 900)

    try {
      const response = await $fetch<CompileApiResponse>('/api/compile', {
        method: 'POST',
        body: { files, entryFile },
      })

      compileStep.value = 5
      compileStepMessage.value = compileSteps[4].message

      if (response?.data?.isSuccess && response.data.pdfBase64) {
        pdfUrl.value = response.data.pdfBase64
        logs.value = response.data.logs || []
        return response.data
      } else {
        compileError.value = response?.data?.errorText || response?.message || 'Kompilasi gagal.'
        logs.value = response?.data?.logs || []
        return null
      }
    } catch (err: any) {
      const statusMessage = err?.data?.statusMessage || err?.statusMessage || 'Gagal terhubung ke kompilator.'

      if (err?.statusCode === 400 && statusMessage.includes('berbahaya')) {
        securityWarning.value = statusMessage
      } else {
        compileError.value = statusMessage
      }

      return null
    } finally {
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      compiling.value = false
    }
  }

  /**
   * Mengunduh berkas PDF yang sedang ditampilkan pada preview.
   */
  const downloadPdf = (filename: string = 'dokumen-scribetex.pdf') => {
    if (!pdfUrl.value) return

    const link = document.createElement('a')
    link.href = pdfUrl.value
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /**
   * Membersihkan hasil kompilasi dan log.
   */
  const clearOutput = () => {
    pdfUrl.value = null
    compileError.value = null
    securityWarning.value = null
    logs.value = []
  }

  return {
    compiling,
    compileStep,
    compileStepMessage,
    pdfUrl,
    compileError,
    securityWarning,
    logs,
    compileLatex,
    downloadPdf,
    clearOutput,
  }
}
