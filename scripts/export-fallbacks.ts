/**
 * Export every public-facing table from Neon production to JSON.
 * Output: `data/fallbacks/<table>.json` — committed to git so local dev
 * has an exact replica of prod content without opening a DB connection.
 *
 * Re-run whenever you want to refresh the local snapshot.
 *
 * Run: node --env-file=.env.local --import tsx scripts/export-fallbacks.ts
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { db } from "@/lib/db";
import {
  siteConfig,
  navConfig,
  homeContent,
  servicios,
  industrias,
  casosExito,
  blogCategories,
  blogPosts,
  teamMembers,
  historiaItems,
  certificaciones,
  pagesGeneral,
  landingPages,
  productos,
  uiLabels,
} from "@/lib/db/schema/admin";
import type { PgTable } from "drizzle-orm/pg-core";

type NamedTable = { name: string; table: PgTable };

const TABLES: NamedTable[] = [
  { name: "site_config", table: siteConfig },
  { name: "nav_config", table: navConfig },
  { name: "home_content", table: homeContent },
  { name: "servicios", table: servicios },
  { name: "industrias", table: industrias },
  { name: "casos_exito", table: casosExito },
  { name: "blog_categories", table: blogCategories },
  { name: "blog_posts", table: blogPosts },
  { name: "team_members", table: teamMembers },
  { name: "historia_items", table: historiaItems },
  { name: "certificaciones", table: certificaciones },
  { name: "pages_general", table: pagesGeneral },
  { name: "landing_pages", table: landingPages },
  { name: "productos", table: productos },
  { name: "ui_labels", table: uiLabels },
];

const OUT_DIR = path.resolve(process.cwd(), "data/fallbacks");

async function main() {
  if (!db) {
    console.error(
      "✗ db is null. Check that DATABASE_URL is set in .env.local and USE_DB_FALLBACKS is not 'true'.",
    );
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });

  console.log(`\n=== Exportando snapshot de Neon → ${OUT_DIR} ===\n`);

  let totalRows = 0;
  let totalBytes = 0;

  for (const { name, table } of TABLES) {
    process.stdout.write(`  ${name.padEnd(20)} `);
    try {
      const rows = await db.select().from(table);
      const json = JSON.stringify(rows, null, 2);
      const outPath = path.join(OUT_DIR, `${name}.json`);
      await writeFile(outPath, json + "\n", "utf8");
      const kb = (Buffer.byteLength(json) / 1024).toFixed(1);
      console.log(`${String(rows.length).padStart(4)} rows · ${kb.padStart(8)} kB`);
      totalRows += rows.length;
      totalBytes += Buffer.byteLength(json);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`✗ ${msg}`);
    }
  }

  console.log(
    `\n✅ Export completo: ${totalRows} filas · ${(totalBytes / 1024).toFixed(1)} kB total\n`,
  );
  console.log(
    `Commit: git add data/fallbacks/ && git commit -m "chore: refresh fallback snapshot"`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
