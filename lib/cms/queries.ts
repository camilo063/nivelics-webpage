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

// ─── SERVICIOS ─────────────────────────────────────────

export const getServicio = cache(async (slugEs: string) => {
  if (!db) return null;
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
  if (!db) return [];
  return db
    .select()
    .from(servicios)
    .where(and(isNull(servicios.deletedAt), eq(servicios.status, "published")))
    .orderBy(asc(servicios.sortOrder));
});

export const getServiciosByParent = cache(async (parentId: string) => {
  if (!db) return [];
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
  if (!db) return [];
  return db
    .select()
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
  if (!db) return null;
  const result = await db
    .select()
    .from(industrias)
    .where(and(eq(industrias.slugEs, slugEs), isNull(industrias.deletedAt)))
    .limit(1);
  return result[0] || null;
});

export const getAllIndustrias = cache(async () => {
  if (!db) return [];
  return db
    .select()
    .from(industrias)
    .where(isNull(industrias.deletedAt))
    .orderBy(asc(industrias.nameEs));
});

// ─── CASOS DE ÉXITO ───────────────────────────────────

export const getCasoExito = cache(async (slug: string) => {
  if (!db) return null;
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
  if (!db) return [];
  return db
    .select()
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

export const getBlogPost = cache(async (slug: string) => {
  if (!db) return null;
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
  if (!db) return [];
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
  if (!db) return [];
  const rows = await db
    .select(blogListingColumns)
    .from(blogPosts)
    .where(and(isNull(blogPosts.deletedAt), eq(blogPosts.status, "published")))
    .orderBy(desc(blogPosts.publishedAt));
  return rows.map((r) => ({ ...r, contentEs: "", contentEn: "" }));
});

export const getBlogCategoriesPublic = cache(async () => {
  if (!db) return [];
  return db.select().from(blogCategories).orderBy(asc(blogCategories.nameEs));
});

export const getBlogCategoryBySlug = cache(async (slug: string) => {
  if (!db) return null;
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
  if (!db) return [];
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
  if (!db) return null;
  const result = await db
    .select()
    .from(blogPosts)
    .where(and(isNull(blogPosts.deletedAt), eq(blogPosts.status, "published")))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(1);
  return result[0] || null;
});

// Light variant used by category pages — same shape as getAllBlogPostsLight.
export const getBlogPostsByCategory = cache(async (categoryId: string) => {
  if (!db) return [];
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
  if (!db) return [];
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
  if (!db) return null;
  const result = await db.select().from(homeContent).where(eq(homeContent.id, "main")).limit(1);
  return result[0] || null;
});

// ─── NOSOTROS ──────────────────────────────────────────

export const getTeamMembers = cache(async () => {
  if (!db) return [];
  return db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.status, "published"))
    .orderBy(asc(teamMembers.sortOrder));
});

export const getHistoriaItems = cache(async () => {
  if (!db) return [];
  return db.select().from(historiaItems).orderBy(asc(historiaItems.sortOrder));
});

export const getCertificacionesPublic = cache(async () => {
  if (!db) return [];
  return db.select().from(certificaciones).orderBy(asc(certificaciones.sortOrder));
});

// ─── NAV ───────────────────────────────────────────────

// Request-level memoization: nav + footer both call this in the same render.
// Without cache(), that's 2 queries per request against nav_config.
export const getNavConfigPublic = cache(async () => {
  if (!db) return null;
  const result = await db.select().from(navConfig).where(eq(navConfig.id, "main")).limit(1);
  return result[0] || null;
});

// ─── CONFIG ────────────────────────────────────────────

// Request-level memoization: multiple calls within the same render tree
// (e.g. marketing layout + llms.txt route on the same request) hit the DB once.
export const getSiteConfigPublic = cache(async () => {
  if (!db) return null;
  const result = await db.select().from(siteConfig).where(eq(siteConfig.id, "main")).limit(1);
  return result[0] || null;
});

// ─── PÁGINAS GENERALES ─────────────────────────────────

export const getPageGeneral = cache(async (pageType: string) => {
  if (!db) return null;
  const result = await db
    .select()
    .from(pagesGeneral)
    .where(eq(pagesGeneral.pageType, pageType as "contact" | "privacy" | "support" | "careers"))
    .limit(1);
  return result[0] || null;
});
