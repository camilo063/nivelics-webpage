import { NextResponse } from "next/server";
import { getSiteConfigPublic } from "@/lib/cms/queries";
import { getAllProductos } from "@/lib/cms/productos";
import * as fs from "fs";
import * as path from "path";

export const revalidate = 86400;

async function getProductosFullSection(): Promise<string> {
  try {
    const productos = await getAllProductos();
    if (!productos.length) return "";
    const blocks = productos
      .map((p) => {
        const features = (p.features ?? [])
          .map((f) => `- ${f.titleEs}: ${f.descriptionEs}`)
          .join("\n");
        const featuresEn = (p.features ?? [])
          .map((f) => `- ${f.titleEn}: ${f.descriptionEn}`)
          .join("\n");
        const faqs = (p.faqs ?? []).map((f) => `Q: ${f.questionEs}\nA: ${f.answerEs}`).join("\n\n");
        const faqsEn = (p.faqs ?? [])
          .map((f) => `Q: ${f.questionEn}\nA: ${f.answerEn}`)
          .join("\n\n");

        return `## Producto: ${p.name}

### Español
- Tagline: ${p.taglineEs}
- Descripción: ${p.descriptionEs}
- ICP: ${p.icpEs}
- Categoría: ${p.categoryEs}
- Pricing: ${p.pricingLabelEs ?? "N/A"}
${p.pricingNoteEs ? `- Nota pricing: ${p.pricingNoteEs}\n` : ""}- URL en nivelics.com: https://www.nivelics.com/productos/${p.slugEs}
- URL del producto: ${p.externalUrl}

#### Características (ES)
${features}

#### FAQs (ES)
${faqs}

### English
- Tagline: ${p.taglineEn}
- Description: ${p.descriptionEn}
- ICP: ${p.icpEn}
- Category: ${p.categoryEn}
- Pricing: ${p.pricingLabelEn ?? "N/A"}
- URL on nivelics.com: https://www.nivelics.com/en/products/${p.slugEn}

#### Features (EN)
${featuresEn}

#### FAQs (EN)
${faqsEn}
`;
      })
      .join("\n---\n\n");

    return `\n\n# Productos SaaS propios\n\n${blocks}\n`;
  } catch {
    return "";
  }
}

export async function GET() {
  const productosSection = await getProductosFullSection();

  try {
    const config = await getSiteConfigPublic();
    if (config?.llmsFullTxtContent) {
      return new NextResponse(config.llmsFullTxtContent + productosSection, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  } catch {
    // fallback
  }

  try {
    const filePath = path.join(process.cwd(), "public", "llms-full.txt");
    const content = fs.readFileSync(filePath, "utf-8");
    return new NextResponse(content + productosSection, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return new NextResponse("# Nivelics — Full Documentation" + productosSection, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
