import fs from "fs";
import { CONFIG } from "./config.js";
import { sleep } from "./helpers.js";
import { processCombinedLesson } from "./processor.js";
import { printSummary } from "./summary.js";

async function main() {
  await fs.promises.mkdir(CONFIG.OUTPUT_DIR, { recursive: true });
  console.log("Starting combined scraping process...\n");

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
