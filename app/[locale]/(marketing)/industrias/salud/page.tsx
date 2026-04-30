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
  const raw = await getIndustria("salud");
  const ind = raw ? mapIndustria(raw as Record<string, unknown>, locale) : null;

  return {
    title: ind?.seoTitle || "Transformación Digital en Salud",
    description:
      ind?.seoDescription ||
      "Soluciones de interoperabilidad, telemedicina y gestión de datos clínicos para el sector salud.",
    alternates: {
      canonical: "https://www.nivelics.com/industrias/salud",
      languages: {
        es: "https://www.nivelics.com/industrias/salud",
        en: "https://www.nivelics.com/en/industries/healthcare",
        "x-default": "https://www.nivelics.com/industrias/salud",
      },
    },
  };
}

// LEGACY FALLBACK
const CHALLENGES = [
  {
    icon: "unplug",
    title: "Interoperabilidad de sistemas",
    description:
      "Sistemas legacy aislados que no se comunican entre sí, generando duplicación de datos y errores en la atención al paciente.",
  },
  {
    icon: "video",
    title: "Telemedicina",
    description:
      "Necesidad de plataformas de consulta remota seguras, confiables y que cumplan con regulaciones de privacidad de datos de salud.",
  },
  {
    icon: "database",
    title: "Gestión de datos clínicos",
    description:
      "Volúmenes masivos de datos clínicos que requieren almacenamiento seguro, acceso rápido y analítica para mejorar diagnósticos.",
  },
];

// LEGACY FALLBACK
const SOLUTIONS = [
  {
    badge: "ia" as const,
    title: "IA para Salud",
    description:
      "Modelos predictivos para diagnóstico temprano, NLP para historias clínicas y asistentes virtuales para triaje automatizado.",
  },
  {
    badge: "cloud" as const,
    title: "Cloud para Salud",
    description:
      "Infraestructura HIPAA-compliant con alta disponibilidad, respaldo de datos clínicos y arquitecturas de integración HL7/FHIR.",
  },
  {
    badge: "staffing" as const,
    title: "Staffing para Salud",
    description:
      "Ingenieros con experiencia en healthtech, integraciones de sistemas clínicos y regulaciones de datos de salud.",
  },
];

export default async function SaludPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const raw = await getIndustria("salud");
  const ind = raw ? mapIndustria(raw as Record<string, unknown>, locale) : null;

  const challenges = ind?.painPoints?.length ? ind.painPoints : CHALLENGES;
  const solutions = ind?.solutions?.length ? ind.solutions : SOLUTIONS;

  const serviceSchema = getServiceSchema({
    name: ind?.name || "Tecnología para el Sector Salud",
    description:
      ind?.heroSubtitle ||
      "IA, cloud y staffing para empresas de salud que necesitan interoperabilidad, telemedicina y gestión de datos clínicos.",
    url: "/industrias/salud",
    serviceType: "Healthcare Technology Consulting",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Industrias", url: "/industrias" },
    { name: ind?.name || "Salud", url: "/industrias/salud" },
  ]);
  const webPageSchema = getIndustriaWebPageSchema(INDUSTRIAS_SCHEMA_DATA["salud"]);

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
            {ind?.heroTitle || "Tecnología para el Sector Salud"}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            {ind?.heroSubtitle ||
              "Conectamos sistemas, habilitamos telemedicina y transformamos datos clínicos en mejores resultados para pacientes."}
          </p>
        </div>
      </section>

      {/* Challenges */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Los 3 retos tech de Salud</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map((ch) => {
              const iconName = "icon" in ch && typeof ch.icon === "string" ? ch.icon : undefined;
              return (
                <div key={ch.title} className="glass glow-hover rounded-xl p-6">
                  <div className="mb-4">
                    <GeoIconBox name={iconName} size={22} color="red" />
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
      {!ind?.ctaTitle && <CTABanner title={ind?.ctaText || "Hablemos de tu proyecto en Salud"} />}
    </PageWrapper>
  );
}
