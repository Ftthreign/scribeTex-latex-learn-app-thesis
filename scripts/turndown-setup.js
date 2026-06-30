import TurndownService from "turndown";

export const turndownService = new TurndownService({
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
