/**
 * Audita las queries más pesadas contra Neon y reporta tamaños por tabla.
 * Ejecutar: node --env-file=.env.local --import tsx scripts/audit-db-queries.ts
 *
 * Requiere pg_stat_statements habilitado en Neon (viene por defecto en Launch).
 * Si no lo está, habilitar desde Neon Console → Settings.
 */

import { Client } from "pg";

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("✗ DATABASE_URL no definido.");
    process.exit(1);
  }

  const client = new Client({ connectionString: dbUrl });
  await client.connect();

  try {
    console.log("\n=== Auditoría de Queries Neon — Nivelics ===\n");

    // 1. Top 20 queries por filas retornadas
    console.log("📊 Top 20 queries por filas retornadas:\n");
    try {
      const topByRows = await client.query<{
        query_preview: string;
        calls: string;
        rows: string;
        avg_ms: string;
        blocks: string;
      }>(`
        SELECT
          left(query, 120) as query_preview,
          calls,
          rows,
          round((total_exec_time / NULLIF(calls, 0))::numeric, 2) as avg_ms,
          round((shared_blks_hit + shared_blks_read)::numeric, 0) as blocks
        FROM pg_stat_statements
        WHERE query NOT LIKE '%pg_stat%'
          AND query NOT LIKE '%information_schema%'
        ORDER BY rows DESC
        LIMIT 20
      `);
      for (const row of topByRows.rows) {
        console.log(
          `  Calls: ${row.calls} | Rows: ${row.rows} | Avg: ${row.avg_ms}ms | Blocks: ${row.blocks}`,
        );
        console.log(`  Query: ${row.query_preview}`);
        console.log("");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("pg_stat_statements")) {
        console.log(
          "  ⚠️  pg_stat_statements no disponible. Habilitar en Neon Console → Settings.",
        );
      } else {
        console.log(`  ⚠️  Error consultando pg_stat_statements: ${msg}`);
      }
    }

    // 2. Tamaño de cada tabla
    console.log("\n📦 Tamaño de tablas:\n");
    const sizes = await client.query<{
      table_name: string;
      total_size: string;
      data_size: string;
      row_count: string;
    }>(`
      SELECT
        relname as table_name,
        pg_size_pretty(pg_total_relation_size(relid)) as total_size,
        pg_size_pretty(pg_relation_size(relid)) as data_size,
        n_live_tup as row_count
      FROM pg_stat_user_tables
      ORDER BY pg_total_relation_size(relid) DESC
    `);
    for (const row of sizes.rows) {
      console.log(
        `  ${row.table_name.padEnd(32)} total ${row.total_size.padStart(10)}  data ${row.data_size.padStart(10)}  rows ${row.row_count}`,
      );
    }

    // 3. Conexiones activas
    console.log("\n🔌 Conexiones activas:\n");
    const conns = await client.query<{ total: string; active: string; idle: string }>(`
      SELECT count(*)::text as total,
             count(*) FILTER (WHERE state = 'active')::text as active,
             count(*) FILTER (WHERE state = 'idle')::text as idle
      FROM pg_stat_activity
      WHERE datname = current_database()
    `);
    console.log(
      `  Total: ${conns.rows[0].total} | Active: ${conns.rows[0].active} | Idle: ${conns.rows[0].idle}`,
    );

    console.log("\n✅ Auditoría completa.\n");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
