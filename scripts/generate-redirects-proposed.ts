/**
 * Reads blog-mapping.csv + the bucket files and emits
 * docs/seo/redirects-proposed.ts as a reviewable TypeScript module.
 *
 * Service mappings are hard-coded here (they came from Fase 3 human review).
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const OUT = join(ROOT, "docs/seo/redirects-proposed.ts");

type Redirect = {
  source: string;
  destination: string;
  permanent: true;
  note?: string;
  confidence: "high" | "medium" | "low";
};

const redirects: Redirect[] = [];

// ─────────────────────────────────────────────────────────────────────────────
// 1. NOSOTROS (already in next.config.ts, preserved verbatim — ES + EN)
// ─────────────────────────────────────────────────────────────────────────────

redirects.push(
  { source: "/quienes-somos", destination: "/nosotros", permanent: true, confidence: "high" },
  {
    source: "/linea-del-tiempo",
    destination: "/nosotros/historia",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/como-trabajamos",
    destination: "/nosotros/metodologia",
    permanent: true,
    confidence: "high",
  },
  { source: "/en/about-us", destination: "/en/about", permanent: true, confidence: "high" },
  {
    source: "/en/how-do-we-work",
    destination: "/en/about/methodology",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/en/timeline",
    destination: "/en/about/history",
    permanent: true,
    confidence: "high",
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONTACTO EN
// ─────────────────────────────────────────────────────────────────────────────

redirects.push({
  source: "/en/contact-us-at",
  destination: "/en/contact",
  permanent: true,
  confidence: "high",
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. BLOGS hub EN (slug viejo "/en/blogs")
// ─────────────────────────────────────────────────────────────────────────────

redirects.push({
  source: "/en/blogs",
  destination: "/en/blog",
  permanent: true,
  confidence: "high",
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. SUCCESS STORIES — slug rename "/nivelics-and-XXX" → "/XXX"
// ─────────────────────────────────────────────────────────────────────────────

redirects.push(
  {
    source: "/en/success-stories/:slug(nivelics-and-grupo-bolivar)",
    destination: "/en/success-stories/grupo-bolivar",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/en/success-stories/:slug(nivelics-and-televisa)",
    destination: "/en/success-stories/televisa",
    permanent: true,
    confidence: "high",
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// 5. SERVICIOS ES → hubs + sub-servicios (ES locale)
// Grouped by destination.
// ─────────────────────────────────────────────────────────────────────────────

const esServiceGroups: Array<[string[], string, Redirect["confidence"]]> = [
  // IA hub
  [["ia-aplicada-a-negocios"], "/servicios/inteligencia-artificial", "high"],
  // IA: automatización procesos (cadena de valor)
  [
    ["mejora-cadena-valor-inteligencia-artificial"],
    "/servicios/inteligencia-artificial/automatizacion-procesos",
    "high",
  ],
  // IA: marketing-crm
  [
    ["revoluciona-marketing-inteligencia-artificial"],
    "/servicios/inteligencia-artificial/marketing-crm",
    "high",
  ],
  // IA: agentes comerciales
  [
    ["revoluciona-ventas-agentes-comerciales-inteligentes"],
    "/servicios/inteligencia-artificial/agentes-comerciales",
    "high",
  ],
  // IA: gestión contenido
  [
    ["gestion-de-contenido-con-ia-optimiza-tiempo-y-alcanza-mas-audiencia"],
    "/servicios/inteligencia-artificial/gestion-contenido",
    "high",
  ],
  // IA: ruta legacy interna del propio sitio nuevo (agentes → hub)
  [["agentes"], "/servicios/inteligencia-artificial", "high"],

  // Cloud hub
  [["servicios-cloud", "servicios-cloud-nivelics"], "/servicios/cloud", "high"],
  // Cloud infraestructura
  [
    [
      "administracion-de-infraestructura",
      "arquitectura-e-implementacion-de-infraestructura",
      "orquestacion-de-contenedores-en-kubernetes-k8-s",
    ],
    "/servicios/cloud/infraestructura",
    "high",
  ],
  // Cloud migración AWS (era "plataformas en la nube")
  [["implementacion-de-plataformas-en-la-nube"], "/servicios/cloud/migracion-aws", "high"],
  // Cloud serverless
  [["soluciones-serverless"], "/servicios/cloud/serverless", "high"],
  // Cloud seguridad
  [
    ["seguridad-informatica", "pruebas-de-penetracion", "remediacion-de-sitios-vulnerados"],
    "/servicios/cloud/seguridad",
    "high",
  ],

  // Desarrollo digital hub
  [
    ["desarrollo-de-soluciones-digitales", "desarrollo-de-soluciones-tecnologicas"],
    "/servicios/desarrollo-digital",
    "high",
  ],
  // DD apps móviles (incluye iOS/Android/híbridas)
  [
    [
      "desarrollo-de-aplicaciones-android",
      "desarrollo-de-aplicaciones-hibridas",
      "desarrollo-de-aplicaciones-moviles",
      "desarrollo-de-i-os-app",
    ],
    "/servicios/desarrollo-digital/apps-moviles",
    "high",
  ],
  // DD plataformas web (incluye PWA y portales)
  [
    [
      "desarrollo-web",
      "desarrollo-web-a-la-medida",
      "desarrollo-de-portales-de-informacion",
      "desarrollo-de-aplicaciones-web-pwa",
    ],
    "/servicios/desarrollo-digital/plataformas-web",
    "high",
  ],
  // DD ecommerce
  [
    [
      "e-commerce",
      "implementacion-de-tiendas-sobre-shopify",
      "implementacion-online-con-woocommerce",
    ],
    "/servicios/desarrollo-digital/ecommerce",
    "high",
  ],
  // DD sitios agentic — SEO (bloqueante resuelto: opción A)
  [
    ["auditorias-seo", "estrategia-seo"],
    "/servicios/desarrollo-digital/sitios-web-agentic",
    "medium",
  ],

  // Staff Augmentation
  [["staff-argumentation"], "/servicios/staff-augmentation", "high"], // typo original
  [["devops", "implementacion-agil-ci-cd"], "/servicios/staff-augmentation/devops-cloud", "high"],
  [
    [
      "diseno-ux-ui",
      "diseno-de-producto",
      "creacion-de-mockups-y-prototipado",
      "descubrimiento-e-investigacion",
    ],
    "/servicios/staff-augmentation/diseno-ux-ui",
    "high",
  ],
  [
    [
      "quality-assurance",
      "automatizacion-de-pruebas",
      "pruebas-a-b",
      "pruebas-funcionales",
      "pruebas-no-funcionales",
      "pruebas-heuristicas",
      "pruebas-de-experiencia-de-usuario",
      "pruebas-de-revision-de-codigo-estatico",
      "inspeccion-de-codigo-y-pruebas-unitarias",
    ],
    "/servicios/staff-augmentation/qa-seguridad",
    "high",
  ],

  // Industrias (salud vivía como servicio)
  [["software-para-salud"], "/industrias/salud", "high"],
];

for (const [slugs, dest, conf] of esServiceGroups) {
  redirects.push({
    source: `/servicios/:slug(${slugs.join("|")})`,
    destination: dest,
    permanent: true,
    confidence: conf,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SERVICIOS EN — usar paths traducidos del nuevo sitio
// ─────────────────────────────────────────────────────────────────────────────

const enServiceGroups: Array<[string[], string, Redirect["confidence"]]> = [
  // AI
  [["ai-applied-to-business"], "/en/services/artificial-intelligence", "high"],
  // Cloud hub
  [["cloud-services", "cloud-services-nivelics"], "/en/services/cloud", "high"],
  [
    [
      "infrastructure-architecture-and-implementation",
      "infrastructure-management",
      "kubernetes-container-orchestration",
    ],
    "/en/services/cloud/infrastructure",
    "high",
  ],
  [["cloud-platforms-implementation"], "/en/services/cloud/aws-migration", "high"],
  [["cibersecurity"], "/en/services/cloud/security", "high"],

  // Staff Aug
  [["it-staffing"], "/en/services/staff-augmentation", "high"],
  [
    ["devops", "agile-implementation-ci-cd"],
    "/en/services/staff-augmentation/devops-cloud",
    "high",
  ],
  [
    ["ux-design", "product-design", "mockup-creation-and-prototyping", "discovery-and-research"],
    "/en/services/staff-augmentation/ux-ui-design",
    "high",
  ],
  [
    [
      "quality-assurance",
      "a-b-testing",
      "functional-testing",
      "heuristic-testing",
      "nonfunctional-tests",
      "test-automation",
      "static-code-review-testing",
      "code-inspection-and-unit-testing",
      "user-testing",
    ],
    "/en/services/staff-augmentation/qa-security",
    "high",
  ],

  // Digital development
  [
    ["digital-solutions-development", "technological-solutions-development"],
    "/en/services/digital-development",
    "high",
  ],
  [
    ["android-app-development", "hybrid-app-development", "i-os-app-development"],
    "/en/services/digital-development/mobile-apps",
    "high",
  ],
  [
    [
      "web-development",
      "tailored-web-development",
      "development-of-information-portals",
      "progressive-web-app-development",
    ],
    "/en/services/digital-development/web-platforms",
    "high",
  ],
  [
    ["e-commerce", "shopify-website", "woocommerce-website"],
    "/en/services/digital-development/ecommerce",
    "high",
  ],
  [
    ["seo", "seo-audits", "seo-consulting"],
    "/en/services/digital-development/agentic-web",
    "medium",
  ],

  // Industries
  [["healthcare-software"], "/en/industries/healthcare", "high"],
  [["media-solutions"], "/en/industries/media-entertainment", "high"],
];

for (const [slugs, dest, conf] of enServiceGroups) {
  redirects.push({
    source: `/en/services/:slug(${slugs.join("|")})`,
    destination: dest,
    permanent: true,
    confidence: conf,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. /aws-services (sin prefijo locale)
// ─────────────────────────────────────────────────────────────────────────────

redirects.push({
  source: "/aws-services",
  destination: "/servicios/cloud",
  permanent: true,
  confidence: "high",
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. /es/soluciones/* (prefijo legacy)
// ─────────────────────────────────────────────────────────────────────────────

redirects.push(
  {
    source: "/es/soluciones/paginas-web{/}?",
    destination: "/servicios/desarrollo-digital/plataformas-web",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/es/soluciones/seo{/}?",
    destination: "/servicios/desarrollo-digital/sitios-web-agentic",
    permanent: true,
    confidence: "medium",
  },
  {
    source: "/es/soluciones/staff-augmentation{/}?",
    destination: "/servicios/staff-augmentation",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/es/soluciones/seguridad-informatica{/}?",
    destination: "/servicios/cloud/seguridad",
    permanent: true,
    confidence: "high",
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// 9. BLOG: políticas
// ─────────────────────────────────────────────────────────────────────────────

redirects.push({
  source: "/blog/politica-privacidad",
  destination: "/privacidad",
  permanent: true,
  confidence: "high",
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. BLOG: renames (slug viejo con contenido migrado bajo slug nuevo)
// Generated from blog-mapping.csv — only `rename` rows.
// ─────────────────────────────────────────────────────────────────────────────

type BlogRow = {
  legacyPath: string;
  newPath: string;
  type: string;
  confidence: string;
};

const blogCsv = readFileSync(join(ROOT, "docs/seo/buckets/blog-mapping.csv"), "utf-8")
  .trim()
  .split("\n")
  .slice(1);

const blogRows: BlogRow[] = blogCsv.map((line) => {
  const parts: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') inQuotes = !inQuotes;
    else if (ch === "," && !inQuotes) {
      parts.push(cur);
      cur = "";
    } else cur += ch;
  }
  parts.push(cur);
  return {
    legacyPath: parts[0],
    newPath: parts[1],
    type: parts[2],
    confidence: parts[3],
  };
});

const renames = blogRows.filter((r) => r.type === "rename");
for (const r of renames) {
  redirects.push({
    source: r.legacyPath,
    destination: r.newPath,
    permanent: true,
    confidence: r.confidence as Redirect["confidence"],
    note: "blog slug rename (fuzzy match)",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. BLOG: hub catch-alls for unmigrated posts
// Every legacy /blog/:slug (or /en/blog/:slug) that has no counterpart in DB
// goes to /blog (or /en/blog). Emitted as TWO grouped regex rules.
// ─────────────────────────────────────────────────────────────────────────────

const esHubSlugs: string[] = [];
const enHubSlugs: string[] = [];
for (const r of blogRows.filter((b) => b.type === "hub")) {
  if (r.legacyPath.startsWith("/en/blog/")) {
    enHubSlugs.push(r.legacyPath.slice("/en/blog/".length));
  } else if (r.legacyPath.startsWith("/blog/")) {
    esHubSlugs.push(r.legacyPath.slice("/blog/".length));
  }
}

// path-to-regexp needs any regex-special char escaped within :param(regex)
// slugs are [a-z0-9-] mostly, but we have a "I" and "XXI" — still fine.
function escapeForRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

if (esHubSlugs.length > 0) {
  redirects.push({
    source: `/blog/:slug(${esHubSlugs.map(escapeForRegex).join("|")})`,
    destination: "/blog",
    permanent: true,
    confidence: "low",
    note: `blog hub catch-all ES (${esHubSlugs.length} unmigrated posts)`,
  });
}
if (enHubSlugs.length > 0) {
  redirects.push({
    source: `/en/blog/:slug(${enHubSlugs.map(escapeForRegex).join("|")})`,
    destination: "/en/blog",
    permanent: true,
    confidence: "low",
    note: `blog hub catch-all EN (${enHubSlugs.length} unmigrated posts)`,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Emit file
// ─────────────────────────────────────────────────────────────────────────────

const highCount = redirects.filter((r) => r.confidence === "high").length;
const medCount = redirects.filter((r) => r.confidence === "medium").length;
const lowCount = redirects.filter((r) => r.confidence === "low").length;

const header = `/**
 * Proposed legacy → new-site 301/308 redirects.
 *
 * Generated ${new Date().toISOString()} by scripts/generate-redirects-proposed.ts
 * from GSC export docs/seo/legacy-urls-gsc-2026-04-12.csv + DB blog query.
 *
 * Rule count:   ${redirects.length}
 *  - high confidence:   ${highCount}
 *  - medium confidence: ${medCount}
 *  - low confidence:    ${lowCount}
 *
 * Do NOT merge into next.config.ts without running
 * \`node --env-file=.env.local --import tsx scripts/verify-redirects.ts\` first.
 */

export type LegacyRedirect = {
  source: string;
  destination: string;
  permanent: true;
  /** Human-readable hint. Strip before feeding to Next.js. */
  note?: string;
  /** Audit metadata. Strip before feeding to Next.js. */
  confidence: "high" | "medium" | "low";
};

export const LEGACY_REDIRECTS: LegacyRedirect[] = ${JSON.stringify(redirects, null, 2)};

/**
 * Shape for Next.js \`redirects()\` — strips audit-only fields.
 */
export function toNextRedirects(
  rules: LegacyRedirect[] = LEGACY_REDIRECTS,
): Array<{ source: string; destination: string; permanent: true }> {
  return rules.map(({ source, destination, permanent }) => ({
    source,
    destination,
    permanent,
  }));
}
`;

writeFileSync(OUT, header);

console.log(`Wrote ${redirects.length} redirects to ${OUT}`);
console.log(`  high:   ${highCount}`);
console.log(`  medium: ${medCount}`);
console.log(`  low:    ${lowCount}`);
