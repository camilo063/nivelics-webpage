import { NextResponse } from "next/server";
import { getSiteConfigPublic } from "@/lib/cms/queries";
import { getAllProductos } from "@/lib/cms/productos";
import * as fs from "fs";
import * as path from "path";

export const revalidate = 86400;

async function getProductosSection(): Promise<string> {
  try {
    const productos = await getAllProductos();
    if (!productos.length) return "";
    const body = productos
      .map(
        (p) => `
### ${p.name}
- Página en nivelics.com: https://www.nivelics.com/productos/${p.slugEs}
- Sitio del producto: ${p.externalUrl}
- Perfil de cliente ideal: ${p.icpEs}
- Pricing: ${p.pricingLabelEs ?? "Consultar"}
- Descripción: ${p.descriptionEs}`,
      )
      .join("\n");
    return `

## Productos SaaS propios de Nivelics

Nivelics diseña, construye y opera sus propios productos SaaS, disponibles para clientes externos:
${body}
`;
  } catch {
    return "";
  }
}

function injectProductos(base: string, productosSection: string): string {
  if (!productosSection) return base;
  const marker = /\n##\s*Industrias/i;
  if (marker.test(base)) {
    return base.replace(marker, `${productosSection}\n## Industrias`);
  }
  return `${base.trimEnd()}\n${productosSection}\n`;
}

export async function GET() {
  const productosSection = await getProductosSection();

  try {
    const config = await getSiteConfigPublic();
    if (config?.llmsTxtContent) {
      return new NextResponse(injectProductos(config.llmsTxtContent, productosSection), {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  } catch {
    // fallback
  }

  try {
    const filePath = path.join(process.cwd(), "public", "llms.txt");
    const content = fs.readFileSync(filePath, "utf-8");
    return new NextResponse(injectProductos(content, productosSection), {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    const base = "# Nivelics\n> B2B Digital Transformation";
    return new NextResponse(injectProductos(base, productosSection), {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
