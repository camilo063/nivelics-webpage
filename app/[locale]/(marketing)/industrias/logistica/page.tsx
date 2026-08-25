import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { GeoIconBox } from "@/lib/icons/geometric";
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
  const raw = await getIndustria("logistica");
  const ind = raw ? mapIndustria(raw as Record<string, unknown>, locale) : null;

  return buildPageMetadata({
    locale,
    href: "/industrias/logistica",
    title: ind?.seoTitle || "Tecnología para Logística y Transporte",
    description:
      ind?.seoDescription ||
      "Soluciones de trazabilidad, optimización de rutas y automatización de warehouse para empresas de logística y transporte.",
  });
}

// LEGACY FALLBACK
const CHALLENGES = [
  {
    icon: "map-pin",
    title: "Trazabilidad en tiempo real",
    description:
      "Visibilidad completa de la cadena de suministro desde el origen hasta la entrega final, con alertas proactivas ante desviaciones.",
  },
  {
    icon: "route",
    title: "Optimización de rutas",
    description:
      "Reducir costos de transporte y tiempos de entrega con algoritmos que consideran tráfico, capacidad y ventanas horarias.",
  },
  {
    icon: "warehouse",
    title: "Automatización de warehouse",
    description:
      "Digitalizar operaciones de almacén con picking inteligente, inventario en tiempo real y coordinación con flotas de transporte.",
  },
];

// LEGACY FALLBACK
const SOLUTIONS = [
  {
    badge: "ia" as const,
    title: "IA para Logística",
    description:
      "Predicción de demanda, optimización de rutas con machine learning y visión por computadora para control de calidad en almacén.",
  },
  {
    badge: "cloud" as const,
    title: "Cloud para Logística",
    description:
      "Plataformas IoT en la nube para tracking en tiempo real, procesamiento de eventos y dashboards operativos multi-ubicación.",
  },
  {
    badge: "staffing" as const,
    title: "Staffing para Logística",
    description:
      "Ingenieros con experiencia en TMS, WMS, integraciones de IoT y desarrollo de plataformas de trazabilidad.",
  },
];

export default async function LogisticaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const raw = await getIndustria("logistica");
  const ind = raw ? mapIndustria(raw as Record<string, unknown>, locale) : null;

  const challenges = ind?.painPoints?.length ? ind.painPoints : CHALLENGES;
  const isEn = locale === "en";
  const industriaName = ind?.name || (isEn ? "Logistics" : "Logística");
  const solutions = ind?.solutions?.length ? ind.solutions : SOLUTIONS;

  const serviceSchema = getServiceSchema({
    name: ind?.name || "Tecnología para Logística y Transporte",
    description:
      ind?.heroSubtitle ||
      "IA, cloud y staffing para empresas de logística que necesitan trazabilidad, optimización de rutas y automatización.",
    url: "/industrias/logistica",
    serviceType: "Logistics Technology Consulting",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Industrias", url: "/industrias" },
    { name: ind?.name || "Logística", url: "/industrias/logistica" },
  ]);
  const webPageSchema = getIndustriaWebPageSchema(INDUSTRIAS_SCHEMA_DATA["logistica"]);

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
            {ind?.heroTitle || "Transformación Digital en Logística"}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            {ind?.heroSubtitle ||
              "Trazabilidad total, rutas inteligentes y almacenes automatizados con IA, cloud y talento especializado."}
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
                    <GeoIconBox name={iconName} size={22} color="cyan" />
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
      {!ind?.ctaTitle && (
        <CTABanner title={ind?.ctaText || "Hablemos de tu proyecto en Logística"} />
      )}
    </PageWrapper>
  );
}
