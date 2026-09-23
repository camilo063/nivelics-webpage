/**
 * Fija en `site_config` (fila `main`) los datos de contacto oficiales, que son la
 * fuente única y transversal del sitio: los leen las páginas, el pie, los
 * /llms*.txt y los datos estructurados (Organization, LocalBusiness) a través de
 * `getContactoSitio()` (lib/cms/contacto.ts).
 *
 * Valores confirmados por el dueño (2026-09-21):
 *   - emailContact  hola@nivelics.com   (la BD traía contacto@nivelics.com)
 *   - phoneWhatsapp +573112146459       (convivía con el viejo 310 392 6621)
 *   - linkedinUrl   https://www.linkedin.com/company/nivelics  (estaba vacío)
 *   - instagramUrl  https://www.instagram.com/nivelics         (columna nueva)
 *
 * Idempotente: compara campo por campo y solo escribe lo que difiere. Si la fila
 * `main` no existe, la crea.
 *
 * Correr:
 *   node --env-file=.env.local --import tsx scripts/seed-contacto-config.ts --dry-run
 *   node --env-file=.env.local --import tsx scripts/seed-contacto-config.ts
 *   node --import tsx scripts/seed-contacto-config.ts --fallbacks   (data/fallbacks, sin BD)
 *
 * `instagram_url` la crea drizzle/migrations/0011_contacto_instagram_url.sql. Si la
 * migración todavía no está aplicada, el script lo detecta, avisa y sigue con los
 * otros tres campos en vez de reventar con «column does not exist».
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/db/schema/admin";

const DRY_RUN = process.argv.includes("--dry-run");
const FALLBACKS = process.argv.includes("--fallbacks");

const CONTACTO_OFICIAL = {
  emailContact: "hola@nivelics.com",
  phoneWhatsapp: "+573112146459",
  linkedinUrl: "https://www.linkedin.com/company/nivelics",
  instagramUrl: "https://www.instagram.com/nivelics",
} as const;

type Campo = keyof typeof CONTACTO_OFICIAL;

/** Solo los campos que difieren del valor oficial. */
function diff(
  row: Partial<Record<Campo, string | null>> | undefined,
): Partial<Record<Campo, string>> {
  const patch: Partial<Record<Campo, string>> = {};
  for (const [campo, valor] of Object.entries(CONTACTO_OFICIAL) as [Campo, string][]) {
    if ((row?.[campo] ?? "").trim() !== valor) patch[campo] = valor;
  }
  return patch;
}

/** ¿Existe esa columna en esta base? Evita depender de que la migración ya corriera. */
async function columnaExiste(tabla: string, columna: string): Promise<boolean> {
  const res = await db!.execute(
    sql`select 1 from information_schema.columns where table_name = ${tabla} and column_name = ${columna} limit 1`,
  );
  return (res.rows?.length ?? 0) > 0;
}

function describir(patch: Partial<Record<Campo, string>>): string {
  return Object.entries(patch)
    .map(([k, v]) => `${k}=${v}`)
    .join(", ");
}

function applyToFallbacks(): void {
  const file = join(process.cwd(), "data/fallbacks/site_config.json");
  const rows = JSON.parse(readFileSync(file, "utf8")) as Array<Record<string, unknown>>;
  const row = rows.find((r) => r.id === "main") ?? rows[0];
  if (!row) {
    console.error("✗ data/fallbacks/site_config.json no tiene ninguna fila");
    process.exit(1);
  }
  const patch = diff(row as Partial<Record<Campo, string | null>>);
  if (!Object.keys(patch).length) {
    console.log("• data/fallbacks/site_config.json: ya tenía los datos oficiales");
    return;
  }
  Object.assign(row, patch);
  writeFileSync(file, JSON.stringify(rows, null, 2) + "\n");
  console.log(`✓ data/fallbacks/site_config.json: ${describir(patch)}`);
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

  // `site_config` se consulta columna por columna, y no con `select()` entero,
  // porque instagram_url puede no existir todavía en esta BD.
  const tieneInstagram = await columnaExiste("site_config", "instagram_url");
  if (!tieneInstagram) {
    console.warn(
      "⚠ site_config.instagram_url no existe todavía: falta aplicar\n" +
        "  drizzle/migrations/0011_contacto_instagram_url.sql. Se omite ese campo.",
    );
  }

  const campos = {
    emailContact: siteConfig.emailContact,
    phoneWhatsapp: siteConfig.phoneWhatsapp,
    linkedinUrl: siteConfig.linkedinUrl,
    ...(tieneInstagram ? { instagramUrl: siteConfig.instagramUrl } : {}),
  };

  const [row] = await db.select(campos).from(siteConfig).where(eq(siteConfig.id, "main")).limit(1);

  if (!row) {
    if (DRY_RUN) {
      console.log(`• [dry-run] site_config: crear fila 'main' con ${describir(CONTACTO_OFICIAL)}`);
      process.exit(0);
    }
    const valores = { ...CONTACTO_OFICIAL } as Partial<Record<Campo, string>>;
    if (!tieneInstagram) delete valores.instagramUrl;
    await db.insert(siteConfig).values({ id: "main", ...valores, updatedAt: new Date() });
    console.log(`✓ site_config: fila 'main' creada con ${describir(valores)}`);
    process.exit(0);
  }

  const patch = diff(row);
  if (!tieneInstagram) delete patch.instagramUrl;
  if (!Object.keys(patch).length) {
    console.log("• site_config.main: los datos de contacto ya eran los oficiales");
    process.exit(0);
  }

  for (const campo of Object.keys(patch) as Campo[]) {
    const antes = row[campo] ?? "(vacío)";
    console.log(
      `${DRY_RUN ? "• [dry-run]" : "✓"} site_config.${campo}: «${antes}» → «${patch[campo]}»`,
    );
  }

  if (DRY_RUN) process.exit(0);

  await db
    .update(siteConfig)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(siteConfig.id, "main"));
  console.log(
    "✓ site_config.main actualizado. Recuerda revalidar (/admin/configuracion → Guardar).",
  );
  process.exit(0);
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
