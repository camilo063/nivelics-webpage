import { marked } from "marked";

interface ProseContentProps {
  content: string;
  className?: string;
  /** "light" = artículo sobre superficie clara (.reading-surface); "dark" = default del sitio */
  variant?: "dark" | "light";
}

const PROSE_CLASSES = [
  "nivelics-prose prose prose-invert max-w-none",
  "prose-headings:font-[family-name:var(--font-inter)] prose-headings:font-medium prose-headings:text-text-100 prose-headings:scroll-mt-24",
  "prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-5",
  "prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4",
  "prose-h4:text-lg prose-h4:mt-8 prose-h4:mb-3",
  "prose-p:text-text-70 prose-p:leading-[1.8] prose-p:mb-6",
  "prose-a:text-[var(--primary)] prose-a:no-underline hover:prose-a:underline",
  "prose-strong:text-text-100 prose-strong:font-semibold",
  "prose-em:text-text-100",
  "prose-ul:text-text-70 prose-ol:text-text-70 prose-ul:mb-6 prose-ol:mb-6",
  "prose-li:marker:text-text-40 prose-li:mb-2 prose-li:leading-[1.8]",
  "prose-blockquote:border-l-[var(--primary)] prose-blockquote:text-text-70 prose-blockquote:my-8 prose-blockquote:py-3 prose-blockquote:px-6",
  "prose-code:font-[family-name:var(--font-jetbrains-mono)] prose-code:text-[var(--primary)] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
  "prose-pre:bg-white/[0.03] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg prose-pre:my-6",
  "prose-table:border-collapse prose-table:my-8",
  "prose-th:border prose-th:border-white/10 prose-th:bg-white/[0.05] prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:text-text-100 prose-th:font-medium",
  "prose-td:border prose-td:border-white/10 prose-td:px-4 prose-td:py-2 prose-td:text-text-70",
  "prose-img:rounded-lg prose-img:border prose-img:border-white/10",
  "prose-hr:border-white/10 prose-hr:my-12",
].join(" ");

/* Variante clara — artículo sobre .reading-surface (legibilidad long-form).
   Los bloques de código permanecen dark: contraste agradable sobre el papel. */
const PROSE_CLASSES_LIGHT = [
  "nivelics-prose prose max-w-none",
  "prose-headings:font-[family-name:var(--font-inter)] prose-headings:font-semibold prose-headings:text-[var(--reading-text)] prose-headings:scroll-mt-24",
  "prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-5 prose-h2:tracking-tight",
  "prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4",
  "prose-h4:text-lg prose-h4:mt-8 prose-h4:mb-3",
  "prose-p:text-[var(--reading-muted)] prose-p:leading-[1.8] prose-p:mb-6",
  "prose-a:text-[var(--reading-link)] prose-a:font-medium prose-a:no-underline hover:prose-a:underline",
  "prose-strong:text-[var(--reading-text)] prose-strong:font-semibold",
  "prose-em:text-[var(--reading-text)]",
  "prose-ul:text-[var(--reading-muted)] prose-ol:text-[var(--reading-muted)] prose-ul:mb-6 prose-ol:mb-6",
  "prose-li:marker:text-[var(--reading-link)] prose-li:mb-2 prose-li:leading-[1.8]",
  "prose-blockquote:border-l-[var(--reading-link)] prose-blockquote:text-[var(--reading-muted)] prose-blockquote:my-8 prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:bg-black/[0.03] prose-blockquote:rounded-r-lg",
  "prose-code:font-[family-name:var(--font-jetbrains-mono)] prose-code:text-[var(--reading-link)] prose-code:bg-black/[0.05] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
  "prose-pre:bg-[#14141c] prose-pre:text-[#e8e8f0] prose-pre:border prose-pre:border-black/10 prose-pre:rounded-lg prose-pre:my-6 prose-pre:shadow-md",
  "prose-table:border-collapse prose-table:my-8",
  "prose-th:border prose-th:border-black/10 prose-th:bg-black/[0.04] prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:text-[var(--reading-text)] prose-th:font-medium",
  "prose-td:border prose-td:border-black/10 prose-td:px-4 prose-td:py-2 prose-td:text-[var(--reading-muted)]",
  "prose-img:rounded-lg prose-img:border prose-img:border-black/10 prose-img:shadow-md",
  "prose-hr:border-black/10 prose-hr:my-12",
].join(" ");

marked.setOptions({ gfm: true, breaks: false });

// Heuristic: content is already HTML if it contains block-level HTML tags.
// Markdown content from the generator starts with paragraphs, `## `, `**`, etc.
const HTML_SIGNAL = /<\s*(h[1-6]|p|ul|ol|table|blockquote|div|section|article|pre)\b/i;

export function renderToHtml(content: string): string {
  if (!content) return "";
  if (HTML_SIGNAL.test(content)) return content;
  return marked.parse(content, { async: false }) as string;
}

export function ProseContent({ content, className, variant = "dark" }: ProseContentProps) {
  const html = renderToHtml(content);
  const base = variant === "light" ? PROSE_CLASSES_LIGHT : PROSE_CLASSES;
  return (
    <div
      className={`${base}${className ? " " + className : ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
