import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);

  console.log("=== FINAL DB STATE REPORT ===\n");

  const q = await db.execute(sql`
    SELECT * FROM (
      SELECT 'servicios' as tbl, translation_status_en as status, count(*)::int as cnt FROM servicios WHERE deleted_at IS NULL GROUP BY translation_status_en
      UNION ALL SELECT 'industrias', translation_status_en, count(*)::int FROM industrias WHERE deleted_at IS NULL GROUP BY translation_status_en
      UNION ALL SELECT 'casos_exito', translation_status_en, count(*)::int FROM casos_exito WHERE deleted_at IS NULL GROUP BY translation_status_en
      UNION ALL SELECT 'blog_posts', translation_status_en, count(*)::int FROM blog_posts WHERE deleted_at IS NULL GROUP BY translation_status_en
      UNION ALL SELECT 'pages_general', translation_status_en, count(*)::int FROM pages_general GROUP BY translation_status_en
    ) t ORDER BY tbl, status
  `);

  console.log("TABLE            STATUS     COUNT");
  console.log("-".repeat(40));
  for (const r of q.rows)
    console.log(String(r.tbl).padEnd(17) + String(r.status).padEnd(11) + r.cnt);

  console.log("\nRECORD COUNTS:");
  for (const t of [
    "servicios",
    "industrias",
    "casos_exito",
    "blog_posts",
    "home_content",
    "team_members",
    "historia_items",
    "certificaciones",
    "pages_general",
  ]) {
    const r = await db.execute(sql.raw("SELECT count(*)::int as cnt FROM " + t));
    console.log("  " + t + ": " + r.rows[0].cnt);
  }

  console.log("\nPENDING (status=pending):");
  const pending = await db.execute(sql`
    SELECT 'servicios' as tbl, slug_es as id FROM servicios WHERE deleted_at IS NULL AND translation_status_en = 'pending'
    UNION ALL SELECT 'industrias', slug_es FROM industrias WHERE deleted_at IS NULL AND translation_status_en = 'pending'
    UNION ALL SELECT 'casos_exito', slug FROM casos_exito WHERE deleted_at IS NULL AND translation_status_en = 'pending'
    UNION ALL SELECT 'blog_posts', slug FROM blog_posts WHERE deleted_at IS NULL AND translation_status_en = 'pending'
  `);
  if (pending.rows.length === 0) console.log("  NONE - all translated!");
  else for (const r of pending.rows) console.log("  " + r.tbl + ": " + r.id);

  process.exit(0);
}

main().catch(console.error);
