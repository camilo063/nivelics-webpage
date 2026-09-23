// CMS-connected: 2026-05-07 — benefits, processSteps and CTAs read from DB with hardcoded fallbacks
// Bilingüe con el patrón de cloud/ciberseguridad-ethical-hacking (constantes _ES/_EN + isEn):
// el copy fijo estaba solo en español y /en lo servía así.
import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { CTABanner } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { BenefitCard } from "@/components/shared/benefit-card";
import { GeoIconBox } from "@/lib/icons/geometric";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { HeroSplit } from "@/components/sections/hero-split";
import { HeroSelector } from "@/components/sections/hero-selector";
import { MetricsBar } from "@/components/sections/metrics-bar";
import { StickyMobileCta } from "@/components/ui/sticky-mobile-cta";
import {
  CmsServicioBenefits,
  CmsServicioProcess,
  resolveServicioCtas,
} from "@/components/sections/cms-servicio-sections";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getServicioData } from "@/lib/cms/get-servicio-data";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import type { Locale } from "@/lib/cms/types";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const cms = await getServicioData("plataformas-web", locale);
  // El layout aplica la plantilla "%s | Nivelics" — nunca repetir el sufijo aquí.
  return buildPageMetadata({
    locale,
    href: "/servicios/desarrollo-digital/plataformas-web",
    title:
      cms?.seoTitle ||
      (isEn
        ? "Web Platforms | Scalable Full-Stack Development"
        : "Plataformas Web | Desarrollo Full-Stack Escalable"),
    description:
      cms?.seoDescription ||
      (isEn
        ? "Enterprise web platforms with React, Next.js and Node.js. Modern, scalable architecture."
        : "Plataformas web empresariales con React, Next.js y Node.js. Arquitectura moderna y escalable."),
  });
}

const BENEFITS_ES = [
  {
    icon: "globe",
    title: "React y Next.js",
    description:
      "Desarrollo frontend con React y Next.js para aplicaciones web rápidas, SEO-friendly y con excelente experiencia de usuario.",
  },
  {
    icon: "network",
    title: "APIs RESTful y GraphQL",
    description:
      "Backend robusto con APIs RESTful y GraphQL diseñadas para escalabilidad, seguridad y facilidad de integración.",
  },
  {
    icon: "cloud-cog",
    title: "Arquitectura serverless",
    description:
      "Despliegue en arquitecturas serverless que escalan automáticamente y eliminan la gestión de infraestructura.",
  },
];

const BENEFITS_EN = [
  {
    icon: "globe",
    title: "React and Next.js",
    description:
      "Frontend development with React and Next.js for web applications that are fast, SEO-friendly and a pleasure to use.",
  },
  {
    icon: "network",
    title: "RESTful and GraphQL APIs",
    description:
      "Robust backends with RESTful and GraphQL APIs designed for scalability, security and easy integration.",
  },
  {
    icon: "cloud-cog",
    title: "Serverless architecture",
    description:
      "Deployment on serverless architectures that scale automatically and take infrastructure management off your hands.",
  },
];

const HERO_OPTIONS_ES = [
  {
    icon: "☁️",
    label: "SaaS",
    url: "/servicios/desarrollo-digital/plataformas-web",
    description: "Software como servicio multi-tenant escalable",
  },
  {
    icon: "🏢",
    label: "Portal empresarial",
    url: "/servicios/desarrollo-digital/plataformas-web",
    description: "Intranet, extranet o portal de clientes",
  },
  {
    icon: "📊",
    label: "Dashboard/Analytics",
    url: "/servicios/desarrollo-digital/plataformas-web",
    description: "Visualización de datos y reportes en tiempo real",
  },
  {
    icon: "🔗",
    label: "Integración de sistemas",
    url: "/servicios/desarrollo-digital/plataformas-web",
    description: "Middleware y APIs para conectar tus sistemas",
  },
];

const HERO_OPTIONS_EN = [
  {
    icon: "☁️",
    label: "SaaS",
    url: "/servicios/desarrollo-digital/plataformas-web",
    description: "Scalable multi-tenant software as a service",
  },
  {
    icon: "🏢",
    label: "Enterprise portal",
    url: "/servicios/desarrollo-digital/plataformas-web",
    description: "Intranet, extranet or customer portal",
  },
  {
    icon: "📊",
    label: "Dashboard/Analytics",
    url: "/servicios/desarrollo-digital/plataformas-web",
    description: "Data visualisation and real-time reporting",
  },
  {
    icon: "🔗",
    label: "Systems integration",
    url: "/servicios/desarrollo-digital/plataformas-web",
    description: "Middleware and APIs to connect your systems",
  },
];

const COMPARISON_ROWS_ES = [
  {
    criterion: "Escalabilidad técnica",
    alternative: "Limitada — plugins y templates",
    nivelics: "Arquitectura pensada para crecer desde el diseño",
  },
  {
    criterion: "Performance (Core Web Vitals)",
    alternative: "Mediocre por sobrecarga de plugins",
    nivelics: "Optimizado por diseño — sin sobrecarga de plugins",
  },
  {
    criterion: "Seguridad",
    alternative: "Dependiente de plugins de terceros",
    nivelics: "Hardening desde el código base",
  },
  {
    criterion: "Customización real",
    alternative: "Temas y plugins — siempre hay límites",
    nivelics: "Sin límites — código propio",
  },
  {
    criterion: "Integración con sistemas core (ERP, CRM)",
    alternative: "Conectores genéricos de mercado",
    nivelics: "APIs a medida para tus sistemas reales",
  },
  {
    criterion: "Costo de mantenimiento a 3 años",
    alternative: "Creciente — licencias, plugins, parches",
    nivelics: "Estable y predecible",
  },
  {
    criterion: "Vendor lock-in",
    alternative: "Alto — dependencia de la plataforma",
    nivelics: "Cero — código tuyo, stack estándar",
  },
];

const COMPARISON_ROWS_EN = [
  {
    criterion: "Technical scalability",
    alternative: "Limited — plugins and templates",
    nivelics: "Architecture designed to grow from day one",
  },
  {
    criterion: "Performance (Core Web Vitals)",
    alternative: "Mediocre from plugin overhead",
    nivelics: "Optimised by design — no plugin overhead",
  },
  {
    criterion: "Security",
    alternative: "Dependent on third-party plugins",
    nivelics: "Hardening from the codebase up",
  },
  {
    criterion: "Real customisation",
    alternative: "Themes and plugins — there is always a ceiling",
    nivelics: "No limits — your own code",
  },
  {
    criterion: "Integration with core systems (ERP, CRM)",
    alternative: "Off-the-shelf generic connectors",
    nivelics: "Custom APIs for the systems you actually run",
  },
  {
    criterion: "Maintenance cost over 3 years",
    alternative: "Rising — licences, plugins, patches",
    nivelics: "Stable and predictable",
  },
  {
    criterion: "Vendor lock-in",
    alternative: "High — dependence on the platform",
    nivelics: "Zero — your code, a standard stack",
  },
];

// Señales cualitativas del servicio: reemplazan la banda numérica de respaldo.
// El conteo de plataformas, el uptime y el tiempo de carga que vivían en esta banda
// no tenían respaldo (no hay SLA firmado), así que el mismo mensaje va en cualitativo.
const HIGHLIGHTS_ES = [
  "Experiencia entregando plataformas a la medida: SaaS, portales y dashboards",
  "Alta disponibilidad por diseño, arquitectura cloud-native",
  "Carga rápida: Core Web Vitals optimizado",
  "Cero vendor lock-in: código tuyo, stack estándar",
];

const HIGHLIGHTS_EN = [
  "Experience delivering custom platforms: SaaS, portals and dashboards",
  "High availability by design, cloud-native architecture",
  "Fast loading: Core Web Vitals optimised",
  "Zero vendor lock-in: your code, a standard stack",
];

export default async function PlataformasWebPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const cms = await getServicioData("plataformas-web", locale);
  const { ctaPrimary, ctaSecondary } = resolveServicioCtas({
    primary: cms ? { text: cms.ctaPrimaryText, url: cms.ctaPrimaryUrl } : null,
    secondary: cms ? { text: cms.ctaSecondaryText, url: cms.ctaSecondaryUrl } : null,
    fallbackPrimary: {
      text: isEn ? "Tell us about your project" : "Cuéntanos tu proyecto",
      url: "/contacto",
    },
    fallbackSecondary: {
      text: isEn ? "See success stories" : "Ver casos de éxito",
      url: "/casos-de-exito",
    },
  });
  const serviceSchema = getServiceSchema({
    locale,
    name: isEn ? "Web Platforms" : "Plataformas Web",
    description: isEn
      ? "Enterprise web platforms with React, Next.js and Node.js. Modern, scalable architecture."
      : "Plataformas web empresariales con React, Next.js y Node.js. Arquitectura moderna y escalable.",
    url: "/servicios/desarrollo-digital/plataformas-web",
    serviceType: "Web Development",
  });
  const breadcrumb = getBreadcrumbSchema(
    locale,
    isEn
      ? [
          { name: "Home", url: "/" },
          { name: "Services", url: "/servicios" },
          { name: "Digital Development", url: "/servicios/desarrollo-digital" },
          { name: "Web Platforms", url: "/servicios/desarrollo-digital/plataformas-web" },
        ]
      : [
          { name: "Inicio", url: "/" },
          { name: "Servicios", url: "/servicios" },
          { name: "Desarrollo Digital", url: "/servicios/desarrollo-digital" },
          { name: "Plataformas Web", url: "/servicios/desarrollo-digital/plataformas-web" },
        ],
  );

  const benefits = isEn ? BENEFITS_EN : BENEFITS_ES;

  return (
    <PageWrapper>
      <SiblingServicesNav
        parentService={{
          name: "Desarrollo Digital",
          nameEn: "Digital Development",
          accentColor: "#06B6D4",
        }}
        siblings={[
          {
            name: "Sitios Agentic-First",
            nameEn: "Agentic-First Websites",
            url: "/servicios/desarrollo-digital/sitios-web-agentic",
            urlEn: "/en/services/digital-development/agentic-web",
          },
          {
            name: "Apps Móviles",
            nameEn: "Mobile Apps",
            url: "/servicios/desarrollo-digital/apps-moviles",
            urlEn: "/en/services/digital-development/mobile-apps",
          },
          {
            name: "E-commerce",
            nameEn: "E-commerce",
            url: "/servicios/desarrollo-digital/ecommerce",
            urlEn: "/en/services/digital-development/ecommerce",
          },
          {
            name: "Plataformas Web",
            nameEn: "Web Platforms",
            url: "/servicios/desarrollo-digital/plataformas-web",
            urlEn: "/en/services/digital-development/web-platforms",
          },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* Hero */}
      <HeroSplit
        heroEffect="particles"
        badge={
          isEn ? "Digital Development · Web Platforms" : "Desarrollo Digital · Plataformas Web"
        }
        h1={cms?.title || (isEn ? "A web platform that" : "Plataforma web")}
        h1Accent={isEn ? "scales without limits" : "sin límites de escala"}
        subtitle={
          cms?.subtitle ||
          (isEn
            ? "Enterprise web platforms with React, Next.js and Node.js. Modern architecture, robust APIs and serverless deployment that grows with your business without technical ceilings."
            : "Plataformas web empresariales con React, Next.js y Node.js. Arquitectura moderna, APIs robustas y despliegue serverless que escala con tu negocio sin límites técnicos.")
        }
        bullets={
          isEn
            ? [
                "SaaS, enterprise portals and custom dashboards",
                "Real integration with your core systems (ERP, CRM, APIs)",
                "Your code, a standard stack — zero vendor lock-in",
              ]
            : [
                "SaaS, portales empresariales y dashboards a medida",
                "Integración real con tus sistemas core (ERP, CRM, APIs)",
                "Código tuyo, stack estándar — cero vendor lock-in",
              ]
        }
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor="#06B6D4"
        rightPanel={
          <HeroSelector
            title={
              isEn ? "What kind of platform do you need?" : "¿Qué tipo de plataforma necesitas?"
            }
            accentColor="#06B6D4"
            options={isEn ? HERO_OPTIONS_EN : HERO_OPTIONS_ES}
          />
        }
        dataSection="plataformas-web-hero"
        ariaLabel={
          isEn
            ? "Enterprise web platforms — scaling without limits, SaaS, portals, dashboards and integrations"
            : "Plataformas web empresariales — sin límites de escala, SaaS, portales, dashboards e integraciones"
        }
      />

      {/* Métricas del CMS si las hay; si no, señales cualitativas (ver HIGHLIGHTS_*). */}
      {cms?.metrics?.length ? (
        <MetricsBar
          metrics={cms.metrics.map((m) => ({
            value: m.value,
            label: m.label,
            sublabel: "",
            unit: m.unit,
          }))}
        />
      ) : (
        <section
          aria-labelledby="plataformas-web-highlights-title"
          className="border-y border-white/[0.06] py-10 md:py-12"
        >
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <h2
              id="plataformas-web-highlights-title"
              className="text-xs font-semibold uppercase tracking-[0.12em] text-text-40"
            >
              {isEn ? "What it includes" : "Lo que incluye"}
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(isEn ? HIGHLIGHTS_EN : HIGHLIGHTS_ES).map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <GeoIconBox name="dia-check" size={16} color="cyan" />
                  <span className="text-sm font-medium leading-snug text-text-100">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            {isEn ? "Key benefits" : "Beneficios clave"}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {benefits.map((b) => (
              <BenefitCard
                key={b.title}
                title={b.title}
                description={b.description}
                icon={b.icon}
                accentColor="#fbbf24"
              />
            ))}
          </div>
        </div>
      </section>

      <CmsServicioBenefits
        benefits={cms?.benefits}
        accentColor="#06B6D4"
        titleEs="Por qué Plataformas Web con Nivelics"
        titleEn="Why Web Platforms with Nivelics"
        locale={locale}
      />
      <CmsServicioProcess
        steps={cms?.processSteps}
        accentColor="#06B6D4"
        titleEs="Cómo lo construimos"
        titleEn="How we build it"
        locale={locale}
      />

      {/* Comparison Table */}
      <ComparisonTable
        title={
          isEn
            ? "A custom web platform vs. WordPress or low-code?"
            : "Plataforma web a medida vs. WordPress o low-code?"
        }
        alternativeLabel="WordPress / Low-code"
        nivelicsLabel={isEn ? "Custom platform — Nivelics" : "Plataforma a medida — Nivelics"}
        criterionLabel={isEn ? "Criterion" : undefined}
        rows={isEn ? COMPARISON_ROWS_EN : COMPARISON_ROWS_ES}
      />

      <CTABanner />

      <StickyMobileCta
        text={isEn ? "Tell us about your project →" : "Cuéntanos tu proyecto →"}
        url="/contacto"
        accentColor="#06B6D4"
      />
    </PageWrapper>
  );
}
