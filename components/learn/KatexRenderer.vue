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

const KATEX_PREFIX = "KATEXPH";
const KATEX_SUFFIX = "ENDPH";

const renderedHtml = computed(() => {
  if (!props.content) return "";

  const katexStore: string[] = [];
  const saveKatex = (rendered: string): string => {
    const idx = katexStore.length;
    katexStore.push(rendered);
    return `${KATEX_PREFIX}${idx}${KATEX_SUFFIX}`;
  };

  let text = props.content;

  text = text.replace(/^---[\s\S]*?---\n?/, "");
  // Hapus komentar LaTeX (baris berawalan % yang tidak di-escape \%)
  text = text.replace(/(^|[^\\])%[^\n]*/g, "$1");

  text = text.replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, (_, math) => {
    try {
      const rendered = `<div class="katex-display-block my-4 overflow-x-auto text-center">${katex.renderToString(math, { displayMode: true, throwOnError: false })}</div>`;
      return saveKatex(rendered);
    } catch {
      return saveKatex(`<code class="katex-error">$$${math}$$</code>`);
    }
  });

  text = text.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_, math) => {
    try {
      const rendered = `<div class="katex-display-block my-4 overflow-x-auto text-center">${katex.renderToString(math, { displayMode: true, throwOnError: false })}</div>`;
      return saveKatex(rendered);
    } catch {
      return saveKatex(`<code class="katex-error">\\[${math}\\]</code>`);
    }
  });

  text = text.replace(/(^|[^\\])\$([^\n$]+?)\$/g, (_, prefix, math) => {
    try {
      return (
        prefix +
        saveKatex(
          katex.renderToString(math, {
            displayMode: false,
            throwOnError: false,
          }),
        )
      );
    } catch {
      return prefix + saveKatex(`<code class="katex-error">$${math}$</code>`);
    }
  });

  // Utility rekursif untuk memproses argumen bersarang
  const processArg = (inner: string): string => {
    return inner
      .replace(/\\textbf\{([^{}]*)\}/g, "<strong>$1</strong>")
      .replace(/\\textit\{([^{}]*)\}/g, "<em>$1</em>")
      .replace(/\\emph\{([^{}]*)\}/g, "<em>$1</em>")
      .replace(/\\underline\{([^{}]*)\}/g, "<u>$1</u>")
      .replace(/\\texttt\{([^{}]*)\}/g, "<code>$1</code>")
      .replace(
        /\\textrm\{([^{}]*)\}/g,
        '<span style="font-family:serif">$1</span>',
      )
      .replace(
        /\\textsf\{([^{}]*)\}/g,
        '<span style="font-family:sans-serif">$1</span>',
      )
      .replace(/\\text\{([^{}]*)\}/g, "$1");
  };

  // Format teks – paling umum
  text = text.replace(
    /\\textbf\{([^{}]*)\}/g,
    (_, inner) => `<strong>${processArg(inner)}</strong>`,
  );
  text = text.replace(
    /\\textit\{([^{}]*)\}/g,
    (_, inner) => `<em>${processArg(inner)}</em>`,
  );
  text = text.replace(
    /\\emph\{([^{}]*)\}/g,
    (_, inner) => `<em>${processArg(inner)}</em>`,
  );
  text = text.replace(
    /\\underline\{([^{}]*)\}/g,
    (_, inner) => `<u>${processArg(inner)}</u>`,
  );
  text = text.replace(
    /\\texttt\{([^{}]*)\}/g,
    (_, inner) => `<code>${processArg(inner)}</code>`,
  );
  text = text.replace(
    /\\textrm\{([^{}]*)\}/g,
    (_, inner) => `<span style="font-family:serif">${processArg(inner)}</span>`,
  );
  text = text.replace(
    /\\textsf\{([^{}]*)\}/g,
    (_, inner) =>
      `<span style="font-family:sans-serif">${processArg(inner)}</span>`,
  );
  text = text.replace(/\\text\{([^{}]*)\}/g, (_, inner) => processArg(inner));

  // Ukuran font LaTeX
  text = text.replace(
    /\\tiny\{([^{}]*)\}/g,
    '<span style="font-size:0.6em">$1</span>',
  );
  text = text.replace(
    /\\small\{([^{}]*)\}/g,
    '<span style="font-size:0.85em">$1</span>',
  );
  text = text.replace(
    /\\large\{([^{}]*)\}/g,
    '<span style="font-size:1.25em">$1</span>',
  );
  text = text.replace(
    /\\Large\{([^{}]*)\}/g,
    '<span style="font-size:1.5em">$1</span>',
  );
  text = text.replace(
    /\\LARGE\{([^{}]*)\}/g,
    '<span style="font-size:1.75em">$1</span>',
  );
  text = text.replace(
    /\\huge\{([^{}]*)\}/g,
    '<span style="font-size:2em">$1</span>',
  );

  // Warna teks: \textcolor{warna}{teks}
  text = text.replace(
    /\\textcolor\{([^{}]*)\}\{([^{}]*)\}/g,
    (_, color, inner) =>
      `<span style="color:${processArg(color)}">${processArg(inner)}</span>`,
  );

  // Heading / struktur dokumen
  text = text.replace(
    /\\chapter\*?\{([^{}]*)\}/g,
    (_, inner) => `\n# ${processArg(inner)}\n`,
  );
  text = text.replace(
    /\\section\*?\{([^{}]*)\}/g,
    (_, inner) => `\n## ${processArg(inner)}\n`,
  );
  text = text.replace(
    /\\subsection\*?\{([^{}]*)\}/g,
    (_, inner) => `\n### ${processArg(inner)}\n`,
  );
  text = text.replace(
    /\\subsubsection\*?\{([^{}]*)\}/g,
    (_, inner) => `\n#### ${processArg(inner)}\n`,
  );
  text = text.replace(
    /\\paragraph\*?\{([^{}]*)\}/g,
    (_, inner) => `\n**${processArg(inner)}**\n`,
  );

  // Daftar item LaTeX: \begin{itemize}...\end{itemize} dan \begin{enumerate}...\end{enumerate}
  text = text.replace(
    /\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g,
    (_, content) => {
      const items = content.replace(/\\item\s*/g, "- ").trim();
      return `\n${items}\n`;
    },
  );
  text = text.replace(
    /\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g,
    (_, content) => {
      let i = 1;
      const items = content.replace(/\\item\s*/g, () => `${i++}. `).trim();
      return `\n${items}\n`;
    },
  );

  // Blok verbatim / lstlisting
  text = text.replace(
    /\\begin\{verbatim\}([\s\S]*?)\\end\{verbatim\}/g,
    (_, code) => `\n\`\`\`\n${code.trim()}\n\`\`\`\n`,
  );
  text = text.replace(
    /\\begin\{lstlisting\}([\s\S]*?)\\end\{lstlisting\}/g,
    (_, code) => `\n\`\`\`latex\n${code.trim()}\n\`\`\`\n`,
  );

  // Link & footnote
  text = text.replace(
    /\\href\{([^{}]*)\}\{([^{}]*)\}/g,
    (_, url, label) =>
      `<a href="${url}" target="_blank" rel="noopener">${processArg(label)}</a>`,
  );
  text = text.replace(
    /\\footnote\{([^{}]*)\}/g,
    (_, inner) =>
      `<sup class="text-xs text-(--color-text-muted)" title="${inner}">[*]</sup>`,
  );

  // Parse LaTeX tabular environment: \begin{tabular}[spec]{cols} ... \end{tabular}
  text = text.replace(
    /\\begin\{tabular\}(?:\[.*?\])?\{[^{}]*\}[\s\S]*?\\end\{tabular\}/g,
    (tabularMatch) => {
      const inner = tabularMatch
        .replace(/^\\begin\{tabular\}(?:\[.*?\])?\{[^{}]*\}/, "")
        .replace(/\\end\{tabular\}$/, "")
        .trim();
      const rawRows = inner
        .split(/\\\\\s*/)
        .map((r) => r.replace(/\\hline/g, "").trim())
        .filter((r) => r.length > 0);
      if (rawRows.length === 0) return "";
      let html = '<div class="table-scroll-wrapper"><table>';
      rawRows.forEach((rowStr, idx) => {
        const cells = rowStr.split("&").map((c) => c.trim());
        if (idx === 0) {
          html +=
            "<thead><tr>" +
            cells.map((c) => `<th>${processArg(c)}</th>`).join("") +
            "</tr></thead><tbody>";
        } else {
          html +=
            "<tr>" +
            cells.map((c) => `<td>${processArg(c)}</td>`).join("") +
            "</tr>";
        }
      });
      html += "</tbody></table></div>";
      return html;
    },
  );

  text = text.replace(/\\begin\{table\}(?:\[.*?\])?/g, '<div class="my-4">');
  text = text.replace(/\\end\{table\}/g, "</div>");

  // Karakter spesial LaTeX → Unicode (Hapus '---' -> '—' agar tidak merusak tabel Markdown | --- |)
  text = text.replace(/\\&/g, "&amp;");
  text = text.replace(/\\%/g, "%");
  text = text.replace(/\\#/g, "#");
  text = text.replace(/\\_/g, "_");
  text = text.replace(/\\\$/g, "$");
  text = text.replace(/\\ldots/g, "…");
  text = text.replace(/\\dots/g, "…");

  // Hapus environment LaTeX yang tersisa/tidak dikenali agar tidak mengacaukan output
  text = text.replace(
    /\\begin\{(?!tabular|table|equation|align|array|matrix|pmatrix|bmatrix|vmatrix|Vmatrix)[a-zA-Z*]+\}|\\end\{(?!tabular|table|equation|align|array|matrix|pmatrix|bmatrix|vmatrix|Vmatrix)[a-zA-Z*]+\}/g,
    "",
  );

  // Hapus perintah preamble LaTeX
  text = text.replace(/\\documentclass(\[.*?\])?\{[^{}]*\}\s*\n?/g, "");
  text = text.replace(/\\usepackage(\[.*?\])?\{[^{}]*\}\s*\n?/g, "");
  text = text.replace(/\\title\{([^{}]*)\}/g, "# $1\n");
  text = text.replace(/\\author\{([^{}]*)\}/g, "**Penulis:** $1\n");
  text = text.replace(/\\date\{([^{}]*)\}/g, "*Tanggal:* $1\n");
  text = text.replace(/\\maketitle/g, "");
  text = text.replace(/\\newpage/g, "\n---\n");
  text = text.replace(/\\clearpage/g, "\n---\n");

  // ── 4. Proses Markdown (marked mengubah teks → HTML; tabel dibungkus div scrollable)
  if (props.isMarkdown) {
    try {
      const renderer = new marked.Renderer();
      const originalTable = renderer.table.bind(renderer);
      renderer.table = function (token: any) {
        const html = originalTable(token);
        return `<div class="table-scroll-wrapper">${html}</div>`;
      };
      const parsed = marked.parse(text, { renderer, async: false }) as any;
      if (typeof parsed === "string") {
        text = parsed;
      } else if (parsed && typeof parsed.then === "function") {
        // jika marked mengembalikan Promise, konversi aman
        text = text; // fallback ke text mentah jika async promise
      }
    } catch {
      try {
        const parsed = marked.parse(text, { async: false }) as any;
        if (typeof parsed === "string") text = parsed;
      } catch {
        /* noop */
      }
    }
  }

  // ── 5. Restore placeholder → KaTeX HTML yang sesungguhnya
  if (typeof text === "string") {
    text = text.replace(/KATEXPH(\d+)ENDPH/g, (_, idx) => {
      return katexStore[Number(idx)] ?? "";
    });
  }

  return typeof text === "string" ? text : "";
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
  font-family: var(--font-body, "DM Sans", sans-serif);
  color: var(--color-text-primary);
  font-size: 0.9375rem; /* 15px */
  line-height: 1.75;
}

.katex-rendered-content h1,
.katex-rendered-content h2,
.katex-rendered-content h3,
.katex-rendered-content h4 {
  font-family: var(--font-body, "DM Sans", sans-serif);
  color: var(--color-text-primary);
  font-weight: 700;
  line-height: 1.3;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}
.katex-rendered-content h1 {
  font-size: 1.5rem;
}
.katex-rendered-content h2 {
  font-size: 1.25rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.35rem;
}
.katex-rendered-content h3 {
  font-size: 1.1rem;
}
.katex-rendered-content h4 {
  font-size: 1rem;
}

.katex-rendered-content p {
  margin-top: 0;
  margin-bottom: 1rem;
}

.katex-rendered-content ul,
.katex-rendered-content ol {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}
.katex-rendered-content li {
  margin-bottom: 0.25rem;
}

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
    linear-gradient(to right, white 30%, rgba(255, 255, 255, 0)),
    linear-gradient(to right, rgba(255, 255, 255, 0), white 70%) 0 100%,
    radial-gradient(
      farthest-side at 0% 50%,
      rgba(0, 0, 0, 0.08),
      rgba(0, 0, 0, 0)
    ),
    radial-gradient(
        farthest-side at 100% 50%,
        rgba(0, 0, 0, 0.08),
        rgba(0, 0, 0, 0)
      )
      0 100%;
  background-repeat: no-repeat;
  background-color: white;
  background-size:
    40px 100%,
    40px 100%,
    14px 100%,
    14px 100%;
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
  font-family: var(--font-mono, "JetBrains Mono", monospace);
  font-size: 0.8125rem;
  overflow-x: auto;
  margin: 1rem 0;
  line-height: 1.65;
}
.katex-rendered-content code {
  font-family: var(--font-mono, "JetBrains Mono", monospace);
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
.katex-rendered-content strong {
  color: var(--color-text-primary);
  font-weight: 700;
}
.katex-rendered-content em {
  font-style: italic;
  color: var(--color-text-secondary);
}

/* ── Link ────────────────────────────────────────────────────────── */
.katex-rendered-content a {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.katex-rendered-content a:hover {
  color: var(--color-primary-hover);
}
</style>
