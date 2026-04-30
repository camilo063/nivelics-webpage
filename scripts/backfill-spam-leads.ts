// Backfill is_spam / spam_reason on existing leads using the same heuristic
// the API uses for new submissions. Default mode is DRY RUN — no writes.
//
// Usage:
//   node --env-file=.env.local --import tsx scripts/backfill-spam-leads.ts
//   DRY_RUN=false node --env-file=.env.local --import tsx scripts/backfill-spam-leads.ts

import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema/admin";
import { isLikelySpam, type SpamReason } from "@/lib/security/spam-detection";
import { eq, and, sql } from "drizzle-orm";

const DRY_RUN = process.env.DRY_RUN !== "false";

async function main() {
  if (!db) {
    console.error("DB no disponible. ¿Falta DATABASE_URL?");
    process.exit(1);
  }

  console.log(`Modo: ${DRY_RUN ? "DRY RUN (sin escribir)" : "ESCRITURA REAL"}`);
  console.log("Leyendo leads…");

  const rows = await db
    .select({
      id: leads.id,
      nombre: leads.nombre,
      email: leads.email,
      empresa: leads.empresa,
      mensaje: leads.mensaje,
      fuente: leads.fuente,
      isSpam: leads.isSpam,
      createdAt: leads.createdAt,
    })
    .from(leads);

  const total = rows.length;
  type Match = {
    id: string;
    reason: SpamReason;
    nombre: string;
    email: string;
    empresa: string | null;
    mensaje: string | null;
    fuente: string;
    alreadyFlagged: boolean;
  };
  const matches: Match[] = [];
  const reasonCount: Record<string, number> = {};

  for (const row of rows) {
    const result = isLikelySpam({
      name: row.nombre,
      email: row.email,
      company: row.empresa,
      message: row.mensaje,
    });
    if (result.spam && result.reason) {
      matches.push({
        id: row.id,
        reason: result.reason,
        nombre: row.nombre,
        email: row.email,
        empresa: row.empresa,
        mensaje: row.mensaje,
        fuente: row.fuente,
        alreadyFlagged: row.isSpam,
      });
      reasonCount[result.reason] = (reasonCount[result.reason] ?? 0) + 1;
    }
  }

  console.log("");
  console.log("─── RESUMEN ───────────────────────────────");
  console.log(`Total de leads evaluados: ${total}`);
  console.log(`Leads que coinciden con la heurística: ${matches.length}`);
  console.log(`% spam: ${total > 0 ? ((matches.length / total) * 100).toFixed(1) : "0"}%`);
  console.log("");
  console.log("Desglose por razón:");
  const sortedReasons = Object.entries(reasonCount).sort((a, b) => b[1] - a[1]);
  for (const [reason, count] of sortedReasons) {
    console.log(`  ${reason.padEnd(28)} ${count}`);
  }

  console.log("");
  console.log("─── MUESTRA (primeros 10 matches) ─────────");
  const sample = matches.slice(0, 10);
  for (const m of sample) {
    const msgPreview = (m.mensaje ?? "").slice(0, 60).replace(/\s+/g, " ");
    console.log(
      `[${m.reason}] ${m.nombre} <${m.email}> | empresa=${m.empresa ?? "—"} | fuente=${m.fuente}` +
        (msgPreview ? ` | msg="${msgPreview}${(m.mensaje ?? "").length > 60 ? "…" : ""}"` : "") +
        (m.alreadyFlagged ? " [ya marcado]" : ""),
    );
  }

  if (DRY_RUN) {
    console.log("");
    console.log("DRY RUN — no se escribió nada.");
    console.log(
      "Para aplicar: DRY_RUN=false node --env-file=.env.local --import tsx scripts/backfill-spam-leads.ts",
    );
    process.exit(0);
  }

  console.log("");
  console.log("Aplicando UPDATE…");

  let updated = 0;
  for (const m of matches) {
    if (m.alreadyFlagged) continue;
    await db
      .update(leads)
      .set({ isSpam: true, spamReason: m.reason })
      .where(and(eq(leads.id, m.id), eq(leads.isSpam, false)));
    updated++;
  }

  console.log(`✅ ${updated} leads marcados como spam.`);

  // Final verification queries
  const totals = await db.execute<{ spam_count: number; clean_count: number; total: number }>(
    sql`SELECT
      COUNT(*) FILTER (WHERE is_spam = true)::int AS spam_count,
      COUNT(*) FILTER (WHERE is_spam = false)::int AS clean_count,
      COUNT(*)::int AS total
    FROM leads`,
  );
  console.log("");
  console.log("─── VERIFICACIÓN ──────────────────────────");
  console.log(totals.rows[0]);

  const breakdown = await db.execute<{ spam_reason: string | null; count: number }>(
    sql`SELECT spam_reason, COUNT(*)::int AS count
        FROM leads
        WHERE is_spam = true
        GROUP BY spam_reason
        ORDER BY 2 DESC`,
  );
  console.log("");
  console.log("Desglose final por razón:");
  for (const r of breakdown.rows) {
    console.log(`  ${(r.spam_reason ?? "—").padEnd(28)} ${r.count}`);
  }

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
