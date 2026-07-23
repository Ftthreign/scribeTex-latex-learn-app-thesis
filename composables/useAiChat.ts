/**
 * composables/useAiChat.ts
 * Composable pengelola state interaktif Pembimbing Cerdas AI (Gemini Chatbot).
 * Mengelola daftar pesan, status loading, pengiriman konteks galat, serta pengambilan riwayat percakapan dari basis data.
 */

import { ref } from 'vue'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  timestamp: string
  isErrorExplanation?: boolean
}

export interface DbChatEntry {
  id: number
  user_id: string
  session_id: string
  message: string
  response: string
  created_at: string
}

export function useAiChat() {
  const isOpen = ref<boolean>(false)
  const loading = ref<boolean>(false)
  const historyLoading = ref<boolean>(false)
  const messages = ref<ChatMessage[]>([])
  const savedHistory = ref<DbChatEntry[]>([])
  const sessionId = ref<string>('sandbox-session')

  // Pesan selamat datang default dari Pembimbing Cerdas
  const welcomeMessage: ChatMessage = {
    id: 'welcome-msg',
    role: 'assistant',
    text: '💡 **Halo! Saya Pembimbing Cerdas ScribeTex.**\n\nAda yang bisa saya bantu terkait penulisan sintaks \\LaTeX{}, notasi matematika, atau struktur dokumen Anda? \n\n*Tips:* Jika terjadi kesalahan kompilasi, Anda dapat menekan tombol **"Tanyakan Galat Ini ke AI"** pada tab Log Galat!',
    timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
  }

  // Inisialisasi daftar pesan dengan welcome message
  if (messages.value.length === 0) {
    messages.value.push(welcomeMessage)
  }

  /** Toggle buka/tutup drawer chat AI */
  function toggleDrawer(open?: boolean) {
    isOpen.value = open !== undefined ? open : !isOpen.value
  }

  /** Mengambil riwayat percakapan dari backend Nitro /api/ai/history */
  async function fetchHistory(targetSessionId?: string) {
    historyLoading.value = true
    try {
      const querySession = targetSessionId || sessionId.value
      const res = await $fetch<{ statusCode: number; data: DbChatEntry[] }>('/api/ai/history', {
        query: { sessionId: querySession },
      })
      if (res?.data) {
        savedHistory.value = res.data
      }
    } catch (err) {
      console.warn('[useAiChat] Error fetching history:', err)
    } finally {
      historyLoading.value = false
    }
  }

  /** Memuat seluruh riwayat percakapan dari basis data ke dalam Obrolan Aktif */
  function loadHistoryIntoChat() {
    if (!savedHistory.value || savedHistory.value.length === 0) return

    const historyMessages: ChatMessage[] = []
    for (const entry of savedHistory.value) {
      const timeStr = new Date(entry.created_at).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })
      historyMessages.push({
        id: `db-user-${entry.id}`,
        role: 'user',
        text: entry.message,
        timestamp: timeStr,
      })
      historyMessages.push({
        id: `db-ai-${entry.id}`,
        role: 'assistant',
        text: entry.response,
        timestamp: timeStr,
      })
    }

    messages.value = [welcomeMessage, ...historyMessages]
  }

  /** Kirim pertanyaan pengguna ke backend API Nitro /api/ai/chat */
  async function sendMessage(
    text: string,
    codeContext?: Record<string, string> | string,
    errorLogs?: any[] | string
  ) {
    const trimmed = text.trim()
    if (!trimmed || loading.value) return

    const userMsgId = `user-${Date.now()}`
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

    // 1. Tambahkan pesan pengguna ke UI
    messages.value.push({
      id: userMsgId,
      role: 'user',
      text: trimmed,
      timestamp: nowTime,
    })

    loading.value = true

    try {
      // 2. Panggil Nitro API
      const res = await $fetch<{
        statusCode: number
        data: { response: string; timestamp: string }
      }>('/api/ai/chat', {
        method: 'POST',
        body: {
          message: trimmed,
          codeContext,
          errorLogs,
          sessionId: sessionId.value,
        },
      })

      const aiText = res?.data?.response || 'Maaf, tidak mendapat respon dari AI.'

      // 3. Tambahkan jawaban AI ke UI
      messages.value.push({
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: aiText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      })

      // Refresh riwayat lokal
      await fetchHistory()
    } catch (err: any) {
      console.error('[useAiChat] Error sending message:', err)
      messages.value.push({
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: '⚠️ **Gagal terhubung ke Pembimbing AI.** Silakan periksa koneksi internet Anda atau coba beberapa saat lagi.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      })
    } finally {
      loading.value = false
    }
  }

  /** Aksi Cepat: Minta AI menjelaskan kesalahan kompilasi secara otomatis */
  async function explainError(
    errorLogs: any[] | string,
    codeContext?: Record<string, string> | string
  ) {
    isOpen.value = true
    const promptText = 'Tolong jelaskan kesalahan kompilasi yang terjadi pada dokumen saya dan berikan petunjuk perbaikannya.'
    await sendMessage(promptText, codeContext, errorLogs)
  }

  /** Memuat 1 item/sesi riwayat spesifik ke dalam tampilan aktif chat */
  function loadSingleHistoryItem(entry: DbChatEntry) {
    if (entry.session_id) {
      sessionId.value = entry.session_id
    }

    // Ambil semua percakapan yang memiliki session_id yang sama dari savedHistory
    const sessionEntries = savedHistory.value.filter(
      (h) => h.session_id === entry.session_id
    )

    const entriesToLoad = sessionEntries.length > 0 ? sessionEntries : [entry]

    // Urutkan berdasarkan tanggal dibuat (ascending) agar pesan berurutan
    const sortedEntries = [...entriesToLoad].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )

    const historyMessages: ChatMessage[] = []
    for (const item of sortedEntries) {
      const timeStr = new Date(item.created_at).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })
      historyMessages.push({
        id: `db-user-${item.id}`,
        role: 'user',
        text: item.message,
        timestamp: timeStr,
      })
      historyMessages.push({
        id: `db-ai-${item.id}`,
        role: 'assistant',
        text: item.response,
        timestamp: timeStr,
      })
    }

    messages.value = [welcomeMessage, ...historyMessages]
  }

  /** Reset percakapan chat dan buat ID sesi baru */
  function clearChat() {
    sessionId.value = `sandbox-session-${Date.now()}`
    messages.value = [welcomeMessage]
  }

  return {
    isOpen,
    loading,
    historyLoading,
    messages,
    savedHistory,
    sessionId,
    toggleDrawer,
    fetchHistory,
    loadHistoryIntoChat,
    loadSingleHistoryItem,
    sendMessage,
    explainError,
    clearChat,
  }
}
