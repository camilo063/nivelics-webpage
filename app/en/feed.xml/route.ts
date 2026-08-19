import { NextResponse } from "next/server";
import { buildRssFeed } from "@/lib/seo/feed";

export const revalidate = 3600;

export async function GET() {
  const body = await buildRssFeed("en");
  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
