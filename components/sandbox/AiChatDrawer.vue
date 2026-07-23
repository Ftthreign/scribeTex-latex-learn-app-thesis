<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from "vue";
import { marked } from "marked";
import {
  IconUser,
  IconSend,
  IconX,
  IconTrash,
  IconSparkles,
  IconBulb,
  IconCode,
  IconMathSymbols,
  IconHistory,
  IconMessage,
  IconClock,
  IconCheck,
  IconRefresh,
} from "@tabler/icons-vue";
import type { ChatMessage, DbChatEntry } from "~/composables/useAiChat";

const props = defineProps<{
  isOpen: boolean;
  messages: ChatMessage[];
  savedHistory: DbChatEntry[];
  loading: boolean;
  historyLoading?: boolean;
  codeContext?: Record<string, string> | string;
  errorLogs?: any[] | string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (
    e: "send",
    text: string,
    codeContext?: Record<string, string> | string,
    errorLogs?: any[] | string,
  ): void;
  (e: "clear"): void;
  (e: "fetchHistory"): void;
  (e: "loadHistory"): void;
  (e: "selectHistory", item: DbChatEntry): void;
}>();

// ─── State ──────────────────────────────────────────────────────────────────
const activeTab = ref<"chat" | "history">("chat");
const inputPrompt = ref("");
const chatScrollRef = ref<HTMLElement | null>(null);

// Configure marked for clean inline markdown rendering
marked.setOptions({
  gfm: true,
  breaks: true,
});

function renderMarkdown(content: string): string {
  try {
    return marked.parse(content) as string;
  } catch {
    return content;
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (chatScrollRef.value && activeTab.value === "chat") {
      chatScrollRef.value.scrollTop = chatScrollRef.value.scrollHeight;
    }
  });
}

watch(
  () => props.messages,
  () => scrollToBottom(),
  { deep: true },
);

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      scrollToBottom();
      emit("fetchHistory");
    }
  },
);

function handleSend() {
  const text = inputPrompt.value.trim();
  if (!text || props.loading) return;
  emit("send", text, props.codeContext, props.errorLogs);
  inputPrompt.value = "";
}

function handleQuickPrompt(text: string) {
  if (props.loading) return;
  emit("send", text, props.codeContext, props.errorLogs);
}

function handleSwitchTab(tab: "chat" | "history") {
  activeTab.value = tab;
  if (tab === "history") {
    emit("fetchHistory");
  } else {
    scrollToBottom();
  }
}

function handleLoadHistoryToChat() {
  emit("loadHistory");
  activeTab.value = "chat";
}

function handleSelectHistoryItem(item: DbChatEntry) {
  emit("selectHistory", item);
  activeTab.value = "chat";
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}
</script>

<template>
  <!-- Backdrop Overlay -->
  <Transition name="fade">
    <div
      v-if="isOpen"
      @click="emit('close')"
      class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 transition-opacity"
    ></div>
  </Transition>

  <!-- Slide-Over Chat Drawer Panel -->
  <Transition name="slide">
    <div
      v-if="isOpen"
      class="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-(--color-surface) border-l border-border shadow-2xl z-50 flex flex-col h-full overflow-hidden"
    >
      <!-- Header dengan Tab Bar (Chat Aktif vs Riwayat) -->
      <div
        class="bg-(--color-surface-alt)/90 backdrop-blur-md border-b border-border p-3 space-y-3 shrink-0"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div
              class="size-8 rounded-xl bg-[var(--color-ai-primary)] flex items-center justify-center text-white shadow-sm shrink-0"
            >
              <IconSparkles class="size-4 animate-pulse" />
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h3
                  class="text-sm font-bold text-(--color-text-primary) font-display tracking-tight"
                >
                  Pembimbing Cerdas AI
                </h3>
                <span class="badge-ai">
                  ScribeTex
                </span>
              </div>
              <p class="text-[11px] text-(--color-text-muted)">
                Asisten Belajar \LaTeX{} Interaktif (Gemini)
              </p>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <button
              @click="emit('clear')"
              class="p-1.5 rounded-lg text-(--color-text-muted) hover:text-(--color-error) hover:bg-(--color-error-light) transition-all cursor-pointer"
              title="Bersihkan Obrolan Aktif"
            >
              <IconTrash class="size-4" />
            </button>
            <button
              @click="emit('close')"
              class="p-1.5 rounded-lg text-(--color-text-muted) hover:text-(--color-text-primary) hover:bg-(--color-surface-alt) transition-all cursor-pointer"
              title="Tutup AI Chat"
            >
              <IconX class="size-4.5" />
            </button>
          </div>
        </div>

        <!-- Navigation Tabs Bar -->
        <div
          class="flex bg-(--color-surface) p-1 rounded-xl border border-border"
        >
          <button
            @click="handleSwitchTab('chat')"
            :class="[
              'flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer',
              activeTab === 'chat'
                ? 'btn-primary text-white shadow-xs'
                : 'text-(--color-text-muted) hover:text-(--color-text-primary) hover:bg-(--color-surface-alt)',
            ]"
          >
            <IconMessage class="size-3.5" />
            <span>Obrolan Aktif</span>
          </button>
          <button
            @click="handleSwitchTab('history')"
            :class="[
              'flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer',
              activeTab === 'history'
                ? 'btn-primary text-white shadow-xs'
                : 'text-(--color-text-muted) hover:text-(--color-text-primary) hover:bg-(--color-surface-alt)',
            ]"
          >
            <IconHistory class="size-3.5" />
            <span>Riwayat Chat</span>
            <span
              v-if="savedHistory.length > 0"
              class="ml-0.5 px-1.5 py-0.2 text-[9px] rounded-full bg-white/20 text-white font-mono"
            >
              {{ savedHistory.length }}
            </span>
          </button>
        </div>
      </div>

      <!-- TAB 1: Chat History Scroll View (Obrolan Aktif) -->
      <div
        v-if="activeTab === 'chat'"
        ref="chatScrollRef"
        class="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
      >
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="[
            'flex gap-2.5 max-w-[90%]',
            msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto',
          ]"
        >
          <!-- Avatar Icon -->
          <div
            :class="[
              'size-7 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-xs',
              msg.role === 'user'
                ? 'bg-primary'
                : 'bg-gradient-to-br from-purple-600 to-indigo-600',
            ]"
          >
            <IconUser v-if="msg.role === 'user'" class="size-4" />
          </div>

          <!-- Message Body -->
          <div
            :class="[
              'p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 shadow-xs',
              msg.role === 'user'
                ? 'bg-primary text-white rounded-tr-none'
                : 'bg-(--color-surface-alt) text-(--color-text-primary) border border-border rounded-tl-none',
            ]"
          >
            <!-- Formatted Markdown Content -->
            <div
              v-if="msg.role === 'assistant'"
              class="ai-markdown prose prose-invert max-w-none text-xs leading-relaxed font-sans"
              v-html="renderMarkdown(msg.text)"
            ></div>

            <p v-else class="whitespace-pre-wrap font-sans leading-relaxed">
              {{ msg.text }}
            </p>

            <!-- Timestamp -->
            <div
              :class="[
                'text-[10px] opacity-60 text-right pt-0.5 font-mono',
                msg.role === 'user'
                  ? 'text-white'
                  : 'text-(--color-text-muted)',
              ]"
            >
              {{ msg.timestamp }}
            </div>
          </div>
        </div>

        <!-- Typing Loading Indicator -->
        <div
          v-if="loading"
          class="flex gap-2.5 mr-auto max-w-[80%] items-center"
        >
          <div
            class="size-7 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0"
          ></div>
          <div
            class="p-3.5 bg-(--color-surface-alt) border border-border rounded-2xl rounded-tl-none flex items-center gap-2 shadow-xs"
          >
            <span class="size-2 bg-purple-500 rounded-full animate-ping"></span>
            <span class="text-xs text-(--color-text-muted) font-medium"
              >Pembimbing AI sedang merancang saran…</span
            >
          </div>
        </div>
      </div>

      <!-- TAB 2: Riwayat Percakapan (History View dari Database) -->
      <div v-else class="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        <div
          class="flex items-center justify-between pb-2 border-b border-border"
        >
          <span class="text-xs font-bold text-(--color-text-primary)"
            >Riwayat Percakapan Tersimpan</span
          >
          <button
            @click="emit('fetchHistory')"
            class="btn-ghost btn-sm text-xs gap-1 font-medium cursor-pointer"
          >
            <IconRefresh class="size-3" />
            <span>Muat Ulang</span>
          </button>
        </div>

        <!-- Tombol Muat Seluruh Riwayat ke Obrolan Aktif -->
        <button
          v-if="savedHistory.length > 0"
          @click="handleLoadHistoryToChat"
          class="btn-secondary btn-sm w-full gap-2 rounded-xl border-primary/20 bg-primary-light/50 text-primary hover:bg-primary-light transition-all cursor-pointer font-bold"
        >
          <IconCheck class="size-4" />
          <span>Tampilkan Semua Riwayat di Obrolan</span>
        </button>

        <!-- Loading State -->
        <div v-if="historyLoading" class="space-y-3 py-4">
          <div
            v-for="i in 3"
            :key="i"
            class="h-20 bg-(--color-surface-alt) rounded-xl animate-pulse"
          ></div>
        </div>

        <!-- History List -->
        <div v-else-if="savedHistory.length > 0" class="space-y-2.5">
          <div
            v-for="item in savedHistory"
            :key="item.id"
            @click="handleSelectHistoryItem(item)"
            class="group p-3.5 rounded-xl bg-(--color-surface-alt) border border-border space-y-2 hover:border-primary/60 hover:bg-(--color-surface) transition-all cursor-pointer shadow-2xs hover:shadow-xs relative"
            title="Klik untuk membuka obrolan ini"
          >
            <div
              class="flex items-center justify-between text-[11px] text-(--color-text-muted)"
            >
              <div class="flex items-center gap-1 font-mono">
                <IconClock class="size-3 text-purple-500" />
                <span>{{ formatDate(item.created_at) }}</span>
              </div>
              <span class="text-[10px] text-primary font-bold group-hover:underline flex items-center gap-0.5">
                Buka di Chat &rarr;
              </span>
            </div>

            <!-- Pertanyaan Mahasiswa -->
            <div
              class="text-xs font-semibold text-(--color-text-primary) line-clamp-2"
            >
              <span class="text-primary font-bold">Q:</span> {{ item.message }}
            </div>

            <!-- Preview Jawaban AI -->
            <div
              class="text-[11px] text-(--color-text-secondary) line-clamp-2 bg-(--color-surface) p-2 rounded-lg border border-border/60 font-mono"
            >
              <span class="text-purple-600 font-bold">AI:</span>
              {{ item.response.replace(/[*#]/g, "") }}
            </div>
          </div>
        </div>

        <!-- Empty History State -->
        <div
          v-else
          class="text-center py-16 text-(--color-text-muted) space-y-2"
        >
          <IconHistory class="size-10 mx-auto opacity-30 text-purple-500" />
          <p class="text-xs font-medium">
            Belum ada riwayat percakapan yang tersimpan.
          </p>
          <p class="text-[11px] text-(--color-text-muted) max-w-xs mx-auto">
            Mulailah mengajukan pertanyaan pada tab **Obrolan Aktif** untuk
            menyimpan riwayat konsultasi Anda.
          </p>
        </div>
      </div>

      <!-- Quick Prompt Badges (Hanya di Tab Chat) -->
      <div
        v-if="activeTab === 'chat'"
        class="px-4 py-2.5 bg-(--color-surface-alt)/60 border-t border-border shrink-0"
      >
        <p
          class="text-[10px] text-(--color-text-muted) font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1"
        >
          <IconBulb class="size-3 text-amber-500" />
          <span>Rekomendasi Pertanyaan Cepat:</span>
        </p>
        <div class="flex flex-wrap gap-1.5">
          <button
            @click="
              handleQuickPrompt(
                'Tolong jelaskan galat kompilasi ini dan berikan petunjuk perbaikannya.',
              )
            "
            class="px-2.5 py-1 rounded-lg bg-(--color-error-light) hover:bg-red-200/80 text-(--color-error) border border-red-500/20 text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:-translate-y-px"
          >
            <IconBulb class="size-3" />
            <span>Jelaskan Error Log</span>
          </button>
          <button
            @click="
              handleQuickPrompt(
                'Bagaimana cara membuat tabel atau notasi matematika dalam LaTeX?',
              )
            "
            class="px-2.5 py-1 rounded-lg bg-primary-light hover:bg-blue-100 text-primary border border-primary/20 text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:-translate-y-px"
          >
            <IconMathSymbols class="size-3" />
            <span>Notasi MTK</span>
          </button>
          <button
            @click="
              handleQuickPrompt(
                'Bantu berikan masukan untuk merapikan sintaks dokumen LaTeX saya.',
              )
            "
            class="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:-translate-y-px"
          >
            <IconCode class="size-3" />
            <span>Rapikan Sintaks</span>
          </button>
        </div>
      </div>

      <!-- Input Action Bar (Hanya di Tab Chat) -->
      <div
        v-if="activeTab === 'chat'"
        class="p-3 bg-(--color-surface) border-t border-border shrink-0"
      >
        <form @submit.prevent="handleSend" class="flex items-center gap-2">
          <input
            v-model="inputPrompt"
            type="text"
            placeholder="Tanyakan sesuatu ke Pembimbing AI..."
            :disabled="loading"
            class="flex-1 bg-(--color-surface-alt) text-xs text-(--color-text-primary) placeholder:text-(--color-text-muted) px-3.5 py-2.5 rounded-xl border border-border outline-none focus:border-primary transition-all disabled:opacity-50 font-sans"
          />
          <button
            type="submit"
            :disabled="!inputPrompt.trim() || loading"
            class="btn-primary p-2.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:hover:brightness-100 shrink-0"
            title="Kirim Pertanyaan"
          >
            <IconSend class="size-4" />
          </button>
        </form>
      </div>
    </div>
  </Transition>
</template>

<style>
/* Markdown Styling inside Assistant Chat Bubble */
.ai-markdown p {
  margin-bottom: 0.5rem;
}
.ai-markdown p:last-child {
  margin-bottom: 0;
}
.ai-markdown code {
  background-color: var(--color-code-bg, #0d1117);
  padding: 0.15rem 0.4rem;
  border-radius: 0.35rem;
  font-family: var(--font-mono, "JetBrains Mono", monospace);
  font-size: 0.75rem;
  color: var(--color-code-accent, #58a6ff);
  border: 1px solid var(--color-code-border, #30363d);
}
.ai-markdown pre {
  background-color: var(--color-code-bg, #0d1117);
  color: var(--color-code-text, #e6edf3);
  padding: 0.75rem;
  border-radius: 0.75rem;
  overflow-x: auto;
  margin: 0.5rem 0;
  border: 1px solid var(--color-code-border, #30363d);
  font-family: var(--font-mono, "JetBrains Mono", monospace);
}
.ai-markdown ul,
.ai-markdown ol {
  padding-left: 1.2rem;
  margin: 0.4rem 0;
}
.ai-markdown li {
  margin-bottom: 0.25rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
