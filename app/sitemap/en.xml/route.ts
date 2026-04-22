import { NextResponse } from "next/server";
import { buildLocaleSitemapXml, getAllSiteUrls } from "@/lib/seo/sitemap-urls";

export const revalidate = 3600;

export async function GET() {
  const urls = await getAllSiteUrls();
  const body = buildLocaleSitemapXml(urls, "en");
  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
