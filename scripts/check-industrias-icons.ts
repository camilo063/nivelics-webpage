import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../lib/db/schema/admin";

async function main() {
  const sqlClient = neon(process.env.DATABASE_URL!);
  const db = drizzle(sqlClient, { schema });
  const inds = await db.select().from(schema.industrias);
  for (const i of inds) {
    console.log(
      JSON.stringify({ slugEs: i.slugEs, slugEn: i.slugEn, icon: i.icon, name: i.nameEs }),
    );
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
