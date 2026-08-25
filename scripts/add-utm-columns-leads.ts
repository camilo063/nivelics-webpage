/**
 * Agrega las columnas UTM a la tabla `leads` (ALTER ... ADD COLUMN IF NOT EXISTS).
 * Aditivo y seguro de correr en cualquier momento; el código viejo las ignora.
 *
 * Uso: node --env-file=.env.local --import tsx scripts/add-utm-columns-leads.ts
 */
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import * as schema from "../lib/db/schema/admin";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no está definida");
  const db = drizzle(neon(url), { schema });

  await db.execute(sql`
    ALTER TABLE "leads"
      ADD COLUMN IF NOT EXISTS "utm_source" varchar(255),
      ADD COLUMN IF NOT EXISTS "utm_medium" varchar(255),
      ADD COLUMN IF NOT EXISTS "utm_campaign" varchar(255),
      ADD COLUMN IF NOT EXISTS "utm_content" varchar(255);
  `);

  console.log("✅ Columnas utm_* agregadas a leads (o ya existían).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
