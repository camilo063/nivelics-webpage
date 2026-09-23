import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { ServiceBadge, CTABanner, JsonLd } from "@/components/shared";
import { getCreativeWorkSchema } from "@/lib/schema/creative-work";
import { absoluteUrl } from "@/lib/schema/webpage";
import { getLocale, setRequestLocale } from "next-intl/server";
import { localizedUrls } from "@/lib/seo/page-meta";
import { getAllUiLabels } from "@/lib/cms/ui-labels";
import { getAllCasosExito, mapCasoExito, uiLabel } from "@/lib/cms";
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
  const isEn = locale === "en";

  const { es: esUrl, en: enUrl } = localizedUrls("/casos-de-exito");
  const canonical = isEn ? enUrl : esUrl;
  const ogImage = "https://www.nivelics.com/og/nivelics-home.jpg";

  const title = isEn
    ? "Success Stories: Televisa, Grupo Bolívar, Two Maids"
    : "Casos de éxito: Televisa, Grupo Bolívar, Two Maids";
  const description = isEn
    ? "See how we have helped B2B companies transform digitally: media, insurance, retail and consumer goods, in Latin America and the United States."
    : "Conoce cómo hemos ayudado a empresas B2B a transformarse digitalmente: medios, seguros, retail y consumo masivo, en Latinoamérica y Estados Unidos.";

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: esUrl,
        en: enUrl,
        "x-default": esUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: isEn ? "en_US" : "es_CO",
      alternateLocale: isEn ? ["es_CO"] : ["en_US"],
      siteName: "Nivelics",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// LEGACY FALLBACK
// Son los siete clientes reales, los mismos que sirve la BD. Antes había aquí cinco casos
// inventados («Migración Cloud para Grupo Financiero», «42% ahorro en 6 meses»…) que solo
// aparecían si la BD no respondía: contenido fabricado y además solo en español.
const CASES = [
  {
    title: "Televisa / N+: Plataforma de Noticias Digitales",
    titleEn: "Televisa / N+: Digital News Platform",
    badge: "dev" as const,
    industry: "Medios / Streaming",
    industryEn: "Media / Streaming",
    challenge:
      "Televisa necesitaba una plataforma digital de noticias tipo streaming para el mercado hispanohablante, capaz de manejar picos masivos de tráfico durante eventos noticiosos en vivo.",
    challengeEn:
      "Televisa needed a streaming-type digital news platform for the Spanish-speaking market, capable of handling massive traffic spikes during live news events.",
    solution:
      "Diseñamos una arquitectura cloud escalable en AWS con CDN global, equipo de ingeniería Nivelics integrado al equipo Televisa, y pipelines de CI/CD para deploys múltiples al día.",
    solutionEn:
      "We designed a scalable cloud architecture on AWS with global CDN, integrated Nivelics engineering team with Televisa's team, and CI/CD pipelines for multiple daily deploys.",
    results: [
      "Plataforma escalable a millones de usuarios",
      "preparada para los picos de tráfico de eventos noticiosos en vivo",
      "y 40% más rápido en time-to-market",
    ],
    resultsEn: [
      "A platform that scales to millions of users",
      "built for the traffic peaks of live news events",
      "and 40% faster time-to-market",
    ],
  },
  {
    title: "Grupo Bolívar: Transformación Digital Multi-línea",
    titleEn: "Grupo Bolívar: Multi-line Digital Transformation",
    badge: "ia" as const,
    industry: "Seguros / Salud / E-commerce",
    industryEn: "Insurance / Health / E-commerce",
    challenge:
      "Grupo Bolívar necesitaba modernizar múltiples líneas de negocio simultáneamente, integrando canales digitales y optimizando procesos internos.",
    challengeEn:
      "Grupo Bolívar needed to modernize multiple business lines simultaneously, integrating digital channels and optimizing internal processes.",
    solution:
      "Rediseño y desarrollo de productos digitales para seguros, salud y e-commerce con equipo dedicado y metodología ágil.",
    solutionEn:
      "Redesigned and developed digital products for insurance, healthcare and e-commerce with dedicated team and agile methodology.",
    results: [
      "3 productos digitales lanzados",
      "25% reducción de costos operativos",
      "85% adopción digital",
    ],
    resultsEn: [
      "3 digital products launched",
      "25% reduction in operational costs",
      "85% digital adoption",
    ],
  },
  {
    title: "Two Maids: Escalamiento de Equipo Tech en USA",
    titleEn: "Two Maids: Tech Team Scaling in the USA",
    badge: "staffing" as const,
    industry: "Servicios / Franquicias",
    industryEn: "Services / Franchises",
    challenge:
      "Two Maids necesitaba escalar su equipo de desarrollo rápidamente para construir una plataforma de gestión de franquicias sin los costos de contratación directa en USA.",
    challengeEn:
      "Two Maids needed to scale their development team quickly to build a franchise management platform without the costs of direct hiring in the USA.",
    solution:
      "Staff Augmentation con ingenieros senior colombianos integrados al equipo de Two Maids. Desarrollo de plataforma para +100 franquicias.",
    solutionEn:
      "Staff Augmentation with senior Colombian engineers integrated into Two Maids' team. Platform development for +100 franchises.",
    results: [
      "Equipo escalado en menos de 10 días",
      "ingenieros senior integrados al equipo de Two Maids y una plataforma que gestiona más de 100 franquicias",
    ],
    resultsEn: [
      "Team scaled in under 10 days",
      "senior engineers embedded in the Two Maids team and a platform that manages more than 100 franchises",
    ],
  },
  {
    title: "AB InBev-Bavaria: Transformación Digital en Consumo Masivo",
    titleEn: "AB InBev-Bavaria: Digital Transformation in Mass Consumer Markets",
    badge: "dev" as const,
    industry: "Consumo Masivo",
    industryEn: "Consumer goods",
    challenge:
      "AB InBev-Bavaria necesitaba digitalizar procesos de distribución y ventas en la región centroamericana.",
    challengeEn:
      "AB InBev-Bavaria needed to digitize distribution and sales processes in the Central American region.",
    solution:
      "Desarrollo de soluciones digitales para optimizar la cadena de distribución y las operaciones de venta en campo.",
    solutionEn:
      "Development of digital solutions to optimize the distribution chain and field sales operations.",
    results: [
      "Procesos de distribución digitalizados con trazabilidad en tiempo real y eficiencia operativa mejorada",
    ],
    resultsEn: [
      "Digitized distribution processes with real-time traceability and improved operational efficiency",
    ],
  },
  {
    title: "Crónica: Modernización de Plataforma de Noticias",
    titleEn: "Case Study: News Platform Modernization",
    badge: "ia" as const,
    industry: "Medios",
    industryEn: "Media",
    challenge:
      "Crónica, uno de los medios más reconocidos de Argentina, necesitaba modernizar su plataforma digital para competir en la era del contenido personalizado.",
    challengeEn:
      "Crónica, one of Argentina's most recognized media outlets, needed to modernize its digital platform to compete in the era of personalized content.",
    solution:
      "Rediseño completo del portal de noticias con arquitectura moderna, personalización de contenido con IA y optimización de procesos editoriales.",
    solutionEn:
      "Complete redesign of the news portal with modern architecture, AI-powered content personalization and editorial process optimization.",
    results: [
      "Portal de alto tráfico modernizado",
      "personalización con IA implementada",
      "procesos editoriales 50% más eficientes",
    ],
    resultsEn: [
      "High-traffic portal modernized",
      "AI-powered personalization implemented",
      "editorial processes 50% more efficient",
    ],
  },
  {
    title: "Pulzo: Partnership Tecnológico en 2014",
    titleEn: "Pulzo: Technology Partnership 2014",
    badge: "dev" as const,
    industry: "Medios Digitales",
    industryEn: "Digital media",
    challenge:
      "Pulzo, medio digital líder en Colombia, necesitaba un partner tecnológico de confianza para escalar su plataforma y optimizar su operación digital.",
    challengeEn:
      "Pulzo, Colombia's leading digital media company, needed a trusted technology partner to scale their platform and optimize their digital operations.",
    solution:
      "Partnership tecnológico de largo plazo con Nivelics. Desarrollo y evolución continua de la plataforma editorial con foco en performance y escalabilidad.",
    solutionEn:
      "Long-term technology partnership with Nivelics. Ongoing development and evolution of the editorial platform with focus on performance and scalability.",
    results: [
      "Partnership de largo plazo (+10 años)",
      "plataforma escalable a millones de visitas",
      "evolución tecnológica continua",
    ],
    resultsEn: [
      "Long-term partnership (+10 years)",
      "scalable platform handling millions of visits",
      "continuous technological evolution",
    ],
  },
  {
    title: "Univision: Desarrollo Digital para Medios Hispanos",
    titleEn: "Univision: Digital Development for Hispanic Media",
    badge: "staffing" as const,
    industry: "Medios / Broadcasting",
    industryEn: "Media / Broadcasting",
    challenge:
      "Univision requería capacidad de desarrollo adicional para sus plataformas digitales dirigidas al mercado hispano en USA y México.",
    challengeEn:
      "Univision required additional development capacity for their digital platforms targeting the Hispanic market in the USA and Mexico.",
    solution:
      "Equipo de desarrollo Nivelics integrado para fortalecer las capacidades digitales de Univision con talento senior bilingüe.",
    solutionEn:
      "Nivelics development team integrated to strengthen Univision's digital capabilities with senior bilingual talent.",
    results: [
      "Equipo integrado exitosamente",
      "plataformas digitales mejoradas",
      "cobertura bilingüe total",
    ],
    resultsEn: [
      "Successfully integrated team",
      "improved digital platforms",
      "complete bilingual coverage",
    ],
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
  const isEn = locale === "en";
  const [rawCases, uiLabels] = await Promise.all([getAllCasosExito(), getAllUiLabels()]);
  const dbCases = rawCases.length
    ? rawCases.map((c) => mapCasoExito(c as Record<string, unknown>, locale))
    : null;

  const creativeWorks = getCreativeWorkSchema(
    [
      {
        name: "Televisa / N+",
        description: isEn
          ? "Digital news platform for the Spanish-speaking market."
          : "Plataforma de noticias digitales para el mercado hispanohablante.",
        url: "/casos-de-exito/televisa",
      },
      {
        name: "Grupo Bolívar",
        description: isEn
          ? "Multi-line digital transformation across insurance, health and e-commerce."
          : "Transformación digital multi-línea para seguros, salud y e-commerce.",
        url: "/casos-de-exito/grupo-bolivar",
      },
      {
        name: "Two Maids",
        description: isEn
          ? "Staff augmentation for a franchise management platform in the USA."
          : "Staff Augmentation para plataforma de gestión de franquicias en USA.",
        url: "/casos-de-exito/two-maids",
      },
      {
        name: "Crónica",
        description: isEn
          ? "News platform modernization with AI in Argentina."
          : "Modernización de plataforma de noticias con IA en Argentina.",
        url: "/casos-de-exito/cronica",
      },
      {
        name: "Pulzo",
        description: isEn
          ? "Long-term technology partnership with a Colombian digital outlet."
          : "Partnership tecnológico de largo plazo para medio digital colombiano.",
        url: "/casos-de-exito/pulzo",
      },
      {
        name: "Univision",
        description: isEn
          ? "Digital development for Hispanic media in the USA and Mexico."
          : "Desarrollo digital para medios hispanos en USA y México.",
        url: "/casos-de-exito/univision",
      },
      {
        name: "AB InBev-Bavaria",
        description: isEn
          ? "Digital transformation in distribution for consumer goods."
          : "Transformación digital en distribución para consumo masivo.",
        url: "/casos-de-exito/ab-inbev",
      },
    ],
    locale,
  );

  // ItemList de los casos: se arma con lo que realmente lista la página
  // (las filas del CMS); si la BD no responde, con los CreativeWork de arriba.
  const listItems = dbCases
    ? dbCases.map((c) => ({ name: c.clientName || c.title, url: `/casos-de-exito/${c.slug}` }))
    : [];
  const casosItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${absoluteUrl("/casos-de-exito", locale)}#casos`,
    name: uiLabel(uiLabels, "caso.list_title", locale),
    numberOfItems: listItems.length,
    itemListElement: listItems.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: absoluteUrl(c.url, locale),
    })),
  };

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorks) }}
      />
      {listItems.length > 0 && <JsonLd data={casosItemList} />}

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
              : CASES.map((raw) => ({
                  ...raw,
                  title: isEn ? raw.titleEn : raw.title,
                  industry: isEn ? raw.industryEn : raw.industry,
                  challenge: isEn ? raw.challengeEn : raw.challenge,
                  solution: isEn ? raw.solutionEn : raw.solution,
                  results: isEn ? raw.resultsEn : raw.results,
                })).map((c) => (
                  <article key={c.title} className="glass glow-hover rounded-xl p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <ServiceBadge variant={c.badge}>
                        {c.badge === "ia"
                          ? isEn
                            ? "AI"
                            : "IA"
                          : c.badge === "dev"
                            ? isEn
                              ? "Development"
                              : "Desarrollo"
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
