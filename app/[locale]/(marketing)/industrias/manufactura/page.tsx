import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { GeoIconBox } from "@/lib/icons/geometric";
import { HeroEffect } from "@/components/ui/hero-effect";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { IndustriaRichSections } from "@/components/sections/industria-rich-sections";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getIndustriaWebPageSchema, INDUSTRIAS_SCHEMA_DATA } from "@/lib/schema/industria";
import { getLocale } from "next-intl/server";
import { getIndustria, mapIndustria } from "@/lib/cms";
import type { Locale } from "@/lib/cms";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const raw = await getIndustria("manufactura");
  const ind = raw ? mapIndustria(raw as Record<string, unknown>, locale) : null;

  return {
    title: ind?.seoTitle || "Industria 4.0 y Manufactura Inteligente",
    description:
      ind?.seoDescription ||
      "Soluciones de IoT, mantenimiento predictivo y calidad automatizada para la industria manufacturera.",
    alternates: {
      canonical: "https://www.nivelics.com/industrias/manufactura",
      languages: {
        es: "https://www.nivelics.com/industrias/manufactura",
        en: "https://www.nivelics.com/en/industries/manufacturing",
        "x-default": "https://www.nivelics.com/industrias/manufactura",
      },
    },
  };
}

// LEGACY FALLBACK
const CHALLENGES = [
  {
    icon: "cpu",
    title: "IoT y sensores",
    description:
      "Conectar miles de sensores en planta para recolectar datos en tiempo real y alimentar dashboards de producción.",
  },
  {
    icon: "wrench",
    title: "Mantenimiento predictivo",
    description:
      "Anticipar fallas en equipos antes de que ocurran para reducir tiempos de inactividad y costos de reparación no planificada.",
  },
  {
    icon: "scan-line",
    title: "Calidad automatizada",
    description:
      "Detectar defectos de producción en línea con visión por computadora y controles de calidad automatizados en tiempo real.",
  },
];

// LEGACY FALLBACK
const SOLUTIONS = [
  {
    badge: "ia" as const,
    title: "IA para Manufactura",
    description:
      "Modelos de mantenimiento predictivo, visión por computadora para control de calidad y optimización de procesos con ML.",
  },
  {
    badge: "cloud" as const,
    title: "Cloud para Manufactura",
    description:
      "Plataformas IoT en la nube, digital twins, procesamiento de datos de sensores y dashboards de producción en tiempo real.",
  },
  {
    badge: "staffing" as const,
    title: "Staffing para Manufactura",
    description:
      "Ingenieros con experiencia en IoT industrial, integraciones SCADA/MES y desarrollo de plataformas de Industria 4.0.",
  },
];

export default async function ManufacturaPage() {
  const locale = (await getLocale()) as Locale;
  const raw = await getIndustria("manufactura");
  const ind = raw ? mapIndustria(raw as Record<string, unknown>, locale) : null;

  const challenges = ind?.painPoints?.length ? ind.painPoints : CHALLENGES;
  const solutions = ind?.solutions?.length ? ind.solutions : SOLUTIONS;

  const serviceSchema = getServiceSchema({
    name: ind?.name || "Industria 4.0 y Manufactura Inteligente",
    description:
      ind?.heroSubtitle ||
      "IA, cloud y staffing para empresas manufactureras que necesitan IoT, mantenimiento predictivo y calidad automatizada.",
    url: "/industrias/manufactura",
    serviceType: "Manufacturing Technology Consulting",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Industrias", url: "/industrias" },
    { name: ind?.name || "Manufactura", url: "/industrias/manufactura" },
  ]);
  const webPageSchema = getIndustriaWebPageSchema(INDUSTRIAS_SCHEMA_DATA["manufactura"]);

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
            {ind?.heroTitle || "Industria 4.0: IA y Cloud para Manufactura"}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            {ind?.heroSubtitle ||
              "Conectamos sensores, predecimos fallas y automatizamos calidad para llevar tu planta al siguiente nivel."}
          </p>
        </div>
      </section>

      {/* Challenges */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Los 3 retos tech de Manufactura</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map((ch) => {
              const iconName = "icon" in ch && typeof ch.icon === "string" ? ch.icon : undefined;
              return (
                <div key={ch.title} className="glass glow-hover rounded-xl p-6">
                  <div className="mb-4">
                    <GeoIconBox name={iconName} size={22} color="amber" />
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
          <h2 className="text-3xl font-bold text-text-100">Cómo el marco I+C+S resuelve esto</h2>
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
        <CTABanner title={ind?.ctaText || "Hablemos de tu proyecto en Manufactura"} />
      )}
    </PageWrapper>
  );
}
