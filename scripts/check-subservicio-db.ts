import { db } from "../lib/db";
import { servicios } from "../lib/db/schema/admin";
import { eq } from "drizzle-orm";

async function main() {
  for (const slug of ["finops", "sitios-web-agentic"]) {
    const rows = await db.select().from(servicios).where(eq(servicios.slugEs, slug)).limit(1);
    const s = rows[0];
    if (!s) {
      console.log(`❌ ${slug}: NO existe en DB`);
      continue;
    }
    console.log(`\n=== ${slug} ===`);
    console.log(`  parentId: ${s.parentId}`);
    console.log(`  titleEs: ${s.titleEs ? "✓ " + s.titleEs.slice(0, 50) : "❌ VACÍO"}`);
    console.log(`  titleEn: ${s.titleEn ? "✓ " + s.titleEn.slice(0, 50) : "❌ VACÍO"}`);
    console.log(`  subtitleEs: ${s.subtitleEs ? "✓" : "❌ VACÍO"}`);
    console.log(`  subtitleEn: ${s.subtitleEn ? "✓" : "❌ VACÍO"}`);
    console.log(`  descriptionEs: ${s.descriptionEs ? "✓" : "❌ VACÍO"}`);
    console.log(`  descriptionEn: ${s.descriptionEn ? "✓" : "❌ VACÍO"}`);
    console.log(
      `  benefits: ${Array.isArray(s.benefits) ? s.benefits.length + " items" : "❌ null"}`,
    );
    console.log(
      `  processSteps: ${Array.isArray(s.processSteps) ? s.processSteps.length + " items" : "❌ null"}`,
    );
    console.log(`  metrics: ${Array.isArray(s.metrics) ? s.metrics.length + " items" : "❌ null"}`);
    console.log(`  faqs: ${Array.isArray(s.faqs) ? s.faqs.length + " items" : "❌ null"}`);
    console.log(`  seoTitleEs: ${s.seoTitleEs ? "✓" : "❌"}`);
    console.log(`  seoTitleEn: ${s.seoTitleEn ? "✓" : "❌"}`);
    console.log(`  ctaPrimaryTextEs: ${s.ctaPrimaryTextEs ? "✓" : "❌"}`);
    console.log(`  ctaPrimaryTextEn: ${s.ctaPrimaryTextEn ? "✓" : "❌"}`);
    console.log(`  translationStatusEn: ${s.translationStatusEn}`);
  }
  process.exit(0);
}

main();
