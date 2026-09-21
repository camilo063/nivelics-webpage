/**
 * Agrega «Mapa del sitio» a los enlaces legales del pie (nav_config.footer.legal_links).
 *
 * La página /mapa-del-sitio (EN /en/sitemap) es nueva: sin este enlace solo se llega desde
 * el 404, y una página huérfana no la rastrea nadie.
 *
 * Idempotente: si el enlace ya está, no escribe.
 *
 * Correr:
 *   node --env-file=.env.local --import tsx scripts/seed-footer-mapa-sitio.ts --dry-run
 *   node --env-file=.env.local --import tsx scripts/seed-footer-mapa-sitio.ts
 *   node --import tsx scripts/seed-footer-mapa-sitio.ts --fallbacks   (data/fallbacks, sin BD)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { navConfig } from "@/lib/db/schema/admin";

const DRY_RUN = process.argv.includes("--dry-run");
const FALLBACKS = process.argv.includes("--fallbacks");

const LINK = {
  url: "/mapa-del-sitio",
  labelEs: "Mapa del sitio",
  labelEn: "Sitemap",
};

type LegalLink = { url?: string } & Record<string, unknown>;
type Footer = { legalLinks?: LegalLink[] } & Record<string, unknown>;

/** Devuelve true si hubo cambio. */
function addLink(footer: Footer | null | undefined): boolean {
  if (!footer) return false;
  const links = footer.legalLinks;
  if (!Array.isArray(links)) return false;
  if (links.some((l) => l.url === LINK.url)) return false;
  links.push(LINK);
  return true;
}

function applyToFallbacks(): void {
  const file = join(process.cwd(), "data/fallbacks/nav_config.json");
  const rows = JSON.parse(readFileSync(file, "utf8")) as Array<{ footer?: Footer }>;
  const changed = rows.some((r) => addLink(r.footer));
  if (!changed) {
    console.log("• data/fallbacks/nav_config.json: el enlace ya estaba");
    return;
  }
  writeFileSync(file, JSON.stringify(rows, null, 2) + "\n");
  console.log("✓ data/fallbacks/nav_config.json");
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
  const [row] = await db.select().from(navConfig).where(eq(navConfig.id, "main")).limit(1);
  const footer = row?.footer as Footer | undefined;
  if (!addLink(footer)) {
    console.log("• nav_config.footer: el enlace ya estaba (o no hay legalLinks)");
    process.exit(0);
  }
  if (DRY_RUN) {
    console.log("• [dry-run] nav_config.footer: + Mapa del sitio / Sitemap");
    process.exit(0);
  }
  await db.update(navConfig).set({ footer, updatedAt: new Date() }).where(eq(navConfig.id, "main"));
  console.log("✓ nav_config.footer: + Mapa del sitio / Sitemap");
  process.exit(0);
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
