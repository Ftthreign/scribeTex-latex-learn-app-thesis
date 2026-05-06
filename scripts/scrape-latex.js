import axios from "axios";
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
// Maps learnlatex.org lesson numbers → Overleaf article paths.
// Set value to null to skip Overleaf for that lesson.
// Audit notes:
//   - Lesson 2  : changed from "Choosing_a_LaTeX_Compiler" (too narrow)
//   - Lesson 14 : changed from "XeLaTeX" (too narrow for a fonts/unicode lesson)
//   - Lesson 16 : set to null — Overleaf Main_Page is an index, not an article

const OVERLEAF_MAPPING = {
  1: "Learn_LaTeX_in_30_minutes",
  2: "Creating_a_document_in_LaTeX",
  3: "Sections_and_chapters",
  4: "Bold,_italics_and_underlining",
  5: "Document_classes",
  6: "Finding_and_using_LaTeX_packages",
  7: "Inserting_Images",
  8: "Tables",
  9: "Cross_referencing_sections,_figures_and_tables",
  10: "Mathematical_expressions",
  11: "Text_alignment",
  12: "Bibliography_management_with_bibtex",
  13: "Management_of_large_projects",
  14: "Font_typefaces",
  15: "Errors",
  16: null,
};

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

turndownService.addRule("latexCodeBlocks", {
  filter(node) {
    if (node.nodeName !== "PRE") return false;

    const cls = (node.getAttribute("class") || "").toLowerCase();
    const childCode = node.querySelector("code");
    const codeCls = childCode
      ? (childCode.getAttribute("class") || "").toLowerCase()
      : "";

    if (cls.includes("latex") || codeCls.includes("latex")) return true;
    if (cls.includes("language-latex") || codeCls.includes("language-latex"))
      return true;

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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const formatLessonId = (num) => `lesson-${num.toString().padStart(2, "0")}`;
const formatMoreId = (num) => `more-${num.toString().padStart(2, "0")}`;

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

  if (sections.overleaf) {
    md += `\n\n---\n\n## Supplemental Documentation (Overleaf)\n\n${sections.overleaf}\n`;
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
  const olPath = OVERLEAF_MAPPING[num];

  // Warn if lesson is missing from mapping entirely (future-proofing)
  if (!(num in OVERLEAF_MAPPING)) {
    console.warn(
      `  [WARN] No Overleaf mapping entry for lesson ${num}. Skipping OL fetch.`,
    );
  }

  console.log(`🚀 Processing ${lessonId}...`);

  // ── 1. LearnLaTeX main (required) ──
  const mainMd = await fetchSafe(`${lessonId} [LL main]`, () =>
    getPageMarkdown(CONFIG.LL_BASE_URL, lessonId),
  );

  if (!mainMd) {
    console.warn(`   No main content for ${lessonId} — skipping entirely.\n`);
    results.skipped.push(lessonId);
    return;
  }

  const sections = { main: mainMd, more: null, overleaf: null };

  // ── 2. LearnLaTeX "more" page (optional) ──
  await sleep(CONFIG.DELAY_BETWEEN_LL_PAGES);
  sections.more = await fetchSafe(`${lessonId} [LL more]`, () =>
    getPageMarkdown(CONFIG.LL_BASE_URL, moreId),
  );
  if (sections.more)
    console.log(`   ↳ ✅ "More" content added from LearnLaTeX`);

  // ── 3. Overleaf supplemental (optional) ──
  if (olPath) {
    await sleep(CONFIG.DELAY_BETWEEN_OL_PAGES);
    console.log(`   ↳ Fetching from Overleaf: ${olPath}`);
    sections.overleaf = await fetchSafe(`${lessonId} [OL: ${olPath}]`, () =>
      getPageMarkdown(CONFIG.OL_BASE_URL, olPath, true),
    );
    if (sections.overleaf) console.log(`   ↳ ✅ Overleaf supplemental added`);
    else
      console.log(
        `   ↳ ⚠️  Overleaf content unavailable — continuing without it`,
      );
  } else {
    console.log(`   ↳  Overleaf mapping is null for lesson ${num} — skipped`);
  }

  // ── 4. Save file (always, even if only main content exists) ──
  const finalMarkdown = buildMarkdown(lessonId, sections);
  const filePath = path.join(CONFIG.OUTPUT_DIR, `${lessonId}.md`);
  await fs.promises.writeFile(filePath, finalMarkdown, "utf-8");

  const hasOl = !!sections.overleaf;
  const hasMore = !!sections.more;
  const status = hasOl ? "full" : "partial (no OL)";
  console.log(
    `   ✅ Saved [${status}${hasMore ? " +more" : ""}] → ${filePath}\n`,
  );

  if (hasOl) results.success.push(lessonId);
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

// ─── Main ─────────────────────────────────────────────────────────────────────

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
