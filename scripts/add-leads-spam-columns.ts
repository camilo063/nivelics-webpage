import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  await db.execute(sql`
    ALTER TABLE leads
      ADD COLUMN IF NOT EXISTS is_spam boolean NOT NULL DEFAULT false
  `);
  await db.execute(sql`
    ALTER TABLE leads
      ADD COLUMN IF NOT EXISTS spam_reason varchar(50)
  `);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS leads_is_spam_idx ON leads(is_spam)`);
  console.log("Columns is_spam + spam_reason added to leads");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
