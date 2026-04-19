import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function main() {
  const byStatus = await db.execute(sql`SELECT status, count(*) FROM blog_posts GROUP BY status`);
  console.log("By status:", byStatus.rows);

  const total = await db.execute(sql`SELECT count(*) as c FROM blog_posts`);
  console.log("Total rows:", total.rows);

  const notDeleted = await db.execute(
    sql`SELECT count(*) as c FROM blog_posts WHERE deleted_at IS NULL`,
  );
  console.log("Not deleted:", notDeleted.rows);

  const sample = await db.execute(
    sql`SELECT slug, title_es, status FROM blog_posts WHERE deleted_at IS NULL ORDER BY slug LIMIT 30`,
  );
  console.log("Sample slugs (not deleted):");
  for (const r of sample.rows)
    console.log(`  [${r.status}] ${r.slug}  ||  ${String(r.title_es).slice(0, 70)}`);

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
