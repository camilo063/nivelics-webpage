/**
 * Alta de la sexta subcategoría de Cloud: Ciberseguridad y Ethical Hacking.
 *
 * Hacen falta DOS escrituras y no una sola, porque la página no es lo único que
 * tiene que aparecer:
 *
 *  1. Fila en `servicios` — la grid «Soluciones especializadas» de /servicios/cloud
 *     lee de esta tabla y SOLO cae al array del código si la consulta vuelve vacía
 *     (`CmsSubServicesGrid`). Con 5 filas en producción, agregar la card en el
 *     código no la muestra en ningún lado.
 *  2. Ítem en `nav_config.mega_menu` — el menú del header sale de ahí, no del código.
 *
 * Es idempotente: se puede correr dos veces sin duplicar nada.
 *
 * Correr:
 *   node --env-file=.env.local --import tsx scripts/seed-ciberseguridad-ethical-hacking.ts
 *
 * Después, para refrescar la copia local que usa el modo sin BD:
 *   node --env-file=.env.local --import tsx scripts/export-fallbacks.ts
 */
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { servicios, navConfig } from "@/lib/db/schema/admin";

const SLUG_ES = "ciberseguridad-ethical-hacking";
const SLUG_EN = "ethical-hacking";
const URL_ES = `/servicios/cloud/${SLUG_ES}`;

/** Fila del hub Cloud. Se resuelve por slug, nunca por un uuid escrito a mano. */
const HUB_SLUG = "cloud";

const ROW = {
  slugEs: SLUG_ES,
  slugEn: SLUG_EN,
  serviceType: "sub" as const,
  accentColor: "cloud" as const,
  icon: "oct-scan",
  titleEs: "Ciberseguridad y Ethical Hacking",
  titleEn: "Cybersecurity & Ethical Hacking",
  subtitleEs:
    "Pentesting, red team y auditorías de seguridad ejecutadas por hackers éticos certificados. Reportes accionables, no PDFs genéricos.",
  subtitleEn:
    "Pentesting, red team and security audits run by certified ethical hackers. Actionable reports, not generic PDFs.",
  descriptionEs:
    "Encontramos tus vulnerabilidades antes que un atacante real. Bajo acuerdo de alcance firmado, siempre.",
  descriptionEn:
    "We find your vulnerabilities before a real attacker does. Always under a signed rules-of-engagement agreement.",
  benefits: [
    {
      icon: "oct-scan",
      titleEs: "Hallazgos reproducibles, no un listado de escáner",
      titleEn: "Reproducible findings, not a scanner dump",
      copyEs:
        "Cada vulnerabilidad va con evidencia, severidad CVSS y los pasos para reproducirla. Lo que no se puede reproducir, no se reporta.",
      copyEn:
        "Every vulnerability ships with evidence, a CVSS severity rating and the steps to reproduce it. What cannot be reproduced is not reported.",
    },
    {
      icon: "dia-pulse",
      titleEs: "Cubrimos la superficie de ataque de la IA",
      titleEn: "We cover the AI attack surface",
      copyEs:
        "Prompt injection, fuga de datos de entrenamiento, jailbreaks y abuso de herramientas conectadas: lo que un pentest tradicional no mira.",
      copyEn:
        "Prompt injection, training-data leakage, jailbreaks and abuse of connected tools — what a traditional pentest does not look at.",
    },
    {
      icon: "tri-check",
      titleEs: "Dos reportes, dos audiencias",
      titleEn: "Two reports, two audiences",
      copyEs:
        "Reporte ejecutivo para dirección y reporte técnico para el equipo de TI, con plan de remediación priorizado y retest de cierre.",
      copyEn:
        "An executive report for leadership and a technical report for the IT team, with a prioritized remediation plan and a closing retest.",
    },
  ],
  metrics: [
    {
      value: "4-6",
      unit: "",
      labelEs: "Semanas — De kickoff a reporte final",
      labelEn: "Weeks — From kickoff to final report",
    },
    {
      value: "100%",
      unit: "",
      labelEs: "Bajo acuerdo legal — Ninguna prueba sin autorización firmada",
      labelEn: "Under legal agreement — No test runs without signed authorization",
    },
    {
      value: "4",
      unit: "",
      labelEs: "Fases — Alcance, ejecución, reporte, retest",
      labelEn: "Phases — Scope, execution, reporting, retest",
    },
  ],
  ctaPrimaryTextEs: "Solicitar diagnóstico de seguridad",
  ctaPrimaryTextEn: "Request a security assessment",
  ctaPrimaryUrl: "/contacto",
  ctaSecondaryTextEs: "Ver alcance de un pentest",
  ctaSecondaryTextEn: "See what a pentest covers",
  ctaSecondaryUrl: "#soluciones",
  seoTitleEs: "Ethical Hacking y Ciberseguridad | Pentesting Real",
  seoTitleEn: "Ethical Hacking & Cybersecurity | Real Pentesting",
  seoDescriptionEs:
    "Pentesting, red team y auditorías de ciberseguridad con hackers éticos certificados. Encontramos las vulnerabilidades antes que un atacante real.",
  seoDescriptionEn:
    "Pentesting, red team and cybersecurity audits with certified ethical hackers. We find the vulnerabilities before a real attacker does.",
  sortOrder: 6,
  status: "published" as const,
  translationStatusEn: "complete" as const,
};

const NAV_ITEM = {
  url: URL_ES,
  labelEs: "Ciberseguridad y Ethical Hacking",
  labelEn: "Cybersecurity & Ethical Hacking",
  ariaLabelEs:
    "Ciberseguridad y Ethical Hacking — pentesting, red team y auditoría de seguridad de agentes de IA",
  ariaLabelEn:
    "Cybersecurity and Ethical Hacking — pentesting, red team and AI agent security audits",
  descriptionEs: "Pentesting, red team y seguridad de IA",
  descriptionEn: "Pentesting, red team and AI security",
};

type MegaMenuColumn = { url?: string; items?: Array<{ url?: string }> };
type MegaMenuSection = { columns?: MegaMenuColumn[] };

async function seedServicio(): Promise<void> {
  const hub = await db
    .select({ id: servicios.id })
    .from(servicios)
    .where(eq(servicios.slugEs, HUB_SLUG))
    .limit(1);

  if (!hub[0]) {
    throw new Error(`No existe el hub '${HUB_SLUG}' en servicios — abortando sin escribir nada.`);
  }

  const existing = await db
    .select({ id: servicios.id })
    .from(servicios)
    .where(eq(servicios.slugEs, SLUG_ES))
    .limit(1);

  const payload = { ...ROW, parentId: hub[0].id, updatedAt: new Date() };

  if (existing[0]) {
    // `publishedAt` NO va aquí: una segunda corrida reescribiría la fecha real de
    // publicación y el módulo perdería cuándo salió de verdad.
    await db.update(servicios).set(payload).where(eq(servicios.id, existing[0].id));
    console.log(`✓ servicios: fila actualizada (${SLUG_ES})`);
  } else {
    await db.insert(servicios).values({ ...payload, publishedAt: new Date() });
    console.log(`✓ servicios: fila creada (${SLUG_ES})`);
  }
}

async function seedNav(): Promise<void> {
  const row = await db.select().from(navConfig).where(eq(navConfig.id, "main")).limit(1);
  if (!row[0]?.megaMenu) {
    console.warn(
      "⚠ nav_config sin mega_menu — el ítem del menú hay que agregarlo desde /admin/navegacion",
    );
    return;
  }

  const menu = row[0].megaMenu as MegaMenuSection[];
  const cloudColumn = menu
    .flatMap((section) => section.columns ?? [])
    .find((col) => col.url === "/servicios/cloud");

  if (!cloudColumn?.items) {
    console.warn("⚠ No se encontró la columna Cloud en el mega-menú — agregarlo a mano.");
    return;
  }

  if (cloudColumn.items.some((it) => it.url === URL_ES)) {
    console.log("• nav_config: el ítem ya estaba, no se toca");
    return;
  }

  // Al final de la columna: la grid ordena por sortOrder y este entra con el 6,
  // así que el menú tiene que leerse en el mismo orden que las cards.
  cloudColumn.items.push(NAV_ITEM);

  await db
    .update(navConfig)
    .set({ megaMenu: menu, updatedAt: new Date() })
    .where(eq(navConfig.id, "main"));
  console.log("✓ nav_config: ítem agregado a la columna Cloud");
}

async function main(): Promise<void> {
  if (!db) {
    console.error(
      "✗ db es null. Revisa DATABASE_URL en .env.local y que USE_DB_FALLBACKS no sea 'true'.",
    );
    process.exit(1);
  }
  await seedServicio();
  await seedNav();
  console.log("\nListo. Ahora corre export-fallbacks.ts para refrescar data/fallbacks/.");
  process.exit(0);
}

main().catch((e) => {
  console.error("✗ el seed no llegó al final:", e);
  process.exit(1);
});
