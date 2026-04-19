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

export async function getServicio(slugEs: string) {
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
}

export async function getAllServicios() {
  if (!db) return [];
  return db
    .select()
    .from(servicios)
    .where(and(isNull(servicios.deletedAt), eq(servicios.status, "published")))
    .orderBy(asc(servicios.sortOrder));
}

export async function getServiciosByParent(parentId: string) {
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
}

export async function getHubServicios() {
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
}

// ─── INDUSTRIAS ────────────────────────────────────────

export async function getIndustria(slugEs: string) {
  if (!db) return null;
  const result = await db
    .select()
    .from(industrias)
    .where(and(eq(industrias.slugEs, slugEs), isNull(industrias.deletedAt)))
    .limit(1);
  return result[0] || null;
}

export async function getAllIndustrias() {
  if (!db) return [];
  return db
    .select()
    .from(industrias)
    .where(isNull(industrias.deletedAt))
    .orderBy(asc(industrias.nameEs));
}

// ─── CASOS DE ÉXITO ───────────────────────────────────

export async function getCasoExito(slug: string) {
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
}

export async function getAllCasosExito() {
  if (!db) return [];
  return db
    .select()
    .from(casosExito)
    .where(and(isNull(casosExito.deletedAt), eq(casosExito.status, "published")))
    .orderBy(desc(casosExito.createdAt));
}

// ─── BLOG ──────────────────────────────────────────────

export async function getBlogPost(slug: string) {
  if (!db) return null;
  const result = await db
    .select()
    .from(blogPosts)
    .where(
      and(eq(blogPosts.slug, slug), isNull(blogPosts.deletedAt), eq(blogPosts.status, "published")),
    )
    .limit(1);
  return result[0] || null;
}

export const getAllBlogPosts = cache(async () => {
  if (!db) return [];
  return db
    .select()
    .from(blogPosts)
    .where(and(isNull(blogPosts.deletedAt), eq(blogPosts.status, "published")))
    .orderBy(desc(blogPosts.publishedAt));
});

export async function getBlogCategoriesPublic() {
  if (!db) return [];
  return db.select().from(blogCategories).orderBy(asc(blogCategories.nameEs));
}

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

export const getBlogPostsByCategory = cache(async (categoryId: string) => {
  if (!db) return [];
  return db
    .select()
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.categoryId, categoryId),
        isNull(blogPosts.deletedAt),
        eq(blogPosts.status, "published"),
      ),
    )
    .orderBy(desc(blogPosts.publishedAt));
});

// Proxy for "popular" while we don't track views: most recent posts. Replace
// when a view-count column lands on blog_posts.
export const getPopularBlogPosts = cache(async (limit = 5) => {
  if (!db) return [];
  return db
    .select()
    .from(blogPosts)
    .where(and(isNull(blogPosts.deletedAt), eq(blogPosts.status, "published")))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit);
});

// ─── HOME ──────────────────────────────────────────────

export async function getHomeContent() {
  if (!db) return null;
  const result = await db.select().from(homeContent).where(eq(homeContent.id, "main")).limit(1);
  return result[0] || null;
}

// ─── NOSOTROS ──────────────────────────────────────────

export async function getTeamMembers() {
  if (!db) return [];
  return db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.status, "published"))
    .orderBy(asc(teamMembers.sortOrder));
}

export async function getHistoriaItems() {
  if (!db) return [];
  return db.select().from(historiaItems).orderBy(asc(historiaItems.sortOrder));
}

export async function getCertificacionesPublic() {
  if (!db) return [];
  return db.select().from(certificaciones).orderBy(asc(certificaciones.sortOrder));
}

// ─── NAV ───────────────────────────────────────────────

export async function getNavConfigPublic() {
  if (!db) return null;
  const result = await db.select().from(navConfig).where(eq(navConfig.id, "main")).limit(1);
  return result[0] || null;
}

// ─── CONFIG ────────────────────────────────────────────

// Request-level memoization: multiple calls within the same render tree
// (e.g. marketing layout + llms.txt route on the same request) hit the DB once.
export const getSiteConfigPublic = cache(async () => {
  if (!db) return null;
  const result = await db.select().from(siteConfig).where(eq(siteConfig.id, "main")).limit(1);
  return result[0] || null;
});

// ─── PÁGINAS GENERALES ─────────────────────────────────

export async function getPageGeneral(pageType: string) {
  if (!db) return null;
  const result = await db
    .select()
    .from(pagesGeneral)
    .where(eq(pagesGeneral.pageType, pageType as "contact" | "privacy" | "support" | "careers"))
    .limit(1);
  return result[0] || null;
}
