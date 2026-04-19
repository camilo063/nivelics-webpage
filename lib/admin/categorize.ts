// Claude-backed classifier that assigns one of a fixed set of blog category
// slugs to a post based on its title, excerpt, and the start of its content.
// Shared by the admin endpoint (`/api/admin/categorize`) and the batch script
// (`scripts/auto-categorize-blog-posts.ts`).

const MODEL = "claude-sonnet-4-5-20250929";
const CONTENT_CHARS = 500;

export interface CategoryCandidate {
  slug: string;
  nameEs: string;
  nameEn: string | null;
}

export interface ClassifyInput {
  title: string;
  excerpt?: string | null;
  content?: string | null;
}

export interface ClassifyResult {
  slug: string;
  confidence: "ok" | "none";
}

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildUserMessage(categories: CategoryCandidate[], input: ClassifyInput): string {
  const categoryList = categories
    .map((c) => `- ${c.slug}: ${c.nameEs}${c.nameEn ? ` / ${c.nameEn}` : ""}`)
    .join("\n");
  const excerpt = (input.excerpt || "").trim();
  const contentSnippet = stripHtml(input.content || "").slice(0, CONTENT_CHARS);
  return `Categorías disponibles (responde con el slug EXACTO, sin explicación):
${categoryList}

Artículo:
Título: ${input.title}
${excerpt ? `Extracto: ${excerpt}` : ""}
${contentSnippet ? `Contenido (inicio): ${contentSnippet}` : ""}

¿Cuál slug corresponde mejor?`;
}

const SYSTEM_PROMPT = `Eres un clasificador de contenido técnico B2B para Nivelics (consultoría de transformación digital: IA, Cloud, Staff Augmentation, Desarrollo Digital).
Dada una lista de categorías con slug y nombre, clasifica el artículo en la categoría más apropiada.
Responde ÚNICAMENTE con el slug exacto de la categoría. Sin comillas, sin explicación, sin markdown. Si ninguna encaja claramente, elige la más cercana.`;

export async function classifyPost(
  apiKey: string,
  categories: CategoryCandidate[],
  input: ClassifyInput,
): Promise<ClassifyResult> {
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY missing");
  if (categories.length === 0) return { slug: "", confidence: "none" };
  if (!input.title?.trim()) return { slug: "", confidence: "none" };

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 64,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserMessage(categories, input) }],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Anthropic API ${response.status}: ${body}`);
  }

  const data = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  const text = data.content?.find((c) => c.type === "text")?.text?.trim() ?? "";
  const slug = text
    .split(/\s/)[0]
    .replace(/[^a-z0-9-]/gi, "")
    .toLowerCase();

  const isValid = categories.some((c) => c.slug === slug);
  return { slug: isValid ? slug : "", confidence: isValid ? "ok" : "none" };
}
