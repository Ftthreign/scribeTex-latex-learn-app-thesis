export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const formatLessonId = (num) => `lesson-${num.toString().padStart(2, "0")}`;
export const formatMoreId = (num) => `more-${num.toString().padStart(2, "0")}`;

/**
 * Convert an Overleaf URL path to a human-readable article title.
 * "Aligning_equations_with_amsmath"  -> "Aligning equations with amsmath"
 * "Bold%2C_italics_and_underlining"  -> "Bold, italics and underlining"
 */
export function olPathToTitle(p) {
  return decodeURIComponent(p).replace(/_/g, " ");
}

/**
 * Build the final Markdown file content with consistent frontmatter.
 * sections.overleaf = Array of { olPath: string, content: string }
 */
export function buildMarkdown(lessonId, sections) {
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
