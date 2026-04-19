import { marked } from "marked";

interface ProseContentProps {
  content: string;
  className?: string;
}

const PROSE_CLASSES = [
  "nivelics-prose prose prose-invert max-w-none",
  "prose-headings:font-[family-name:var(--font-inter)] prose-headings:font-medium prose-headings:text-white/90 prose-headings:scroll-mt-24",
  "prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-5",
  "prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4",
  "prose-h4:text-lg prose-h4:mt-8 prose-h4:mb-3",
  "prose-p:text-white/70 prose-p:leading-[1.8] prose-p:mb-6",
  "prose-a:text-[var(--primary)] prose-a:no-underline hover:prose-a:underline",
  "prose-strong:text-white/90 prose-strong:font-semibold",
  "prose-em:text-white/80",
  "prose-ul:text-white/70 prose-ol:text-white/70 prose-ul:mb-6 prose-ol:mb-6",
  "prose-li:marker:text-white/40 prose-li:mb-2 prose-li:leading-[1.8]",
  "prose-blockquote:border-l-[var(--primary)] prose-blockquote:text-white/60 prose-blockquote:my-8 prose-blockquote:py-3 prose-blockquote:px-6",
  "prose-code:font-[family-name:var(--font-jetbrains-mono)] prose-code:text-[var(--primary)] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
  "prose-pre:bg-white/[0.03] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg prose-pre:my-6",
  "prose-table:border-collapse prose-table:my-8",
  "prose-th:border prose-th:border-white/10 prose-th:bg-white/[0.05] prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:text-white/80 prose-th:font-medium",
  "prose-td:border prose-td:border-white/10 prose-td:px-4 prose-td:py-2 prose-td:text-white/70",
  "prose-img:rounded-lg prose-img:border prose-img:border-white/10",
  "prose-hr:border-white/10 prose-hr:my-12",
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

export function ProseContent({ content, className }: ProseContentProps) {
  const html = renderToHtml(content);
  return (
    <div
      className={`${PROSE_CLASSES}${className ? " " + className : ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
