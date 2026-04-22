import { NextResponse } from "next/server";
import { getSiteConfigPublic } from "@/lib/cms/queries";
import { buildLlmsFullTxt } from "@/lib/seo/llms-content";

export const revalidate = 86400;

export async function GET() {
  try {
    const config = await getSiteConfigPublic();
    if (config?.llmsFullTxtContent && config.llmsFullTxtContent.trim().length > 0) {
      return new NextResponse(config.llmsFullTxtContent, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      });
    }
  } catch {
    // seguir con build dinámico
  }

  const body = await buildLlmsFullTxt("es");
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
