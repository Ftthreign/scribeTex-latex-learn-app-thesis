<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import gsap from "gsap";
import katex from "katex";

interface LatexSnippet {
  code: string;
  katex: string;
  displayMode: boolean;
}

const snippets: LatexSnippet[] = [
  {
    code: "\\begin{equation}\n  E = mc^2\n\\end{equation}",
    katex: "E = mc^2",
    displayMode: true,
  },
  {
    code: "\\frac{\\partial f}{\\partial x} = 2x + \\sin(x)",
    katex: "\\frac{\\partial f}{\\partial x} = 2x + \\sin(x)",
    displayMode: true,
  },
  {
    code: "\\begin{pmatrix}\n  a & b \\\\\\\\\n  c & d\n\\end{pmatrix}",
    katex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",
    displayMode: true,
  },
];

const compileBtnRef = ref<HTMLElement | null>(null);
const currentSnippetIndex = ref(0);
const typedText = ref("");
const isTyping = ref(false);
const isPreviewVisible = ref(false);
let typingAborted = false;
const timeouts: ReturnType<typeof setTimeout>[] = [];

const displayedCodeLines = computed(() => {
  const lines = typedText.value.split("\n");
  return lines.map((line) => highlightLatex(line));
});

const renderedKatex = computed(() => {
  const snippet = snippets[currentSnippetIndex.value];
  if (!snippet) return "";
  try {
    return katex.renderToString(snippet.katex, {
      displayMode: snippet.displayMode,
      throwOnError: false,
      output: "html",
      trust: true,
    });
  } catch {
    return "";
  }
});

function highlightLatex(line: string): string {
  return line
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/(\\[a-zA-Z]+)/g, '<span class="hl-command">$1</span>')
    .replace(/(\{[^}]*\})/g, '<span class="hl-args">$1</span>');
}

function waitMs(ms: number): Promise<void> {
  return new Promise((resolve) => {
    if (typingAborted) return;
    const id = setTimeout(resolve, ms);
    timeouts.push(id);
  });
}

async function startTypingLoop() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReducedMotion) {
    typedText.value = snippets[0].code;
    isPreviewVisible.value = true;
    return;
  }

  try {
    while (!typingAborted) {
      const snippet = snippets[currentSnippetIndex.value];
      const code = snippet.code;

      isTyping.value = true;
      isPreviewVisible.value = false;
      typedText.value = "";

      for (let i = 0; i < code.length; i++) {
        await waitMs(40 + (Math.random() * 30 - 15));
        if (typingAborted) return;
        typedText.value = code.slice(0, i + 1);
      }

      isTyping.value = false;
      await waitMs(1000);
      if (typingAborted) return;

      isPreviewVisible.value = true;

      if (compileBtnRef.value) {
        gsap.fromTo(
          compileBtnRef.value,
          { scale: 1 },
          {
            scale: 1.05,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
          },
        );
      }

      await waitMs(3000);
      if (typingAborted) return;

      isPreviewVisible.value = false;
      await waitMs(300);
      if (typingAborted) return;

      const text = typedText.value;
      for (let i = text.length; i > 0; i--) {
        await waitMs(10);
        if (typingAborted) return;
        typedText.value = text.slice(0, i - 1);
      }

      typedText.value = "";
      await waitMs(400);
      currentSnippetIndex.value =
        (currentSnippetIndex.value + 1) % snippets.length;
    }
  } catch (_err) {
    // Typing loop aborted or unmounted safely
  }
}

onMounted(async () => {
  await nextTick();
  startTypingLoop();
});

onUnmounted(() => {
  typingAborted = true;
  timeouts.forEach(clearTimeout);
});
</script>

<template>
  <div
    class="hero-mockup lg:col-span-5 relative flex items-center justify-center order-1 lg:order-2"
  >
    <div class="relative z-10 w-full max-w-lg">
      <!-- Main Editor Mockup -->
      <div class="editor-mockup-container">
        <!-- Window Chrome Bar -->
        <div
          class="flex items-center justify-between px-4 py-2.5 bg-[#161B22] border-b border-[#30363D]"
        >
          <div class="flex gap-1.5">
            <div class="size-2.5 rounded-full bg-[#ff5f56]" />
            <div class="size-2.5 rounded-full bg-[#ffbd2e]" />
            <div class="size-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <span class="text-[11px] text-[#8b949e] font-mono tracking-tight"
            >LaTeX Editor</span
          >
          <button
            ref="compileBtnRef"
            class="compile-btn px-2.5 py-1 rounded-md text-[10px] font-bold font-sans tracking-wide uppercase transition-all"
            :class="
              isPreviewVisible
                ? 'bg-success text-white'
                : 'bg-[#30363D] text-[#8b949e]'
            "
          >
            {{ isPreviewVisible ? "✓ Compiled" : "Compile" }}
          </button>
        </div>

        <!-- Split Editor Body -->
        <div class="flex flex-col sm:flex-row min-h-80 sm:min-h-75">
          <!-- Code Panel (Top/Left) -->
          <div
            class="flex-1 p-4 font-mono text-[13px] leading-[1.65] overflow-hidden border-b sm:border-b-0 sm:border-r border-[#30363D] relative"
          >
            <div class="space-y-0">
              <div
                v-for="(line, idx) in displayedCodeLines"
                :key="idx"
                class="flex gap-3"
              >
                <span
                  class="text-[#484f58] text-right w-4 select-none shrink-0 text-[12px]"
                  >{{ idx + 1 }}</span
                >
                <span v-html="line" class="whitespace-pre" />
              </div>
            </div>
            <span
              v-if="isTyping"
              class="typing-cursor inline-block w-0.5 h-3.75 bg-code-accent align-middle ml-px"
            />
          </div>

          <div
            class="flex-1 p-6 flex items-center justify-center relative overflow-hidden bg-code-bg"
          >
            <Transition
              enter-active-class="transition-all duration-[350ms] ease-out"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
            >
              <div
                v-if="isPreviewVisible"
                class="katex-preview text-center w-full overflow-x-auto"
                v-html="renderedKatex"
              />
            </Transition>
            <span
              v-if="!isPreviewVisible && !isTyping"
              class="text-[#484f58] text-[11px] font-sans italic"
              >Preview akan muncul...</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-mockup-container {
  background: #0d1117;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #30363d;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
}

:deep(.hl-command) {
  color: #79c0ff;
}
:deep(.hl-args) {
  color: #a5d6ff;
}

.typing-cursor {
  animation: blink 1s step-end infinite;
}
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.floating-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid var(--color-border);
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 12px;
  box-shadow: var(--shadow-float);
  z-index: 20;
}

.badge-ai {
  animation: floatBadge 3s ease-in-out infinite;
}
.badge-success {
  animation: floatBadge 3.7s ease-in-out infinite;
  animation-delay: -1s;
}
.badge-progress {
  animation: floatBadge 4.3s ease-in-out infinite;
  animation-delay: -2s;
}

@keyframes floatBadge {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.katex-preview {
  color: #e6edf3;
}
:deep(.katex-preview .katex) {
  font-size: 1.3em;
}
:deep(.katex-preview .katex-html) {
  color: #e6edf3;
}
</style>
