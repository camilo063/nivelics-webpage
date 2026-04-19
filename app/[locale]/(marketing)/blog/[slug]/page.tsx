import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { ProseContent } from "@/components/shared/ProseContent";
import { Button } from "@/components/ui/button";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getBlogPostingSchema } from "@/lib/schema/blog-posting";
import { getLocale } from "next-intl/server";
import { getBlogPost, getAllBlogPosts, mapBlogPost, getBlogCategoriesPublic } from "@/lib/cms";
import type { Locale, MappedBlogPost } from "@/lib/cms";
import { processBlogContent } from "@/lib/utils/blog";
import { TableOfContents, TableOfContentsCollapsible } from "@/components/shared/TableOfContents";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { CTAContextual } from "@/components/shared/CTAContextual";
import { RelatedPosts } from "@/components/shared/RelatedPosts";

export const revalidate = 3600;

// LEGACY FALLBACK — used only when DB is unreachable.
const POSTS: Record<string, { title: string; content: string; date: string; readTime: string }> = {
  "como-implementar-ia-generativa-en-tu-empresa": {
    title: "Cómo implementar IA generativa en tu empresa: guía práctica 2026",
    date: "2026-03-15",
    readTime: "8 min",
    content: `La inteligencia artificial generativa ha dejado de ser una promesa futurista para convertirse en una herramienta operativa que las empresas más competitivas ya están usando. En esta guía te mostramos cómo iniciar tu adopción de IA de forma práctica y segura.

## 1. Identifica casos de uso con ROI claro

Antes de implementar cualquier modelo, mapea los procesos donde la IA puede generar valor inmediato: atención al cliente, generación de contenido, análisis de documentos, o automatización de reportes.

## 2. Elige el modelo correcto

No todo requiere GPT-4 o Claude. Evalúa modelos open-source para tareas específicas y reserva los modelos premium para casos que requieran razonamiento complejo.

## 3. Construye con guardrails

Implementa validación de outputs, monitoreo de alucinaciones y feedback loops desde el día uno. La IA sin controles es un riesgo, no una ventaja.

## 4. Mide y optimiza

Define KPIs claros: tiempo ahorrado, errores reducidos, satisfacción del usuario. Si no lo puedes medir, no sabes si funciona.`,
  },
  "finops-guia-completa": {
    title: "FinOps: la guía completa para optimizar tu inversión cloud",
    date: "2026-02-28",
    readTime: "12 min",
    content: `FinOps es la práctica de gestionar y optimizar el gasto en cloud para maximizar el valor de negocio. No se trata solo de reducir costos, sino de gastar de forma inteligente.

## ¿Qué es FinOps?

FinOps combina finanzas, tecnología y negocio para tomar decisiones informadas sobre el uso de cloud. Es una disciplina cultural, no solo técnica.

## Los tres pilares

**Informar**: Visibilidad total del gasto por equipo, proyecto y ambiente.
**Optimizar**: Rightsizing, reserved instances, spot instances y eliminación de waste.
**Operar**: Governance, budgets, alertas y cultura de eficiencia.

## Primeros pasos

1. Implementa una estrategia de tagging consistente
2. Configura dashboards de costo en tiempo real
3. Identifica quick wins (recursos idle, oversized)
4. Establece un equipo FinOps cross-funcional`,
  },
  "staff-augmentation-vs-outsourcing": {
    title: "Staff Augmentation vs Outsourcing: ¿cuál es mejor para tu proyecto?",
    date: "2026-02-10",
    readTime: "6 min",
    content: `Elegir entre staff augmentation y outsourcing puede definir el éxito de tu proyecto. Ambos modelos tienen ventajas, pero sirven para situaciones diferentes.

## Staff Augmentation

Integras profesionales externos a tu equipo existente. Tú mantienes el control del proyecto, la metodología y los procesos. Ideal cuando necesitas skills específicos o escalar rápido manteniendo la cultura del equipo.

## Outsourcing

Delegas un proyecto completo a un equipo externo. Ellos manejan el delivery end-to-end. Funciona bien para proyectos con scope definido y cuando no tienes capacidad interna de gestión.

## ¿Cuándo elegir cada uno?

- **Staff Augmentation**: proyecto core, equipo existente, necesitas control, largo plazo
- **Outsourcing**: proyecto no-core, scope cerrado, capacidad de gestión limitada`,
  },
  "migracion-cloud-errores-comunes": {
    title: "5 errores comunes en migraciones cloud (y cómo evitarlos)",
    date: "2026-01-20",
    readTime: "7 min",
    content: `Después de +50 migraciones cloud, hemos identificado los errores más frecuentes que cometen las empresas. Aquí te contamos cuáles son y cómo evitarlos.

## 1. Migrar sin estrategia (lift & shift a ciegas)

No todo debe ir a la nube, y no todo debe ir igual. Evalúa cada workload: rehost, replatform, refactor o retire.

## 2. Ignorar los costos desde el inicio

La nube no es mágica. Sin governance, tus costos pueden dispararse. Implementa FinOps desde el día uno.

## 3. No planificar el rollback

Toda migración necesita un plan B. Define criterios de rollback y prueba que funciona antes de migrar producción.

## 4. Subestimar la seguridad

Cloud no es inseguro, pero requiere un modelo de seguridad diferente. Shared responsibility, IAM, encryption, network segmentation.

## 5. No capacitar al equipo

La nube requiere habilidades nuevas. Invierte en capacitación antes y durante la migración.`,
  },
};

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const dbPosts = await getAllBlogPosts();
  if (dbPosts.length > 0) {
    return dbPosts.map((p) => ({ slug: (p as Record<string, unknown>).slug as string }));
  }
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

function buildAlternates(slug: string) {
  const es = `https://www.nivelics.com/blog/${slug}`;
  const en = `https://www.nivelics.com/en/blog/${slug}`;
  return { es, en };
}

function computeReadingTime(p: MappedBlogPost): number {
  if (p.readingTimeMinutes && p.readingTimeMinutes > 0) return p.readingTimeMinutes;
  const words = (p.content || "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(d: Date | null, locale: Locale): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString(locale === "en" ? "en-US" : "es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function t(locale: Locale, es: string, en: string): string {
  return locale === "en" ? en : es;
}

export async function generateMetadata(props: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const locale = (await getLocale()) as Locale;
  const urls = buildAlternates(slug);
  const canonical = locale === "en" ? urls.en : urls.es;

  const dbPost = await getBlogPost(slug);
  if (dbPost) {
    const mapped = mapBlogPost(dbPost as Record<string, unknown>, locale);
    const title = mapped.seoTitle || mapped.title;
    const description = mapped.seoDescription || mapped.excerpt.slice(0, 160);
    const image = mapped.coverImage || undefined;
    const datePublished = (mapped.publishedAt ?? mapped.createdAt)?.toISOString();
    const dateModified = (
      mapped.updatedAt ??
      mapped.publishedAt ??
      mapped.createdAt
    )?.toISOString();
    return {
      title,
      description,
      alternates: {
        canonical,
        languages: { es: urls.es, en: urls.en, "x-default": urls.es },
      },
      openGraph: {
        type: "article",
        title,
        description,
        url: canonical,
        locale: locale === "en" ? "en_US" : "es_CO",
        alternateLocale: locale === "en" ? ["es_CO"] : ["en_US"],
        siteName: "Nivelics",
        images: image ? [{ url: image }] : undefined,
        publishedTime: datePublished,
        modifiedTime: dateModified,
        authors: ["Equipo Nivelics"],
        tags: mapped.tags,
        section: undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: image ? [image] : undefined,
      },
    };
  }

  const post = POSTS[slug];
  if (!post) return { title: "Post no encontrado" };
  return {
    title: post.title,
    description: post.content.slice(0, 160),
    alternates: {
      canonical,
      languages: { es: urls.es, en: urls.en, "x-default": urls.es },
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.content.slice(0, 160),
      url: canonical,
      locale: locale === "en" ? "en_US" : "es_CO",
      siteName: "Nivelics",
    },
    twitter: { card: "summary_large_image", title: post.title },
  };
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const { slug } = await props.params;
  const locale = (await getLocale()) as Locale;

  const dbPost = await getBlogPost(slug);
  if (dbPost) {
    const mapped = mapBlogPost(dbPost as Record<string, unknown>, locale);

    const [allPostsRaw, categoriesRaw] = await Promise.all([
      getAllBlogPosts(),
      getBlogCategoriesPublic(),
    ]);

    const categoryById = new Map(
      categoriesRaw.map((c) => [
        c.id,
        {
          id: c.id,
          slug: c.slug,
          name: locale === "en" ? c.nameEn || c.nameEs : c.nameEs,
        },
      ]),
    );
    const category = mapped.categoryId ? (categoryById.get(mapped.categoryId) ?? null) : null;

    const { html: processedHtml, headings } = processBlogContent(mapped.content);
    const readingTime = computeReadingTime(mapped);
    const formattedDate = formatDate(mapped.publishedAt, locale);
    const canonicalUrl = `https://www.nivelics.com${locale === "en" ? "/en" : ""}/blog/${slug}`;

    // Related: prefer same category, fill with most recent, dedupe, cap at 3.
    const allMapped = allPostsRaw.map((p) => mapBlogPost(p as Record<string, unknown>, locale));
    const sameCategory = mapped.categoryId
      ? allMapped.filter((p) => p.slug !== slug && p.categoryId === mapped.categoryId)
      : [];
    const recent = allMapped.filter((p) => p.slug !== slug);
    const seen = new Set<string>();
    const related = [...sameCategory, ...recent]
      .filter((p) => {
        if (seen.has(p.slug)) return false;
        seen.add(p.slug);
        return true;
      })
      .slice(0, 3)
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        coverImage: p.coverImage,
        coverImageAlt: p.coverImageAlt,
        publishedAt: p.publishedAt,
        readingTimeMinutes: p.readingTimeMinutes,
        categoryName: p.categoryId ? (categoryById.get(p.categoryId)?.name ?? null) : null,
      }));

    const breadcrumb = getBreadcrumbSchema([
      { name: t(locale, "Inicio", "Home"), url: locale === "en" ? "/en" : "/" },
      { name: "Blog", url: locale === "en" ? "/en/blog" : "/blog" },
      { name: mapped.title, url: `${locale === "en" ? "/en" : ""}/blog/${slug}` },
    ]);
    const blogPosting = getBlogPostingSchema(mapped, {
      locale,
      categoryName: category?.name,
    });

    return (
      <PageWrapper>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPosting) }}
        />

        <div className="mx-auto max-w-[1280px] px-6 md:px-20 py-10 md:py-14">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs">
              <li>
                <Link
                  href={locale === "en" ? "/en" : "/"}
                  className="text-white/35 transition-colors hover:text-white/60 font-medium"
                >
                  {t(locale, "Inicio", "Home")}
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <span aria-hidden="true" className="text-white/20">
                  /
                </span>
                <Link
                  href={locale === "en" ? "/en/blog" : "/blog"}
                  className="text-white/35 transition-colors hover:text-white/60 font-medium"
                >
                  Blog
                </Link>
              </li>
              <li className="flex items-center gap-1.5 min-w-0">
                <span aria-hidden="true" className="text-white/20">
                  /
                </span>
                <span className="text-white/70 font-medium truncate" aria-current="page">
                  {mapped.title}
                </span>
              </li>
            </ol>
          </nav>

          <Button asChild variant="ghost" size="sm" className="mb-6">
            <Link href={locale === "en" ? "/en/blog" : "/blog"}>
              <ArrowLeft className="h-3.5 w-3.5" />
              {t(locale, "Volver al blog", "Back to blog")}
            </Link>
          </Button>

          {/* Article header */}
          <header className="mb-10 md:mb-14">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
              {category ? (
                <Link
                  href={`${locale === "en" ? "/en" : ""}/blog?cat=${category.slug}`}
                  className="inline-flex items-center rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/25 transition-colors"
                >
                  {category.name}
                </Link>
              ) : null}
              {formattedDate ? (
                <>
                  {category ? <span className="text-white/30">•</span> : null}
                  <time className="text-white/40">{formattedDate}</time>
                </>
              ) : null}
              <span className="text-white/30">•</span>
              <span className="text-white/40 font-[family-name:var(--font-jetbrains-mono)]">
                {readingTime} {t(locale, "min de lectura", "min read")}
              </span>
            </div>
            <h1 className="mb-4 text-3xl font-medium leading-tight text-white md:text-4xl lg:text-5xl">
              {mapped.title}
            </h1>
            {mapped.excerpt ? (
              <p className="max-w-3xl text-lg leading-relaxed text-white/60">{mapped.excerpt}</p>
            ) : null}
          </header>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px] lg:gap-14">
            <article>
              <TableOfContentsCollapsible
                headings={headings}
                label={t(locale, "Contenido", "Contents")}
              />
              <ProseContent content={processedHtml} />

              <CTAContextual categorySlug={category?.slug ?? null} locale={locale} />

              <RelatedPosts
                posts={related}
                locale={locale}
                heading={t(locale, "Artículos relacionados", "Related articles")}
              />
            </article>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-10">
                <TableOfContents headings={headings} label={t(locale, "Contenido", "Contents")} />
                <ShareButtons
                  url={canonicalUrl}
                  title={mapped.title}
                  label={t(locale, "Compartir", "Share")}
                  copyLabel={t(locale, "Copiar link", "Copy link")}
                  copiedLabel={t(locale, "¡Copiado!", "Copied!")}
                />
              </div>
            </aside>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // ─── LEGACY FALLBACK ──────────────────────────────────
  const post = POSTS[slug];
  if (!post) notFound();

  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${slug}` },
  ]);

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <article className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6 md:px-20">
          <Button asChild variant="ghost" size="sm" className="mb-8">
            <Link href="/blog">
              <ArrowLeft size={14} />
              Volver al blog
            </Link>
          </Button>

          <div className="flex items-center gap-3 text-sm text-text-40">
            <time>
              {new Date(post.date).toLocaleDateString("es-CO", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{post.readTime} de lectura</span>
          </div>

          <h1 className="mt-4 text-3xl font-bold text-text-100 md:text-4xl">{post.title}</h1>

          <ProseContent content={post.content} className="mt-12" />
        </div>
      </article>
    </PageWrapper>
  );
}
