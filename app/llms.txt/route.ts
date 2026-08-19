import { NextResponse } from "next/server";
import { buildLlmsTxt } from "@/lib/seo/llms-content";

export const revalidate = 86400;

// Siempre dinámico: el contenido sale de la DB (productos, posts, precios) y
// el costo es ~1 build/día por el ISR + s-maxage. No hay override admin — un
// texto congelado en site_config dejaba de reflejar el sitio silenciosamente.
export async function GET() {
  const body = await buildLlmsTxt("es");
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
