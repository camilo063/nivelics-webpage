import { cache } from "react";
import { db } from "@/lib/db";
import {
  servicios,
  industrias,
  casosExito,
  blogPosts,
  blogCategories,
  homeContent,
  teamMembers,
  historiaItems,
  certificaciones,
  navConfig,
  siteConfig,
  pagesGeneral,
} from "@/lib/db/schema/admin";
import { eq, and, isNull, desc, asc } from "drizzle-orm";
import {
  SITE_CONFIG_FB,
  NAV_CONFIG_FB,
  HOME_CONTENT_FB,
  SERVICIOS_FB,
  INDUSTRIAS_FB,
  CASOS_EXITO_FB,
  BLOG_CATEGORIES_FB,
  BLOG_POSTS_FB,
  TEAM_MEMBERS_FB,
  HISTORIA_ITEMS_FB,
  CERTIFICACIONES_FB,
  PAGES_GENERAL_FB,
} from "./fallbacks-data";

function byPublishedDesc<T extends { publishedAt: Date | null; createdAt?: Date | null }>(
  a: T,
  b: T,
): number {
  const ta = a.publishedAt?.getTime() ?? a.createdAt?.getTime() ?? 0;
  const tb = b.publishedAt?.getTime() ?? b.createdAt?.getTime() ?? 0;
  return tb - ta;
}

// ─── SERVICIOS ─────────────────────────────────────────

export const getServicio = cache(async (slugEs: string) => {
  if (!db) {
    return (
      SERVICIOS_FB.find((r) => r.slugEs === slugEs && !r.deletedAt && r.status === "published") ??
      null
    );
  }
  const result = await db
    .select()
    .from(servicios)
    .where(
      and(
        eq(servicios.slugEs, slugEs),
        isNull(servicios.deletedAt),
        eq(servicios.status, "published"),
      ),
    )
    .limit(1);
  return result[0] || null;
});

export const getAllServicios = cache(async () => {
  if (!db) {
    return SERVICIOS_FB.filter((r) => !r.deletedAt && r.status === "published").sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
  }
  return db
    .select()
    .from(servicios)
    .where(and(isNull(servicios.deletedAt), eq(servicios.status, "published")))
    .orderBy(asc(servicios.sortOrder));
});

export const getServiciosByParent = cache(async (parentId: string) => {
  if (!db) {
    return SERVICIOS_FB.filter(
      (r) => r.parentId === parentId && !r.deletedAt && r.status === "published",
    ).sort((a, b) => a.sortOrder - b.sortOrder);
  }
  return db
    .select()
    .from(servicios)
    .where(
      and(
        eq(servicios.parentId, parentId),
        isNull(servicios.deletedAt),
        eq(servicios.status, "published"),
      ),
    )
    .orderBy(asc(servicios.sortOrder));
});

export const getHubServicios = cache(async () => {
  if (!db) {
    return SERVICIOS_FB.filter(
      (r) => r.serviceType === "hub" && !r.deletedAt && r.status === "published",
    ).sort((a, b) => a.sortOrder - b.sortOrder);
  }
  // Home only renders title/subtitle/icon/accentColor/metrics[0]/slug.
  // Omit JSONB hub-only fields (frameworkPillars, sectors, hubMetrics) and
  // detail-only fields (benefits, processSteps, faqs, schemaServiceJson, ctas).
  return db
    .select({
      id: servicios.id,
      slugEs: servicios.slugEs,
      slugEn: servicios.slugEn,
      parentId: servicios.parentId,
      serviceType: servicios.serviceType,
      accentColor: servicios.accentColor,
      icon: servicios.icon,
      titleEs: servicios.titleEs,
      titleEn: servicios.titleEn,
      subtitleEs: servicios.subtitleEs,
      subtitleEn: servicios.subtitleEn,
      metrics: servicios.metrics,
      sortOrder: servicios.sortOrder,
      status: servicios.status,
    })
    .from(servicios)
    .where(
      and(
        eq(servicios.serviceType, "hub"),
        isNull(servicios.deletedAt),
        eq(servicios.status, "published"),
      ),
    )
    .orderBy(asc(servicios.sortOrder));
});

// ─── INDUSTRIAS ────────────────────────────────────────

export const getIndustria = cache(async (slugEs: string) => {
  if (!db) {
    return INDUSTRIAS_FB.find((r) => r.slugEs === slugEs && !r.deletedAt) ?? null;
  }
  const result = await db
    .select()
    .from(industrias)
    .where(and(eq(industrias.slugEs, slugEs), isNull(industrias.deletedAt)))
    .limit(1);
  return result[0] || null;
});

export const getAllIndustrias = cache(async () => {
  if (!db) {
    return INDUSTRIAS_FB.filter((r) => !r.deletedAt).sort((a, b) =>
      a.nameEs.localeCompare(b.nameEs),
    );
  }
  // Listings (home + hub) render name/slug/icon/heroTitle/heroSubtitle.
  // Detail rich-section JSONB columns (painPoints/solutions/useCases/...)
  // are loaded by getIndustria(slug) on the detail page.
  return db
    .select({
      id: industrias.id,
      slugEs: industrias.slugEs,
      slugEn: industrias.slugEn,
      icon: industrias.icon,
      accentColor: industrias.accentColor,
      nameEs: industrias.nameEs,
      nameEn: industrias.nameEn,
      heroTitleEs: industrias.heroTitleEs,
      heroTitleEn: industrias.heroTitleEn,
      heroSubtitleEs: industrias.heroSubtitleEs,
      heroSubtitleEn: industrias.heroSubtitleEn,
      status: industrias.status,
      createdAt: industrias.createdAt,
      updatedAt: industrias.updatedAt,
    })
    .from(industrias)
    .where(isNull(industrias.deletedAt))
    .orderBy(asc(industrias.nameEs));
});

// ─── CASOS DE ÉXITO ───────────────────────────────────

export const getCasoExito = cache(async (slug: string) => {
  if (!db) {
    return (
      CASOS_EXITO_FB.find((r) => r.slug === slug && !r.deletedAt && r.status === "published") ??
      null
    );
  }
  const result = await db
    .select()
    .from(casosExito)
    .where(
      and(
        eq(casosExito.slug, slug),
        isNull(casosExito.deletedAt),
        eq(casosExito.status, "published"),
      ),
    )
    .limit(1);
  return result[0] || null;
});

export const getAllCasosExito = cache(async () => {
  if (!db) {
    return CASOS_EXITO_FB.filter((r) => !r.deletedAt && r.status === "published").sort(
      (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
    );
  }
  // Omit `gallery` (jsonb array of URLs) — listings never render it.
  return db
    .select({
      id: casosExito.id,
      slug: casosExito.slug,
      clientName: casosExito.clientName,
      clientLogo: casosExito.clientLogo,
      clientCountry: casosExito.clientCountry,
      clientCountryEs: casosExito.clientCountryEs,
      clientCountryEn: casosExito.clientCountryEn,
      clientSector: casosExito.clientSector,
      clientSectorEs: casosExito.clientSectorEs,
      clientSectorEn: casosExito.clientSectorEn,
      titleEs: casosExito.titleEs,
      titleEn: casosExito.titleEn,
      challengeEs: casosExito.challengeEs,
      challengeEn: casosExito.challengeEn,
      solutionEs: casosExito.solutionEs,
      solutionEn: casosExito.solutionEn,
      resultsEs: casosExito.resultsEs,
      resultsEn: casosExito.resultsEn,
      metric1Value: casosExito.metric1Value,
      metric1LabelEs: casosExito.metric1LabelEs,
      metric1LabelEn: casosExito.metric1LabelEn,
      metric2Value: casosExito.metric2Value,
      metric2LabelEs: casosExito.metric2LabelEs,
      metric2LabelEn: casosExito.metric2LabelEn,
      metric3Value: casosExito.metric3Value,
      metric3LabelEs: casosExito.metric3LabelEs,
      metric3LabelEn: casosExito.metric3LabelEn,
      testimonialQuoteEs: casosExito.testimonialQuoteEs,
      testimonialQuoteEn: casosExito.testimonialQuoteEn,
      testimonialAuthor: casosExito.testimonialAuthor,
      testimonialRole: casosExito.testimonialRole,
      testimonialRoleEs: casosExito.testimonialRoleEs,
      testimonialRoleEn: casosExito.testimonialRoleEn,
      coverImage: casosExito.coverImage,
      servicesUsed: casosExito.servicesUsed,
      featured: casosExito.featured,
      seoTitleEs: casosExito.seoTitleEs,
      seoTitleEn: casosExito.seoTitleEn,
      seoDescriptionEs: casosExito.seoDescriptionEs,
      seoDescriptionEn: casosExito.seoDescriptionEn,
      status: casosExito.status,
      publishedAt: casosExito.publishedAt,
      createdAt: casosExito.createdAt,
      updatedAt: casosExito.updatedAt,
    })
    .from(casosExito)
    .where(and(isNull(casosExito.deletedAt), eq(casosExito.status, "published")))
    .orderBy(desc(casosExito.createdAt));
});

// ─── BLOG ──────────────────────────────────────────────

// Shared column set for blog listings — omits contentEs/contentEn (big TEXT fields).
// Used by getAllBlogPostsLight, getBlogPostsByCategory, getPopularBlogPosts.
const blogListingColumns = {
  id: blogPosts.id,
  slug: blogPosts.slug,
  titleEs: blogPosts.titleEs,
  titleEn: blogPosts.titleEn,
  excerptEs: blogPosts.excerptEs,
  excerptEn: blogPosts.excerptEn,
  coverImage: blogPosts.coverImage,
  coverImageAltEs: blogPosts.coverImageAltEs,
  coverImageAltEn: blogPosts.coverImageAltEn,
  tags: blogPosts.tags,
  readingTimeMinutes: blogPosts.readingTimeMinutes,
  categoryId: blogPosts.categoryId,
  seoTitleEs: blogPosts.seoTitleEs,
  seoTitleEn: blogPosts.seoTitleEn,
  seoDescriptionEs: blogPosts.seoDescriptionEs,
  seoDescriptionEn: blogPosts.seoDescriptionEn,
  status: blogPosts.status,
  publishedAt: blogPosts.publishedAt,
  createdAt: blogPosts.createdAt,
  updatedAt: blogPosts.updatedAt,
};

function publishedBlogPosts() {
  return BLOG_POSTS_FB.filter((r) => !r.deletedAt && r.status === "published").sort(
    byPublishedDesc,
  );
}

export const getBlogPost = cache(async (slug: string) => {
  if (!db) {
    return (
      BLOG_POSTS_FB.find((r) => r.slug === slug && !r.deletedAt && r.status === "published") ?? null
    );
  }
  const result = await db
    .select()
    .from(blogPosts)
    .where(
      and(eq(blogPosts.slug, slug), isNull(blogPosts.deletedAt), eq(blogPosts.status, "published")),
    )
    .limit(1);
  return result[0] || null;
});

export const getAllBlogPosts = cache(async () => {
  if (!db) return publishedBlogPosts();
  return db
    .select()
    .from(blogPosts)
    .where(and(isNull(blogPosts.deletedAt), eq(blogPosts.status, "published")))
    .orderBy(desc(blogPosts.publishedAt));
});

// Lighter variant for blog listings / category pages / related-post rails:
// omits contentEs + contentEn (the two biggest columns) to reduce egress.
// Use getBlogPost(slug) when you need the full post body.
export const getAllBlogPostsLight = cache(async () => {
  if (!db) return publishedBlogPosts();
  const rows = await db
    .select(blogListingColumns)
    .from(blogPosts)
    .where(and(isNull(blogPosts.deletedAt), eq(blogPosts.status, "published")))
    .orderBy(desc(blogPosts.publishedAt));
  return rows.map((r) => ({ ...r, contentEs: "", contentEn: "" }));
});

export const getBlogCategoriesPublic = cache(async () => {
  if (!db) return [...BLOG_CATEGORIES_FB].sort((a, b) => a.nameEs.localeCompare(b.nameEs));
  return db.select().from(blogCategories).orderBy(asc(blogCategories.nameEs));
});

export const getBlogCategoryBySlug = cache(async (slug: string) => {
  if (!db) return BLOG_CATEGORIES_FB.find((c) => c.slug === slug) ?? null;
  const result = await db
    .select()
    .from(blogCategories)
    .where(eq(blogCategories.slug, slug))
    .limit(1);
  return result[0] || null;
});

// Categories that have at least one published, non-deleted post. Used to
// render the filter rail in the blog home — empty categories never appear.
export const getActiveBlogCategories = cache(async () => {
  if (!db) {
    const activeIds = new Set(publishedBlogPosts().map((p) => p.categoryId));
    return BLOG_CATEGORIES_FB.filter((c) => activeIds.has(c.id))
      .map(({ id, slug, nameEs, nameEn, color, icon }) => ({
        id,
        slug,
        nameEs,
        nameEn,
        color,
        icon,
      }))
      .sort((a, b) => a.nameEs.localeCompare(b.nameEs));
  }
  return db
    .selectDistinct({
      id: blogCategories.id,
      slug: blogCategories.slug,
      nameEs: blogCategories.nameEs,
      nameEn: blogCategories.nameEn,
      color: blogCategories.color,
      icon: blogCategories.icon,
    })
    .from(blogCategories)
    .innerJoin(blogPosts, eq(blogPosts.categoryId, blogCategories.id))
    .where(and(isNull(blogPosts.deletedAt), eq(blogPosts.status, "published")))
    .orderBy(asc(blogCategories.nameEs));
});

export const getFeaturedBlogPost = cache(async () => {
  if (!db) return publishedBlogPosts()[0] ?? null;
  // Featured renders title/excerpt/coverImage — never the full content body.
  const rows = await db
    .select(blogListingColumns)
    .from(blogPosts)
    .where(and(isNull(blogPosts.deletedAt), eq(blogPosts.status, "published")))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(1);
  const r = rows[0];
  return r ? { ...r, contentEs: "", contentEn: "" } : null;
});

// Light variant used by category pages — same shape as getAllBlogPostsLight.
export const getBlogPostsByCategory = cache(async (categoryId: string) => {
  if (!db) return publishedBlogPosts().filter((p) => p.categoryId === categoryId);
  const rows = await db
    .select(blogListingColumns)
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.categoryId, categoryId),
        isNull(blogPosts.deletedAt),
        eq(blogPosts.status, "published"),
      ),
    )
    .orderBy(desc(blogPosts.publishedAt));
  return rows.map((r) => ({ ...r, contentEs: "", contentEn: "" }));
});

// Proxy for "popular" while we don't track views: most recent posts. Replace
// when a view-count column lands on blog_posts.
export const getPopularBlogPosts = cache(async (limit = 5) => {
  if (!db) return publishedBlogPosts().slice(0, limit);
  const rows = await db
    .select(blogListingColumns)
    .from(blogPosts)
    .where(and(isNull(blogPosts.deletedAt), eq(blogPosts.status, "published")))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit);
  return rows.map((r) => ({ ...r, contentEs: "", contentEn: "" }));
});

// ─── HOME ──────────────────────────────────────────────

// Request-level memoization: home page calls this twice per request
// (generateMetadata + HomePage). With cache() that collapses to 1 query.
export const getHomeContent = cache(async () => {
  if (!db) return HOME_CONTENT_FB.find((r) => r.id === "main") ?? HOME_CONTENT_FB[0] ?? null;
  const result = await db.select().from(homeContent).where(eq(homeContent.id, "main")).limit(1);
  return result[0] || null;
});

// ─── NOSOTROS ──────────────────────────────────────────

export const getTeamMembers = cache(async () => {
  if (!db) {
    return TEAM_MEMBERS_FB.filter((r) => r.status === "published").sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
  }
  return db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.status, "published"))
    .orderBy(asc(teamMembers.sortOrder));
});

export const getHistoriaItems = cache(async () => {
  if (!db) return [...HISTORIA_ITEMS_FB].sort((a, b) => a.sortOrder - b.sortOrder);
  return db.select().from(historiaItems).orderBy(asc(historiaItems.sortOrder));
});

export const getCertificacionesPublic = cache(async () => {
  if (!db) return [...CERTIFICACIONES_FB].sort((a, b) => a.sortOrder - b.sortOrder);
  return db.select().from(certificaciones).orderBy(asc(certificaciones.sortOrder));
});

// ─── NAV ───────────────────────────────────────────────

// Request-level memoization: nav + footer both call this in the same render.
// Without cache(), that's 2 queries per request against nav_config.
export const getNavConfigPublic = cache(async () => {
  if (!db) return NAV_CONFIG_FB.find((r) => r.id === "main") ?? NAV_CONFIG_FB[0] ?? null;
  const result = await db.select().from(navConfig).where(eq(navConfig.id, "main")).limit(1);
  return result[0] || null;
});

// ─── CONFIG ────────────────────────────────────────────

// Request-level memoization: multiple calls within the same render tree
// (e.g. marketing layout + llms.txt route on the same request) hit the DB once.
// Omits llmsTxtContent / llmsFullTxtContent — those are kilobytes of text only
// the /llms.txt and /llms-full.txt routes read. Use getSiteConfigLlms() for those.
export const getSiteConfigPublic = cache(async () => {
  if (!db) {
    const fb = SITE_CONFIG_FB.find((r) => r.id === "main") ?? SITE_CONFIG_FB[0] ?? null;
    if (!fb) return null;
    const { llmsTxtContent: _l1, llmsFullTxtContent: _l2, ...rest } = fb;
    return rest;
  }
  const result = await db
    .select({
      id: siteConfig.id,
      siteNameEs: siteConfig.siteNameEs,
      siteNameEn: siteConfig.siteNameEn,
      taglineEs: siteConfig.taglineEs,
      taglineEn: siteConfig.taglineEn,
      logoUrl: siteConfig.logoUrl,
      logoWidth: siteConfig.logoWidth,
      logoHeight: siteConfig.logoHeight,
      logoAltEs: siteConfig.logoAltEs,
      logoAltEn: siteConfig.logoAltEn,
      logoTitleEs: siteConfig.logoTitleEs,
      logoTitleEn: siteConfig.logoTitleEn,
      faviconUrl: siteConfig.faviconUrl,
      defaultOgImage: siteConfig.defaultOgImage,
      phoneWhatsapp: siteConfig.phoneWhatsapp,
      emailContact: siteConfig.emailContact,
      addressBogota: siteConfig.addressBogota,
      addressMiami: siteConfig.addressMiami,
      linkedinUrl: siteConfig.linkedinUrl,
      googleAnalyticsId: siteConfig.googleAnalyticsId,
      googleTagManagerId: siteConfig.googleTagManagerId,
      updatedAt: siteConfig.updatedAt,
    })
    .from(siteConfig)
    .where(eq(siteConfig.id, "main"))
    .limit(1);
  return result[0] || null;
});

// Loaded only by /llms.txt and /llms-full.txt routes.
export const getSiteConfigLlms = cache(async () => {
  if (!db) {
    const fb = SITE_CONFIG_FB.find((r) => r.id === "main") ?? SITE_CONFIG_FB[0] ?? null;
    if (!fb) return null;
    return {
      llmsTxtContent: fb.llmsTxtContent,
      llmsFullTxtContent: fb.llmsFullTxtContent,
    };
  }
  const result = await db
    .select({
      llmsTxtContent: siteConfig.llmsTxtContent,
      llmsFullTxtContent: siteConfig.llmsFullTxtContent,
    })
    .from(siteConfig)
    .where(eq(siteConfig.id, "main"))
    .limit(1);
  return result[0] || null;
});

// ─── PÁGINAS GENERALES ─────────────────────────────────

export const getPageGeneral = cache(async (pageType: string) => {
  if (!db) return PAGES_GENERAL_FB.find((r) => r.pageType === pageType) ?? null;
  const result = await db
    .select()
    .from(pagesGeneral)
    .where(eq(pagesGeneral.pageType, pageType as "contact" | "privacy" | "support" | "careers"))
    .limit(1);
  return result[0] || null;
});
