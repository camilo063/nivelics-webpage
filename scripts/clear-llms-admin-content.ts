/**
 * Clear llmsTxtContent and llmsFullTxtContent in site_config so the
 * dynamic builders (lib/seo/llms-content.ts) are used instead.
 *
 * Run with: node --env-file=.env.local --import tsx scripts/clear-llms-admin-content.ts
 */
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/db/schema/admin";
import { eq } from "drizzle-orm";

async function main() {
  if (!db) {
    console.error("DB not initialized. Check .env.local");
    process.exit(1);
  }

  const before = await db.select().from(siteConfig).where(eq(siteConfig.id, "main")).limit(1);
  if (!before.length) {
    console.log("No site_config row with id='main' found. Nothing to clear.");
    return;
  }

  console.log("Before:");
  console.log("  llmsTxtContent length:", (before[0].llmsTxtContent ?? "").length);
  console.log("  llmsFullTxtContent length:", (before[0].llmsFullTxtContent ?? "").length);

  await db
    .update(siteConfig)
    .set({ llmsTxtContent: null, llmsFullTxtContent: null })
    .where(eq(siteConfig.id, "main"));

  const after = await db.select().from(siteConfig).where(eq(siteConfig.id, "main")).limit(1);
  console.log("After:");
  console.log("  llmsTxtContent:", after[0].llmsTxtContent);
  console.log("  llmsFullTxtContent:", after[0].llmsFullTxtContent);
  console.log("Done. /llms.txt and /llms-full.txt now use the dynamic builder.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
