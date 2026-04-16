import { NextResponse } from "next/server";

/**
 * Sitemap index — referencia los sitemaps por locale generados por app/sitemap.ts
 * Google descubre todos los sitemaps del sitio desde este índice.
 */

export const revalidate = 3600;

const BASE = "https://www.nivelics.com";

export function GET() {
  const lastmod = new Date().toISOString();
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
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
