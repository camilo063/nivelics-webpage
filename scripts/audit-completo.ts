import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);

  console.log("\n=== SERVICIOS ===");
  const s = await db.execute(sql`
    SELECT slug_es as slug,
      CASE WHEN title_es IS NOT NULL AND title_es != '' THEN 'OK' ELSE 'FALTA' END as title,
      CASE WHEN subtitle_es IS NOT NULL AND subtitle_es != '' THEN 'OK' ELSE 'FALTA' END as subtitle,
      CASE WHEN description_es IS NOT NULL AND description_es != '' THEN 'OK' ELSE 'FALTA' END as descr,
      jsonb_array_length(COALESCE(benefits,'[]'::jsonb)) as benefits,
      jsonb_array_length(COALESCE(process_steps,'[]'::jsonb)) as steps,
      jsonb_array_length(COALESCE(metrics,'[]'::jsonb)) as metrics,
      jsonb_array_length(COALESCE(faqs,'[]'::jsonb)) as faqs,
      CASE WHEN cta_primary_text_es != '' AND cta_primary_text_es IS NOT NULL THEN 'OK' ELSE 'FALTA' END as cta,
      CASE WHEN seo_title_es != '' AND seo_title_es IS NOT NULL THEN 'OK' ELSE 'FALTA' END as seo,
      CASE WHEN title_en IS NOT NULL AND title_en != '' THEN 'OK' ELSE 'FALTA' END as en_title,
      CASE WHEN description_en IS NOT NULL AND description_en != '' THEN 'OK' ELSE 'FALTA' END as en_desc
    FROM servicios WHERE deleted_at IS NULL ORDER BY slug_es
  `);
  console.table(s.rows);

  console.log("\n=== INDUSTRIAS ===");
  const i = await db.execute(sql`
    SELECT slug_es as slug,
      CASE WHEN name_es IS NOT NULL AND name_es != '' THEN 'OK' ELSE 'FALTA' END as name,
      CASE WHEN hero_title_es IS NOT NULL AND hero_title_es != '' THEN 'OK' ELSE 'FALTA' END as hero,
      CASE WHEN hero_subtitle_es IS NOT NULL AND hero_subtitle_es != '' THEN 'OK' ELSE 'FALTA' END as sub,
      jsonb_array_length(COALESCE(pain_points,'[]'::jsonb)) as pain,
      jsonb_array_length(COALESCE(solutions,'[]'::jsonb)) as sol,
      CASE WHEN seo_title_es IS NOT NULL AND seo_title_es != '' THEN 'OK' ELSE 'FALTA' END as seo,
      CASE WHEN name_en IS NOT NULL AND name_en != '' THEN 'OK' ELSE 'FALTA' END as en_name
    FROM industrias WHERE deleted_at IS NULL ORDER BY slug_es
  `);
  console.table(i.rows);

  console.log("\n=== CASOS ===");
  const c = await db.execute(sql`
    SELECT slug,
      CASE WHEN title_es IS NOT NULL AND title_es != '' THEN 'OK' ELSE 'FALTA' END as title,
      CASE WHEN challenge_es IS NOT NULL AND challenge_es != '' THEN 'OK' ELSE 'FALTA' END as challenge,
      CASE WHEN solution_es IS NOT NULL AND solution_es != '' THEN 'OK' ELSE 'FALTA' END as solution,
      CASE WHEN metric_1_value IS NOT NULL AND metric_1_value != '' THEN 'OK' ELSE 'FALTA' END as m1,
      CASE WHEN title_en IS NOT NULL AND title_en != '' THEN 'OK' ELSE 'FALTA' END as en_title
    FROM casos_exito WHERE deleted_at IS NULL ORDER BY slug
  `);
  console.table(c.rows);

  console.log("\n=== HOME ===");
  const h = await db.execute(sql`
    SELECT
      CASE WHEN hero_title_es IS NOT NULL AND hero_title_es != '' THEN 'OK' ELSE 'FALTA' END as hero,
      CASE WHEN hero_title_en IS NOT NULL AND hero_title_en != '' THEN 'OK' ELSE 'FALTA' END as hero_en,
      jsonb_array_length(COALESCE(metrics,'[]'::jsonb)) as metrics,
      jsonb_array_length(COALESCE(faqs,'[]'::jsonb)) as faqs
    FROM home_content LIMIT 1
  `);
  console.table(h.rows);

  console.log("\n=== EQUIPO ===");
  const t = await db.execute(sql`
    SELECT name,
      CASE WHEN role_es IS NOT NULL AND role_es != '' THEN 'OK' ELSE 'FALTA' END as role,
      CASE WHEN bio_es IS NOT NULL AND bio_es != '' THEN 'OK' ELSE 'FALTA' END as bio,
      CASE WHEN role_en IS NOT NULL AND role_en != '' THEN 'OK' ELSE 'FALTA' END as en_role
    FROM team_members ORDER BY name
  `);
  console.table(t.rows);

  console.log("\n=== BLOG ===");
  const b = await db.execute(sql`
    SELECT slug,
      CASE WHEN title_es IS NOT NULL AND title_es != '' THEN 'OK' ELSE 'FALTA' END as title,
      CASE WHEN content_es IS NOT NULL AND content_es != '' THEN 'OK' ELSE 'FALTA' END as content,
      CASE WHEN title_en IS NOT NULL AND title_en != '' THEN 'OK' ELSE 'FALTA' END as en_title
    FROM blog_posts WHERE deleted_at IS NULL ORDER BY slug
  `);
  console.table(b.rows);

  console.log("\n=== HISTORIA ===");
  const hi = await db.execute(sql`
    SELECT year, title_es,
      CASE WHEN description_es IS NOT NULL AND description_es != '' THEN 'OK' ELSE 'FALTA' END as desc_es,
      CASE WHEN title_en IS NOT NULL AND title_en != '' THEN 'OK' ELSE 'FALTA' END as en_title
    FROM historia_items ORDER BY sort_order
  `);
  console.table(hi.rows);

  console.log("\n=== PAGES GENERAL ===");
  const p = await db.execute(sql`
    SELECT slug_es,
      CASE WHEN title_es IS NOT NULL AND title_es != '' THEN 'OK' ELSE 'FALTA' END as title,
      CASE WHEN title_en IS NOT NULL AND title_en != '' THEN 'OK' ELSE 'FALTA' END as en_title
    FROM pages_general ORDER BY slug_es
  `);
  console.table(p.rows);

  // Summary
  console.log("\n=== RESUMEN DE CAMPOS FALTANTES ===");
  const missing = await db.execute(sql`
    SELECT 'servicios' as tabla, slug_es as id, 'subtitle_es' as campo FROM servicios WHERE deleted_at IS NULL AND (subtitle_es IS NULL OR subtitle_es = '')
    UNION ALL SELECT 'servicios', slug_es, 'description_es' FROM servicios WHERE deleted_at IS NULL AND (description_es IS NULL OR description_es = '')
    UNION ALL SELECT 'servicios', slug_es, 'description_en' FROM servicios WHERE deleted_at IS NULL AND (description_en IS NULL OR description_en = '')
    UNION ALL SELECT 'industrias', slug_es, 'hero_title_es' FROM industrias WHERE deleted_at IS NULL AND (hero_title_es IS NULL OR hero_title_es = '')
    UNION ALL SELECT 'industrias', slug_es, 'hero_subtitle_es' FROM industrias WHERE deleted_at IS NULL AND (hero_subtitle_es IS NULL OR hero_subtitle_es = '')
    UNION ALL SELECT 'casos_exito', slug, 'challenge_es' FROM casos_exito WHERE deleted_at IS NULL AND (challenge_es IS NULL OR challenge_es = '')
    UNION ALL SELECT 'team_members', name, 'bio_es' FROM team_members WHERE (bio_es IS NULL OR bio_es = '')
    ORDER BY tabla, id
  `);
  if (missing.rows.length === 0) {
    console.log("NINGÚN campo faltante — todo completo!");
  } else {
    console.log(`${missing.rows.length} campos faltantes:`);
    for (const r of missing.rows) console.log(`  ${r.tabla} | ${r.id} | ${r.campo}`);
  }

  process.exit(0);
}
main().catch(console.error);
