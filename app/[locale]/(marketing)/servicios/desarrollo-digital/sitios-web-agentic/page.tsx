// CMS-connected: 2026-05-07 — benefits, processSteps and CTAs read from DB with hardcoded fallbacks
import type { Metadata } from "next";
import Link from "next/link";
import { Search, Bot, Brain, Check, ChevronsRight } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { GeoIconBox } from "@/lib/icons/geometric";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { StickyMobileCta } from "@/components/ui/sticky-mobile-cta";
import { ComparisonTable } from "@/components/shared/comparison-table";
import {
  CmsServicioBenefits,
  CmsServicioProcess,
  resolveServicioCtas,
} from "@/components/sections/cms-servicio-sections";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getFAQSchema } from "@/lib/schema/faq";
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
  const cms = await getServicioData("sitios-web-agentic", locale);

  return buildPageMetadata({
    locale,
    href: "/servicios/desarrollo-digital/sitios-web-agentic",
    title:
      cms?.seoTitle ||
      (isEn
        ? "Agentic-First Websites | AI-Ready SEO + LLM Indexing"
        : "Sitios Web Agentic-First | SEO Técnico + IA-Ready"),
    description:
      cms?.seoDescription ||
      (isEn
        ? "We build websites navigable by AI agents and LLMs. Multilingual, complete Schema.org, llms.txt, Core Web Vitals ≥95. Indexed by Google SGE, ChatGPT, Claude and Perplexity."
        : "Construimos sitios web navegables por IA, agentes y LLMs. Multi-idioma, Schema.org completo, llms.txt, Core Web Vitals ≥95. Indexados por Google SGE, ChatGPT, Claude y Perplexity."),
  });
}

/* ------------------------------------------------------------------ */
/*  Bilingual data                                                     */
/* ------------------------------------------------------------------ */

const PAIN_CARDS_ES = [
  {
    icon: "search",
    title: "Google ya no muestra solo links",
    description:
      "AI Overviews responden directamente en los resultados de búsqueda. Si tu sitio no tiene datos estructurados y HTML semántico, Google no te cita — cita a tu competencia.",
  },
  {
    icon: "bot",
    title: "Los agentes IA ya toman decisiones",
    description:
      "ChatGPT Operator, Claude Computer Use y otros agentes navegan sitios web para completar tareas. Si tu sitio no es crawleable por máquinas, esos agentes no pueden interactuar con tu negocio.",
  },
  {
    icon: "brain",
    title: "ChatGPT y Claude recomiendan empresas",
    description:
      'Cuando alguien pregunta "¿quién desarrolla apps en Colombia?", los LLMs recomiendan empresas cuyo sitio entienden bien. Schema.org, llms.txt y HTML semántico determinan si apareces o no.',
  },
];

const PAIN_CARDS_EN = [
  {
    icon: "search",
    title: "Google no longer shows just links",
    description:
      "Google's AI Overviews answer questions directly in search results. If your site doesn't have correct Schema.org, readable text content and semantic structure, you don't appear in those answers. Organic traffic goes to whoever built correctly.",
  },
  {
    icon: "bot",
    title: "AI agents are already making decisions",
    description:
      "Tools like ChatGPT Operator, Claude Computer Use and Perplexity browse websites autonomously to compare services, extract prices and make recommendations. If your site isn't navigable by agents, you don't exist in that decision layer.",
  },
  {
    icon: "brain",
    title: "ChatGPT and Claude recommend companies",
    description:
      'When someone asks an LLM "who does Staff Augmentation in Colombia?" or "best FinOps company in LATAM", the LLM responds with companies it indexed correctly. Appearing in those answers requires a site built with this standard.',
  },
];

const CAPABILITIES_ES: ReadonlyArray<{
  icon: string;
  title: string;
  description: string;
  tech?: string;
}> = [
  {
    icon: "globe",
    title: "Multi-idioma nativo",
    description:
      "Arquitectura i18n con español en la raíz e inglés en /en/. Cada página tiene su equivalente traducido con hreflang verificado automáticamente.",
    tech: "next-intl + hreflang",
  },
  {
    icon: "link-icon",
    title: "URLs semánticas",
    description:
      "Estructura de URLs definida antes de escribir una sola línea de código. Jerarquía clara: /servicios/desarrollo-digital/plataformas-web.",
    tech: "App Router",
  },
  {
    icon: "zap",
    title: "Core Web Vitals ≥95",
    description:
      "Performance diseñada desde la arquitectura, no parcheada después. Server Components, lazy loading estratégico y zero layout shift.",
    tech: "Next.js RSC",
  },
  {
    icon: "code2",
    title: "Schema.org completo",
    description:
      "JSON-LD server-side en cada página: Organization, Service, BreadcrumbList, FAQPage y más. No plugins genéricos — esquemas escritos a mano.",
    tech: "JSON-LD SSR",
  },
  {
    icon: "file-text",
    title: "llms.txt implementado",
    description:
      "Archivo en la raíz del dominio que indica a los LLMs qué hace tu empresa, qué servicios ofreces y cómo contactarte. Bilingüe.",
    tech: "llms.txt spec",
  },
  {
    icon: "shield",
    title: "robots.txt optimizado",
    description:
      "Configuración que permite el crawl de buscadores y agentes IA, bloquea rutas internas y apunta al sitemap XML correcto.",
    tech: "robots.txt + sitemap",
  },
  {
    icon: "menu",
    title: "Mega menú semántico",
    description:
      "Navegación con <nav>, roles ARIA y estructura jerárquica que los crawlers y agentes entienden sin ejecutar JavaScript.",
    tech: "SSR + ARIA",
  },
  {
    icon: "chevrons-right",
    title: "Breadcrumbs en todas las páginas",
    description:
      "BreadcrumbList con JSON-LD renderizado server-side. Google los muestra directamente en los resultados de búsqueda.",
    tech: "BreadcrumbList SSR",
  },
  {
    icon: "layers",
    title: "HTML semántico",
    description:
      "Uso correcto de <main>, <article>, <section>, <header>, <footer>, headings jerárquicos y landmarks ARIA en todo el sitio.",
    tech: "WAI-ARIA + HTML5",
  },
];

const CAPABILITIES_EN: ReadonlyArray<{
  icon: string;
  title: string;
  description: string;
  tech?: string;
}> = [
  {
    icon: "globe",
    title: "Technical multi-language (i18n)",
    description:
      "Architecture from first commit, semantic routes per language, hreflang, x-default, og:locale.",
  },
  {
    icon: "link-icon",
    title: "URL architecture without errors",
    description: "No 404s, documented 301 redirects, canonical tags, no duplicate content.",
  },
  {
    icon: "zap",
    title: "Performance that Google rewards",
    description: "LCP < 2s, CLS = 0, INP < 150ms, WebP/AVIF, hosted fonts.",
  },
  {
    icon: "code2",
    title: "Structured data for machines",
    description: "JSON-LD server-side, Organization, Service, BreadcrumbList, FAQPage.",
  },
  {
    icon: "file-text",
    title: "The robots.txt of LLMs",
    description: "llms.txt standard, bilingual, with ES/EN URL pairs.",
  },
  {
    icon: "shield",
    title: "Granular access for AI bots",
    description: "robots.txt configured for GPTBot, Claude-Web, PerplexityBot etc.",
  },
  {
    icon: "menu",
    title: "Navigation that agents read",
    description: "aria-labels, data-attributes, SiteNavigationElement Schema.org.",
  },
  {
    icon: "chevrons-right",
    title: "Breadcrumbs for humans and crawlers",
    description: "BreadcrumbList JSON-LD, translated labels.",
  },
  {
    icon: "layers",
    title: "Strict semantic HTML",
    description: "H1\u2192H2\u2192H3 hierarchy, one H1 per page, content in text not images.",
  },
];

const PROCESS_PHASES_ES = [
  {
    phase: "01",
    title: "Arquitectura",
    weeks: "Semana 1-2",
    description:
      "Definición de URLs, estructura de contenido, esquemas JSON-LD, estrategia i18n y wireframes de navegación.",
  },
  {
    phase: "02",
    title: "Infraestructura",
    weeks: "Semana 2-4",
    description:
      "Setup de Next.js, CI/CD, hosting edge, configuración de robots.txt, sitemap, llms.txt y analytics.",
  },
  {
    phase: "03",
    title: "Páginas",
    weeks: "Semana 3-6",
    description:
      "Desarrollo de cada página con Server Components, Schema.org, hreflang y contenido bilingüe.",
  },
  {
    phase: "04",
    title: "Performance",
    weeks: "Semana 5-7",
    description:
      "Optimización de Core Web Vitals, lazy loading, font subsetting, image optimization y bundle analysis.",
  },
  {
    phase: "05",
    title: "Auditoría",
    weeks: "Semana 6-8",
    description:
      "Script automático que valida Schema.org, hreflang, canonical tags, sitemap, llms.txt y PageSpeed en cada deploy.",
  },
];

const PROCESS_PHASES_EN = [
  {
    phase: "01",
    title: "Architecture",
    weeks: "Week 1-2",
    description:
      "URL map, i18n strategy, Schema.org plan, performance budget and tech stack selection.",
  },
  {
    phase: "02",
    title: "Technical Setup",
    weeks: "Week 2-4",
    description:
      "Project scaffold, i18n routing, JSON-LD generators, llms.txt, robots.txt, sitemap config.",
  },
  {
    phase: "03",
    title: "Pages",
    weeks: "Week 3-6",
    description: "Component-driven page development, semantic HTML, breadcrumbs, CMS integration.",
  },
  {
    phase: "04",
    title: "Performance",
    weeks: "Week 5-7",
    description: "Core Web Vitals optimization, image pipeline, font strategy, bundle analysis.",
  },
  {
    phase: "05",
    title: "Audit & Launch",
    weeks: "Week 6-8",
    description:
      "Automated technical audit, cross-browser testing, staging review, production deploy.",
  },
];

const FAQ_ITEMS_ES = [
  {
    question: "¿Qué es un sitio web agentic-first?",
    answer:
      "Es un sitio web diseñado desde su arquitectura para ser entendido tanto por humanos como por agentes de inteligencia artificial (ChatGPT, Claude, Google AI Overviews, entre otros). Esto incluye HTML semántico, datos estructurados con Schema.org, archivo llms.txt, URLs jerárquicas y contenido bilingüe con hreflang verificado.",
  },
  {
    question: "¿Mi sitio actual puede convertirse en agentic-first?",
    answer:
      "Depende de la plataforma. Si tu sitio está en WordPress con muchos plugins, generalmente es más eficiente reconstruirlo con una arquitectura moderna que intentar parchar lo existente. Hacemos un diagnóstico gratuito para evaluar tu caso específico.",
  },
  {
    question: "¿Cuánto tiempo toma construir un sitio agentic-first?",
    answer:
      "Entre 6 y 8 semanas para un sitio corporativo completo con 20-50 páginas, dos idiomas, Schema.org en todas las páginas y auditoría automatizada. Sitios más grandes o con funcionalidades custom pueden tomar 10-12 semanas.",
  },
  {
    question: "¿Qué es llms.txt y por qué lo necesito?",
    answer:
      "Es un archivo de texto plano en la raíz de tu dominio (similar a robots.txt) que indica a los modelos de lenguaje qué hace tu empresa, qué servicios ofreces y cómo contactarte. Es un estándar emergente que mejora cómo los LLMs entienden y recomiendan tu negocio.",
  },
  {
    question: "¿Esto reemplaza el SEO tradicional?",
    answer:
      "No lo reemplaza, lo complementa. Un sitio agentic-first incluye todas las mejores prácticas de SEO técnico (Core Web Vitals, Schema.org, canonical tags, sitemap) y añade optimizaciones específicas para agentes IA y LLMs que el SEO tradicional no contempla.",
  },
  {
    question: "¿Qué pasa si no hago nada?",
    answer:
      "A medida que más usuarios interactúan con agentes IA en lugar de buscar directamente en Google, los sitios que no son legibles por máquinas pierden visibilidad gradualmente. No es una emergencia hoy, pero cada mes que pasa la brecha con competidores preparados se amplía.",
  },
];

const FAQ_ITEMS_EN = [
  {
    question: "What's the difference between an 'agentic-first' site and a site with good SEO?",
    answer:
      "Good SEO optimizes for Google's traditional crawlers. An agentic-first site goes further: it's also structured so AI agents (ChatGPT, Claude, Perplexity) can navigate, understand and recommend your content. This includes llms.txt, complete JSON-LD schemas, semantic HTML hierarchy and bilingual URL architecture that LLMs can parse natively.",
  },
  {
    question: "How long until my site appears in ChatGPT or Claude answers?",
    answer:
      "Once the site is live with all agentic standards, LLMs typically begin indexing and referencing the content within 2 to 6 weeks. The timeline depends on the LLM's crawl frequency and domain authority, but the correct technical foundation is what makes it possible in the first place.",
  },
  {
    question: "Can I update content without knowing code?",
    answer:
      "Yes. We integrate a headless CMS (like Sanity, Contentful or Strapi) so your team can edit text, images and metadata without touching code. The structured data, schemas and performance optimizations remain intact regardless of content changes.",
  },
  {
    question: "What happens with multi-language if I add new content?",
    answer:
      "The i18n architecture is built from day one. When you add a new page or blog post in one language, the system creates the corresponding route in the other language, generates the hreflang tags automatically, and updates the sitemap and llms.txt with both URL versions.",
  },
  {
    question: "How much does an agentic-first site cost?",
    answer:
      "Pricing depends on the number of pages, integrations and whether you need a CMS. A typical project with 15-30 pages, two languages, CMS and all agentic standards starts around USD $15,000-25,000. We provide a detailed quote after a free discovery call.",
  },
  {
    question: "Can you build it in English from the start for US markets?",
    answer:
      "Absolutely. While the architecture supports both ES and EN from the start, the primary language can be English with Spanish as secondary. We adapt the URL structure, hreflang tags and llms.txt to reflect the market priority you need.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default async function AgenticWebPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const cms = await getServicioData("sitios-web-agentic", locale);
  const { ctaPrimary, ctaSecondary } = resolveServicioCtas({
    primary: cms ? { text: cms.ctaPrimaryText, url: cms.ctaPrimaryUrl } : null,
    secondary: cms ? { text: cms.ctaSecondaryText, url: cms.ctaSecondaryUrl } : null,
    fallbackPrimary: {
      text: isEn ? "Schedule a free diagnosis" : "Agenda un diagnóstico gratuito",
      url: "/contacto",
    },
    fallbackSecondary: {
      text: isEn ? "See how we built this site" : "Ver cómo construimos este sitio",
      url: isEn ? "#caso" : "#lo-que-ves",
    },
  });

  const painCards = isEn ? PAIN_CARDS_EN : PAIN_CARDS_ES;
  const capabilities = isEn ? CAPABILITIES_EN : CAPABILITIES_ES;
  const processPhases = isEn ? PROCESS_PHASES_EN : PROCESS_PHASES_ES;
  const faqItems = isEn ? FAQ_ITEMS_EN : FAQ_ITEMS_ES;

  const serviceSchema = getServiceSchema({
    name: isEn ? "Agentic-First Web Development" : "Desarrollo de Sitios Web Agentic-First",
    description: isEn
      ? "We build websites navigable by AI agents and LLMs. Multilingual, complete Schema.org, llms.txt, Core Web Vitals ≥95. Indexed by Google SGE, ChatGPT, Claude and Perplexity."
      : "Sitios web optimizados para humanos y agentes IA. HTML semántico, Schema.org, llms.txt, multi-idioma y Core Web Vitals ≥95.",
    url: "/servicios/desarrollo-digital/sitios-web-agentic",
    serviceType: "Web Development",
  });

  const breadcrumb = getBreadcrumbSchema([
    { name: isEn ? "Home" : "Inicio", url: "/" },
    { name: isEn ? "Services" : "Servicios", url: "/servicios" },
    {
      name: isEn ? "Digital Development" : "Desarrollo Digital",
      url: "/servicios/desarrollo-digital",
    },
    {
      name: isEn ? "Agentic-First Websites" : "Sitios Web Agentic-First",
      url: "/servicios/desarrollo-digital/sitios-web-agentic",
    },
  ]);

  const faqSchema = getFAQSchema(faqItems);

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
      {/* ── JSON-LD Schemas ── */}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── SECTION 1: HERO ── */}
      {isEn ? (
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-dev/5 to-transparent" />
          <div className="relative mx-auto max-w-[1280px] px-6 md:px-20">
            <ServiceBadge variant="dev">Digital Development &middot; New</ServiceBadge>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
              {cms?.title || (
                <>
                  Websites that humans{" "}
                  <span className="bg-gradient-to-r from-dev to-primary bg-clip-text text-transparent">
                    AND AI
                  </span>{" "}
                  understand
                </>
              )}
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-text-70">
              {cms?.subtitle ||
                "In 2026, your website has two types of visitors: people and AI agents. Most websites are optimized for just one. We build for both."}
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              <div className="glass rounded-xl p-6 text-center">
                <div className="font-mono text-3xl font-bold text-primary">&ge;95</div>
                <p className="mt-1 text-sm font-semibold text-text-100">PageSpeed Score</p>
                <p className="mt-1 text-xs text-text-70">mobile and desktop</p>
              </div>
              <div className="glass rounded-xl p-6 text-center">
                <div className="font-mono text-3xl font-bold text-primary">100%</div>
                <p className="mt-1 text-sm font-semibold text-text-100">LLM Crawlable</p>
                <p className="mt-1 text-xs text-text-70">GPT, Claude, Perplexity, Gemini</p>
              </div>
              <div className="glass rounded-xl p-6 text-center">
                <div className="font-mono text-3xl font-bold text-primary">2</div>
                <p className="mt-1 text-sm font-semibold text-text-100">Languages from day one</p>
                <p className="mt-1 text-xs text-text-70">ES + EN with semantic URLs</p>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href={ctaPrimary.url || "/contacto"}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                {ctaPrimary.text} &rarr;
              </Link>
              <a
                href={ctaSecondary?.url || "#caso"}
                className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-semibold text-text-100 transition hover:bg-bg-surface"
              >
                {ctaSecondary?.text} &darr;
              </a>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-dev/5 to-transparent" />
          <div className="relative mx-auto max-w-[1280px] px-6 md:px-20">
            <ServiceBadge variant="dev">Desarrollo Digital &middot; Nuevo</ServiceBadge>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
              {cms?.title || (
                <>
                  Sitios web que los humanos{" "}
                  <span className="bg-gradient-to-r from-dev to-primary bg-clip-text text-transparent">
                    Y la IA
                  </span>{" "}
                  entienden
                </>
              )}
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-text-70">
              {cms?.subtitle ||
                "En 2026, tu sitio tiene dos tipos de visitantes: personas y agentes IA. La mayoría de los sitios web están optimizados para uno solo. Nosotros construimos para los dos."}
            </p>

            {/* Metric cards */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3 max-w-2xl">
              {[
                { value: "≥95", label: "PageSpeed Score" },
                { value: "100%", label: "Crawleable por LLMs" },
                { value: "2", label: "Idiomas desde el inicio" },
              ].map((m) => (
                <div key={m.label} className="glass rounded-xl p-5 text-center">
                  <div className="font-mono text-3xl font-bold text-dev">{m.value}</div>
                  <p className="mt-1 text-sm text-text-70">{m.label}</p>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={ctaPrimary.url || "/contacto"}
                className="inline-flex items-center rounded-lg bg-dev px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dev/90"
              >
                {ctaPrimary.text} &rarr;
              </Link>
              <a
                href={ctaSecondary?.url || "#lo-que-ves"}
                className="inline-flex items-center rounded-lg border border-border px-6 py-3 text-sm font-semibold text-text-100 transition-colors hover:bg-bg-surface"
              >
                {ctaSecondary?.text} &darr;
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 2: THE PROBLEM ── */}
      {isEn ? (
        <section className="bg-bg-surface py-16 md:py-24">
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <h2 className="text-3xl font-bold text-text-100">
              Why does it matter if AI understands your site?
            </h2>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {painCards.map((card) => (
                <div key={card.title} className="glass glow-hover rounded-xl p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-dev/10">
                    {card.icon === "search" && (
                      <Search size={24} className="text-dev" aria-hidden="true" />
                    )}
                    {card.icon === "bot" && (
                      <Bot size={24} className="text-dev" aria-hidden="true" />
                    )}
                    {card.icon === "brain" && (
                      <Brain size={24} className="text-dev" aria-hidden="true" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-text-100">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-70">{card.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-xl border border-dev/20 bg-dev/5 p-6">
              <p className="text-sm leading-relaxed text-text-70">
                <strong className="text-text-100">This site</strong> &mdash; nivelics.com &mdash;
                was built with all these standards. What you see here is exactly what we build for
                you.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-bg-surface py-16 md:py-24">
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <h2 className="text-3xl font-bold text-text-100">
              ¿Por qué importa que la IA entienda tu sitio?
            </h2>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {painCards.map((card) => {
                const iconName = card.icon;
                return (
                  <div key={card.title} className="glass glow-hover rounded-xl p-6">
                    <GeoIconBox name={iconName} size={20} color="amber" />
                    <h3 className="text-lg font-semibold text-text-100">{card.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-70">{card.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 rounded-xl border border-dev/20 bg-dev/5 p-6">
              <p className="text-sm leading-relaxed text-text-100">
                <strong>Este sitio — nivelics.com —</strong> fue construido con todos estos
                estándares. Cada detalle que ves aquí es una demostración de lo que implementamos
                para nuestros clientes.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 3: WHAT'S INCLUDED (9 capabilities) ── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            {isEn
              ? "Everything that makes a site agentic-first"
              : "Todo lo que hace un sitio agentic-first"}
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap) => {
              const iconName = cap.icon;
              return (
                <div key={cap.title} className="glass glow-hover rounded-xl p-6">
                  <GeoIconBox name={iconName} size={20} color="amber" />
                  <h3 className="text-lg font-semibold text-text-100">{cap.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-70">{cap.description}</p>
                  {cap.tech && (
                    <span className="mt-3 inline-block rounded-full bg-dev/10 px-3 py-1 font-mono text-xs font-medium text-dev">
                      {cap.tech}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CmsServicioBenefits
        benefits={cms?.benefits}
        accentColor="#06B6D4"
        titleEs="Por qué Sitios Web Agentic con Nivelics"
        titleEn="Why Agentic-First Websites with Nivelics"
        locale={locale}
      />
      <CmsServicioProcess
        steps={cms?.processSteps}
        accentColor="#06B6D4"
        titleEs="Cómo lo construimos"
        titleEn="How we build it"
        locale={locale}
      />

      {/* ── SECTION 4: PROCESS TIMELINE ── */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            {isEn
              ? "Our process for an agentic-first site"
              : "Nuestro proceso para un sitio agentic-first"}
          </h2>

          <div
            className={
              isEn
                ? "mt-12 grid gap-6 md:grid-cols-5"
                : "mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5"
            }
          >
            {processPhases.map((phase) => (
              <div
                key={phase.phase}
                className="glass glow-hover rounded-xl p-6 border-t-2 border-dev"
              >
                <span className="font-mono text-sm font-bold text-dev">{phase.weeks}</span>
                <h3 className="mt-2 text-lg font-semibold text-text-100">{phase.title}</h3>
                <p className="mt-2 text-sm text-text-70">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: CASE STUDY ── */}
      {isEn ? (
        <section id="caso" className="py-16 md:py-24">
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <h2 className="text-3xl font-bold text-text-100">
              What you see here is what we build for you
            </h2>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Open /llms.txt",
                  description:
                    "Visit nivelics.com/llms.txt and see the structured file that LLMs use to understand this site.",
                },
                {
                  label: "Check the sitemap",
                  description:
                    "Inspect sitemap.xml with all bilingual URLs, canonical tags and lastmod dates.",
                },
                {
                  label: "Inspect the JSON-LD",
                  description:
                    "View page source on any page and find Organization, Service, BreadcrumbList and FAQPage schemas.",
                },
                {
                  label: "Switch the language",
                  description:
                    "Toggle between /es and /en and verify semantic URLs, hreflang and content parity.",
                },
              ].map((v) => (
                <div key={v.label} className="glass glow-hover rounded-xl p-6">
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-dev/10">
                    <Check size={16} className="text-dev" aria-hidden="true" />
                  </div>
                  <h3 className="text-sm font-semibold text-text-100">{v.label}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-text-70">{v.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: "\u226595", label: "PageSpeed Score" },
                { value: "122", label: "pages" },
                { value: "6", label: "schemas" },
                { value: "2", label: "languages" },
              ].map((m) => (
                <div key={m.label} className="glass rounded-xl p-6 text-center">
                  <div className="font-mono text-3xl font-bold text-primary">{m.value}</div>
                  <p className="mt-2 text-sm text-text-70">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section id="lo-que-ves" className="py-16 md:py-24">
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <h2 className="text-3xl font-bold text-text-100">
              Lo que ves aquí es lo que construimos para ti
            </h2>

            <div className="mt-10 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-8 md:p-12">
              <p className="text-lg text-text-70">
                Este mismo sitio — <strong className="text-text-100">nivelics.com</strong> — es un
                sitio agentic-first. No es un mockup ni un caso hipotético. Cada estándar que
                describimos arriba está implementado aquí. Puedes verificarlo tú mismo:
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    label: "llms.txt",
                    description:
                      "Visita nivelics.com/llms.txt para ver nuestro archivo de contexto para LLMs.",
                  },
                  {
                    label: "Sitemap",
                    description:
                      "Abre nivelics.com/sitemap.xml — 122+ páginas indexadas con lastmod.",
                  },
                  {
                    label: "JSON-LD",
                    description:
                      "Inspecciona el código fuente de esta página: verás 3 schemas inyectados server-side.",
                  },
                  {
                    label: "Cambio de idioma",
                    description:
                      "Cambia a inglés en el menú — cada página tiene su equivalente con hreflang.",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20">
                      <Check size={14} className="text-cyan-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-100">{item.label}</p>
                      <p className="text-sm text-text-70">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-4">
                {[
                  { value: "≥95", label: "PageSpeed Score" },
                  { value: "122", label: "Páginas indexadas" },
                  { value: "6", label: "Schemas JSON-LD" },
                  { value: "2", label: "Idiomas nativos" },
                ].map((m) => (
                  <div key={m.label} className="glass rounded-xl p-5 text-center">
                    <div className="font-mono text-3xl font-bold text-cyan-400">{m.value}</div>
                    <p className="mt-1 text-sm text-text-70">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 6: COMPARISON TABLE ── */}
      <ComparisonTable
        title={
          isEn
            ? "Why an agentic-first site vs. a traditional one?"
            : "¿Por qué un sitio agentic-first vs. uno tradicional?"
        }
        alternativeLabel={
          isEn ? "WordPress / Traditional agency" : "WordPress / Agencia tradicional"
        }
        nivelicsLabel={
          isEn ? "Agentic-First Site \u2014 Nivelics" : "Sitio Agentic-First — Nivelics"
        }
        rows={
          isEn
            ? [
                {
                  criterion: "LLM indexing",
                  alternative: "Not considered",
                  nivelics: "Designed from the start",
                },
                {
                  criterion: "llms.txt",
                  alternative: "Doesn\u2019t exist",
                  nivelics: "Implemented and bilingual",
                },
                {
                  criterion: "Schema.org",
                  alternative: "Generic plugins, incomplete",
                  nivelics: "Complete JSON-LD server-side",
                },
                {
                  criterion: "Multi-language",
                  alternative: "i18n plugin with /es/ and /en/ URLs",
                  nivelics: "Native architecture, ES at root",
                },
                {
                  criterion: "hreflang",
                  alternative: "Frequently incorrect",
                  nivelics: "Automatically verified",
                },
                {
                  criterion: "Core Web Vitals",
                  alternative: "60-75 due to plugins and themes",
                  nivelics: "\u226595 by architecture design",
                },
                {
                  criterion: "SEO Breadcrumbs",
                  alternative: "Plugin that fails on subpages",
                  nivelics: "SSR BreadcrumbList on all pages",
                },
                {
                  criterion: "Semantic URLs",
                  alternative: "CMS-dependent",
                  nivelics: "Defined before writing code",
                },
                {
                  criterion: "Technical audit",
                  alternative: "Manual or nonexistent",
                  nivelics: "Automated script on every deploy",
                },
                {
                  criterion: "Canonical tags",
                  alternative: "Auto-generated, sometimes wrong",
                  nivelics: "Verified page by page",
                },
                {
                  criterion: "Time to SEO results",
                  alternative: "3-6 months",
                  nivelics: "30-60 days (correct technical base)",
                },
                {
                  criterion: "Correction costs",
                  alternative: "High \u2014 undo what was done wrong",
                  nivelics: "Low \u2014 architecture is the foundation",
                },
              ]
            : [
                {
                  criterion: "Indexación por LLMs",
                  alternative: "No considerada",
                  nivelics: "Diseñada desde el inicio",
                },
                {
                  criterion: "llms.txt",
                  alternative: "No existe",
                  nivelics: "Implementado y bilingüe",
                },
                {
                  criterion: "Schema.org",
                  alternative: "Plugins genéricos, incompleto",
                  nivelics: "JSON-LD completo server-side",
                },
                {
                  criterion: "Multi-idioma",
                  alternative: "Plugin i18n con URLs /es/ y /en/",
                  nivelics: "Arquitectura nativa, ES en raíz",
                },
                {
                  criterion: "hreflang",
                  alternative: "Frecuentemente incorrecto",
                  nivelics: "Verificado automáticamente",
                },
                {
                  criterion: "Core Web Vitals",
                  alternative: "60-75 por plugins y temas",
                  nivelics: "≥95 diseñado por arquitectura",
                },
                {
                  criterion: "Breadcrumbs SEO",
                  alternative: "Plugin que falla en subpáginas",
                  nivelics: "BreadcrumbList SSR en todas",
                },
                {
                  criterion: "URLs semánticas",
                  alternative: "Dependiente del CMS",
                  nivelics: "Definidas antes de escribir código",
                },
                {
                  criterion: "Auditoría técnica",
                  alternative: "Manual o inexistente",
                  nivelics: "Script automático en cada deploy",
                },
                {
                  criterion: "Canonical tags",
                  alternative: "Auto-generados, a veces mal",
                  nivelics: "Verificados página por página",
                },
                {
                  criterion: "Tiempo a resultados SEO",
                  alternative: "3-6 meses",
                  nivelics: "30-60 días (base técnica correcta)",
                },
                {
                  criterion: "Costo de correcciones",
                  alternative: "Alto — deshacer lo mal hecho",
                  nivelics: "Bajo — arquitectura es la base",
                },
              ]
        }
      />

      {/* ── SECTION 7: FAQ ── */}
      {isEn ? (
        <section className="bg-bg-surface py-16 md:py-24">
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <h2 className="text-3xl font-bold text-text-100">Frequently Asked Questions</h2>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {faqItems.map((faq) => (
                <div key={faq.question} className="glass rounded-xl p-6">
                  <h3 className="text-base font-semibold text-text-100">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-70">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-bg-surface py-16 md:py-24">
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <h2 className="text-3xl font-bold text-text-100">Preguntas frecuentes</h2>

            <div className="mt-10 grid gap-4">
              {faqItems.map((faq) => (
                <details key={faq.question} className="group glass rounded-xl">
                  <summary className="flex cursor-pointer items-center justify-between p-6 text-text-100 font-semibold [&::-webkit-details-marker]:hidden">
                    <span>{faq.question}</span>
                    <ChevronsRight
                      size={20}
                      className="shrink-0 text-text-40 transition-transform group-open:rotate-90"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-sm leading-relaxed text-text-70">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 8: CTA FINAL ── */}
      <CTABanner
        title={
          isEn ? "Is your current site ready for 2026?" : "¿Tu sitio actual está listo para 2026?"
        }
        description={
          isEn
            ? "In 30 minutes we analyze your current site and tell you exactly what it needs to be indexed by LLMs and AI agents."
            : "En 30 minutos analizamos tu sitio actual y te decimos exactamente qué necesita para ser indexado por LLMs y agentes IA."
        }
        buttonText={isEn ? "Schedule your free diagnosis" : "Agenda tu diagnóstico gratuito"}
        buttonHref="/contacto"
      />

      <StickyMobileCta text="Diagnóstico gratuito →" url="/contacto" accentColor="#06B6D4" />
    </PageWrapper>
  );
}
