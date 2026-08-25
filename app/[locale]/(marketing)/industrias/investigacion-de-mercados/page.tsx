import type { Metadata } from "next";
import { GeoIconBox } from "@/lib/icons/geometric";
import { PageWrapper } from "@/components/layout";
import { HeroEffect } from "@/components/ui/hero-effect";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { IndustriaRichSections } from "@/components/sections/industria-rich-sections";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getIndustriaWebPageSchema, INDUSTRIAS_SCHEMA_DATA } from "@/lib/schema/industria";
import { getLocale, setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { getIndustria, mapIndustria } from "@/lib/cms";
import type { Locale } from "@/lib/cms";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const raw = await getIndustria("investigacion-de-mercados");
  const ind = raw ? mapIndustria(raw as Record<string, unknown>, locale) : null;

  return buildPageMetadata({
    locale,
    href: "/industrias/investigacion-de-mercados",
    title: ind?.seoTitle || "IA y Automatización para Investigación de Mercados",
    description:
      ind?.seoDescription ||
      "Back-checks con llamadas de IA al 100% de la muestra, CATI híbrido, dashboards de campo en tiempo real y entregables automáticos para firmas de investigación.",
  });
}

// LEGACY FALLBACK
const CHALLENGES = [
  {
    icon: "tri-check",
    title: "Back-checks que solo cubren una muestra",
    description:
      "La supervisión telefónica verifica el 10–20% del trabajo de campo; el resto queda sin auditar y los hallazgos llegan tarde.",
  },
  {
    icon: "hex-nodes",
    title: "Coordinación de campo manual",
    description:
      "Rutas, agendas y supervisión de encuestadores gestionados con planillas y llamadas, sin visibilidad en tiempo real del operativo.",
  },
  {
    icon: "hex-time",
    title: "Entregables que tardan semanas",
    description:
      "Codificación de abiertas, cruces y armado de informes consumen el tiempo entre el cierre de campo y el cliente.",
  },
];

// LEGACY FALLBACK
const SOLUTIONS = [
  {
    badge: "ia" as const,
    title: "IA para Investigación de Mercados",
    description:
      "Agentes de voz para back-checks al 100% de la muestra y CATI híbrido; codificación automática de abiertas y detección de fraude.",
  },
  {
    badge: "cloud" as const,
    title: "Cloud para Investigación de Mercados",
    description:
      "Dashboards de operación de campo en tiempo real y pipelines que conectan captura, validación y entrega.",
  },
  {
    badge: "staffing" as const,
    title: "Staffing para Investigación de Mercados",
    description:
      "Científicos de datos e ingenieros bilingües integrados a tus proyectos de research en 5 días.",
  },
];

export default async function InvestigacionMercadosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const raw = await getIndustria("investigacion-de-mercados");
  const ind = raw ? mapIndustria(raw as Record<string, unknown>, locale) : null;

  const challenges = ind?.painPoints?.length ? ind.painPoints : CHALLENGES;
  const isEn = locale === "en";
  const industriaName = ind?.name || (isEn ? "Market Research" : "Investigación de Mercados");

  const solutions = ind?.solutions?.length ? ind.solutions : SOLUTIONS;

  const serviceSchema = getServiceSchema({
    name: ind?.name || "Soluciones Tecnológicas para Investigación de Mercados",
    description:
      ind?.heroSubtitle ||
      "IA, cloud y staffing para firmas de investigación: back-checks automatizados, CATI híbrido, dashboards de campo y entregables en días.",
    url: "/industrias/investigacion-de-mercados",
    serviceType: "Market Research Technology Consulting",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Industrias", url: "/industrias" },
    {
      name: ind?.name || "Investigación de Mercados",
      url: "/industrias/investigacion-de-mercados",
    },
  ]);
  const webPageSchema = getIndustriaWebPageSchema(
    INDUSTRIAS_SCHEMA_DATA["investigacion-de-mercados"],
  );

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <HeroEffect kind="hex" opacity={0.9} />
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"
          style={{ zIndex: 1 }}
        />
        <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-20">
          <h1 className="max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
            {ind?.heroTitle || "Transformación Digital para Investigación de Mercados"}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            {ind?.heroSubtitle ||
              "Verificación con llamadas de IA al 100% de la muestra, dashboards de campo en tiempo real y automatización de entregables."}
          </p>
        </div>
      </section>

      {/* Challenges */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            {isEn
              ? `The 3 tech challenges in ${industriaName}`
              : `Los 3 retos tech de ${industriaName}`}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map((ch) => {
              const iconName = "icon" in ch && typeof ch.icon === "string" ? ch.icon : undefined;
              return (
                <div key={ch.title} className="glass glow-hover rounded-xl p-6">
                  <div className="mb-4">
                    <GeoIconBox name={iconName} size={22} color="green" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-100">{ch.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-70">
                    {"description" in ch ? ch.description : "desc" in ch ? ch.desc : ""}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            {isEn ? "How the I+C+S framework solves this" : "Cómo el marco I+C+S resuelve esto"}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((sol) => {
              const badge = "badge" in sol ? sol.badge : null;
              return (
                <div key={sol.title} className="glass glow-hover rounded-xl p-6">
                  {badge && (
                    <ServiceBadge variant={badge} className="mb-4">
                      {badge === "ia" ? "IA" : badge.charAt(0).toUpperCase() + badge.slice(1)}
                    </ServiceBadge>
                  )}
                  <h3 className="text-lg font-semibold text-text-100">{sol.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-70">
                    {"description" in sol ? sol.description : "desc" in sol ? sol.desc : ""}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {ind && <IndustriaRichSections industria={ind} locale={locale} />}
      {!ind?.ctaTitle && <CTABanner title={ind?.ctaText || "Hablemos de tu operación de campo"} />}
    </PageWrapper>
  );
}
