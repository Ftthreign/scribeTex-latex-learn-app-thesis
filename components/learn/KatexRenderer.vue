<script setup lang="ts">
import { computed } from "vue";
import katex from "katex";
import "katex/dist/katex.min.css";
import { marked } from "marked";

const props = withDefaults(
  defineProps<{
    content: string;
    isMarkdown?: boolean;
  }>(),
  {
    isMarkdown: true,
  },
);

// Placeholder untuk melindungi blok KaTeX dari diproses oleh marked
const KATEX_PLACEHOLDER = '__KATEX_PLACEHOLDER_'
const katexStore: string[] = []

const saveKatex = (rendered: string): string => {
  const idx = katexStore.length
  katexStore.push(rendered)
  return `${KATEX_PLACEHOLDER}${idx}__`
}

const renderedHtml = computed(() => {
  if (!props.content) return "";

  // Reset store setiap kali content berubah
  katexStore.length = 0

  let text = props.content;

  // ── 1. Strip YAML frontmatter (--- ... ---) jika ada
  text = text.replace(/^---[\s\S]*?---\n?/, '')

  // ── 2. Render display math $$ ... $$ dan \[ ... \] → simpan sebagai placeholder
  text = text.replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, (_, math) => {
    try {
      const rendered = `<div class="katex-display-block my-4 overflow-x-auto text-center">${katex.renderToString(math, { displayMode: true, throwOnError: false })}</div>`
      return saveKatex(rendered)
    } catch {
      return saveKatex(`<code class="katex-error">$$${math}$$</code>`)
    }
  });

  text = text.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_, math) => {
    try {
      const rendered = `<div class="katex-display-block my-4 overflow-x-auto text-center">${katex.renderToString(math, { displayMode: true, throwOnError: false })}</div>`
      return saveKatex(rendered)
    } catch {
      return saveKatex(`<code class="katex-error">\\[${math}\\]</code>`)
    }
  });

  // ── 3. Render inline math $ ... $ → simpan sebagai placeholder
  // Gunakan regex yang lebih presisi (hindari false positive di URL atau LaTeX \$ escaped)
  text = text.replace(/(?<!\\)\$(?!\$)([^\n$]+?)(?<!\\)\$/g, (_, math) => {
    try {
      return saveKatex(katex.renderToString(math, { displayMode: false, throwOnError: false }))
    } catch {
      return saveKatex(`<code class="katex-error">$${math}$</code>`)
    }
  });

  // ── 4. Proses Markdown (marked mengubah teks → HTML)
  //    Gunakan custom renderer agar tabel dibungkus div scrollable
  if (props.isMarkdown) {
    try {
      // Custom renderer: bungkus <table> dalam div.table-scroll-wrapper
      const renderer = new marked.Renderer()
      const originalTable = renderer.table.bind(renderer)
      renderer.table = (token) => {
        const html = originalTable(token)
        return `<div class="table-scroll-wrapper">${html}</div>`
      }
      text = marked.parse(text, { renderer }) as string;
    } catch {
      // fallback: gunakan marked default
      try { text = marked.parse(text) as string } catch { /* noop */ }
    }
  }

  // ── 5. Restore placeholder → KaTeX HTML yang sesungguhnya
  text = text.replace(/__KATEX_PLACEHOLDER_(\d+)__/g, (_, idx) => {
    return katexStore[Number(idx)] ?? ''
  })

  return text;
});
</script>

<template>
  <div
    class="katex-rendered-content prose max-w-none leading-relaxed"
    v-html="renderedHtml"
  ></div>
</template>

<style>
/* ── Tipografi Prose sesuai DESIGN.md ──────────────────────────── */
.katex-rendered-content {
  font-family: var(--font-body, 'DM Sans', sans-serif);
  color: var(--color-text-primary);
  font-size: 0.9375rem; /* 15px */
  line-height: 1.75;
}

.katex-rendered-content h1,
.katex-rendered-content h2,
.katex-rendered-content h3,
.katex-rendered-content h4 {
  font-family: var(--font-body, 'DM Sans', sans-serif);
  color: var(--color-text-primary);
  font-weight: 700;
  line-height: 1.3;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}
.katex-rendered-content h1 { font-size: 1.5rem; }
.katex-rendered-content h2 { font-size: 1.25rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.35rem; }
.katex-rendered-content h3 { font-size: 1.1rem; }
.katex-rendered-content h4 { font-size: 1rem; }

.katex-rendered-content p {
  margin-top: 0;
  margin-bottom: 1rem;
}

.katex-rendered-content ul,
.katex-rendered-content ol {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}
.katex-rendered-content li { margin-bottom: 0.25rem; }

.katex-rendered-content blockquote {
  border-left: 3px solid var(--color-primary);
  background: var(--color-primary-light);
  padding: 0.75rem 1rem;
  margin: 1rem 0;
  border-radius: 0 0.5rem 0.5rem 0;
  color: var(--color-text-secondary);
  font-style: italic;
}

/* ── Tabel: wrapper scrollable ────────────────────────────────── */
.katex-rendered-content .table-scroll-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 1.25rem 0;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  /* Gradient hint untuk mobile agar user tahu bisa di-scroll */
  background:
    linear-gradient(to right, white 30%, rgba(255,255,255,0)),
    linear-gradient(to right, rgba(255,255,255,0), white 70%) 0 100%,
    radial-gradient(farthest-side at 0% 50%, rgba(0,0,0,.08), rgba(0,0,0,0)),
    radial-gradient(farthest-side at 100% 50%, rgba(0,0,0,.08), rgba(0,0,0,0)) 0 100%;
  background-repeat: no-repeat;
  background-color: white;
  background-size: 40px 100%, 40px 100%, 14px 100%, 14px 100%;
  background-attachment: local, local, scroll, scroll;
}

.katex-rendered-content table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  margin: 0; /* margin sudah dihandle wrapper */
  min-width: 480px; /* pastikan header/kolom tidak terlipat */
}
.katex-rendered-content th,
.katex-rendered-content td {
  border: 1px solid var(--color-border);
  padding: 0.5rem 0.75rem;
  text-align: left;
  vertical-align: top;
}
.katex-rendered-content th {
  background: var(--color-surface-alt);
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.katex-rendered-content tr:nth-child(even) td {
  background: var(--color-bg);
}

/* ── Kode ─────────────────────────────────────────────────────── */
.katex-rendered-content pre {
  background: var(--color-code-bg, #0d1117);
  color: var(--color-code-text, #e6edf3);
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.8125rem;
  overflow-x: auto;
  margin: 1rem 0;
  line-height: 1.65;
}
.katex-rendered-content code {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.875em;
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  padding: 0.1em 0.35em;
  color: var(--color-primary);
}
.katex-rendered-content pre code {
  background: transparent;
  border: none;
  padding: 0;
  color: inherit;
  font-size: inherit;
}

/* ── KaTeX error ────────────────────────────────────────────────── */
.katex-rendered-content .katex-error {
  color: var(--color-error);
  background: var(--color-error-light);
  padding: 0.1em 0.35em;
  border-radius: 0.25rem;
  font-family: var(--font-mono, monospace);
}

/* ── KaTeX display block ─────────────────────────────────────────── */
.katex-rendered-content .katex-display-block {
  padding: 0.75rem 1rem;
  background: var(--color-surface-alt);
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  overflow-x: auto;
}

/* ── HR ─────────────────────────────────────────────────────────── */
.katex-rendered-content hr {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 1.5rem 0;
}

/* ── Strong / Em ─────────────────────────────────────────────────── */
.katex-rendered-content strong { color: var(--color-text-primary); font-weight: 700; }
.katex-rendered-content em { font-style: italic; color: var(--color-text-secondary); }

/* ── Link ────────────────────────────────────────────────────────── */
.katex-rendered-content a {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.katex-rendered-content a:hover { color: var(--color-primary-hover); }
</style>
