// CMS-connected: 2026-05-07 — benefits, processSteps and CTAs read from DB with hardcoded fallbacks
// Bilingüe con el patrón de cloud/ciberseguridad-ethical-hacking (constantes _ES/_EN + isEn).
import type { Metadata } from "next";
import Link from "next/link";
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

const SLUG = "automatizacion-procesos";
const ACCENT = "#8B5CF6";
const PATH_ES = "/servicios/inteligencia-artificial/automatizacion-procesos";
const PATH_EN = "/en/services/artificial-intelligence/process-automation";

// Las URLs de CTA del CMS son rutas ES; en /en se traducen a su equivalente.
const EN_URLS: Record<string, string> = {
  "/contacto": "/en/contact",
  "/servicios/inteligencia-artificial": "/en/services/artificial-intelligence",
  [PATH_ES]: PATH_EN,
};
function toEnUrl(url: string): string {
  return EN_URLS[url.replace(/\/$/, "")] ?? url;
}

const TITLE_ES = "Automatización de Procesos con IA | Eficiencia Operacional";
const TITLE_EN = "AI Process Automation | Operational Efficiency";
const DESCRIPTION_ES =
  "Automatizamos procesos en finanzas, RRHH y logística sobre tus sistemas actuales, con registro completo de cada ejecución.";
const DESCRIPTION_EN =
  "We automate finance, HR and logistics processes on top of your current systems, with a full log of every run.";

// Reglas de diseño del servicio, no resultados: sin cifras ni garantías.
const PRINCIPLES_ES = [
  "Cada paso automatizado queda registrado para auditoría",
  "Excepciones a una persona con el contexto completo",
  "Integración sobre tus sistemas actuales, sin reemplazarlos",
  "Reglas de negocio versionadas y probadas",
];
const PRINCIPLES_EN = [
  "Every automated step is logged for audit",
  "Exceptions go to a person with the full context",
  "Built on top of your current systems, not replacing them",
  "Business rules are versioned and tested",
];

const HERO_ES = {
  badge: "IA · Automatización",
  h1: "Procesos repetitivos,",
  h1Accent: "automatizados y auditables",
  subtitle:
    "Combinamos RPA con IA generativa para automatizar flujos complejos que requieren juicio y contexto. Finanzas, RRHH, logística y operaciones — sin reemplazar tus sistemas actuales.",
  bullets: [
    "Menos tiempo de tu equipo en tareas repetitivas",
    "Integración con sistemas legacy sin necesidad de reemplazarlos",
    "Log completo de cada ejecución para auditoría y compliance",
  ],
  ariaLabel:
    "Automatización de Procesos con IA — eficiencia operacional para finanzas, RRHH y logística",
  ctaPrimary: "Agendar discovery",
  ctaSecondary: "Ver todos los servicios IA",
};
const HERO_EN = {
  badge: "AI · Automation",
  h1: "Repetitive processes,",
  h1Accent: "automated and auditable",
  subtitle:
    "We combine RPA with generative AI to automate complex workflows that call for judgment and context. Finance, HR, logistics and operations — without replacing your current systems.",
  bullets: [
    "Less of your team's time spent on repetitive tasks",
    "Integration with legacy systems, no replacement required",
    "Full log of every run for audit and compliance",
  ],
  ariaLabel: "AI Process Automation — operational efficiency for finance, HR and logistics",
  ctaPrimary: "Book a discovery call",
  ctaSecondary: "View all AI services",
};

const PANEL_ES = {
  ariaLabel: "Qué proceso automatizas",
  title: "¿Qué proceso automatizas?",
  footer: "O cuéntanos tu caso personalizado →",
  items: [
    {
      icon: "arc-doc",
      label: "Procesamiento de documentos",
      description: "Extracción, clasificación y ruteo automático de documentos",
    },
    {
      icon: "hex-data",
      label: "Conciliaciones financieras",
      description: "Cruces automáticos entre sistemas contables y bancarios",
    },
    {
      icon: "tri-person",
      label: "Flujos de RRHH",
      description: "Onboarding, nómina y gestión documental automatizada",
    },
    {
      icon: "hex-nodes",
      label: "Logística y supply chain",
      description: "Seguimiento, alertas y optimización de inventario",
    },
    {
      icon: "hex-chart",
      label: "Reportes ejecutivos",
      description: "Generación automática desde múltiples fuentes de datos",
    },
  ],
};
const PANEL_EN = {
  ariaLabel: "Which process you want to automate",
  title: "Which process do you want to automate?",
  footer: "Or tell us about your specific case →",
  items: [
    {
      icon: "arc-doc",
      label: "Document processing",
      description: "Automatic extraction, classification and routing of documents",
    },
    {
      icon: "hex-data",
      label: "Financial reconciliations",
      description: "Automatic matching between accounting and banking systems",
    },
    {
      icon: "tri-person",
      label: "HR workflows",
      description: "Automated onboarding, payroll and document management",
    },
    {
      icon: "hex-nodes",
      label: "Logistics and supply chain",
      description: "Tracking, alerts and inventory optimization",
    },
    {
      icon: "hex-chart",
      label: "Executive reporting",
      description: "Generated automatically from multiple data sources",
    },
  ],
};

const COMPARISON_ES = {
  title: "¿Automatizar con IA vs. seguir con procesos manuales?",
  alternativeLabel: "Proceso manual actual",
  nivelicsLabel: "Automatización con IA — Nivelics",
  rows: [
    {
      criterion: "Tiempo de ejecución del proceso",
      alternative: "Horas o días según volumen",
      nivelics: "Se ejecuta en cuanto llega el caso, sin esperar turno",
    },
    {
      criterion: "Errores humanos",
      alternative: "Frecuentes en tareas repetitivas",
      nivelics: "Reglas aplicadas igual en cada ejecución; las excepciones van a revisión",
    },
    {
      criterion: "Disponibilidad",
      alternative: "Horario laboral únicamente",
      nivelics: "A cualquier hora, sin depender del horario laboral",
    },
    {
      criterion: "Escalabilidad",
      alternative: "Requiere contratar más personas",
      nivelics: "Escala sin costo marginal por unidad",
    },
    {
      criterion: "Costo a largo plazo",
      alternative: "Crece linealmente con el volumen",
      nivelics: "Fijo o decrece — economías de escala reales",
    },
    {
      criterion: "Trazabilidad del proceso",
      alternative: "Difícil de auditar",
      nivelics: "Log completo de cada ejecución",
    },
    {
      criterion: "Medición del impacto",
      alternative: "Difícil de cuantificar",
      nivelics: "Línea base y seguimiento con tus propios datos",
    },
  ],
};
const COMPARISON_EN = {
  title: "Automating with AI vs. sticking with manual processes?",
  alternativeLabel: "Current manual process",
  nivelicsLabel: "AI automation — Nivelics",
  rows: [
    {
      criterion: "Process execution time",
      alternative: "Hours or days, depending on volume",
      nivelics: "Runs as soon as the case arrives, with no queue",
    },
    {
      criterion: "Human error",
      alternative: "Common in repetitive tasks",
      nivelics: "Rules applied the same way on every run; exceptions go to review",
    },
    {
      criterion: "Availability",
      alternative: "Business hours only",
      nivelics: "At any hour, independent of business hours",
    },
    {
      criterion: "Scalability",
      alternative: "Requires hiring more people",
      nivelics: "Scales without a marginal cost per unit",
    },
    {
      criterion: "Long-term cost",
      alternative: "Grows linearly with volume",
      nivelics: "Flat or decreasing — real economies of scale",
    },
    {
      criterion: "Process traceability",
      alternative: "Hard to audit",
      nivelics: "Full log of every run",
    },
    {
      criterion: "Impact measurement",
      alternative: "Hard to quantify",
      nivelics: "Baseline and tracking with your own data",
    },
  ],
};

const FAQ_TITLE_ES = "Preguntas frecuentes sobre Automatización de Procesos";
const FAQ_TITLE_EN = "Frequently asked questions about Process Automation";

const FAQ_ES = [
  {
    question: "¿Qué procesos se pueden automatizar con IA?",
    answer:
      "Cualquier proceso repetitivo que involucre documentos, datos o decisiones basadas en reglas: conciliaciones financieras, procesamiento de facturas, onboarding de empleados, generación de reportes, gestión de inventario, aprobaciones y flujos de trabajo multi-paso.",
  },
  {
    question: "¿Necesito reemplazar mis sistemas actuales?",
    answer:
      "No. Nos integramos con tus sistemas existentes (ERP, CRM, bases de datos, herramientas legacy) sin necesidad de migración. Construimos conectores que extraen el máximo valor de tu infraestructura actual.",
  },
  {
    question: "¿Cuánto tiempo toma implementar la automatización?",
    answer:
      "El plazo se define en el discovery: ahí mapeamos el proceso actual, identificamos cuellos de botella y definimos el alcance del MVP.",
  },
  {
    question: "¿Cómo se mide el ROI de la automatización?",
    answer:
      "Medimos tiempo de ejecución, errores, volumen procesado y costo por transacción antes y después, con tus propios datos. Definimos la línea base en el discovery para que el impacto se pueda comparar.",
  },
  {
    question: "¿Qué pasa con los empleados que hacían esas tareas?",
    answer:
      "La automatización libera a tu equipo de tareas repetitivas para que se enfoquen en trabajo de mayor valor: análisis, estrategia, relaciones con clientes. Tú defines cómo se redistribuye ese tiempo.",
  },
];
const FAQ_EN = [
  {
    question: "Which processes can be automated with AI?",
    answer:
      "Any repetitive process that involves documents, data or rule-based decisions: financial reconciliations, invoice processing, employee onboarding, report generation, inventory management, approvals and multi-step workflows.",
  },
  {
    question: "Do I need to replace my current systems?",
    answer:
      "No. We integrate with your existing systems (ERP, CRM, databases, legacy tools) without a migration. We build connectors that get the most out of your current infrastructure.",
  },
  {
    question: "How long does it take to implement the automation?",
    answer:
      "The timeline is set during discovery: that is where we map the current process, identify bottlenecks and define the scope of the MVP.",
  },
  {
    question: "How is the ROI of automation measured?",
    answer:
      "We measure execution time, errors, volume processed and cost per transaction before and after, using your own data. We set the baseline during discovery so the impact can be compared.",
  },
  {
    question: "What happens to the employees who used to do those tasks?",
    answer:
      "Automation frees your team from repetitive tasks so they can focus on higher-value work: analysis, strategy, customer relationships. You decide how that time is redistributed.",
  },
];

const CONTACT_ES = {
  title: "¿Qué proceso quieres automatizar?",
  subtitle: "Cuéntanos el caso y calculamos el ROI potencial de la automatización.",
  sticky: "Hablar con un experto →",
};
const CONTACT_EN = {
  title: "Which process do you want to automate?",
  subtitle: "Tell us about the case and we will estimate the potential ROI of automating it.",
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

export default async function AutomatizacionProcesosPage({
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
    name: isEn ? "AI Process Automation" : "Automatización de Procesos con IA",
    description: isEn ? DESCRIPTION_EN : DESCRIPTION_ES,
    url: isEn ? PATH_EN : PATH_ES,
    serviceType: "Process Automation Consulting",
  });
  const breadcrumb = getBreadcrumbSchema(
    isEn
      ? [
          { name: "Home", url: "/en" },
          { name: "Services", url: "/en/services" },
          { name: "Artificial Intelligence", url: "/en/services/artificial-intelligence" },
          { name: "Process Automation", url: PATH_EN },
        ]
      : [
          { name: "Inicio", url: "/" },
          { name: "Servicios", url: "/servicios" },
          { name: "Inteligencia Artificial", url: "/servicios/inteligencia-artificial" },
          { name: "Automatización de Procesos", url: PATH_ES },
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
              {panel.items.map((item) => (
                <li key={item.label} className="flex items-start gap-3 rounded-lg p-2">
                  <GeoIconBox name={item.icon} size={16} color="violet" />
                  <div>
                    <span className="block text-sm font-semibold text-text-100">{item.label}</span>
                    <span className="mt-0.5 block text-xs text-text-40">{item.description}</span>
                  </div>
                </li>
              ))}
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
        dataSection="automatizacion-hero"
        ariaLabel={hero.ariaLabel}
      />

      {/* Principios de diseño: reemplazan a MetricsBar, que mostraba cifras sin respaldo */}
      <DesignPrinciples locale={locale} principles={isEn ? PRINCIPLES_EN : PRINCIPLES_ES} />

      {/* Benefits from CMS (renders only when admin has populated benefits) */}
      <CmsServicioBenefits
        benefits={cms?.benefits}
        accentColor={ACCENT}
        titleEs="Por qué elegir Automatización de Procesos con Nivelics"
        titleEn="Why choose Process Automation with Nivelics"
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

      <section className="pb-4">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <p className="max-w-3xl text-sm leading-relaxed text-text-70">
            {isEn
              ? "Does your process need judgment, not just rules?"
              : "¿Tu proceso requiere decisiones con criterio, no solo reglas?"}{" "}
            <Link
              href={
                isEn
                  ? "/en/services/artificial-intelligence/ai-agents"
                  : "/servicios/inteligencia-artificial/agentes-ia"
              }
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {isEn ? "See agent engineering →" : "Conoce ingeniería de agentes →"}
            </Link>
          </p>
        </div>
      </section>

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
