"use client";

import { usePathname as useNextPathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { canonicalEsPath, localizePath } from "@/lib/i18n/localize-path";
import { LocaleLink as Link } from "@/components/i18n/locale-link";

const SLUG_TO_KEY: Record<string, string> = {
  servicios: "services",
  services: "services",
  "inteligencia-artificial": "artificialIntelligence",
  "artificial-intelligence": "artificialIntelligence",
  "agentes-ia": "aiAgents",
  "ai-agents": "aiAgents",
  "integracion-sistemas-mcp": "systemsIntegrationMcp",
  "systems-integration-mcp": "systemsIntegrationMcp",
  "ia-privada-on-premise": "privateAi",
  "private-ai-on-premises": "privateAi",
  "agentops-gobierno-agentes": "agentOps",
  agentops: "agentOps",
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
  "ciberseguridad-ethical-hacking": "ethicalHacking",
  "ethical-hacking": "ethicalHacking",
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
  "sitios-web-agentic": "agenticWeb",
  "agentic-web": "agenticWeb",
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
  productos: "products",
  products: "products",
  precios: "pricing",
  pricing: "pricing",
  "medicion-de-audiencias": "audienceMeasurement",
  "audience-measurement": "audienceMeasurement",
  "investigacion-de-mercados": "marketResearch",
  "market-research": "marketResearch",
  ciberseguridad: "cybersecurity",
  desarrollo: "development",
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

  const locale = useLocale() === "en" ? "en" : "es";
  const isEn = locale === "en";
  // Se trabaja sobre la ruta ES canónica: en SSR el pathname de /en llega como
  // /en/<ruta ES> y en el cliente como /en/<ruta EN>. Los enlaces se traducen al final.
  const pathname = canonicalEsPath(rawPathname);
  const homeHref = localizePath("/", locale);

  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  // Ocultar breadcrumb en páginas de subservicio (donde ya aparece SiblingServicesNav).
  // Path pattern: /servicios/{hub}/{subservice}
  if (segments[0] === "servicios" && segments.length >= 3) return null;
  // Los artículos pintan su propio breadcrumb (con el título real) y su BreadcrumbList;
  // aquí solo se podría mostrar el slug.
  if (segments[0] === "blog" && segments.length === 2) return null;

  const crumbs: BreadcrumbItem[] = segments.map((segment, i) => {
    const key = SLUG_TO_KEY[segment];
    const label = key
      ? t(key)
      : segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      label,
      href: localizePath("/" + segments.slice(0, i + 1).join("/"), locale),
    };
  });

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("home"),
        item: `https://www.nivelics.com${homeHref}`,
      },
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
        aria-label="Breadcrumb"
        role="navigation"
        className="mx-auto max-w-[1280px] px-6 pt-3 pb-3 md:px-20 mb-6"
      >
        {/* Desktop */}
        <ol className="flex items-center gap-1.5 max-md:hidden">
          <li className="shrink-0">
            <Link
              href={homeHref}
              className="text-xs text-text-40 transition-colors duration-150 hover:text-text-70 font-medium"
              aria-label={`${t("home")}`}
            >
              {t("home")}
            </Link>
          </li>
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-1.5 shrink-0">
                <span aria-hidden="true" className="text-white/20 text-xs select-none">
                  /
                </span>
                {isLast ? (
                  <span className="text-xs text-text-70 font-medium" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-xs text-text-40 transition-colors duration-150 hover:text-text-70 font-medium"
                    aria-label={isEn ? `Go to ${crumb.label}` : `Ir a ${crumb.label}`}
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>

        {/* Mobile */}
        <ol className="flex items-center gap-1.5 md:hidden">
          <li className="shrink-0">
            <Link
              href={homeHref}
              className="text-xs text-text-40 transition-colors hover:text-text-70 font-medium"
            >
              {t("home")}
            </Link>
          </li>
          {showCollapsed && (
            <li className="flex items-center gap-1.5 shrink-0">
              <span aria-hidden="true" className="text-white/20 text-xs select-none">
                /
              </span>
              <span className="text-xs text-text-40">…</span>
            </li>
          )}
          {mobileCrumbs.map((crumb, i) => {
            const isLast = i === mobileCrumbs.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-1.5 shrink-0">
                <span aria-hidden="true" className="text-white/20 text-xs select-none">
                  /
                </span>
                {isLast ? (
                  <span className="text-xs text-text-70 font-medium" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-xs text-text-40 transition-colors hover:text-text-70 font-medium"
                  >
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
