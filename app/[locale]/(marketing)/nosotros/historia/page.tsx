import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { CTABanner } from "@/components/shared";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getHistoriaItems, mapHistoriaItem } from "@/lib/cms";
import type { Locale } from "@/lib/cms";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Historia de Nivelics | De Bogotá al mundo",
  description:
    "La historia de Nivelics: de startup bogotana a referente de transformación digital B2B en LATAM y USA.",
  alternates: { canonical: "https://www.nivelics.com/nosotros/historia" },
};

// LEGACY FALLBACK
const TIMELINE = [
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
    description: "Lanzamos nuestra línea de staffing premium con +20 ingenieros dedicados.",
  },
  {
    year: "2019",
    title: "Expansión a México",
    description: "Proyecto con Televisa/N+. Primer cliente fuera de Colombia.",
  },
  {
    year: "2020",
    title: "Expansión Regional",
    description: "Clientes en México, Perú, Chile y Centroamérica. Equipo supera las 40 personas.",
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
    description: "Expansión a Argentina (Crónica). +200 proyectos entregados acumulados.",
  },
  {
    year: "2026",
    title: "Hoy",
    description: "+50 ingenieros, presencia en 8 países, consolidación del marco I+C+S.",
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

  // Use DB items or fall back to hardcoded TIMELINE
  const timelineToShow =
    mappedItems && mappedItems.length > 0
      ? mappedItems.map((item) => ({
          year: String(item.year),
          title: item.title,
          description: item.description,
        }))
      : TIMELINE;

  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Nosotros", url: "/nosotros" },
    { name: "Historia", url: "/nosotros/historia" },
  ]);

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h1 className="text-4xl font-bold text-text-100 md:text-5xl">Nuestra Historia</h1>
          <p className="mt-4 max-w-2xl text-lg text-text-70">
            Más de una década de evolución constante, siempre al ritmo de la tecnología.
          </p>

          <h2 className="mt-16 text-3xl font-bold text-text-100">Timeline</h2>
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
