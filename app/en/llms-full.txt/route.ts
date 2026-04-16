import { NextResponse } from "next/server";
import { buildLlmsFullTxt } from "@/lib/seo/llms-content";

export const revalidate = 86400;

export async function GET() {
  const body = await buildLlmsFullTxt("en");
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
