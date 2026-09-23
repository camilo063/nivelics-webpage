import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { CTABanner } from "@/components/shared";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getHistoriaItems, mapHistoriaItem } from "@/lib/cms";
import type { Locale } from "@/lib/cms";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return buildPageMetadata({
    locale: isEn ? "en" : "es",
    href: "/nosotros/historia",
    title: isEn
      ? "The History of Nivelics | From Bogotá to the World"
      : "Historia de Nivelics | De Bogotá al mundo",
    description: isEn
      ? "The history of Nivelics: from a Bogotá startup to a B2B digital transformation leader in LATAM and the USA."
      : "La historia de Nivelics: de startup bogotana a referente de transformación digital B2B en LATAM y USA.",
  });
}

const LABELS = {
  es: {
    h1: "Nuestra Historia",
    intro: "Más de una década de evolución constante, siempre al ritmo de la tecnología.",
    timeline: "Timeline",
  },
  en: {
    h1: "Our History",
    intro: "More than a decade of constant evolution, always at the pace of technology.",
    timeline: "Timeline",
  },
} as const;

// LEGACY FALLBACK (ES)
const TIMELINE_ES = [
  {
    year: "2012",
    title: "Fundación",
    description: "Nivelics nace en Bogotá como consultora de desarrollo de software.",
  },
  {
    year: "2014",
    title: "Primeros grandes clientes",
    description: "Contratos con empresas del sector financiero y asegurador colombiano.",
  },
  {
    year: "2016",
    title: "Pivot a Cloud",
    description: "Incorporamos servicios de arquitectura e infraestructura cloud (AWS, Azure).",
  },
  {
    year: "2018",
    title: "Staff Augmentation",
    description: "Lanzamos nuestra línea de staffing premium con ingenieros dedicados por cliente.",
  },
  {
    year: "2019",
    title: "Expansión a México",
    description: "Proyecto con Televisa/N+. Primer cliente fuera de Colombia.",
  },
  {
    year: "2020",
    title: "Expansión Regional",
    description:
      "Clientes en México, Perú, Chile y Centroamérica. El equipo crece con la operación regional.",
  },
  {
    year: "2021",
    title: "Grupo Bolívar & GPTW",
    description: "Proyecto Grupo Bolívar. Certificación Great Place to Work Colombia.",
  },
  {
    year: "2022",
    title: "Oficina Miami",
    description: "Apertura de sede en Miami (Nivelics LLC) para mercado US-LATAM.",
  },
  {
    year: "2023",
    title: "Práctica de IA",
    description:
      "Inicio de práctica de Inteligencia Artificial. Primeros proyectos de IA generativa.",
  },
  {
    year: "2024",
    title: "IA & FinOps",
    description: "Lanzamiento formal de prácticas de IA y FinOps. Marco estratégico I+C+S.",
  },
  {
    year: "2025",
    title: "Argentina & Consolidación",
    description: "Expansión a Argentina (Crónica), primer cliente del Cono Sur.",
  },
  {
    year: "2026",
    title: "Hoy",
    description: "Presencia en 7+ países y consolidación del marco estratégico I+C+S.",
  },
];

// LEGACY FALLBACK (EN) — espejo exacto de TIMELINE_ES.
const TIMELINE_EN = [
  {
    year: "2012",
    title: "Founding",
    description: "Nivelics is born in Bogotá as a software development consultancy.",
  },
  {
    year: "2014",
    title: "First large clients",
    description: "Contracts with companies in the Colombian banking and insurance sector.",
  },
  {
    year: "2016",
    title: "Pivot to Cloud",
    description: "We add cloud architecture and infrastructure services (AWS, Azure).",
  },
  {
    year: "2018",
    title: "Staff Augmentation",
    description:
      "We launched our premium staffing line with engineers dedicated to a single client.",
  },
  {
    year: "2019",
    title: "Expansion into Mexico",
    description: "Project with Televisa/N+. Our first client outside Colombia.",
  },
  {
    year: "2020",
    title: "Regional Expansion",
    description:
      "Clients in Mexico, Peru, Chile and Central America. The team grows with the regional operation.",
  },
  {
    year: "2021",
    title: "Grupo Bolívar & GPTW",
    description: "Grupo Bolívar project. Great Place to Work Colombia certification.",
  },
  {
    year: "2022",
    title: "Miami Office",
    description: "We open our Miami office (Nivelics LLC) for the US-LATAM market.",
  },
  {
    year: "2023",
    title: "AI Practice",
    description: "Our Artificial Intelligence practice begins. First generative AI projects.",
  },
  {
    year: "2024",
    title: "AI & FinOps",
    description: "Formal launch of the AI and FinOps practices. I+C+S strategic framework.",
  },
  {
    year: "2025",
    title: "Argentina & Consolidation",
    description: "Expansion to Argentina (Crónica), our first Southern Cone client.",
  },
  {
    year: "2026",
    title: "Today",
    description: "Presence in 7+ countries and consolidation of the I+C+S strategic framework.",
  },
];

export default async function HistoriaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const dbItems = await getHistoriaItems();
  const mappedItems = dbItems.length
    ? dbItems.map((item) => mapHistoriaItem(item as Record<string, unknown>, locale))
    : null;

  const isEn = locale === "en";
  const t = LABELS[isEn ? "en" : "es"];

  // Use DB items or fall back to the hardcoded timeline of the served language
  const timelineToShow =
    mappedItems && mappedItems.length > 0
      ? mappedItems.map((item) => ({
          year: String(item.year),
          title: item.title,
          description: item.description,
        }))
      : isEn
        ? TIMELINE_EN
        : TIMELINE_ES;

  return (
    <PageWrapper>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h1 className="text-4xl font-bold text-text-100 md:text-5xl">{t.h1}</h1>
          <p className="mt-4 max-w-2xl text-lg text-text-70">{t.intro}</p>

          <h2 className="mt-16 text-3xl font-bold text-text-100">{t.timeline}</h2>
          <div className="mt-8 relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border md:left-1/2" />

            <div className="space-y-12">
              {timelineToShow.map((item, i) => (
                <div
                  key={item.year}
                  className={`relative flex flex-col md:flex-row ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-start gap-8`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-primary ring-4 ring-bg-base" />

                  {/* Content */}
                  <div
                    className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}
                  >
                    <span className="font-mono text-sm font-bold text-primary">{item.year}</span>
                    <h3 className="mt-1 text-xl font-semibold text-text-100">{item.title}</h3>
                    <p className="mt-2 text-sm text-text-70">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </PageWrapper>
  );
}
