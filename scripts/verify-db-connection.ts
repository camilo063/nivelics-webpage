/**
 * Verifica que la conexión a Neon está configurada correctamente.
 * Ejecutar: node --env-file=.env.local --import tsx scripts/verify-db-connection.ts
 *
 * Checks: pooler endpoint, pgbouncer param, SSL, conectividad y versión de Postgres.
 */

import { Client } from "pg";

async function main() {
  const dbUrl = process.env.DATABASE_URL || "";

  console.log("\n=== Verificación de conexión Neon ===\n");

  if (!dbUrl) {
    console.error("✗ DATABASE_URL no está definido. Abortando.");
    process.exit(1);
  }

  const hasPooler = dbUrl.includes("-pooler");
  console.log(`✓ Pooler endpoint: ${hasPooler ? "SÍ ✅" : "NO ❌ — Agregar -pooler al hostname"}`);

  const hasPgBouncer = dbUrl.includes("pgbouncer=true");
  console.log(
    `✓ pgbouncer=true:  ${hasPgBouncer ? "SÍ ✅" : "NO ❌ — Agregar ?pgbouncer=true al final"}`,
  );

  const hasSsl = dbUrl.includes("sslmode=require") || dbUrl.includes("ssl=true");
  console.log(
    `✓ SSL:             ${hasSsl ? "SÍ ✅" : "Implícito (Neon lo fuerza por defecto) ⚠️"}`,
  );

  const hostMatch = dbUrl.match(/@([^/]+)/);
  if (hostMatch) {
    console.log(`✓ Endpoint:        ${hostMatch[1]}`);
  }

  const client = new Client({ connectionString: dbUrl });
  try {
    await client.connect();
    const res = await client.query<{ db: string; usr: string; version: string }>(
      "SELECT current_database() as db, current_user as usr, version() as version",
    );
    const row = res.rows[0];
    console.log(`\n✓ Conexión exitosa:`);
    console.log(`  DB:      ${row.db}`);
    console.log(`  User:    ${row.usr}`);
    console.log(`  Version: ${row.version.split(" ").slice(0, 2).join(" ")}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`\n✗ Error de conexión: ${message}`);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }

  if (!hasPooler || !hasPgBouncer) {
    console.log("\n⚠️  ACCIÓN REQUERIDA:");
    console.log("Tu DATABASE_URL debe tener este formato:");
    console.log("postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?pgbouncer=true");
    console.log("                           ^^^^^^^ ← agregar -pooler");
    console.log(
      "                                                              ^^^^^^^^^^^^^^^^ ← agregar esto",
    );
  } else {
    console.log("\n✅ Configuración de conexión correcta.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
