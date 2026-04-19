import { renderToHtml } from "@/components/shared/ProseContent";

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Walks h2/h3 in the rendered HTML and injects stable `id` attributes so the
// TOC scroll-spy has anchors to observe. Headings that already carry an `id`
// are preserved; collisions get `-2`, `-3`, etc. suffixes.
export function addHeadingIds(html: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const used = new Set<string>();

  const withIds = html.replace(
    /<(h2|h3)((?:\s+[^>]*)?)>([\s\S]*?)<\/\1>/gi,
    (_match, tag: string, attrs: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      const existingId = /\sid=["']([^"']+)["']/i.exec(attrs || "")?.[1];
      let id = existingId ?? slugify(text) ?? "";
      if (!id) id = `section-${headings.length + 1}`;
      let candidate = id;
      let n = 1;
      while (used.has(candidate)) {
        n++;
        candidate = `${id}-${n}`;
      }
      used.add(candidate);
      const level: 2 | 3 = tag.toLowerCase() === "h2" ? 2 : 3;
      headings.push({ id: candidate, text, level });

      if (existingId) {
        const patched = attrs.replace(/\sid=["'][^"']+["']/i, ` id="${candidate}"`);
        return `<${tag}${patched}>${inner}</${tag}>`;
      }
      return `<${tag}${attrs || ""} id="${candidate}">${inner}</${tag}>`;
    },
  );

  return { html: withIds, headings };
}

export function processBlogContent(raw: string): { html: string; headings: Heading[] } {
  const rendered = renderToHtml(raw || "");
  return addHeadingIds(rendered);
}
