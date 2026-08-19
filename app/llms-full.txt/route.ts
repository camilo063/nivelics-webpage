import { NextResponse } from "next/server";
import { buildLlmsFullTxt } from "@/lib/seo/llms-content";

export const revalidate = 86400;

// Siempre dinámico — ver app/llms.txt/route.ts para el racional.
export async function GET() {
  const body = await buildLlmsFullTxt("es");
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
