// Plantilla de las 4 páginas de «Ingeniería de agentes». Cada page.tsx solo elige qué
// servicio pintar; el copy vive en lib/content/agentes.ts (ES + EN).
//
// Estas páginas NO leen la fila de `servicios`, a propósito:
//  - los campos jsonb no cubren todas las secciones y la página tiene que salir entera en EN;
//  - las URLs de CTA en la BD son rutas ES (/contacto) y en /en llevarían al español;
//  - la fila de agentes-ia en producción trae el subtítulo y SEO del servicio viejo (ventas):
//    si se desplegara antes de correr el seed, la página mezclaría ambos discursos.
// El seed (scripts/seed-servicios-agentes.ts) escribe estos mismos textos en la BD para que
// el admin, la grid del hub y llms.txt digan lo mismo que la página.
import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { PageWrapper } from "@/components/layout";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { CTABanner } from "@/components/shared";
import { BenefitCard } from "@/components/shared/benefit-card";
import { HeroSplit } from "@/components/sections/hero-split";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { TechStackGrid } from "@/components/sections/tech-stack-grid";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { StickyMobileCta } from "@/components/ui/sticky-mobile-cta";
import { GeoIconBox } from "@/lib/icons/geometric";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import {
  AGENT_ACCENT,
  AGENT_SERVICES,
  IA_PARENT,
  IA_SIBLINGS,
  type AgentServiceKey,
} from "@/lib/content/agentes";
import type { Locale } from "@/lib/cms/types";
import { AgentProofSection, DesignPrinciples, HarnessFramework } from "./agent-sections";

type Href = Parameters<typeof buildPageMetadata>[0]["href"];

export function agentServiceMetadata(key: AgentServiceKey, locale: Locale): Metadata {
  const service = AGENT_SERVICES[key];
  const copy = service[locale];
  // La plantilla del layout agrega « | Nivelics»: nunca repetirlo aquí ni en la BD.
  return buildPageMetadata({
    locale,
    href: service.path.es as Href,
    title: copy.seoTitle,
    description: copy.seoDescription,
  });
}

export function AgentServicePage({
  serviceKey,
  locale,
}: {
  serviceKey: AgentServiceKey;
  locale: Locale;
}) {
  const service = AGENT_SERVICES[serviceKey];
  const copy = service[locale];
  const isEn = locale === "en";
  const ctaPrimary = { text: copy.ctaPrimary.label, url: copy.ctaPrimary.href };
  const ctaSecondary = { text: copy.ctaSecondary.label, url: copy.ctaSecondary.href };

  const url = isEn ? service.path.en : service.path.es;
  const serviceSchema = getServiceSchema({
    locale,
    name: copy.name,
    description: copy.seoDescription,
    url,
    serviceType: copy.serviceType,
  });
  const breadcrumb = getBreadcrumbSchema(
    locale,
    isEn
      ? [
          { name: "Home", url: "/en" },
          { name: "Services", url: "/en/services" },
          { name: IA_PARENT.nameEn, url: "/en/services/artificial-intelligence" },
          { name: copy.name, url },
        ]
      : [
          { name: "Inicio", url: "/" },
          { name: "Servicios", url: "/servicios" },
          { name: IA_PARENT.name, url: "/servicios/inteligencia-artificial" },
          { name: copy.name, url },
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

      <HeroSplit
        heroEffect="particles"
        badge={copy.badge}
        // El H1 no sale del CMS: `title` es la etiqueta de la card del hub y HeroSplit
        // pinta `h1 + h1Accent` (mismo motivo que en ethical hacking).
        h1={copy.h1}
        h1Accent={copy.h1Accent}
        subtitle={copy.subtitle}
        bullets={copy.bullets}
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor={AGENT_ACCENT}
        dataSection={`${service.slug}-hero`}
        ariaLabel={`${copy.name} — ${copy.seoDescription}`}
        rightPanel={
          // Panel propio en vez de <HeroSelector>: aquel lleva textos fijos en español.
          <nav aria-label={copy.panelTitle} className="glass rounded-xl p-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-40">
              {copy.panelTitle}
            </p>
            <ul className="space-y-1">
              {copy.panel.map((item) => (
                <li key={item.label}>
                  <Link
                    href="#soluciones"
                    className="flex items-center gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-white/10 hover:bg-white/[0.03]"
                  >
                    <GeoIconBox name={item.icon} size={16} color="violet" />
                    <span className="text-sm font-medium text-text-100">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={copy.ctaPrimary.href}
              className="mt-3 block text-center text-xs font-medium transition-colors hover:brightness-125"
              style={{ color: AGENT_ACCENT }}
            >
              {isEn ? "Or tell us your case →" : "O cuéntanos tu caso →"}
            </Link>
          </nav>
        }
      />

      <DesignPrinciples locale={locale} principles={copy.principles} />

      {/* Contexto */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="max-w-3xl text-3xl font-bold text-text-100 md:text-4xl">
            {copy.contextTitle}
          </h2>
          <div className="mt-6 max-w-3xl space-y-4 text-text-70">
            {copy.contextBody.map((p) => (
              <p key={p} className="leading-relaxed">
                {p}
              </p>
            ))}
          </div>
          <Link
            href={copy.contextLink.href}
            className="mt-6 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {copy.contextLink.label}
          </Link>
        </div>
      </section>

      {/* Soluciones */}
      <section id="soluciones" className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">{copy.solutionsTitle}</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {copy.solutions.map((s) => (
              <div key={s.title} className="flex h-full flex-col">
                <BenefitCard
                  title={s.title}
                  description={s.description}
                  icon={s.icon}
                  accentColor={AGENT_ACCENT}
                />
                {s.link && (
                  <Link
                    href={s.link.href}
                    className="mt-2 px-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {s.link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {serviceKey === "agentesIa" && <HarnessFramework locale={locale} />}

      <ProcessTimeline title={copy.processTitle} steps={copy.process} accentColor={AGENT_ACCENT} />

      <TechStackGrid title={copy.stackTitle} categories={copy.stack} />

      <AgentProofSection locale={locale} />

      {/* schemaEnabled emite el FAQPage: es la única fuente de ese bloque en la página. */}
      <FAQAccordion
        title={isEn ? "Frequently asked questions" : "Preguntas frecuentes"}
        faqs={copy.faqs}
        schemaEnabled
      />

      <section className="pb-4">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <p className="max-w-3xl text-sm leading-relaxed text-text-70">
            {copy.crossLink.text}{" "}
            <Link
              href={copy.crossLink.link.href}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {copy.crossLink.link.label}
            </Link>
          </p>
        </div>
      </section>

      <CTABanner
        locale={locale}
        title={copy.ctaBanner.title}
        description={copy.ctaBanner.description}
        buttonText={copy.ctaBanner.button}
        buttonHref={copy.ctaPrimary.href}
        trustLine={
          isEn
            ? "Reply in under 24 hours · Under a confidentiality agreement"
            : "Respuesta en menos de 24 horas · Bajo acuerdo de confidencialidad"
        }
      />

      <StickyMobileCta
        text={copy.ctaBanner.button}
        url={copy.ctaPrimary.href}
        accentColor={AGENT_ACCENT}
      />
    </PageWrapper>
  );
}
