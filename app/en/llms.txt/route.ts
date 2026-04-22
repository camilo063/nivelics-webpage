import { NextResponse } from "next/server";
import { buildLlmsTxt } from "@/lib/seo/llms-content";

export const revalidate = 86400;

export async function GET() {
  const body = await buildLlmsTxt("en");
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
