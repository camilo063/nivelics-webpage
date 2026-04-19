import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getLocale } from "next-intl/server";
import {
  getAllBlogPosts,
  getFeaturedBlogPost,
  getPopularBlogPosts,
  getActiveBlogCategories,
  getBlogCategoryBySlug,
  getBlogPostsByCategory,
  mapBlogPost,
} from "@/lib/cms";
import type { Locale, MappedBlogPost } from "@/lib/cms";

export const revalidate = 3600;

const POSTS_PER_PAGE = 12;
// Hide the popular sidebar below this threshold — with fewer posts, the
// sidebar duplicates the main grid.
const SIDEBAR_MIN_POSTS = 8;

interface SearchParams {
  cat?: string;
  page?: string;
}

interface ActiveCategory {
  id: string;
  slug: string;
  nameEs: string;
  nameEn: string | null;
  color: string | null;
}

type CategoryLookup = Map<string, ActiveCategory>;

type EnrichedPost = MappedBlogPost & {
  category: ActiveCategory | null;
  readingTime: number;
};

function t(locale: Locale, es: string, en: string): string {
  return locale === "en" ? en : es;
}

function categoryLabel(cat: ActiveCategory, locale: Locale): string {
  return locale === "en" ? cat.nameEn || cat.nameEs : cat.nameEs;
}

function formatDate(d: Date | null, locale: Locale): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString(locale === "en" ? "en-US" : "es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function computeReadingTime(p: MappedBlogPost): number {
  if (p.readingTimeMinutes && p.readingTimeMinutes > 0) return p.readingTimeMinutes;
  const words = (p.content || "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function enrichPost(p: MappedBlogPost, categories: CategoryLookup): EnrichedPost {
  const category = p.categoryId ? categories.get(p.categoryId) || null : null;
  return { ...p, category, readingTime: computeReadingTime(p) };
}

function blogHref(categorySlug: string | null, page: number): string {
  const params = new URLSearchParams();
  if (categorySlug) params.set("cat", categorySlug);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/blog?${qs}` : "/blog";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const params = await searchParams;
  const activeCategory = params.cat ? await getBlogCategoryBySlug(params.cat) : null;

  const baseTitle = "Blog";
  const title = activeCategory
    ? `${baseTitle} — ${categoryLabel(activeCategory as ActiveCategory, locale)}`
    : baseTitle;

  const description = t(
    locale,
    "Insights, guías y tendencias sobre transformación digital, IA, cloud y talento tech.",
    "Insights, guides and trends on digital transformation, AI, cloud and tech talent.",
  );

  const path = activeCategory ? `/blog?cat=${activeCategory.slug}` : "/blog";
  const canonical = `https://www.nivelics.com${locale === "en" ? "/en" : ""}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: `https://www.nivelics.com${path}`,
        en: `https://www.nivelics.com/en${path}`,
        "x-default": `https://www.nivelics.com${path}`,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
    },
  };
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const locale = (await getLocale()) as Locale;
  const params = await searchParams;
  const categorySlug = params.cat ?? null;
  const requestedPage = Math.max(1, parseInt(params.page || "1", 10) || 1);

  const activeCategoryRaw = categorySlug ? await getBlogCategoryBySlug(categorySlug) : null;
  const activeCategory: ActiveCategory | null = activeCategoryRaw
    ? {
        id: activeCategoryRaw.id,
        slug: activeCategoryRaw.slug,
        nameEs: activeCategoryRaw.nameEs,
        nameEn: activeCategoryRaw.nameEn,
        color: activeCategoryRaw.color,
      }
    : null;

  const [rawAll, rawFeatured, rawPopular, rawCategories] = await Promise.all([
    activeCategory ? getBlogPostsByCategory(activeCategory.id) : getAllBlogPosts(),
    activeCategory ? Promise.resolve(null) : getFeaturedBlogPost(),
    getPopularBlogPosts(5),
    getActiveBlogCategories(),
  ]);

  const categoryLookup: CategoryLookup = new Map(
    rawCategories.map((c) => [
      c.id,
      {
        id: c.id,
        slug: c.slug,
        nameEs: c.nameEs,
        nameEn: c.nameEn,
        color: c.color,
      },
    ]),
  );

  const allPosts = rawAll.map((p) => mapBlogPost(p as Record<string, unknown>, locale));
  const featuredMapped = rawFeatured
    ? mapBlogPost(rawFeatured as Record<string, unknown>, locale)
    : null;
  const popularMapped = rawPopular.map((p) => mapBlogPost(p as Record<string, unknown>, locale));

  // Featured is excluded from the grid to avoid duplication (only relevant
  // when no category filter is active).
  const gridPosts = featuredMapped
    ? allPosts.filter((p) => p.slug !== featuredMapped.slug)
    : allPosts;

  const totalPages = Math.max(1, Math.ceil(gridPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const pagedPosts = gridPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  const featured = featuredMapped ? enrichPost(featuredMapped, categoryLookup) : null;
  const paged = pagedPosts.map((p) => enrichPost(p, categoryLookup));
  const popular = popularMapped
    .filter((p) => !featuredMapped || p.slug !== featuredMapped.slug)
    .map((p) => enrichPost(p, categoryLookup));

  const showPopularSidebar = !activeCategory && allPosts.length >= SIDEBAR_MIN_POSTS;

  // ─── Schema.org ──────────────────────────────────────────
  const breadcrumbItems = activeCategory
    ? [
        { name: t(locale, "Inicio", "Home"), url: locale === "en" ? "/en" : "/" },
        { name: "Blog", url: locale === "en" ? "/en/blog" : "/blog" },
        {
          name: categoryLabel(activeCategory, locale),
          url: `${locale === "en" ? "/en" : ""}/blog?cat=${activeCategory.slug}`,
        },
      ]
    : [
        { name: t(locale, "Inicio", "Home"), url: locale === "en" ? "/en" : "/" },
        { name: "Blog", url: locale === "en" ? "/en/blog" : "/blog" },
      ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);

  const postUrl = (slug: string): string =>
    `https://www.nivelics.com${locale === "en" ? "/en" : ""}/blog/${slug}`;

  const schemaPosts: MappedBlogPost[] = [
    ...(featuredMapped ? [featuredMapped] : []),
    ...pagedPosts,
  ];

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: activeCategory
      ? `Blog — ${categoryLabel(activeCategory, locale)}`
      : t(locale, "Blog de Nivelics", "Nivelics Blog"),
    description: t(
      locale,
      "Insights, guías y tendencias sobre transformación digital, IA, cloud y talento tech.",
      "Insights, guides and trends on digital transformation, AI, cloud and tech talent.",
    ),
    url: `https://www.nivelics.com${locale === "en" ? "/en" : ""}${
      activeCategory ? `/blog?cat=${activeCategory.slug}` : "/blog"
    }`,
    inLanguage: locale === "en" ? "en" : "es",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: schemaPosts.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "BlogPosting",
          headline: p.title,
          url: postUrl(p.slug),
          ...(p.publishedAt ? { datePublished: new Date(p.publishedAt).toISOString() } : {}),
          ...(p.coverImage ? { image: p.coverImage } : {}),
          ...(p.excerpt ? { description: p.excerpt } : {}),
        },
      })),
    },
  };

  const pageHeading = activeCategory ? `Blog — ${categoryLabel(activeCategory, locale)}` : "Blog";
  const pageLead = t(
    locale,
    "Insights, guías y tendencias sobre transformación digital, IA, cloud y talento tech.",
    "Insights, guides and trends on digital transformation, AI, cloud and tech talent.",
  );

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* ═══ UI breadcrumb ═══ */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-[1280px] px-6 pt-6 md:px-20">
        <ol className="flex items-center gap-1.5 text-xs">
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
            {activeCategory ? (
              <Link
                href={locale === "en" ? "/en/blog" : "/blog"}
                className="text-white/35 transition-colors hover:text-white/60 font-medium"
              >
                Blog
              </Link>
            ) : (
              <span className="text-white/70 font-medium" aria-current="page">
                Blog
              </span>
            )}
          </li>
          {activeCategory ? (
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className="text-white/20">
                /
              </span>
              <span className="text-white/70 font-medium" aria-current="page">
                {categoryLabel(activeCategory, locale)}
              </span>
            </li>
          ) : null}
        </ol>
      </nav>

      {/* ═══ Page heading ═══ */}
      <section className="pt-6 md:pt-8">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h1 className="text-3xl font-medium text-text-100 md:text-4xl">{pageHeading}</h1>
          <p className="mt-3 max-w-2xl text-text-70">{pageLead}</p>
        </div>
      </section>

      {/* ═══ Featured hero (only on unfiltered home) ═══ */}
      {featured ? (
        <section className="pt-10 md:pt-14">
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <Link
              href={`/blog/${featured.slug}`}
              className="group relative flex min-h-[400px] items-end overflow-hidden rounded-2xl md:min-h-[500px]"
              style={
                featured.coverImage
                  ? {
                      backgroundImage: `url(${featured.coverImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : { background: "var(--grad-hero)" }
              }
              aria-label={featured.title}
            >
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/85 to-[#0d1117]/20"
                aria-hidden="true"
              />
              <div className="relative z-10 w-full p-6 md:p-10 lg:p-14">
                {featured.category ? (
                  <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
                    {categoryLabel(featured.category, locale)}
                  </span>
                ) : null}
                <h2 className="mt-4 max-w-3xl text-3xl font-medium leading-tight text-white md:text-5xl">
                  {featured.title}
                </h2>
                {featured.excerpt ? (
                  <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
                    {featured.excerpt}
                  </p>
                ) : null}
                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/50">
                  {featured.publishedAt ? (
                    <time className="font-[family-name:var(--font-jetbrains-mono)]">
                      {formatDate(featured.publishedAt, locale)}
                    </time>
                  ) : null}
                  <span aria-hidden="true" className="text-white/30">
                    ·
                  </span>
                  <span className="font-[family-name:var(--font-jetbrains-mono)]">
                    {featured.readingTime} {t(locale, "min de lectura", "min read")}
                  </span>
                  <span aria-hidden="true" className="text-white/30">
                    ·
                  </span>
                  <span>Nivelics</span>
                </div>
                <div className="mt-8">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-dark px-6 py-3 text-sm font-semibold text-bg-base shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-[1.02]">
                    {t(locale, "Leer artículo", "Read article")} <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      ) : null}

      {/* ═══ Category filter pills ═══ */}
      {rawCategories.length > 0 ? (
        <section className="mt-10 md:mt-14">
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Link
                href={locale === "en" ? "/en/blog" : "/blog"}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  !activeCategory
                    ? "bg-[var(--primary)] text-white"
                    : "bg-white/[0.05] text-white/60 hover:bg-white/[0.08] hover:text-white/80"
                }`}
              >
                {t(locale, "Todos", "All")}
              </Link>
              {rawCategories.map((cat) => {
                const isActive = activeCategory?.id === cat.id;
                const href = `${locale === "en" ? "/en" : ""}/blog?cat=${cat.slug}`;
                return (
                  <Link
                    key={cat.id}
                    href={href}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[var(--primary)] text-white"
                        : "bg-white/[0.05] text-white/60 hover:bg-white/[0.08] hover:text-white/80"
                    }`}
                  >
                    {locale === "en" ? cat.nameEn || cat.nameEs : cat.nameEs}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* ═══ Main grid + sidebar ═══ */}
      <section className="py-8 md:py-10">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          {paged.length === 0 ? (
            <p className="py-20 text-center text-text-70">
              {activeCategory
                ? t(
                    locale,
                    "No hay artículos en esta categoría aún.",
                    "No articles in this category yet.",
                  )
                : t(locale, "Pronto publicaremos contenido.", "New content coming soon.")}
            </p>
          ) : (
            <div
              className={
                showPopularSidebar
                  ? "grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:gap-12"
                  : undefined
              }
            >
              <div>
                {/* First card — large, horizontal on desktop */}
                {paged[0] ? (
                  <Link
                    href={`/blog/${paged[0].slug}`}
                    className="group glass block overflow-hidden rounded-xl transition-all hover:border-white/15"
                  >
                    <div className="grid gap-0 md:grid-cols-[40%_60%]">
                      <div className="relative aspect-[16/9] overflow-hidden bg-bg-surface md:aspect-auto md:min-h-[260px]">
                        {paged[0].coverImage ? (
                          <Image
                            src={paged[0].coverImage}
                            alt={paged[0].coverImageAlt || paged[0].title}
                            fill
                            sizes="(max-width: 768px) 100vw, 40vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-primary/25 to-bg-surface" />
                        )}
                      </div>
                      <div className="p-6 md:p-8">
                        {paged[0].category ? (
                          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                            {categoryLabel(paged[0].category, locale)}
                          </span>
                        ) : null}
                        <h3 className="mt-3 text-xl font-medium text-white transition-colors group-hover:text-primary md:text-2xl">
                          {paged[0].title}
                        </h3>
                        {paged[0].excerpt ? (
                          <p className="mt-2 text-sm text-white/60 line-clamp-2">
                            {paged[0].excerpt}
                          </p>
                        ) : null}
                        <div className="mt-4 flex items-center gap-3 text-xs text-white/40">
                          {paged[0].publishedAt ? (
                            <time className="font-[family-name:var(--font-jetbrains-mono)]">
                              {formatDate(paged[0].publishedAt, locale)}
                            </time>
                          ) : null}
                          <span aria-hidden="true">·</span>
                          <span className="font-[family-name:var(--font-jetbrains-mono)]">
                            {paged[0].readingTime} {t(locale, "min", "min")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : null}

                {/* Rest of the grid — 2-col */}
                {paged.length > 1 ? (
                  <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {paged.slice(1).map((post) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group glass block overflow-hidden rounded-xl transition-all hover:border-white/15"
                      >
                        <div className="relative aspect-[16/9] overflow-hidden bg-bg-surface">
                          {post.coverImage ? (
                            <Image
                              src={post.coverImage}
                              alt={post.coverImageAlt || post.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-primary/15 to-bg-surface" />
                          )}
                        </div>
                        <div className="p-5">
                          {post.category ? (
                            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/15 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                              {categoryLabel(post.category, locale)}
                            </span>
                          ) : null}
                          <h3 className="mt-3 text-lg font-medium leading-snug text-white transition-colors group-hover:text-primary line-clamp-2">
                            {post.title}
                          </h3>
                          {post.excerpt ? (
                            <p className="mt-2 text-sm text-white/50 line-clamp-2">
                              {post.excerpt}
                            </p>
                          ) : null}
                          <div className="mt-3 flex items-center gap-3 text-xs text-white/40">
                            {post.publishedAt ? (
                              <time className="font-[family-name:var(--font-jetbrains-mono)]">
                                {formatDate(post.publishedAt, locale)}
                              </time>
                            ) : null}
                            <span aria-hidden="true">·</span>
                            <span className="font-[family-name:var(--font-jetbrains-mono)]">
                              {post.readingTime} {t(locale, "min", "min")}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : null}

                {/* Pagination */}
                {totalPages > 1 ? (
                  <nav
                    className="mt-10 flex items-center justify-center gap-2"
                    aria-label={t(locale, "Paginación", "Pagination")}
                  >
                    {currentPage > 1 ? (
                      <Link
                        href={blogHref(activeCategory?.slug ?? null, currentPage - 1)}
                        className="rounded-full px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white/80"
                      >
                        ← {t(locale, "Anterior", "Previous")}
                      </Link>
                    ) : null}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <Link
                        key={n}
                        href={blogHref(activeCategory?.slug ?? null, n)}
                        aria-current={n === currentPage ? "page" : undefined}
                        className={`rounded-full px-4 py-2 text-sm font-[family-name:var(--font-jetbrains-mono)] transition-colors ${
                          n === currentPage
                            ? "bg-[var(--primary)] text-white"
                            : "text-white/60 hover:bg-white/[0.08] hover:text-white/80"
                        }`}
                      >
                        {n}
                      </Link>
                    ))}
                    {currentPage < totalPages ? (
                      <Link
                        href={blogHref(activeCategory?.slug ?? null, currentPage + 1)}
                        className="rounded-full px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white/80"
                      >
                        {t(locale, "Siguiente", "Next")} →
                      </Link>
                    ) : null}
                  </nav>
                ) : null}
              </div>

              {/* Sidebar */}
              {showPopularSidebar ? (
                <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
                  {popular.length > 0 ? (
                    <div>
                      <h2 className="mb-4 text-lg font-medium text-white/90">
                        {t(locale, "Artículos populares", "Popular articles")}
                      </h2>
                      <ul className="space-y-4">
                        {popular.map((post, i) => (
                          <li
                            key={post.slug}
                            className="border-b border-white/[0.06] pb-4 last:border-0 last:pb-0"
                          >
                            <Link href={`/blog/${post.slug}`} className="group flex gap-3">
                              <span className="shrink-0 font-[family-name:var(--font-jetbrains-mono)] text-lg font-medium leading-none text-[var(--primary)]">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm text-white/70 transition-colors group-hover:text-white line-clamp-2">
                                  {post.title}
                                </p>
                                {post.category ? (
                                  <span className="mt-1 inline-block text-[11px] text-white/40">
                                    {categoryLabel(post.category, locale)}
                                  </span>
                                ) : null}
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div className="rounded-xl border border-white/10 bg-gradient-to-b from-[var(--primary)]/10 to-transparent p-6">
                    <h3 className="text-base font-medium text-white">
                      {t(locale, "¿Necesitas implementar esto?", "Need to implement this?")}
                    </h3>
                    <p className="mt-2 text-sm text-white/60">
                      {t(locale, "Agenda un diagnóstico gratuito.", "Schedule a free assessment.")}
                    </p>
                    <Button asChild variant="cta" size="sm" className="mt-4 w-full">
                      <Link href={locale === "en" ? "/en/contact" : "/contacto"}>
                        {t(locale, "Hablar con un experto", "Talk to an expert")}{" "}
                        <ArrowRight size={14} />
                      </Link>
                    </Button>
                  </div>
                </aside>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}
