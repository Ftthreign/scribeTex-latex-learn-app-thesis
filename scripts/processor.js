import fs from "fs";
import path from "path";
import { CONFIG, OVERLEAF_MAPPING } from "./config.js";
import { results } from "./results.js";
import {
  sleep,
  formatLessonId,
  formatMoreId,
  olPathToTitle,
  buildMarkdown,
} from "./helpers.js";
import { getPageMarkdown, fetchSafe } from "./fetcher.js";

/**
 * Per-lesson processor that retrieves Main, More, and Overleaf documentation,
 * then writes the compiled Markdown file.
 */
export async function processCombinedLesson(num) {
  const lessonId = formatLessonId(num);
  const moreId = formatMoreId(num);
  const olPaths = OVERLEAF_MAPPING[num] ?? [];

  if (!(num in OVERLEAF_MAPPING)) {
    console.warn(
      `  [WARN] No Overleaf mapping entry for lesson ${num}. Skipping OL fetch.`,
    );
  }

  console.log(`Processing ${lessonId} (${olPaths.length} OL article(s))...`);

  const mainMd = await fetchSafe(`${lessonId} [LL main]`, () =>
    getPageMarkdown(CONFIG.LL_BASE_URL, lessonId),
  );

  if (!mainMd) {
    console.warn(`No main content for ${lessonId} — skipping entirely.\n`);
    results.skipped.push(lessonId);
    return;
  }

  const sections = { main: mainMd, more: null, overleaf: [] };

  await sleep(CONFIG.DELAY_BETWEEN_LL_PAGES);
  sections.more = await fetchSafe(`${lessonId} [LL more]`, () =>
    getPageMarkdown(CONFIG.LL_BASE_URL, moreId),
  );
  if (sections.more) console.log(`   ↳ "More" content added from LearnLaTeX`);

  if (olPaths.length === 0) {
    console.log(`   ↳ No Overleaf articles mapped for lesson ${num}`);
  }

  for (const olPath of olPaths) {
    await sleep(CONFIG.DELAY_BETWEEN_OL_PAGES);
    console.log(`   ↳ Fetching OL: ${olPathToTitle(olPath)}`);

    const content = await fetchSafe(`${lessonId} [OL: ${olPath}]`, () =>
      getPageMarkdown(CONFIG.OL_BASE_URL, olPath, true),
    );

    if (content) {
      sections.overleaf.push({ olPath, content });
      console.log(`Added`);
    } else {
      console.log(`Unavailable — skipped`);
    }
  }

  const finalMarkdown = buildMarkdown(lessonId, sections);
  const filePath = path.join(CONFIG.OUTPUT_DIR, `${lessonId}.md`);
  await fs.promises.writeFile(filePath, finalMarkdown, "utf-8");

  const olCount = sections.overleaf.length;
  const hasMore = !!sections.more;
  const status =
    olCount > 0 ? `full (${olCount}/${olPaths.length} OL)` : "partial (no OL)";
  console.log(`Saved [${status}${hasMore ? " +more" : ""}] → ${filePath}\n`);

  if (olCount > 0) results.success.push(lessonId);
  else results.partial.push(lessonId);
}
