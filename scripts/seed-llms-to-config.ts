/**
 * Seeds the content of public/llms.txt and public/llms-full.txt
 * into site_config.llmsTxtContent and llmsFullTxtContent.
 *
 * After this, the admin has the content editable, and the route handlers
 * /llms.txt and /llms-full.txt serve from DB (they already do — see
 * app/llms.txt/route.ts and app/llms-full.txt/route.ts).
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema/admin";
import * as fs from "fs";
import * as path from "path";

const db = drizzle(process.env.DATABASE_URL!, { schema });

async function main() {
  console.log("=== Seed llms.txt content into site_config ===\n");

  const llmsTxtPath = path.join(process.cwd(), "public", "llms.txt");
  const llmsFullPath = path.join(process.cwd(), "public", "llms-full.txt");

  let llmsTxtContent = "";
  let llmsFullContent = "";

  try {
    llmsTxtContent = fs.readFileSync(llmsTxtPath, "utf-8");
    console.log(`Read llms.txt — ${llmsTxtContent.length} chars`);
  } catch {
    console.log("⚠️  llms.txt not found, skipping");
  }

  try {
    llmsFullContent = fs.readFileSync(llmsFullPath, "utf-8");
    console.log(`Read llms-full.txt — ${llmsFullContent.length} chars`);
  } catch {
    console.log("⚠️  llms-full.txt not found, skipping");
  }

  const existing = await db
    .select()
    .from(schema.siteConfig)
    .where(eq(schema.siteConfig.id, "main"))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(schema.siteConfig).values({
      id: "main",
      llmsTxtContent,
      llmsFullTxtContent: llmsFullContent,
      updatedAt: new Date(),
    });
    console.log("\n✅ Created site_config row with llms content");
  } else {
    await db
      .update(schema.siteConfig)
      .set({
        llmsTxtContent,
        llmsFullTxtContent: llmsFullContent,
        updatedAt: new Date(),
      })
      .where(eq(schema.siteConfig.id, "main"));
    console.log("\n✅ Updated site_config with llms content");
  }

  console.log("\nLas rutas /llms.txt y /llms-full.txt ahora servirán desde la DB.");
  console.log("Edita el contenido en /admin/configuracion → tab llms.txt");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
