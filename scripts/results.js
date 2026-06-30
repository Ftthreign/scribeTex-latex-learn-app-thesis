/**
 * @typedef {{ id: string, reason: string }} ErrorEntry
 *
 * success  — fully saved (LL + optional OL)
 * partial  — saved with only LL content (OL failed or skipped)
 * skipped  — LL content not found at all, nothing saved
 * errors   — unexpected errors per source
 */
export const results = {
  success: /** @type {string[]} */ ([]),
  partial: /** @type {string[]} */ ([]),
  skipped: /** @type {string[]} */ ([]),
  errors: /** @type {ErrorEntry[]} */ ([]),
};
