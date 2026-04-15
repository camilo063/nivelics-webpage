import { db } from "../lib/db";
import { servicios } from "../lib/db/schema/admin";
import { eq } from "drizzle-orm";

async function main() {
  if (!db) {
    console.log("DB not configured");
    process.exit(1);
  }
  const slugs = ["inteligencia-artificial", "cloud", "staff-augmentation", "desarrollo-digital"];
  for (const slug of slugs) {
    const rows = await db.select().from(servicios).where(eq(servicios.slugEs, slug)).limit(1);
    const s = rows[0];
    if (!s) {
      console.log(`MISSING: ${slug}`);
      continue;
    }
    const b = (s.benefits as unknown[]) ?? [];
    const p = (s.processSteps as unknown[]) ?? [];
    const m = (s.metrics as unknown[]) ?? [];
    const f = (s.faqs as unknown[]) ?? [];
    console.log(
      `${slug}: benefits=${b.length} process=${p.length} metrics=${m.length} faqs=${f.length} type=${s.serviceType} status=${s.status}`,
    );
  }
  process.exit(0);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
