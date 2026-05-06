const axios = require("axios");
const cheerio = require("cheerio");
const TurndownService = require("turndown");
const fs = require("fs");
const path = require("path");

// ─── Configuration ────────────────────────────────────────────────────────────

const CONFIG = {
  BASE_URL: "https://www.learnlatex.org/en/",
  OUTPUT_DIR: path.join(__dirname, "../content/scraped-docs"),
  MAX_LESSON: 16, // Upper bound for auto-discovery
  REQUEST_TIMEOUT: 10_000, // 10 seconds
  DELAY_BETWEEN_LESSONS: 1_000,
  DELAY_BETWEEN_EXTRAS: 500,
  DELAY_BETWEEN_PAGES: 300, // Delay between main + "more" page within a lesson
  MAX_RETRIES: 3,
  RETRY_BASE_DELAY: 1_000, // Exponential backoff base (1s → 2s → 4s)
  EXTRA_IDS: ["language-01", "extra-01"],
};

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

// ─── Tracking ─────────────────────────────────────────────────────────────────

const results = {
  success: [],
  skipped: [],
  errors: [],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatLessonId(num) {
  return `lesson-${num.toString().padStart(2, "0")}`;
}

function formatMoreId(num) {
  return `more-${num.toString().padStart(2, "0")}`;
}

/**
 * Build consistent frontmatter + heading for any page ID.
 */
function buildMarkdown(id, mainContent, moreContent = null) {
  const title = id.toUpperCase().replace(/-/g, " ");

  let md = `---
lesson_id: "${id}"
---

# ${title}

${mainContent}
`;

  if (moreContent) {
    md += `\n\n---\n\n## More on this topic\n\n${moreContent}\n`;
  }

  return md;
}

// ─── Core Fetcher (with retry + timeout) ─────────────────────────────────────

/**
 * Fetch a page and convert to Markdown.
 * Returns null for 404, throws on persistent failure.
 */
async function getPageMarkdown(id) {
  const url = `${CONFIG.BASE_URL}${id}`;

  for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
    try {
      const response = await axios.get(url, {
        timeout: CONFIG.REQUEST_TIMEOUT,
      });

      const $ = cheerio.load(response.data);

      // Strip navigation, boilerplate, and noisy links
      $("nav, footer, .nav, .footer, script, style").remove();
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

      // Try selectors in priority order and log which one matched
      let contentHtml = null;
      const selectors = ["main", "#main", "article", "body"];
      for (const sel of selectors) {
        const html = $(sel).html();
        if (html) {
          if (sel !== "main") {
            console.warn(`  [WARN] '${id}' used fallback selector: <${sel}>`);
          }
          contentHtml = html;
          break;
        }
      }

      if (!contentHtml) return null;

      return turndownService.turndown(contentHtml).trim();
    } catch (error) {
      // 404 = page genuinely doesn't exist, no retry needed
      if (error.response?.status === 404) return null;

      const isLastAttempt = attempt === CONFIG.MAX_RETRIES;

      if (isLastAttempt) {
        // Rethrow so the caller can record it as a real error
        throw new Error(
          `Failed to fetch '${id}' after ${CONFIG.MAX_RETRIES} attempts: ${error.message}`,
        );
      }

      const delay = CONFIG.RETRY_BASE_DELAY * Math.pow(2, attempt - 1);
      console.warn(
        `  [RETRY] Attempt ${attempt}/${CONFIG.MAX_RETRIES} failed for '${id}' (${error.message}). Retrying in ${delay}ms...`,
      );
      await sleep(delay);
    }
  }
}

// ─── Auto-discovery ───────────────────────────────────────────────────────────

/**
 * Probe lesson pages sequentially and return numbers that actually exist.
 * Stops at the first 404 but also respects CONFIG.MAX_LESSON as a safety cap.
 */
async function discoverLessonNumbers() {
  console.log("🔍 Auto-discovering available lessons...");
  const found = [];

  for (let i = 1; i <= CONFIG.MAX_LESSON; i++) {
    const id = formatLessonId(i);
    const content = await getPageMarkdown(id);

    if (content === null) {
      console.log(
        `  Lesson ${i} not found — stopping discovery at lesson ${i - 1}.`,
      );
      break;
    }

    found.push({ num: i, content });
    await sleep(CONFIG.DELAY_BETWEEN_PAGES);
  }

  console.log(`  Found ${found.length} lesson(s).\n`);
  return found;
}

// ─── Per-lesson processor ─────────────────────────────────────────────────────

async function processLesson({ num, content: lessonMd }) {
  const lessonId = formatLessonId(num);
  const moreId = formatMoreId(num);

  console.log(`📄 Processing ${lessonId}...`);

  let moreMd = null;
  try {
    moreMd = await getPageMarkdown(moreId);
    if (moreMd) {
      console.log(`   ↳ "More" page found for ${lessonId}`);
    }
    await sleep(CONFIG.DELAY_BETWEEN_PAGES);
  } catch (err) {
    console.error(
      `   ↳ [ERROR] Could not fetch more page for ${lessonId}: ${err.message}`,
    );
    results.errors.push({ id: moreId, reason: err.message });
  }

  const finalMarkdown = buildMarkdown(lessonId, lessonMd, moreMd);
  const filePath = path.join(CONFIG.OUTPUT_DIR, `${lessonId}.md`);

  await fs.promises.writeFile(filePath, finalMarkdown, "utf-8");
  console.log(`   ✅ Saved → ${filePath}`);
  results.success.push(lessonId);
}

// ─── Extra pages ──────────────────────────────────────────────────────────────

async function processExtra(id) {
  console.log(`📄 Processing extra: ${id}...`);

  try {
    const md = await getPageMarkdown(id);

    if (!md) {
      console.warn(`   ⚠️  Skipping '${id}' — no content found.`);
      results.skipped.push(id);
      return;
    }

    // Extras also get consistent frontmatter
    const finalMarkdown = buildMarkdown(id, md);
    const filePath = path.join(CONFIG.OUTPUT_DIR, `${id}.md`);

    await fs.promises.writeFile(filePath, finalMarkdown, "utf-8");
    console.log(`   ✅ Saved → ${filePath}`);
    results.success.push(id);
  } catch (err) {
    console.error(`   ❌ Error processing '${id}': ${err.message}`);
    results.errors.push({ id, reason: err.message });
  }
}

// ─── Summary ──────────────────────────────────────────────────────────────────

function printSummary() {
  console.log("\n─────────────────────────────────────");
  console.log("📊 Scraping Summary");
  console.log("─────────────────────────────────────");
  console.log(
    `✅ Saved   : ${results.success.length} file(s) → ${results.success.join(", ") || "-"}`,
  );
  console.log(
    `⚠️  Skipped : ${results.skipped.length} file(s) → ${results.skipped.join(", ") || "-"}`,
  );
  console.log(`❌ Errors  : ${results.errors.length} file(s)`);

  if (results.errors.length > 0) {
    for (const { id, reason } of results.errors) {
      console.error(`   • ${id}: ${reason}`);
    }
  }

  console.log("─────────────────────────────────────\n");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Ensure output directory exists
  await fs.promises.mkdir(CONFIG.OUTPUT_DIR, { recursive: true });

  // 1. Auto-discover and fetch all lessons
  let lessons;
  try {
    lessons = await discoverLessonNumbers();
  } catch (err) {
    console.error("❌ Discovery phase failed:", err.message);
    process.exit(1);
  }

  for (const lesson of lessons) {
    try {
      await processLesson(lesson);
    } catch (err) {
      console.error(
        `❌ Failed to process ${formatLessonId(lesson.num)}: ${err.message}`,
      );
      results.errors.push({
        id: formatLessonId(lesson.num),
        reason: err.message,
      });
    }
    await sleep(CONFIG.DELAY_BETWEEN_LESSONS);
  }

  // 2. Process extra pages
  console.log("\n📂 Processing extra pages...");
  for (const extraId of CONFIG.EXTRA_IDS) {
    await processExtra(extraId);
    await sleep(CONFIG.DELAY_BETWEEN_EXTRAS);
  }

  printSummary();
}

main().catch((err) => {
  console.error("💥 Unhandled error:", err);
  process.exit(1);
});
