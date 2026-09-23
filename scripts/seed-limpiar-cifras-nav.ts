/**
 * Quita del mega-menú las dos cifras retiradas y alinea la antigüedad a 14+.
 *
 * El mega-menú se renderiza en la cabecera de TODAS las rutas, así que el «40% de ahorro
 * vs. contratar en USA o Europa» seguía publicándose en cada página del sitio aunque ya
 * se hubiera limpiado de la home, del hub y de los llms.txt. Vive en
 * `nav_config.megaMenu[0].columns[].metricValue` y en `credentials.metricValue1`, dos
 * lugares que ningún otro script tocaba.
 *
 * Entran cifras contables en su lugar: los servicios publicados de cada línea y el
 * compromiso real de 5 días al primer candidato de Staff Augmentation.
 *
 * De paso se limpia `servicios.description_*` de finops, que conservaba «Reducimos costos
 * hasta un 35%»: hoy no se sirve porque la página usa otro campo, pero alimenta la grid
 * del admin y vuelve sola si esa fila se recrea.
 *
 * Idempotente: compara y solo escribe lo que difiere.
 *
 * Correr:
 *   node --env-file=.env.local --import tsx scripts/seed-limpiar-cifras-nav.ts --dry-run
 *   node --env-file=.env.local --import tsx scripts/seed-limpiar-cifras-nav.ts
 *   node --import tsx scripts/seed-limpiar-cifras-nav.ts --fallbacks
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { navConfig, servicios } from "@/lib/db/schema/admin";

const DRY_RUN = process.argv.includes("--dry-run");
const FALLBACKS = process.argv.includes("--fallbacks");

type Columna = Record<string, unknown>;

/** Métrica nueva de cada columna, indexada por la URL de la línea de servicio. */
const POR_URL: Record<
  string,
  { metricValue: string; metricLabelEs: string; metricLabelEn: string }
> = {
  "/servicios/cloud": {
    metricValue: "5",
    metricLabelEs: "servicios cloud especializados",
    metricLabelEn: "specialized cloud services",
  },
  "/servicios/staff-augmentation": {
    metricValue: "5",
    metricLabelEs: "días al primer candidato presentado",
    metricLabelEn: "days to the first candidate presented",
  },
  "/servicios/desarrollo-digital": {
    metricValue: "14",
    metricLabelEs: "años de proyectos en LATAM y USA",
    metricLabelEn: "years of projects across LATAM and USA",
  },
};

const FINOPS = {
  descriptionEs:
    "Optimización y gobernanza financiera de la nube: visibilidad del gasto por equipo y por servicio, y un modelo de success fee sobre el ahorro logrado.",
  descriptionEn:
    "Cloud financial governance and optimization: spend visibility by team and by service, with a success fee on the savings achieved.",
};

function distinto(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) !== JSON.stringify(b);
}

/** Devuelve el megaMenu corregido, o null si ya estaba bien. */
function limpiarMegaMenu(megaMenu: unknown): unknown[] | null {
  const secciones = (megaMenu as Array<Record<string, unknown>> | null) ?? [];
  const nuevo = secciones.map((sec) => {
    const columnas = (sec.columns as Columna[] | undefined)?.map((col) => {
      const nueva = POR_URL[col.url as string];
      return nueva ? { ...col, ...nueva } : col;
    });
    const cred = sec.credentials as Record<string, unknown> | undefined;
    const credLimpio = cred?.metricValue1 === "13" ? { ...cred, metricValue1: "14" } : cred;
    return {
      ...sec,
      ...(columnas ? { columns: columnas } : {}),
      ...(credLimpio ? { credentials: credLimpio } : {}),
    };
  });
  return distinto(secciones, nuevo) ? nuevo : null;
}

function applyToFallbacks(): void {
  const navFile = join(process.cwd(), "data/fallbacks/nav_config.json");
  const navRows = JSON.parse(readFileSync(navFile, "utf8")) as Array<Record<string, unknown>>;
  let navTocado = false;
  for (const row of navRows) {
    const megaMenu = limpiarMegaMenu(row.megaMenu);
    if (!megaMenu) continue;
    row.megaMenu = megaMenu;
    navTocado = true;
  }
  if (navTocado) {
    writeFileSync(navFile, JSON.stringify(navRows, null, 2) + "\n");
    console.log("✓ data/fallbacks/nav_config.json: mega-menú sin el 40%, años a 14");
  } else {
    console.log("• nav_config.json: el mega-menú ya estaba al día");
  }

  const svcFile = join(process.cwd(), "data/fallbacks/servicios.json");
  const svcRows = JSON.parse(readFileSync(svcFile, "utf8")) as Array<Record<string, unknown>>;
  const finops = svcRows.find((r) => r.slugEs === "finops");
  if (
    finops &&
    (distinto(finops.descriptionEs, FINOPS.descriptionEs) ||
      distinto(finops.descriptionEn, FINOPS.descriptionEn))
  ) {
    Object.assign(finops, FINOPS);
    writeFileSync(svcFile, JSON.stringify(svcRows, null, 2) + "\n");
    console.log("✓ data/fallbacks/servicios.json: descripción de finops sin el 35%");
  } else {
    console.log("• servicios.json: la descripción de finops ya estaba al día");
  }
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

  const [nav] = await db.select().from(navConfig).where(eq(navConfig.id, "main")).limit(1);
  const megaMenu = nav ? limpiarMegaMenu(nav.megaMenu) : null;
  if (!megaMenu) {
    console.log("• nav_config.megaMenu: ya estaba al día");
  } else if (DRY_RUN) {
    console.log("• [dry-run] nav_config.megaMenu: sin el 40%, años a 14");
  } else {
    await db
      .update(navConfig)
      .set({ megaMenu: megaMenu as never, updatedAt: new Date() })
      .where(eq(navConfig.id, "main"));
    console.log("✓ nav_config.megaMenu: sin el 40%, años a 14");
  }

  const [finops] = await db.select().from(servicios).where(eq(servicios.slugEs, "finops")).limit(1);
  if (!finops) {
    console.warn("⚠ no existe el servicio 'finops'");
  } else if (
    !distinto(finops.descriptionEs, FINOPS.descriptionEs) &&
    !distinto(finops.descriptionEn, FINOPS.descriptionEn)
  ) {
    console.log("• finops.description: ya estaba al día");
  } else if (DRY_RUN) {
    console.log("• [dry-run] finops.description: sin «hasta un 35%»");
  } else {
    await db
      .update(servicios)
      .set({ ...FINOPS, updatedAt: new Date() })
      .where(eq(servicios.id, finops.id));
    console.log("✓ finops.description: sin «hasta un 35%»");
  }

  console.log(DRY_RUN ? "\nDry-run completo." : "\nListo. Corre export-fallbacks.ts y revalida.");
  process.exit(0);
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
