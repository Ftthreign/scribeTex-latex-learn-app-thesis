import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Configuration ────────────────────────────────────────────────────────────

export const CONFIG = {
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

export const OVERLEAF_MAPPING = {
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
