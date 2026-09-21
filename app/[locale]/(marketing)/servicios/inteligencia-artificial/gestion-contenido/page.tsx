// CMS-connected: 2026-05-07 — benefits, processSteps and CTAs read from DB with hardcoded fallbacks
// Bilingüe con el patrón de cloud/ciberseguridad-ethical-hacking (constantes _ES/_EN + isEn).
import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { PageWrapper } from "@/components/layout";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { HeroSplit } from "@/components/sections/hero-split";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { InlineContactForm } from "@/components/sections/inline-contact-form";
import { StickyMobileCta } from "@/components/ui/sticky-mobile-cta";
import {
  CmsServicioBenefits,
  CmsServicioProcess,
  resolveServicioCtas,
} from "@/components/sections/cms-servicio-sections";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getServicioData } from "@/lib/cms/get-servicio-data";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { GeoIconBox } from "@/lib/icons/geometric";
import type { Locale } from "@/lib/cms/types";
import { IA_PARENT, IA_SIBLINGS } from "@/lib/content/agentes";
import { DesignPrinciples } from "@/components/sections/agentes/agent-sections";

const SLUG = "gestion-contenido";
const ACCENT = "#8B5CF6";
const PATH_ES = "/servicios/inteligencia-artificial/gestion-contenido";
const PATH_EN = "/en/services/artificial-intelligence/content-management";

// Las URLs de CTA del CMS son rutas ES; en /en se traducen a su equivalente.
const EN_URLS: Record<string, string> = {
  "/contacto": "/en/contact",
  "/servicios/inteligencia-artificial": "/en/services/artificial-intelligence",
  [PATH_ES]: PATH_EN,
};
function toEnUrl(url: string): string {
  return EN_URLS[url.replace(/\/$/, "")] ?? url;
}

const TITLE_ES = "Gestión de Contenido con IA | SEO y Marketing Automatizado";
const TITLE_EN = "AI Content Management | Automated SEO and Marketing";
const DESCRIPTION_ES =
  "Generación y optimización de contenido a escala con IA. Integración con tu CMS y flujos editoriales.";
const DESCRIPTION_EN =
  "AI-powered content generation and optimization at scale. Integrated with your CMS and editorial workflows.";

// Reglas de diseño del servicio, no resultados: sin cifras ni garantías.
const PRINCIPLES_ES = [
  "Revisión humana antes de publicar, si tú la exiges",
  "Tono de marca definido en una guía versionada",
  "Publicación en tu CMS vía API, sin reemplazarlo",
  "Cada pieza conserva su brief, fuentes y versión",
];
const PRINCIPLES_EN = [
  "Human review before publishing, if you require it",
  "Brand voice defined in a versioned style guide",
  "Publishing to your CMS via API, without replacing it",
  "Every piece keeps its brief, sources and version",
];

const HERO_ES = {
  badge: "IA · Contenido",
  h1: "Más contenido, con criterio editorial,",
  h1Accent: "el mismo equipo",
  subtitle:
    "Pipelines de contenido impulsados por IA generativa: desde la ideación hasta la publicación. SEO optimizado, tono de marca consistente y publicación directa a tu CMS.",
  bullets: [
    "Artículos, landing pages y descripciones de producto optimizados para SEO",
    "Variantes automáticas por segmento y audiencia",
    "Publicación directa vía API a tu CMS",
  ],
  ariaLabel: "Gestión de Contenido con IA — produce más contenido con el mismo equipo",
  ctaPrimary: "Agendar demo",
  ctaSecondary: "Ver todos los servicios IA",
};
const HERO_EN = {
  badge: "AI · Content",
  h1: "More content, with editorial judgment,",
  h1Accent: "from the same team",
  subtitle:
    "Content pipelines powered by generative AI: from ideation to publication. SEO-optimized, with a consistent brand voice and direct publishing to your CMS.",
  bullets: [
    "SEO-optimized articles, landing pages and product descriptions",
    "Automatic variants by segment and audience",
    "Direct publishing to your CMS via API",
  ],
  ariaLabel: "AI Content Management — produce more content with the same team",
  ctaPrimary: "Book a demo",
  ctaSecondary: "View all AI services",
};

type PanelItem = { icon: string; label: string; description: string; href?: string };

const PANEL_ES: { ariaLabel: string; title: string; footer: string; items: PanelItem[] } = {
  ariaLabel: "Qué tipo de contenido produces",
  title: "¿Qué tipo de contenido produces?",
  footer: "O cuéntanos tu caso personalizado →",
  items: [
    {
      icon: "arc-doc",
      label: "Artículos y blog posts",
      description: "Contenido SEO de alta calidad generado y optimizado con IA",
    },
    {
      icon: "hex-plus",
      label: "Descripciones de producto",
      description: "Fichas de producto únicas y optimizadas a escala",
    },
    {
      icon: "arc-broadcast",
      label: "Email marketing",
      description: "Secuencias personalizadas con copy que convierte",
      href: "/servicios/inteligencia-artificial/marketing-crm",
    },
    {
      icon: "arc-wave",
      label: "Contenido para redes",
      description: "Posts adaptados a cada plataforma y audiencia",
    },
    {
      icon: "dia-search",
      label: "Optimización SEO",
      description: "Mejora de contenido existente para posicionamiento",
    },
  ],
};
const PANEL_EN: { ariaLabel: string; title: string; footer: string; items: PanelItem[] } = {
  ariaLabel: "What kind of content you produce",
  title: "What kind of content do you produce?",
  footer: "Or tell us about your specific case →",
  items: [
    {
      icon: "arc-doc",
      label: "Articles and blog posts",
      description: "High-quality SEO content generated and optimized with AI",
    },
    {
      icon: "hex-plus",
      label: "Product descriptions",
      description: "Unique, optimized product listings at scale",
    },
    {
      icon: "arc-broadcast",
      label: "Email marketing",
      description: "Personalized sequences with copy that converts",
      href: "/en/services/artificial-intelligence/marketing-crm",
    },
    {
      icon: "arc-wave",
      label: "Social media content",
      description: "Posts tailored to each platform and audience",
    },
    {
      icon: "dia-search",
      label: "SEO optimization",
      description: "Improving existing content so it ranks",
    },
  ],
};

const COMPARISON_ES = {
  title: "¿Gestión de contenido con IA vs. equipo editorial tradicional?",
  alternativeLabel: "Equipo editorial tradicional",
  nivelicsLabel: "Nivelics Gestión de Contenido IA",
  rows: [
    {
      criterion: "Volumen de producción",
      alternative: "Limitado por horas del equipo",
      nivelics: "Más volumen con el mismo equipo",
    },
    {
      criterion: "Optimización SEO",
      alternative: "Manual — depende del conocimiento del editor",
      nivelics: "Automatizada — keywords, estructura y metadata",
    },
    {
      criterion: "Tiempo de publicación",
      alternative: "Días por pieza",
      nivelics: "Flujo continuo desde el brief hasta la publicación",
    },
    {
      criterion: "Personalización por audiencia",
      alternative: "Un contenido para todos",
      nivelics: "Variantes automáticas por segmento",
    },
    {
      criterion: "Consistencia de marca",
      alternative: "Variable entre autores",
      nivelics: "Tono de voz aplicado de forma consistente",
    },
    {
      criterion: "Análisis de performance",
      alternative: "Revisión manual periódica",
      nivelics: "Feedback loop automático — el agente aprende",
    },
    {
      criterion: "Integración con CMS",
      alternative: "Carga manual al CMS",
      nivelics: "Publicación directa vía API",
    },
  ],
};
const COMPARISON_EN = {
  title: "AI content management vs. a traditional editorial team?",
  alternativeLabel: "Traditional editorial team",
  nivelicsLabel: "Nivelics AI Content Management",
  rows: [
    {
      criterion: "Production volume",
      alternative: "Limited by the team's hours",
      nivelics: "More volume with the same team",
    },
    {
      criterion: "SEO optimization",
      alternative: "Manual — depends on the editor's know-how",
      nivelics: "Automated — keywords, structure and metadata",
    },
    {
      criterion: "Time to publish",
      alternative: "Days per piece",
      nivelics: "Continuous flow from brief to publication",
    },
    {
      criterion: "Audience personalization",
      alternative: "One piece of content for everyone",
      nivelics: "Automatic variants by segment",
    },
    {
      criterion: "Brand consistency",
      alternative: "Varies from author to author",
      nivelics: "Brand voice applied consistently",
    },
    {
      criterion: "Performance analysis",
      alternative: "Periodic manual review",
      nivelics: "Automatic feedback loop — the agent learns",
    },
    {
      criterion: "CMS integration",
      alternative: "Manual upload to the CMS",
      nivelics: "Direct publishing via API",
    },
  ],
};

const FAQ_TITLE_ES = "Preguntas frecuentes sobre Gestión de Contenido con IA";
const FAQ_TITLE_EN = "Frequently asked questions about AI Content Management";

const FAQ_ES = [
  {
    question: "¿El contenido generado con IA es detectable?",
    answer:
      "No si se hace bien. Nuestro pipeline incluye etapas de humanización, revisión de estilo y verificación de originalidad. El contenido pasa por tu flujo editorial antes de publicarse — la IA acelera la producción, no reemplaza el criterio humano.",
  },
  {
    question: "¿Se integra con mi CMS actual?",
    answer:
      "Sí. Tenemos integraciones con WordPress, Contentful, Strapi, Sanity y otros CMS headless. La publicación puede ser directa vía API o pasar por un flujo de aprobación antes del publish.",
  },
  {
    question: "¿Cómo se mantiene el tono de marca?",
    answer:
      "Configuramos un brand voice profile con ejemplos de tu contenido actual, guías de estilo y restricciones. El agente aplica estas reglas de forma consistente en todo el contenido que produce.",
  },
  {
    question: "¿Funciona para contenido en múltiples idiomas?",
    answer:
      "Sí. El agente puede producir contenido en español, inglés, portugués y otros idiomas, adaptando no solo el idioma sino el estilo y las referencias culturales para cada mercado.",
  },
  {
    question: "¿Cuánto cuesta la generación de contenido con IA?",
    answer:
      "El modelo incluye una implementación inicial y un cargo mensual según el volumen de producción. En el discovery definimos el precio según tu volumen y necesidades.",
  },
];
const FAQ_EN = [
  {
    question: "Is AI-generated content detectable?",
    answer:
      "Not when it is done well. Our pipeline includes humanization, style review and originality checks. Content goes through your editorial workflow before it is published — AI speeds up production, it does not replace human judgment.",
  },
  {
    question: "Does it integrate with my current CMS?",
    answer:
      "Yes. We integrate with WordPress, Contentful, Strapi, Sanity and other headless CMSs. Publishing can go directly via API or through an approval workflow first.",
  },
  {
    question: "How is the brand voice maintained?",
    answer:
      "We set up a brand voice profile with examples of your current content, style guides and constraints. The agent applies those rules consistently across everything it produces.",
  },
  {
    question: "Does it work for content in multiple languages?",
    answer:
      "Yes. The agent can produce content in Spanish, English, Portuguese and other languages, adapting not only the language but also the style and cultural references for each market.",
  },
  {
    question: "How much does AI content generation cost?",
    answer:
      "The model includes an initial implementation plus a monthly fee based on production volume. We set the price during discovery according to your volume and needs.",
  },
];

const CONTACT_ES = {
  title: "¿Listo para escalar tu producción de contenido?",
  subtitle: "Cuéntanos sobre tu flujo editorial y diseñamos el pipeline ideal.",
  sticky: "Hablar con un experto →",
};
const CONTACT_EN = {
  title: "Ready to scale your content production?",
  subtitle: "Tell us about your editorial workflow and we will design the right pipeline for it.",
  sticky: "Talk to an expert →",
};

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
  const cms = await getServicioData(SLUG, locale);
  return buildPageMetadata({
    locale,
    href: PATH_ES,
    title: cms?.seoTitle || (isEn ? TITLE_EN : TITLE_ES),
    description: cms?.seoDescription || (isEn ? DESCRIPTION_EN : DESCRIPTION_ES),
  });
}

export default async function GestionContenidoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const cms = await getServicioData(SLUG, locale);

  const hero = isEn ? HERO_EN : HERO_ES;
  const panel = isEn ? PANEL_EN : PANEL_ES;
  const comparison = isEn ? COMPARISON_EN : COMPARISON_ES;
  const contact = isEn ? CONTACT_EN : CONTACT_ES;
  const contactUrl = isEn ? "/en/contact" : "/contacto";

  const resolved = resolveServicioCtas({
    primary: cms ? { text: cms.ctaPrimaryText, url: cms.ctaPrimaryUrl } : null,
    secondary: cms ? { text: cms.ctaSecondaryText, url: cms.ctaSecondaryUrl } : null,
    fallbackPrimary: { text: hero.ctaPrimary, url: "/contacto" },
    fallbackSecondary: {
      text: hero.ctaSecondary,
      url: "/servicios/inteligencia-artificial",
    },
  });
  const ctaPrimary = isEn
    ? { ...resolved.ctaPrimary, url: toEnUrl(resolved.ctaPrimary.url) }
    : resolved.ctaPrimary;
  const ctaSecondary =
    isEn && resolved.ctaSecondary
      ? { ...resolved.ctaSecondary, url: toEnUrl(resolved.ctaSecondary.url) }
      : resolved.ctaSecondary;

  const serviceSchema = getServiceSchema({
    locale,
    name: isEn ? "AI Content Management" : "Gestión de Contenido con IA",
    description: isEn ? DESCRIPTION_EN : DESCRIPTION_ES,
    url: isEn ? PATH_EN : PATH_ES,
    serviceType: "AI Content Management",
  });
  const breadcrumb = getBreadcrumbSchema(
    locale,
    isEn
      ? [
          { name: "Home", url: "/en" },
          { name: "Services", url: "/en/services" },
          { name: "Artificial Intelligence", url: "/en/services/artificial-intelligence" },
          { name: "Content Management", url: PATH_EN },
        ]
      : [
          { name: "Inicio", url: "/" },
          { name: "Servicios", url: "/servicios" },
          { name: "Inteligencia Artificial", url: "/servicios/inteligencia-artificial" },
          { name: "Gestión de Contenido", url: PATH_ES },
        ],
  );

  return (
    <PageWrapper>
      <SiblingServicesNav parentService={IA_PARENT} siblings={IA_SIBLINGS} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* Hero */}
      <HeroSplit
        heroEffect="particles"
        badge={hero.badge}
        h1={hero.h1}
        h1Accent={hero.h1Accent}
        subtitle={cms?.subtitle || hero.subtitle}
        bullets={hero.bullets}
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor={ACCENT}
        rightPanel={
          // Panel propio en vez de <HeroSelector>: ese componente lleva su aria-label y su
          // enlace de pie en español duro, y esta página tiene que estar entera en inglés.
          <nav aria-label={panel.ariaLabel} className="glass rounded-xl p-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-40">
              {panel.title}
            </p>
            <ul className="space-y-1">
              {panel.items.map((item) => {
                const body = (
                  <>
                    <GeoIconBox name={item.icon} size={16} color="violet" />
                    <div>
                      <span className="block text-sm font-semibold text-text-100">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-text-40">{item.description}</span>
                    </div>
                  </>
                );
                return (
                  <li key={item.label}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="flex items-start gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-white/10 hover:bg-white/[0.03]"
                      >
                        {body}
                      </Link>
                    ) : (
                      <div className="flex items-start gap-3 rounded-lg p-2">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            <Link
              href={contactUrl}
              className="mt-3 block text-center text-xs font-medium transition-colors hover:brightness-125"
              style={{ color: ACCENT }}
            >
              {panel.footer}
            </Link>
          </nav>
        }
        dataSection="gestion-contenido-hero"
        ariaLabel={hero.ariaLabel}
      />

      {/* Principios de diseño: reemplazan a MetricsBar, que mostraba cifras sin respaldo */}
      <DesignPrinciples locale={locale} principles={isEn ? PRINCIPLES_EN : PRINCIPLES_ES} />

      {/* Benefits from CMS (renders only when admin has populated benefits) */}
      <CmsServicioBenefits
        benefits={cms?.benefits}
        accentColor={ACCENT}
        titleEs="Por qué elegir Gestión de Contenido con Nivelics"
        titleEn="Why choose Content Management with Nivelics"
        locale={locale}
      />

      {/* Process from CMS (renders only when admin has populated processSteps) */}
      <CmsServicioProcess
        steps={cms?.processSteps}
        accentColor={ACCENT}
        titleEs="Proceso de implementación"
        titleEn="Implementation process"
        locale={locale}
      />

      {/* Comparison */}
      <ComparisonTable
        criterionLabel={isEn ? "Criterion" : "Criterio"}
        title={comparison.title}
        alternativeLabel={comparison.alternativeLabel}
        nivelicsLabel={comparison.nivelicsLabel}
        rows={comparison.rows}
      />

      {/* FAQ */}
      <FAQAccordion
        title={isEn ? FAQ_TITLE_EN : FAQ_TITLE_ES}
        schemaEnabled
        faqs={cms?.faqs?.length ? cms.faqs : /* LEGACY FALLBACK */ isEn ? FAQ_EN : FAQ_ES}
      />

      {/* Contact */}
      <InlineContactForm
        title={contact.title}
        subtitle={contact.subtitle}
        serviceDefault="ia"
        accentColor={ACCENT}
      />

      <StickyMobileCta text={contact.sticky} url={contactUrl} accentColor={ACCENT} />
    </PageWrapper>
  );
}
