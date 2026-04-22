import "server-only";
import type {
  siteConfig,
  navConfig,
  homeContent,
  servicios,
  industrias,
  casosExito,
  blogCategories,
  blogPosts,
  teamMembers,
  historiaItems,
  certificaciones,
  pagesGeneral,
  landingPages,
  productos,
  uiLabels,
} from "@/lib/db/schema/admin";

import siteConfigRaw from "@/data/fallbacks/site_config.json";
import navConfigRaw from "@/data/fallbacks/nav_config.json";
import homeContentRaw from "@/data/fallbacks/home_content.json";
import serviciosRaw from "@/data/fallbacks/servicios.json";
import industriasRaw from "@/data/fallbacks/industrias.json";
import casosExitoRaw from "@/data/fallbacks/casos_exito.json";
import blogCategoriesRaw from "@/data/fallbacks/blog_categories.json";
import blogPostsRaw from "@/data/fallbacks/blog_posts.json";
import teamMembersRaw from "@/data/fallbacks/team_members.json";
import historiaItemsRaw from "@/data/fallbacks/historia_items.json";
import certificacionesRaw from "@/data/fallbacks/certificaciones.json";
import pagesGeneralRaw from "@/data/fallbacks/pages_general.json";
import landingPagesRaw from "@/data/fallbacks/landing_pages.json";
import productosRaw from "@/data/fallbacks/productos.json";
import uiLabelsRaw from "@/data/fallbacks/ui_labels.json";

/**
 * JSON serializes Date → ISO string. This walks each row and rebuilds Date
 * objects for columns following the Drizzle convention of suffixing timestamp
 * columns with `At` (createdAt, updatedAt, publishedAt, deletedAt).
 */
function rehydrate<T extends Record<string, unknown>>(row: T): T {
  const out = { ...row };
  for (const key of Object.keys(out)) {
    const val = out[key];
    if (typeof val === "string" && /At$/.test(key)) {
      (out as Record<string, unknown>)[key] = new Date(val);
    }
  }
  return out;
}

function load<T>(raw: unknown): T[] {
  return (raw as Record<string, unknown>[]).map(rehydrate) as unknown as T[];
}

export type SiteConfigRow = typeof siteConfig.$inferSelect;
export type NavConfigRow = typeof navConfig.$inferSelect;
export type HomeContentRow = typeof homeContent.$inferSelect;
export type ServicioRow = typeof servicios.$inferSelect;
export type IndustriaRow = typeof industrias.$inferSelect;
export type CasoExitoRow = typeof casosExito.$inferSelect;
export type BlogCategoryRow = typeof blogCategories.$inferSelect;
export type BlogPostRow = typeof blogPosts.$inferSelect;
export type TeamMemberRow = typeof teamMembers.$inferSelect;
export type HistoriaItemRow = typeof historiaItems.$inferSelect;
export type CertificacionRow = typeof certificaciones.$inferSelect;
export type PageGeneralRow = typeof pagesGeneral.$inferSelect;
export type LandingPageRow = typeof landingPages.$inferSelect;
export type ProductoRow = typeof productos.$inferSelect;
export type UiLabelRow = typeof uiLabels.$inferSelect;

export const SITE_CONFIG_FB: SiteConfigRow[] = load(siteConfigRaw);
export const NAV_CONFIG_FB: NavConfigRow[] = load(navConfigRaw);
export const HOME_CONTENT_FB: HomeContentRow[] = load(homeContentRaw);
export const SERVICIOS_FB: ServicioRow[] = load(serviciosRaw);
export const INDUSTRIAS_FB: IndustriaRow[] = load(industriasRaw);
export const CASOS_EXITO_FB: CasoExitoRow[] = load(casosExitoRaw);
export const BLOG_CATEGORIES_FB: BlogCategoryRow[] = load(blogCategoriesRaw);
export const BLOG_POSTS_FB: BlogPostRow[] = load(blogPostsRaw);
export const TEAM_MEMBERS_FB: TeamMemberRow[] = load(teamMembersRaw);
export const HISTORIA_ITEMS_FB: HistoriaItemRow[] = load(historiaItemsRaw);
export const CERTIFICACIONES_FB: CertificacionRow[] = load(certificacionesRaw);
export const PAGES_GENERAL_FB: PageGeneralRow[] = load(pagesGeneralRaw);
export const LANDING_PAGES_FB: LandingPageRow[] = load(landingPagesRaw);
export const PRODUCTOS_FB: ProductoRow[] = load(productosRaw);
export const UI_LABELS_FB: UiLabelRow[] = load(uiLabelsRaw);
