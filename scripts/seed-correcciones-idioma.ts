/**
 * Correcciones de texto guardado en la BD que el código no puede arreglar solo.
 *
 * 1. El voseo «Escalá tu capacidad…» en la descripción ES de staff-augmentation (el sitio
 *    habla de «tú»).
 * 2. Datos de contacto del pie (nav_config.footer): servía contacto@nivelics.com y el
 *    WhatsApp 310 392 6621, mientras el JSON-LD y /contacto publican hola@nivelics.com y
 *    311 214 6459. El dato oficial es el segundo (decisión del dueño, 2026-09-21).
 * 3. Escapes literales «\u00f3» guardados como texto en 4 filas de `servicios` (páginas de
 *    cloud): se veían tal cual, «Infraestructura como c\u00f3digo». Se decodifican en todos los
 *    campos de texto y jsonb de la fila.
 *
 * Idempotente: si el texto ya no está, no escribe nada.
 *
 * Correr:
 *   node --env-file=.env.local --import tsx scripts/seed-correcciones-idioma.ts --dry-run
 *   node --env-file=.env.local --import tsx scripts/seed-correcciones-idioma.ts
 *   node --import tsx scripts/seed-correcciones-idioma.ts --fallbacks   (data/fallbacks, sin BD)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { navConfig, servicios } from "@/lib/db/schema/admin";

const DRY_RUN = process.argv.includes("--dry-run");
const FALLBACKS = process.argv.includes("--fallbacks");

const ESCAPE = /(?:\\u[0-9a-fA-F]{4})+/g;

/** Decodifica \uXXXX literales (incluidos pares sustitutos) en strings, arrays y objetos. */
function decodeEscapes<T>(value: T): T {
  if (typeof value === "string")
    return value.replace(ESCAPE, (m) => JSON.parse(`"${m}"`) as string) as T;
  if (Array.isArray(value)) return value.map(decodeEscapes) as T;
  if (value && typeof value === "object" && !(value instanceof Date))
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, decodeEscapes(v)]),
    ) as T;
  return value;
}

/** Solo los campos que cambian al decodificar (para no reescribir la fila entera). */
function escapePatch(row: Record<string, unknown>): Record<string, unknown> {
  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    if (k === "id" || v === null || v instanceof Date) continue;
    const decoded = decodeEscapes(v);
    if (JSON.stringify(decoded) !== JSON.stringify(v)) patch[k] = decoded;
  }
  return patch;
}

const FIXES: Array<{
  slug: string;
  field: "descriptionEs" | "subtitleEs";
  from: string;
  to: string;
}> = [
  {
    slug: "staff-augmentation",
    field: "descriptionEs",
    from: "Escalá tu capacidad",
    to: "Escala tu capacidad",
  },
];

function applyToFallbacks(): void {
  const file = join(process.cwd(), "data/fallbacks/servicios.json");
  const rows = JSON.parse(readFileSync(file, "utf8")) as Array<Record<string, unknown>>;
  let changed = 0;
  for (const row of rows) {
    const patch = escapePatch(row);
    for (const fix of FIXES) {
      const current = row[fix.field];
      if (row.slugEs === fix.slug && typeof current === "string" && current.includes(fix.from))
        patch[fix.field] = current.replace(fix.from, fix.to);
    }
    if (Object.keys(patch).length) {
      Object.assign(row, patch);
      changed++;
    }
  }
  writeFileSync(file, JSON.stringify(rows, null, 2) + "\n");
  console.log(`✓ data/fallbacks/servicios.json: ${changed} filas corregidas`);
}

async function fixEscapes(): Promise<void> {
  const rows = await db!.select().from(servicios);
  for (const row of rows) {
    const patch = escapePatch(row as unknown as Record<string, unknown>);
    const fields = Object.keys(patch);
    if (!fields.length) continue;
    if (DRY_RUN) {
      console.log(`• [dry-run] ${row.slugEs}: escapes \\u en ${fields.join(", ")}`);
      continue;
    }
    await db!
      .update(servicios)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(servicios.id, row.id));
    console.log(`✓ ${row.slugEs}: escapes decodificados en ${fields.join(", ")}`);
  }
}

const FOOTER_CONTACT = {
  contactEmail: "hola@nivelics.com",
  contactWhatsappUrl: "https://wa.me/573112146459",
};

type Footer = Record<string, unknown>;

/** Devuelve los campos que hay que corregir en el pie, o null si ya están bien. */
function footerPatch(footer: Footer | null | undefined): Footer | null {
  if (!footer) return null;
  const patch: Footer = {};
  for (const [k, v] of Object.entries(FOOTER_CONTACT)) {
    if (footer[k] !== v) patch[k] = v;
  }
  return Object.keys(patch).length ? { ...footer, ...patch } : null;
}

async function fixFooterContact(): Promise<void> {
  const [row] = await db!.select().from(navConfig).where(eq(navConfig.id, "main")).limit(1);
  const patched = footerPatch(row?.footer as Footer | undefined);
  if (!patched) {
    console.log("• nav_config.footer: los datos de contacto ya estaban bien");
    return;
  }
  if (DRY_RUN) {
    console.log("• [dry-run] nav_config.footer: hola@nivelics.com + WhatsApp 311 214 6459");
    return;
  }
  await db!
    .update(navConfig)
    .set({ footer: patched, updatedAt: new Date() })
    .where(eq(navConfig.id, "main"));
  console.log("✓ nav_config.footer: hola@nivelics.com + WhatsApp 311 214 6459");
}

async function main(): Promise<void> {
  if (FALLBACKS) {
    applyToFallbacks();
    process.exit(0);
  }
  if (!db) {
    console.error(
      "✗ db es null. Revisa DATABASE_URL en .env.local y que USE_DB_FALLBACKS no sea 'true'.",
    );
    process.exit(1);
  }
  for (const fix of FIXES) {
    const [row] = await db.select().from(servicios).where(eq(servicios.slugEs, fix.slug)).limit(1);
    const current = row?.[fix.field];
    if (!row || !current?.includes(fix.from)) {
      console.log(`• ${fix.slug}.${fix.field}: nada que corregir`);
      continue;
    }
    if (DRY_RUN) {
      console.log(`• [dry-run] ${fix.slug}.${fix.field}: «${fix.from}» → «${fix.to}»`);
      continue;
    }
    await db
      .update(servicios)
      .set({ [fix.field]: current.replace(fix.from, fix.to), updatedAt: new Date() })
      .where(eq(servicios.id, row.id));
    console.log(`✓ ${fix.slug}.${fix.field}: «${fix.from}» → «${fix.to}»`);
  }
  await fixEscapes();
  await fixFooterContact();
  process.exit(0);
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
