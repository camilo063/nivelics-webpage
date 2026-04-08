"use client";

import { usePathname as useNextPathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";

const SLUG_TO_KEY: Record<string, string> = {
  servicios: "services",
  services: "services",
  "inteligencia-artificial": "artificialIntelligence",
  "artificial-intelligence": "artificialIntelligence",
  "agentes-ia": "aiAgents",
  "ai-agents": "aiAgents",
  "agentes-comerciales": "salesAgents",
  "sales-agents": "salesAgents",
  "automatizacion-procesos": "processAutomation",
  "process-automation": "processAutomation",
  "gestion-contenido": "contentManagement",
  "content-management": "contentManagement",
  "marketing-crm": "marketingCrm",
  cloud: "cloud",
  finops: "finops",
  "migracion-aws": "awsMigration",
  "aws-migration": "awsMigration",
  infraestructura: "infrastructure",
  infrastructure: "infrastructure",
  seguridad: "security",
  security: "security",
  serverless: "serverless",
  "staff-augmentation": "staffAugmentation",
  "desarrollo-software": "softwareDevelopment",
  "software-development": "softwareDevelopment",
  "datos-ia": "dataAi",
  "data-ai": "dataAi",
  "devops-cloud": "devopsCloud",
  "diseno-ux-ui": "uxUiDesign",
  "ux-ui-design": "uxUiDesign",
  "qa-seguridad": "qaSecurity",
  "qa-security": "qaSecurity",
  "desarrollo-digital": "digitalDevelopment",
  "digital-development": "digitalDevelopment",
  "apps-moviles": "mobileApps",
  "mobile-apps": "mobileApps",
  ecommerce: "ecommerce",
  "plataformas-web": "webPlatforms",
  "web-platforms": "webPlatforms",
  nosotros: "about",
  about: "about",
  historia: "history",
  history: "history",
  equipo: "team",
  team: "team",
  metodologia: "methodology",
  methodology: "methodology",
  certificaciones: "certifications",
  certifications: "certifications",
  "casos-de-exito": "successStories",
  "success-stories": "successStories",
  industrias: "industries",
  industries: "industries",
  fintech: "fintech",
  "medios-entretenimiento": "mediaEntertainment",
  "media-entertainment": "mediaEntertainment",
  salud: "healthcare",
  healthcare: "healthcare",
  "retail-ecommerce": "retailEcommerce",
  logistica: "logistics",
  logistics: "logistics",
  manufactura: "manufacturing",
  manufacturing: "manufacturing",
  blog: "blog",
  contacto: "contact",
  contact: "contact",
  "trabaja-con-nosotros": "careers",
  careers: "careers",
  privacidad: "privacy",
  privacy: "privacy",
  soporte: "support",
  support: "support",
  categoria: "category",
  category: "category",
  televisa: "televisa",
  "grupo-bolivar": "grupBolivar",
  "two-maids": "twoMaids",
  cronica: "cronica",
  pulzo: "pulzo",
  univision: "univision",
  "ab-inbev": "abInbev",
};

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function Breadcrumb() {
  const rawPathname = useNextPathname();
  const t = useTranslations("breadcrumb");

  // Strip /en prefix for processing
  const pathname = rawPathname.replace(/^\/en(\/|$)/, "/");

  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const crumbs: BreadcrumbItem[] = segments.map((segment, i) => {
    const key = SLUG_TO_KEY[segment];
    const label = key
      ? t(key)
      : segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      label,
      href: "/" + segments.slice(0, i + 1).join("/"),
    };
  });

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("home"), item: "https://www.nivelics.com/" },
      ...crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: c.label,
        ...(i < crumbs.length - 1 ? { item: `https://www.nivelics.com${c.href}` } : {}),
      })),
    ],
  };

  const showCollapsed = crumbs.length > 3;
  const mobileCrumbs = showCollapsed
    ? [crumbs[crumbs.length - 2], crumbs[crumbs.length - 1]]
    : crumbs;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <nav
        aria-label="Ruta de navegación"
        role="navigation"
        className="mx-auto max-w-[1280px] px-6 pt-2 pb-0 md:px-20"
      >
        {/* Desktop */}
        <ol className="flex items-center gap-1.5 text-xs text-text-40 max-md:hidden">
          <li className="shrink-0">
            <Link
              href="/"
              className="transition-colors hover:text-primary"
              aria-label={`${t("home")}`}
            >
              {t("home")}
            </Link>
          </li>
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-1.5 shrink-0">
                <span aria-hidden="true" className="text-text-40/40">
                  ›
                </span>
                {isLast ? (
                  <span className="text-text-70" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-primary"
                    aria-label={`Ir a ${crumb.label}`}
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>

        {/* Mobile */}
        <ol className="flex items-center gap-1.5 text-xs text-text-40 md:hidden">
          <li className="shrink-0">
            <Link href="/" className="transition-colors hover:text-primary">
              {t("home")}
            </Link>
          </li>
          {showCollapsed && (
            <li className="flex items-center gap-1.5 shrink-0">
              <span aria-hidden="true" className="text-text-40/40">
                ›
              </span>
              <span className="text-text-40">…</span>
            </li>
          )}
          {mobileCrumbs.map((crumb, i) => {
            const isLast = i === mobileCrumbs.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-1.5 shrink-0">
                <span aria-hidden="true" className="text-text-40/40">
                  ›
                </span>
                {isLast ? (
                  <span className="text-text-70" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link href={crumb.href} className="transition-colors hover:text-primary">
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
