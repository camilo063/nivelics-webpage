// CMS-connected: 2026-05-07 — categories and posts read from DB with hardcoded fallbacks
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageWrapper } from "@/components/layout";
import { ServiceBadge } from "@/components/shared";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { setRequestLocale, getLocale } from "next-intl/server";
import { getBlogCategoryBySlug, getBlogPostsByCategory, mapBlogPost } from "@/lib/cms";
import type { Locale } from "@/lib/cms";

export const revalidate = 86400;

const FALLBACK_CATEGORIES: Record<string, { label: string; badge: string }> = {
  "inteligencia-artificial": { label: "Inteligencia Artificial", badge: "ia" },
  cloud: { label: "Cloud", badge: "cloud" },
  "staff-augmentation": { label: "Staff Augmentation", badge: "staffing" },
  finops: { label: "FinOps", badge: "finops" },
  "transformacion-digital": { label: "Transformación Digital", badge: "dev" },
};

const FALLBACK_ALL_POSTS = [
  {
    slug: "como-implementar-ia-generativa-en-tu-empresa",
    title: "Cómo implementar IA generativa en tu empresa: guía práctica 2026",
    excerpt:
      "Una guía paso a paso para adoptar LLMs y agentes de IA en procesos empresariales reales.",
    category: "inteligencia-artificial",
    date: "2026-03-15",
    readTime: "8 min",
  },
  {
    slug: "finops-guia-completa",
    title: "FinOps: la guía completa para optimizar tu inversión cloud",
    excerpt: "Todo lo que necesitas saber sobre FinOps.",
    category: "finops",
    date: "2026-02-28",
    readTime: "12 min",
  },
  {
    slug: "staff-augmentation-vs-outsourcing",
    title: "Staff Augmentation vs Outsourcing: ¿cuál es mejor?",
    excerpt: "Análisis comparativo de modelos de contratación.",
    category: "staff-augmentation",
    date: "2026-02-10",
    readTime: "6 min",
  },
  {
    slug: "migracion-cloud-errores-comunes",
    title: "5 errores comunes en migraciones cloud",
    excerpt: "Lecciones aprendidas de +50 migraciones.",
    category: "cloud",
    date: "2026-01-20",
    readTime: "7 min",
  },
];

export function generateStaticParams() {
  return Object.keys(FALLBACK_CATEGORIES).map((category) => ({ category }));
}

// Use async params per Next.js 16
interface Props {
  params: Promise<{ category: string; locale: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { category, locale: __locale } = await props.params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;

  const dbCategory = await getBlogCategoryBySlug(category);
  const fallback = FALLBACK_CATEGORIES[category];

  if (!dbCategory && !fallback) return { title: "Categoría no encontrada" };

  const label = dbCategory
    ? locale === "en"
      ? dbCategory.nameEn || dbCategory.nameEs
      : dbCategory.nameEs
    : fallback!.label;

  return buildPageMetadata({
    locale,
    path: `/blog/categoria/${category}`,
    title: `Blog ${label} | Artículos y Guías`,
    description: `Artículos sobre ${label.toLowerCase()} para empresas B2B.`,
  });
}

export default async function BlogCategoryPage(props: Props) {
  const { category: slug, locale: __locale } = await props.params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;

  const dbCategory = await getBlogCategoryBySlug(slug);
  const rawPosts = dbCategory ? await getBlogPostsByCategory(dbCategory.id) : [];
  const dbPosts = rawPosts.map((p) => mapBlogPost(p as Record<string, unknown>, locale));

  const fallbackCat = FALLBACK_CATEGORIES[slug];

  // If neither DB nor fallback knows this slug → 404
  if (!dbCategory && !fallbackCat) notFound();

  // Resolve category metadata (label + badge variant)
  const label = dbCategory
    ? locale === "en"
      ? dbCategory.nameEn || dbCategory.nameEs
      : dbCategory.nameEs
    : fallbackCat!.label;
  const badge = (fallbackCat?.badge ?? "dev") as "ia" | "cloud" | "staffing" | "finops" | "dev";

  // Use hardcoded fallback only when CMS yields no posts AND no DB category exists
  const useFallback = dbPosts.length === 0 && !dbCategory;
  const fallbackPosts = useFallback ? FALLBACK_ALL_POSTS.filter((p) => p.category === slug) : [];

  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: label, url: `/blog/categoria/${slug}` },
  ]);

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <ServiceBadge variant={badge}>{label}</ServiceBadge>
          <h1 className="mt-6 text-4xl font-bold text-text-100 md:text-5xl">Blog: {label}</h1>
          <p className="mt-4 max-w-2xl text-lg text-text-70">
            Artículos, guías y tendencias sobre {label.toLowerCase()}.
          </p>
        </div>
      </section>

      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          {dbPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {dbPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group glass glow-hover rounded-xl p-6 block"
                >
                  <h2 className="text-xl font-semibold text-text-100 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt ? (
                    <p className="mt-2 text-sm text-text-70">{post.excerpt}</p>
                  ) : null}
                  <div className="mt-4 flex items-center gap-3 text-xs text-text-40">
                    {post.publishedAt ? (
                      <time>
                        {new Date(post.publishedAt).toLocaleDateString(
                          locale === "en" ? "en-US" : "es-CO",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </time>
                    ) : null}
                    {post.readingTimeMinutes ? (
                      <>
                        <span>·</span>
                        <span>{post.readingTimeMinutes} min</span>
                      </>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          ) : fallbackPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {fallbackPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group glass glow-hover rounded-xl p-6 block"
                >
                  <h2 className="text-xl font-semibold text-text-100 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-text-70">{post.excerpt}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-text-40">
                    <time>
                      {new Date(post.date).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-text-70">
              No hay artículos en esta categoría aún. Pronto publicaremos contenido sobre{" "}
              {label.toLowerCase()}.
            </p>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}
