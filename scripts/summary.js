import { results } from "./results.js";

/**
 * Prints a structured summary of the scraped documentation lessons,
 * including successes, partial updates, skips, and any errors encountered.
 */
export function printSummary() {
  const line = "─".repeat(50);
  console.log(`\n${line}`);
  console.log("Scraping Summary");
  console.log(line);
  console.log(
    `Full success : ${results.success.length} → ${results.success.join(", ") || "-"}`,
  );
  console.log(
    `Partial (LL only) : ${results.partial.length} → ${results.partial.join(", ") || "-"}`,
  );
  console.log(
    `Skipped (no LL)  : ${results.skipped.length} → ${results.skipped.join(", ") || "-"}`,
  );
  console.log(`Source errors : ${results.errors.length}`);

  if (results.errors.length > 0) {
    for (const { id, reason } of results.errors) {
      console.error(`    • ${id}: ${reason}`);
    }
  }

  console.log(line + "\n");
}
