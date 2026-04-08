import Link from "next/link";
import {
  Search,
  Bot,
  Brain,
  Globe,
  LinkIcon,
  Zap,
  Code2,
  FileText,
  Shield,
  Menu,
  ChevronsRight,
  Layers,
  Check,
} from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { CTABanner, ServiceBadge } from "@/components/shared";
import { StickyMobileCta } from "@/components/ui/sticky-mobile-cta";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getFAQSchema } from "@/lib/schema/faq";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const PAIN_CARDS = [
  {
    icon: Search,
    title: "Google ya no muestra solo links",
    description:
      "AI Overviews responden directamente en los resultados de búsqueda. Si tu sitio no tiene datos estructurados y HTML semántico, Google no te cita — cita a tu competencia.",
  },
  {
    icon: Bot,
    title: "Los agentes IA ya toman decisiones",
    description:
      "ChatGPT Operator, Claude Computer Use y otros agentes navegan sitios web para completar tareas. Si tu sitio no es crawleable por máquinas, esos agentes no pueden interactuar con tu negocio.",
  },
  {
    icon: Brain,
    title: "ChatGPT y Claude recomiendan empresas",
    description:
      'Cuando alguien pregunta "¿quién desarrolla apps en Colombia?", los LLMs recomiendan empresas cuyo sitio entienden bien. Schema.org, llms.txt y HTML semántico determinan si apareces o no.',
  },
];

const CAPABILITIES = [
  {
    icon: Globe,
    title: "Multi-idioma nativo",
    description:
      "Arquitectura i18n con español en la raíz e inglés en /en/. Cada página tiene su equivalente traducido con hreflang verificado automáticamente.",
    tech: "next-intl + hreflang",
  },
  {
    icon: LinkIcon,
    title: "URLs semánticas",
    description:
      "Estructura de URLs definida antes de escribir una sola línea de código. Jerarquía clara: /servicios/desarrollo-digital/plataformas-web.",
    tech: "App Router",
  },
  {
    icon: Zap,
    title: "Core Web Vitals ≥95",
    description:
      "Performance diseñada desde la arquitectura, no parcheada después. Server Components, lazy loading estratégico y zero layout shift.",
    tech: "Next.js RSC",
  },
  {
    icon: Code2,
    title: "Schema.org completo",
    description:
      "JSON-LD server-side en cada página: Organization, Service, BreadcrumbList, FAQPage y más. No plugins genéricos — esquemas escritos a mano.",
    tech: "JSON-LD SSR",
  },
  {
    icon: FileText,
    title: "llms.txt implementado",
    description:
      "Archivo en la raíz del dominio que indica a los LLMs qué hace tu empresa, qué servicios ofreces y cómo contactarte. Bilingüe.",
    tech: "llms.txt spec",
  },
  {
    icon: Shield,
    title: "robots.txt optimizado",
    description:
      "Configuración que permite el crawl de buscadores y agentes IA, bloquea rutas internas y apunta al sitemap XML correcto.",
    tech: "robots.txt + sitemap",
  },
  {
    icon: Menu,
    title: "Mega menú semántico",
    description:
      "Navegación con <nav>, roles ARIA y estructura jerárquica que los crawlers y agentes entienden sin ejecutar JavaScript.",
    tech: "SSR + ARIA",
  },
  {
    icon: ChevronsRight,
    title: "Breadcrumbs en todas las páginas",
    description:
      "BreadcrumbList con JSON-LD renderizado server-side. Google los muestra directamente en los resultados de búsqueda.",
    tech: "BreadcrumbList SSR",
  },
  {
    icon: Layers,
    title: "HTML semántico",
    description:
      "Uso correcto de <main>, <article>, <section>, <header>, <footer>, headings jerárquicos y landmarks ARIA en todo el sitio.",
    tech: "WAI-ARIA + HTML5",
  },
];

const PROCESS_PHASES = [
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

const FAQ_ITEMS = [
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

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AgenticContentEs() {
  const serviceSchema = getServiceSchema({
    name: "Desarrollo de Sitios Web Agentic-First",
    description:
      "Sitios web optimizados para humanos y agentes IA. HTML semántico, Schema.org, llms.txt, multi-idioma y Core Web Vitals ≥95.",
    url: "/servicios/desarrollo-digital/sitios-web-agentic",
    serviceType: "Web Development",
  });

  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Desarrollo Digital", url: "/servicios/desarrollo-digital" },
    {
      name: "Sitios Web Agentic-First",
      url: "/servicios/desarrollo-digital/sitios-web-agentic",
    },
  ]);

  const faqSchema = getFAQSchema(FAQ_ITEMS);

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
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-dev/5 to-transparent" />
        <div className="relative mx-auto max-w-[1280px] px-6 md:px-20">
          <ServiceBadge variant="dev">Desarrollo Digital &middot; Nuevo</ServiceBadge>

          <h1 className="mt-6 max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
            Sitios web que los humanos{" "}
            <span className="bg-gradient-to-r from-dev to-primary bg-clip-text text-transparent">
              Y la IA
            </span>{" "}
            entienden
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-text-70">
            En 2026, tu sitio tiene dos tipos de visitantes: personas y agentes IA. La mayoría de
            los sitios web están optimizados para uno solo. Nosotros construimos para los dos.
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
              href="/contacto"
              className="inline-flex items-center rounded-lg bg-dev px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dev/90"
            >
              Agenda un diagnóstico gratuito &rarr;
            </Link>
            <a
              href="#lo-que-ves"
              className="inline-flex items-center rounded-lg border border-border px-6 py-3 text-sm font-semibold text-text-100 transition-colors hover:bg-bg-surface"
            >
              Ver cómo construimos este sitio &darr;
            </a>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: THE PROBLEM ── */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            ¿Por qué importa que la IA entienda tu sitio?
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {PAIN_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="glass glow-hover rounded-xl p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-dev/10">
                    <Icon size={24} className="text-dev" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-100">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-70">{card.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 rounded-xl border border-dev/20 bg-dev/5 p-6">
            <p className="text-sm leading-relaxed text-text-100">
              <strong>Este sitio — nivelics.com —</strong> fue construido con todos estos
              estándares. Cada detalle que ves aquí es una demostración de lo que implementamos para
              nuestros clientes.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: WHAT'S INCLUDED (9 capabilities) ── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            Todo lo que hace un sitio agentic-first
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((cap) => {
              const Icon = cap.icon;
              return (
                <div key={cap.title} className="glass glow-hover rounded-xl p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-dev/10">
                    <Icon size={24} className="text-dev" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-100">{cap.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-70">{cap.description}</p>
                  <span className="mt-3 inline-block rounded-full bg-dev/10 px-3 py-1 font-mono text-xs font-medium text-dev">
                    {cap.tech}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: PROCESS TIMELINE ── */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            Nuestro proceso para un sitio agentic-first
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS_PHASES.map((phase) => (
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
      <section id="lo-que-ves" className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            Lo que ves aquí es lo que construimos para ti
          </h2>

          <div className="mt-10 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-8 md:p-12">
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

      {/* ── SECTION 6: COMPARISON TABLE ── */}
      <ComparisonTable
        title="¿Por qué un sitio agentic-first vs. uno tradicional?"
        alternativeLabel="WordPress / Agencia tradicional"
        nivelicsLabel="Sitio Agentic-First — Nivelics"
        rows={[
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
        ]}
      />

      {/* ── SECTION 7: FAQ ── */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Preguntas frecuentes</h2>

          <div className="mt-10 grid gap-4">
            {FAQ_ITEMS.map((faq) => (
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

      {/* ── SECTION 8: CTA FINAL ── */}
      <CTABanner
        title="¿Tu sitio actual está listo para 2026?"
        description="En 30 minutos analizamos tu sitio actual y te decimos exactamente qué necesita para ser indexado por LLMs y agentes IA."
        buttonText="Agenda tu diagnóstico gratuito"
        buttonHref="/contacto"
      />

      <StickyMobileCta text="Diagnóstico gratuito →" url="/contacto" accentColor="#06B6D4" />
    </PageWrapper>
  );
}
