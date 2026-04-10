/**
 * Fix remaining missing SEO EN fields in servicios
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, or, sql } from "drizzle-orm";
import * as schema from "../lib/db/schema/admin";

const db = drizzle(process.env.DATABASE_URL!, { schema });
const API_KEY = process.env.ANTHROPIC_API_KEY!;

async function translate(text: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 256,
      system: "Translate ES→EN for Nivelics, a B2B tech company. Return ONLY the translation.",
      messages: [{ role: "user", content: text }],
    }),
  });
  const d = await res.json();
  return d.content?.[0]?.text || "";
}

async function main() {
  // Find servicios with missing seo_description_en or seo_title_en
  const missing = await db
    .select()
    .from(schema.servicios)
    .where(
      or(
        sql`(${schema.servicios.seoDescriptionEn} IS NULL OR ${schema.servicios.seoDescriptionEn} = '')`,
        sql`(${schema.servicios.seoTitleEn} IS NULL OR ${schema.servicios.seoTitleEn} = '')`,
      ),
    );

  console.log(`Found ${missing.length} servicios with missing SEO EN`);

  for (const svc of missing) {
    console.log(`\nFixing: ${svc.slugEs}`);
    const updates: Record<string, unknown> = { updatedAt: new Date() };

    if ((!svc.seoTitleEn || svc.seoTitleEn.trim() === "") && svc.seoTitleEs) {
      console.log(`  Translating SEO title...`);
      updates.seoTitleEn = await translate(svc.seoTitleEs);
      await new Promise((r) => setTimeout(r, 13000));
    }

    if ((!svc.seoDescriptionEn || svc.seoDescriptionEn.trim() === "") && svc.seoDescriptionEs) {
      console.log(`  Translating SEO description...`);
      updates.seoDescriptionEn = await translate(svc.seoDescriptionEs);
      await new Promise((r) => setTimeout(r, 13000));
    }

    if (Object.keys(updates).length > 1) {
      await db.update(schema.servicios).set(updates).where(eq(schema.servicios.id, svc.id));
      console.log(`  Updated!`);
    }
  }

  console.log("\nDone!");
  process.exit(0);
}

main().catch(console.error);
