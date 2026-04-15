import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../lib/db/schema/admin";

async function main() {
  const sqlClient = neon(process.env.DATABASE_URL!);
  const db = drizzle(sqlClient, { schema });
  const rows = await db.select().from(schema.homeContent);
  const h = rows[0] as Record<string, unknown>;
  console.log(
    "titulo:",
    h.industriasSectionTitleEs ? "OK" : "VACIO",
    "-",
    h.industriasSectionTitleEs,
  );
  console.log("subtitulo:", h.industriasSectionSubtitleEs ? "OK" : "VACIO");
  const m = h.industriasSectionMetrics as unknown[];
  console.log("metricas:", Array.isArray(m) && m.length === 3 ? "OK (3 items)" : "FAIL");
  console.log(JSON.stringify(m, null, 2));
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
