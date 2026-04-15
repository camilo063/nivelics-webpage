import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema/admin";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  const hubs = await db
    .select({
      slug: schema.servicios.slugEs,
      type: schema.servicios.serviceType,
      title: schema.servicios.titleEs,
    })
    .from(schema.servicios)
    .where(eq(schema.servicios.serviceType, "hub"));
  console.log("hubs:", JSON.stringify(hubs, null, 2));

  const inds = await db
    .select({
      slug: schema.industrias.slugEs,
      name: schema.industrias.nameEs,
      status: schema.industrias.status,
    })
    .from(schema.industrias);
  console.log("industrias:", JSON.stringify(inds, null, 2));

  const home = await db.select().from(schema.homeContent);
  console.log("home rows:", home.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
