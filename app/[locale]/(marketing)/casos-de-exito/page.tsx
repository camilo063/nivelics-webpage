import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { ServiceBadge, CTABanner } from "@/components/shared";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getCreativeWorkSchema } from "@/lib/schema/creative-work";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getAllUiLabels } from "@/lib/cms/ui-labels";
import { getAllCasosExito, mapCasoExito, uiLabel } from "@/lib/cms";
import type { Locale } from "@/lib/cms";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Casos de Éxito | Televisa, Grupo Bolívar, Two Maids",
  description:
    "Conoce cómo hemos ayudado a empresas B2B a transformarse digitalmente con resultados medibles.",
  alternates: {
    canonical: "https://www.nivelics.com/casos-de-exito",
    languages: {
      es: "https://www.nivelics.com/casos-de-exito",
      en: "https://www.nivelics.com/en/case-studies",
      "x-default": "https://www.nivelics.com/casos-de-exito",
    },
  },
};

// LEGACY FALLBACK
const CASES = [
  {
    title: "Migración Cloud para Grupo Financiero",
    badge: "cloud" as const,
    industry: "Servicios Financieros",
    challenge: "Infraestructura on-premise con 99.2% uptime y costos crecientes.",
    solution: "Migración a AWS multi-AZ con arquitectura serverless y CI/CD automatizado.",
    results: ["99.95% uptime", "35% reducción de costos", "Deploy time: 45min → 8min"],
  },
  {
    title: "Chatbot IA para Aseguradora Líder",
    badge: "ia" as const,
    industry: "Seguros",
    challenge: "Call center saturado con tiempos de espera de +15 minutos.",
    solution: "Asistente virtual con LLM fine-tuned en pólizas y procesos de reclamaciones.",
    results: ["60% reducción en llamadas", "NPS +22 puntos", "ROI en 4 meses"],
  },
  {
    title: "Equipo Dedicado para Fintech",
    badge: "staffing" as const,
    industry: "Fintech",
    challenge: "Necesidad de escalar 3x el equipo de ingeniería en 30 días para nuevo lanzamiento.",
    solution: "8 ingenieros senior (React, Node.js, AWS) integrados con procesos Scrum existentes.",
    results: ["Lanzamiento on-time", "0 rotación en 12 meses", "Velocidad +40%"],
  },
  {
    title: "FinOps para Retailer Regional",
    badge: "finops" as const,
    industry: "Retail",
    challenge: "Factura cloud creciendo 20% MoM sin visibilidad del gasto por equipo.",
    solution: "Implementación completa de FinOps: tagging, dashboards, rightsizing y governance.",
    results: ["42% ahorro en 6 meses", "100% visibilidad por equipo", "Cultura FinOps adoptada"],
  },
  {
    title: "Plataforma E-commerce B2B",
    badge: "dev" as const,
    industry: "Manufactura",
    challenge: "Procesos de pedido manuales con Excel y email generando errores y retrasos.",
    solution: "Portal B2B con catálogo, pricing dinámico, integración SAP y app móvil.",
    results: ["70% automatización de pedidos", "Error rate: 12% → 0.5%", "Adopción 95% en 3 meses"],
  },
];

export default async function CasosDeExitoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const rawCases = await getAllCasosExito();
  const uiLabels = await getAllUiLabels();
  const dbCases = rawCases.length
    ? rawCases.map((c) => mapCasoExito(c as Record<string, unknown>, locale))
    : null;

  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Casos de Éxito", url: "/casos-de-exito" },
  ]);
  const creativeWorks = getCreativeWorkSchema([
    {
      name: "Televisa / N+",
      description: "Plataforma de noticias digitales para el mercado hispanohablante.",
      url: "/casos-de-exito/televisa",
    },
    {
      name: "Grupo Bolívar",
      description: "Transformación digital multi-línea para seguros, salud y e-commerce.",
      url: "/casos-de-exito/grupo-bolivar",
    },
    {
      name: "Two Maids",
      description: "Staff Augmentation para plataforma de gestión de franquicias en USA.",
      url: "/casos-de-exito/two-maids",
    },
    {
      name: "Crónica",
      description: "Modernización de plataforma de noticias con IA en Argentina.",
      url: "/casos-de-exito/cronica",
    },
    {
      name: "Pulzo",
      description: "Partnership tecnológico de largo plazo para medio digital colombiano.",
      url: "/casos-de-exito/pulzo",
    },
    {
      name: "Univision",
      description: "Desarrollo digital para medios hispanos en USA y México.",
      url: "/casos-de-exito/univision",
    },
    {
      name: "AB InBev-Bavaria",
      description: "Transformación digital en distribución para consumo masivo.",
      url: "/casos-de-exito/ab-inbev",
    },
  ]);

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorks) }}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h1 className="text-4xl font-bold text-text-100 md:text-5xl">
            {uiLabel(uiLabels, "caso.list_title", locale)}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-text-70">
            {uiLabel(uiLabels, "caso.list_subtitle", locale)}
          </p>
        </div>
      </section>

      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <div className="space-y-8">
            {dbCases
              ? dbCases.map((c) => (
                  <article key={c.id} className="glass glow-hover rounded-xl p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      {c.clientSector && (
                        <span className="text-xs text-text-40">{c.clientSector}</span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-text-100">{c.title}</h2>

                    <div className="mt-6 grid gap-6 md:grid-cols-3">
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-40">
                          {uiLabel(uiLabels, "caso.list_challenge_label", locale)}
                        </h3>
                        <p className="mt-2 text-sm text-text-70">{c.challenge}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-40">
                          {uiLabel(uiLabels, "caso.list_solution_label", locale)}
                        </h3>
                        <p className="mt-2 text-sm text-text-70">{c.solution}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-40">
                          {uiLabel(uiLabels, "caso.list_results_label", locale)}
                        </h3>
                        <ul className="mt-2 space-y-1">
                          {c.metrics.map((m) => (
                            <li key={m.label} className="text-sm font-mono text-primary">
                              {m.value} {m.label}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                ))
              : CASES.map((c) => (
                  <article key={c.title} className="glass glow-hover rounded-xl p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <ServiceBadge variant={c.badge}>
                        {c.badge === "ia"
                          ? "IA"
                          : c.badge === "dev"
                            ? "Desarrollo"
                            : c.badge.charAt(0).toUpperCase() + c.badge.slice(1)}
                      </ServiceBadge>
                      <span className="text-xs text-text-40">{c.industry}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-text-100">{c.title}</h2>

                    <div className="mt-6 grid gap-6 md:grid-cols-3">
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-40">
                          {uiLabel(uiLabels, "caso.list_challenge_label", locale)}
                        </h3>
                        <p className="mt-2 text-sm text-text-70">{c.challenge}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-40">
                          {uiLabel(uiLabels, "caso.list_solution_label", locale)}
                        </h3>
                        <p className="mt-2 text-sm text-text-70">{c.solution}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-40">
                          {uiLabel(uiLabels, "caso.list_results_label", locale)}
                        </h3>
                        <ul className="mt-2 space-y-1">
                          {c.results.map((r) => (
                            <li key={r} className="text-sm font-mono text-primary">
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                ))}
          </div>
        </div>
      </section>

      <CTABanner
        title={uiLabel(uiLabels, "caso.list_cta_banner_title", locale)}
        description={uiLabel(uiLabels, "caso.cta_banner_description", locale)}
      />
    </PageWrapper>
  );
}
