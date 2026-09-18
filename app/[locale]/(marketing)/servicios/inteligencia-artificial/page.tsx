// Hub de IA — línea «Ingeniería de agentes» (2026-09-18).
// Copy bilingüe en lib/content/agentes.ts (IA_HUB). Del CMS solo se lee la lista de
// subservicios (títulos, subtítulos, íconos y orden), que el admin sí mantiene.
// Sin cifras de resultados: la banda de métricas pasó a «Principios de diseño».
import type { Metadata } from "next";
import Link from "next/link";
import { PageWrapper } from "@/components/layout";
import { HeroSplit } from "@/components/sections/hero-split";
import { ClientLogosBar } from "@/components/sections/client-logos-bar";
import { TechStackGrid } from "@/components/sections/tech-stack-grid";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { InlineContactForm } from "@/components/sections/inline-contact-form";
import { CmsSubServicesGrid } from "@/components/sections/cms-servicio-sections";
import {
  AgentProofSection,
  DesignPrinciples,
  HarnessFramework,
} from "@/components/sections/agentes/agent-sections";
import { GeoIconBox } from "@/lib/icons/geometric";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getServicioData, getSubserviciosData } from "@/lib/cms/get-servicio-data";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import {
  AGENT_ACCENT,
  AGENT_SERVICES,
  IA_HUB,
  IA_SIBLINGS,
  IA_SUB_PATHS,
} from "@/lib/content/agentes";
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
  const copy = IA_HUB[locale];
  return buildPageMetadata({
    locale,
    href: "/servicios/inteligencia-artificial",
    title: copy.seoTitle,
    description: copy.seoDescription,
  });
}

// Íconos de la grid cuando la BD no responde (el orden es el de IA_SIBLINGS).
const FALLBACK_ICONS = [
  "dia-pulse",
  "hex-nodes",
  "oct-lock",
  "oct-monitor",
  "arc-person",
  "dia-flow",
  "arc-doc",
  "dia-target",
];

// Subtítulos de la grid cuando la BD no responde.
const FALLBACK_DESCRIPTIONS = {
  es: [
    AGENT_SERVICES.agentesIa.es.seoDescription,
    AGENT_SERVICES.mcp.es.seoDescription,
    AGENT_SERVICES.iaPrivada.es.seoDescription,
    AGENT_SERVICES.agentops.es.seoDescription,
    "IA que califica leads, hace seguimiento y escala oportunidades a tu equipo de ventas.",
    "Elimina trabajo manual repetitivo con flujos inteligentes impulsados por IA.",
    "SEO y contenido a escala con IA. Generación, optimización y distribución inteligente.",
    "Prospectos calificados automáticamente con IA integrada a tu CRM y herramientas de marketing.",
  ],
  en: [
    AGENT_SERVICES.agentesIa.en.seoDescription,
    AGENT_SERVICES.mcp.en.seoDescription,
    AGENT_SERVICES.iaPrivada.en.seoDescription,
    AGENT_SERVICES.agentops.en.seoDescription,
    "AI that qualifies leads, follows up and escalates opportunities to your sales team.",
    "Eliminate repetitive manual work with intelligent AI-powered workflows.",
    "SEO and content at scale with AI. Smart generation, optimization and distribution.",
    "Qualified leads, automatically, with AI integrated into your CRM and marketing tools.",
  ],
};

export default async function IAPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const copy = IA_HUB[locale];

  const cms = await getServicioData("inteligencia-artificial", locale);
  const subs = cms ? await getSubserviciosData(cms.id, locale) : [];

  // La grid del CMS arma el enlace con la ruta ES aun en /en; aquí se resuelve por idioma.
  const gridItems = subs.length
    ? subs.map((s) => ({
        icon: s.icon,
        title: s.title,
        description: s.subtitle,
        href:
          (IA_SUB_PATHS[s.slug] && IA_SUB_PATHS[s.slug][locale]) ??
          `/servicios/inteligencia-artificial/${s.slug}`,
      }))
    : IA_SIBLINGS.map((s, i) => ({
        icon: FALLBACK_ICONS[i] ?? null,
        title: isEn ? s.nameEn : s.name,
        description: FALLBACK_DESCRIPTIONS[locale][i] ?? "",
        href: isEn ? s.urlEn : s.url,
      }));

  const hubUrl = isEn
    ? "/en/services/artificial-intelligence"
    : "/servicios/inteligencia-artificial";
  const serviceSchema = getServiceSchema({
    name: isEn
      ? "Applied Artificial Intelligence and AI Agents"
      : "Agentes e Inteligencia Artificial aplicada",
    description: copy.description,
    url: hubUrl,
    serviceType: "Artificial Intelligence Consulting",
  });
  const breadcrumb = getBreadcrumbSchema(
    isEn
      ? [
          { name: "Home", url: "/en" },
          { name: "Services", url: "/en/services" },
          { name: "Artificial Intelligence", url: hubUrl },
        ]
      : [
          { name: "Inicio", url: "/" },
          { name: "Servicios", url: "/servicios" },
          { name: "Inteligencia Artificial", url: hubUrl },
        ],
  );

  // Panel del hero: las 4 líneas de agentes + las dos hermanas más buscadas.
  const panel = [0, 1, 2, 3, 5, 4].map((i) => ({
    icon: FALLBACK_ICONS[i],
    label: isEn ? IA_SIBLINGS[i].nameEn : IA_SIBLINGS[i].name,
    href: isEn ? IA_SIBLINGS[i].urlEn : IA_SIBLINGS[i].url,
  }));

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

      <HeroSplit
        heroEffect="diagonal"
        badge={copy.badge}
        // El H1 no sale del CMS: `title` es la etiqueta corta del hub y HeroSplit concatena
        // `h1 + h1Accent` («Agentes e IA aplicada ejecutan tareas reales»).
        h1={copy.h1}
        h1Accent={copy.h1Accent}
        subtitle={copy.subtitle}
        bullets={copy.bullets}
        ctaPrimary={{
          text: isEn ? "See our solutions" : "Ver soluciones",
          url: "#sub-services",
        }}
        ctaSecondary={{
          text: isEn ? "Talk to an expert" : "Hablar con un experto",
          url: isEn ? "/en/contact" : "/contacto",
        }}
        accentColor={AGENT_ACCENT}
        rightPanel={
          <nav aria-label={copy.panelTitle} className="glass rounded-xl p-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-40">
              {copy.panelTitle}
            </p>
            <ul className="space-y-1">
              {panel.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-white/10 hover:bg-white/[0.03]"
                  >
                    <GeoIconBox name={item.icon} size={16} color="violet" />
                    <span className="text-sm font-medium text-text-100">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        }
        dataSection="ia-hero"
        ariaLabel={`${copy.badge} — ${copy.subtitle}`}
      />

      <DesignPrinciples locale={locale} principles={copy.principles} />

      <CmsSubServicesGrid
        cmsItems={[]}
        fallback={gridItems}
        parentSlug="inteligencia-artificial"
        titleEs={IA_HUB.es.subServicesTitle}
        titleEn={IA_HUB.en.subServicesTitle}
        locale={locale}
        iconColor="violet"
      />

      <HarnessFramework locale={locale} />

      <ClientLogosBar
        title={copy.logosTitle}
        logos={[
          { name: "Televisa / N+", sector: isEn ? "Media" : "Medios" },
          { name: "Grupo Bolívar", sector: "Fintech" },
          { name: "Pulzo", sector: isEn ? "Digital media" : "Medios digitales" },
          { name: "Crónica", sector: isEn ? "Media" : "Medios" },
          { name: "AB InBev-Bavaria", sector: "CPG" },
        ]}
      />

      <TechStackGrid title={copy.stackTitle} categories={copy.stack} />

      <AgentProofSection locale={locale} />

      {/* Enlace cruzado: la superficie de ataque de un agente de IA no la cubre un
          pentest tradicional, y es el ángulo que más nos diferencia. */}
      <section className="py-8">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <p className="max-w-3xl text-sm leading-relaxed text-text-70">
            <strong className="font-semibold text-text-100">{copy.securityLink.lead}</strong>{" "}
            {copy.securityLink.text}{" "}
            <Link
              href={copy.securityLink.link.href}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {copy.securityLink.link.label}
            </Link>
          </p>
        </div>
      </section>

      <ProcessTimeline title={copy.processTitle} accentColor={AGENT_ACCENT} steps={copy.process} />

      <CaseStudyCard
        client="Pulzo"
        sector={copy.caseStudy.sector}
        country="Colombia"
        countryFlag="🇨🇴"
        result={copy.caseStudy.result}
        metric={copy.caseStudy.metric}
        service={copy.caseStudy.service}
        url={isEn ? "/en/success-stories/pulzo" : "/casos-de-exito/pulzo"}
        ctaLabel={isEn ? "See full case study" : "Ver caso completo"}
      />

      {/* schemaEnabled emite el FAQPage: única fuente de ese bloque en la página (antes
          había un segundo FAQPage manual con otras preguntas). */}
      <FAQAccordion title={copy.faqTitle} schemaEnabled faqs={copy.faqs} />

      <InlineContactForm
        title={copy.contactTitle}
        subtitle={copy.contactSubtitle}
        serviceDefault="ia"
        accentColor={AGENT_ACCENT}
      />
    </PageWrapper>
  );
}
