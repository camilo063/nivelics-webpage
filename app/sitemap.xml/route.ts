import { NextResponse } from "next/server";
import { getAllSiteUrls } from "@/lib/seo/sitemap-urls";

/**
 * Sitemap index — referencia los sitemaps por locale generados por app/sitemap.ts
 * Google descubre todos los sitemaps del sitio desde este índice.
 */

export const revalidate = 3600;

const BASE = "https://www.nivelics.com";

export async function GET() {
  // Antes se emitía `new Date()` en cada petición: el índice decía «cambió ahora mismo»
  // siempre, así que la señal no servía. Ahora es la fecha real más reciente del sitio.
  const urls = await getAllSiteUrls();
  const latest = urls.reduce<Date | null>((max, u) => {
    const d = u.lastModified ? new Date(u.lastModified) : null;
    return d && (!max || d > max) ? d : max;
  }, null);
  const lastmod = (latest ?? new Date()).toISOString();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE}/sitemap/es.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE}/sitemap/en.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>
`;
  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
