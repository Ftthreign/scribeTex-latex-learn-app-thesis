import axios from "axios";
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Configuration ────────────────────────────────────────────────────────────

const CONFIG = {
  LL_BASE_URL: "https://www.learnlatex.org/en/",
  OL_BASE_URL: "https://www.overleaf.com/learn/latex/",
  OUTPUT_DIR: path.join(__dirname, "../content/scraped-docs"),
  MAX_LESSON: 16,
  REQUEST_TIMEOUT: 15_000,
  DELAY_BETWEEN_LL_PAGES: 500, // Conservative delay for LearnLaTeX
  DELAY_BETWEEN_OL_PAGES: 1_500, // More conservative for Overleaf (commercial)
  DELAY_BETWEEN_LESSONS: 2_000,
  MAX_RETRIES: 3,
  RETRY_BASE_DELAY: 1_000,
};

// ─── Overleaf Mapping ─────────────────────────────────────────────────────────
//
// Maps learnlatex.org lesson numbers → array of Overleaf article paths.
// Each path is appended to OL_BASE_URL and fetched as a separate subsection.
// Empty array = skip Overleaf for that lesson entirely.
//
// "Learn_LaTeX_in_30_minutes" is intentionally excluded — it's a long
// overview article that overlaps too broadly across all lessons.

const OVERLEAF_MAPPING = {
  // Lesson 1 — Intro to LaTeX
  1: ["Creating_a_document_in_LaTeX", "Paragraphs_and_new_lines"],

  // Lesson 2 — Working with LaTeX (commands & environments)
  2: ["Commands", "Environments"],

  // Lesson 3 — Basic document structure / layout
  3: [
    "Page_size_and_margins",
    "Lengths_in_LaTeX",
    "Line_breaks_and_blank_spaces",
  ],

  // Lesson 4 — Document structure / navigation
  4: ["Sections_and_chapters", "Table_of_contents", "Hyperlinks"],

  // Lesson 5 — Document classes & custom classes
  5: [
    "Understanding_packages_and_class_files",
    "Writing_your_own_class",
    "Writing_your_own_package",
  ],

  // Lesson 6 — Using packages
  6: [
    "List_of_packages_and_class_files",
    "Understanding_packages_and_class_files",
  ],

  // Lesson 7 — Graphics / figures
  7: [
    "Inserting_Images",
    "Positioning_images_and_tables",
    "Lists_of_tables_and_figures",
    "TikZ_package",
    "Picture_environment",
  ],

  // Lesson 8 — Tables
  8: ["Tables", "Positioning_images_and_tables", "Lists_of_tables_and_figures"],

  // Lesson 9 — Cross-referencing, indices, glossaries
  9: [
    "Cross_referencing_sections%2C_equations_and_floats",
    "Indices",
    "Glossaries",
    "Nomenclatures",
  ],

  // Lesson 10 — Mathematics
  10: [
    "Mathematical_expressions",
    "Subscripts_and_superscripts",
    "Brackets_and_Parentheses",
    "Matrices",
    "Fractions_and_Binomials",
    "Aligning_equations_with_amsmath",
    "Operators",
    "Spacing_in_math_mode",
    "Integrals%2C_sums_and_limits",
    "Display_style_in_math_mode",
    "List_of_Greek_letters_and_math_symbols",
    "Mathematical_fonts",
  ],

  // Lesson 11 — Formatted text & page formatting
  11: [
    "Bold%2C_italics_and_underlining",
    "Lists",
    "Text_alignment",
    "Paragraph_formatting",
    "Footnotes",
    "Margin_notes",
    "Using_colours_in_LaTeX",
    "Headers_and_footers",
    "Page_numbering",
    "Multiple_columns",
    "Counters",
    "Code_listing",
    "Code_Highlighting_with_minted",
  ],

  // Lesson 12 — Bibliographies & citations
  12: [
    "Bibliography_management_with_bibtex",
    "Bibliography_management_with_natbib",
    "Bibliography_management_with_biblatex",
    "Bibtex_bibliography_styles",
    "Natbib_bibliography_styles",
    "Natbib_citation_styles",
    "Biblatex_bibliography_styles",
    "Biblatex_citation_styles",
  ],

  // Lesson 13 — Large projects & presentations
  13: [
    "Management_in_a_large_project",
    "Multi-file_LaTeX_projects",
    "Beamer",
    "Powerdot",
    "Posters",
  ],

  // Lesson 14 — Fonts, encoding & multilingual
  14: [
    "Font_sizes%2C_families%2C_and_styles",
    "Font_typefaces",
    "XeLaTeX",
    "Multilingual_typesetting_on_Overleaf_using_polyglossia_and_fontspec",
    "Multilingual_typesetting_on_Overleaf_using_babel_and_fontspec",
    "International_language_support",
    "Typesetting_quotations",
    "Arabic",
    "Chinese",
    "French",
    "German",
    "Greek",
    "Italian",
    "Japanese",
    "Korean",
    "Portuguese",
    "Russian",
    "Spanish",
  ],

  // Lesson 15 — Errors
  15: ["Errors"],

  // Lesson 16 — What next / field-specific
  16: [
    "Theorems_and_proofs",
    "Chemistry_formulae",
    "Feynman_diagrams",
    "Molecular_orbital_diagrams",
    "Chess_notation",
    "Knitting_patterns",
    "CircuiTikz_package",
    "Pgfplots_package",
    "Typesetting_exams_in_LaTeX",
    "Attribute_Value_Matrices",
  ],
};

// ─── Turndown Setup ───────────────────────────────────────────────────────────

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

// Only tag <pre> blocks as latex when there is a strong signal.
// Signals: explicit class, or parent/sibling context from learnlatex.
turndownService.addRule("latexCodeBlocks", {
  filter(node) {
    if (node.nodeName !== "PRE") return false;

    const cls = (node.getAttribute("class") || "").toLowerCase();
    const childCode = node.querySelector("code");
    const codeCls = childCode
      ? (childCode.getAttribute("class") || "").toLowerCase()
      : "";

    // Explicit class markers
    if (cls.includes("latex") || codeCls.includes("latex")) return true;
    if (cls.includes("language-latex") || codeCls.includes("language-latex"))
      return true;

    // learnlatex.org wraps its runnable examples in a <div class="latex-example">
    const parent = node.parentElement;
    if (
      parent &&
      (parent.getAttribute("class") || "").includes("latex-example")
    )
      return true;

    return false;
  },
  replacement(content) {
    return `\n\`\`\`latex\n${content.trim()}\n\`\`\`\n`;
  },
});

// ─── Result Tracking ──────────────────────────────────────────────────────────

/**
 * @typedef {{ id: string, reason: string }} ErrorEntry
 *
 * success  — fully saved (LL + optional OL)
 * partial  — saved with only LL content (OL failed or skipped)
 * skipped  — LL content not found at all, nothing saved
 * errors   — unexpected errors per source
 */
const results = {
  success: /** @type {string[]} */ ([]),
  partial: /** @type {string[]} */ ([]),
  skipped: /** @type {string[]} */ ([]),
  errors: /** @type {ErrorEntry[]} */ ([]),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const formatLessonId = (num) => `lesson-${num.toString().padStart(2, "0")}`;
const formatMoreId = (num) => `more-${num.toString().padStart(2, "0")}`;

/**
 * Convert an Overleaf URL path to a human-readable article title.
 * "Aligning_equations_with_amsmath"  -> "Aligning equations with amsmath"
 * "Bold%2C_italics_and_underlining"  -> "Bold, italics and underlining"
 */
function olPathToTitle(p) {
  return decodeURIComponent(p).replace(/_/g, " ");
}

/**
 * Build the final Markdown file content with consistent frontmatter.
 * sections.overleaf = Array of { olPath: string, content: string }
 */
function buildMarkdown(lessonId, sections) {
  const title = lessonId.toUpperCase().replace(/-/g, " ");

  let md = `---
lesson_id: "${lessonId}"
---

# ${title}

`;

  if (sections.main) {
    md += sections.main + "\n";
  }

  if (sections.more) {
    md += `\n\n---\n\n## Deep Dive (LearnLaTeX)\n\n${sections.more}\n`;
  }

  if (sections.overleaf?.length > 0) {
    md += `\n\n---\n\n## Supplemental Documentation (Overleaf)\n`;
    for (const { olPath, content } of sections.overleaf) {
      md += `\n\n### ${olPathToTitle(olPath)}\n\n${content}\n`;
    }
  }

  return md;
}

// ─── Core Fetcher (retry + timeout) ──────────────────────────────────────────

/**
 * Fetch a page and return its Markdown content.
 * Returns null for 404 or empty content.
 * Throws after MAX_RETRIES on persistent network errors.
 */
async function getPageMarkdown(baseUrl, id, isOverleaf = false) {
  const url = `${baseUrl}${id}`;

  for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
    try {
      const response = await axios.get(url, {
        timeout: CONFIG.REQUEST_TIMEOUT,
      });
      const $ = cheerio.load(response.data);

      // ── Common noise removal ──
      $("nav, footer, .nav, .footer, script, style, header, aside").remove();

      if (isOverleaf) {
        // Overleaf-specific interactive/UI elements
        $(
          ".btn-open-in-overleaf, .learn-navigation, .learn-search, " +
            ".page-header, .table-of-contents, #table-of-contents",
        ).remove();
        $(
          'a:contains("Open in Overleaf"), a:contains("Open this example")',
        ).remove();
      } else {
        // LearnLaTeX navigation links
        $('a[href*="#toc"], a[href*="lesson-"], a[href*="more-"]').each(
          function () {
            const text = $(this).text().toLowerCase();
            if (
              text.includes("next lesson") ||
              text.includes("table of contents") ||
              text.includes("more on this topic")
            ) {
              $(this).remove();
            }
          },
        );
      }

      // ── Content extraction ──
      const selectors = isOverleaf
        ? [".learn-content", "main", "article", "body"]
        : ["main", "#main", "article", "body"];

      let contentHtml = null;
      for (const sel of selectors) {
        const html = $(sel).html();
        if (html) {
          if (sel === "body" || (sel !== "main" && !isOverleaf)) {
            console.warn(`  [WARN] '${id}' used fallback selector: <${sel}>`);
          }
          contentHtml = html;
          break;
        }
      }

      if (!contentHtml) return null;

      const markdown = turndownService.turndown(contentHtml).trim();
      return markdown || null;
    } catch (error) {
      if (error.response?.status === 404) return null;

      if (attempt === CONFIG.MAX_RETRIES) {
        throw new Error(
          `Failed after ${CONFIG.MAX_RETRIES} attempts (${url}): ${error.message}`,
        );
      }

      const delay = CONFIG.RETRY_BASE_DELAY * Math.pow(2, attempt - 1);
      console.warn(
        `  [RETRY] Attempt ${attempt}/${CONFIG.MAX_RETRIES} failed for '${id}': ${error.message}. ` +
          `Retrying in ${delay}ms...`,
      );
      await sleep(delay);
    }
  }
}

/**
 * Safe wrapper: runs an async fetch function and returns null on failure
 * instead of throwing. Records the error in results.
 */
async function fetchSafe(label, fn) {
  try {
    return await fn();
  } catch (err) {
    console.error(`  [ERROR] ${label}: ${err.message}`);
    results.errors.push({ id: label, reason: err.message });
    return null;
  }
}

// ─── Per-lesson Processor ─────────────────────────────────────────────────────

async function processCombinedLesson(num) {
  const lessonId = formatLessonId(num);
  const moreId = formatMoreId(num);
  const olPaths = OVERLEAF_MAPPING[num] ?? [];

  if (!(num in OVERLEAF_MAPPING)) {
    console.warn(
      `  [WARN] No Overleaf mapping entry for lesson ${num}. Skipping OL fetch.`,
    );
  }

  console.log(`🚀 Processing ${lessonId} (${olPaths.length} OL article(s))...`);

  const mainMd = await fetchSafe(`${lessonId} [LL main]`, () =>
    getPageMarkdown(CONFIG.LL_BASE_URL, lessonId),
  );

  if (!mainMd) {
    console.warn(
      `   ⚠️  No main content for ${lessonId} — skipping entirely.\n`,
    );
    results.skipped.push(lessonId);
    return;
  }

  const sections = { main: mainMd, more: null, overleaf: [] };

  await sleep(CONFIG.DELAY_BETWEEN_LL_PAGES);
  sections.more = await fetchSafe(`${lessonId} [LL more]`, () =>
    getPageMarkdown(CONFIG.LL_BASE_URL, moreId),
  );
  if (sections.more)
    console.log(`   ↳ ✅ "More" content added from LearnLaTeX`);

  if (olPaths.length === 0) {
    console.log(`   ↳ ℹ️  No Overleaf articles mapped for lesson ${num}`);
  }

  for (const olPath of olPaths) {
    await sleep(CONFIG.DELAY_BETWEEN_OL_PAGES);
    console.log(`   ↳ Fetching OL: ${olPathToTitle(olPath)}`);

    const content = await fetchSafe(`${lessonId} [OL: ${olPath}]`, () =>
      getPageMarkdown(CONFIG.OL_BASE_URL, olPath, true),
    );

    if (content) {
      sections.overleaf.push({ olPath, content });
      console.log(`     ✅ Added`);
    } else {
      console.log(`     ⚠️  Unavailable — skipped`);
    }
  }

  const finalMarkdown = buildMarkdown(lessonId, sections);
  const filePath = path.join(CONFIG.OUTPUT_DIR, `${lessonId}.md`);
  await fs.promises.writeFile(filePath, finalMarkdown, "utf-8");

  const olCount = sections.overleaf.length;
  const hasMore = !!sections.more;
  const status =
    olCount > 0 ? `full (${olCount}/${olPaths.length} OL)` : "partial (no OL)";
  console.log(
    `   ✅ Saved [${status}${hasMore ? " +more" : ""}] → ${filePath}\n`,
  );

  if (olCount > 0) results.success.push(lessonId);
  else results.partial.push(lessonId);
}

// ─── Summary ──────────────────────────────────────────────────────────────────

function printSummary() {
  const line = "─".repeat(50);
  console.log(`\n${line}`);
  console.log("📊  Scraping Summary");
  console.log(line);
  console.log(
    `✅  Full success : ${results.success.length} → ${results.success.join(", ") || "-"}`,
  );
  console.log(
    `🟡  Partial (LL only) : ${results.partial.length} → ${results.partial.join(", ") || "-"}`,
  );
  console.log(
    `⏭️   Skipped (no LL)  : ${results.skipped.length} → ${results.skipped.join(", ") || "-"}`,
  );
  console.log(`❌  Source errors : ${results.errors.length}`);

  if (results.errors.length > 0) {
    for (const { id, reason } of results.errors) {
      console.error(`    • ${id}: ${reason}`);
    }
  }

  console.log(line + "\n");
}

async function main() {
  await fs.promises.mkdir(CONFIG.OUTPUT_DIR, { recursive: true });
  console.log("🏁 Starting combined scraping process...\n");

  for (let i = 1; i <= CONFIG.MAX_LESSON; i++) {
    await processCombinedLesson(i);
    await sleep(CONFIG.DELAY_BETWEEN_LESSONS);
  }

  printSummary();
}

main().catch((err) => {
  console.error("💥 Fatal error:", err);
  process.exit(1);
});
