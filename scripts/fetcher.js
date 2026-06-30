import axios from "axios";
import * as cheerio from "cheerio";
import { CONFIG } from "./config.js";
import { turndownService } from "./turndown-setup.js";
import { sleep } from "./helpers.js";
import { results } from "./results.js";

/**
 * Fetch a page and return its Markdown content.
 * Returns null for 404 or empty content.
 * Throws after MAX_RETRIES on persistent network errors.
 */
export async function getPageMarkdown(baseUrl, id, isOverleaf = false) {
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
export async function fetchSafe(label, fn) {
  try {
    return await fn();
  } catch (err) {
    console.error(`  [ERROR] ${label}: ${err.message}`);
    results.errors.push({ id: label, reason: err.message });
    return null;
  }
}
