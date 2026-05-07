// CMS-connected: 2026-05-07 — sub-services, benefits, processSteps and CTAs read from DB with hardcoded fallbacks
import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { HeroSplit } from "@/components/sections/hero-split";
import { HeroCalculator } from "@/components/sections/hero-calculator";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { MetricsBar } from "@/components/sections/metrics-bar";
import { ClientLogosBar } from "@/components/sections/client-logos-bar";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { InlineContactForm } from "@/components/sections/inline-contact-form";
import {
  CmsServicioBenefits,
  CmsServicioProcess,
  CmsSubServicesGrid,
  resolveServicioCtas,
} from "@/components/sections/cms-servicio-sections";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getFAQSchema } from "@/lib/schema/faq";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getServicioData, getSubserviciosData } from "@/lib/cms/get-servicio-data";
import { getAllUiLabels } from "@/lib/cms/ui-labels";
import { uiLabel } from "@/lib/cms/ui-labels-helper";
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
  const cms = await getServicioData("staff-augmentation", locale);
  return {
    title: cms?.seoTitle || "Staff Augmentation Premium Colombia | Talento Tech LATAM",
    description:
      cms?.seoDescription ||
      "Equipos de ingeniería on-demand con talento senior verificado. Integración en 6 días hábiles. Ahorro hasta 40% vs. USA/Europa.",
    alternates: {
      canonical: "https://www.nivelics.com/servicios/staff-augmentation",
      languages: {
        es: "https://www.nivelics.com/servicios/staff-augmentation",
        en: "https://www.nivelics.com/en/services/staff-augmentation",
        "x-default": "https://www.nivelics.com/servicios/staff-augmentation",
      },
    },
  };
}

const SUB_SERVICES = [
  {
    icon: "code2",
    title: "Desarrollo de Software",
    description:
      "Backend, Frontend y Full-Stack engineers senior con React, Node.js, Python, Java y Go.",
    href: "/servicios/staff-augmentation/desarrollo-software",
  },
  {
    icon: "brain",
    title: "Datos e IA",
    description:
      "Data Scientists, Data Engineers y ML Engineers para analítica avanzada y machine learning.",
    href: "/servicios/staff-augmentation/datos-ia",
  },
  {
    icon: "cloud",
    title: "DevOps y Cloud",
    description: "Cloud Architects y DevOps Engineers certificados en AWS, GCP y Azure.",
    href: "/servicios/staff-augmentation/devops-cloud",
  },
  {
    icon: "palette",
    title: "Diseño UX/UI",
    description:
      "Product designers senior con experiencia en design systems, research y prototipado.",
    href: "/servicios/staff-augmentation/diseno-ux-ui",
  },
  {
    icon: "shield-check",
    title: "QA y Ciberseguridad",
    description:
      "QA Engineers, SDET y especialistas en ciberseguridad. Calidad garantizada en cada sprint.",
    href: "/servicios/staff-augmentation/qa-seguridad",
  },
];

export default async function StaffAugmentationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const [cms, uiLabels] = await Promise.all([
    getServicioData("staff-augmentation", locale),
    getAllUiLabels(),
  ]);
  const subs = cms ? await getSubserviciosData(cms.id, locale) : [];
  const cmsSubItems = subs.map((s) => ({
    slug: s.slug,
    title: s.title,
    subtitle: s.subtitle,
    icon: s.icon,
  }));
  const { ctaPrimary, ctaSecondary } = resolveServicioCtas({
    primary: cms ? { text: cms.ctaPrimaryText, url: cms.ctaPrimaryUrl } : null,
    secondary: cms ? { text: cms.ctaSecondaryText, url: cms.ctaSecondaryUrl } : null,
    fallbackPrimary: {
      text: uiLabel(uiLabels, "servicio.staffaug_cta_view_profiles", locale),
      url: "#perfiles",
    },
    fallbackSecondary: {
      text: uiLabel(uiLabels, "servicio.staffaug_cta_whatsapp", locale),
      url: "https://wa.me/573103926621",
    },
  });
  const serviceSchema = getServiceSchema({
    name: "Staff Augmentation Premium",
    description:
      "Talento tech colombiano bilingüe senior. Integración en 6 días hábiles. Ahorro hasta 40% vs. USA/Europa.",
    url: "/servicios/staff-augmentation",
    serviceType: "Staff Augmentation",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Staff Augmentation", url: "/servicios/staff-augmentation" },
  ]);

  return (
    <PageWrapper className="pt-16">
      {/* JSON-LD Schemas */}
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getFAQSchema([
              {
                question: "¿Cuánto tarda Nivelics en presentar candidatos de Staff Augmentation?",
                answer:
                  "Presentamos candidatos calificados en 5 días hábiles. Cada perfil pasa por pruebas técnicas y validación de soft skills antes de ser presentado. La integración completa al equipo del cliente se logra en 6 días hábiles.",
              },
              {
                question: "¿Qué garantía ofrece Nivelics si el candidato no funciona?",
                answer:
                  "Ofrecemos garantía de reemplazo sin costo en menos de 10 días. Además, asignamos un Delivery Manager dedicado que acompaña al profesional durante todo el engagement para asegurar calidad y alineación.",
              },
              {
                question: "¿Qué roles tech ofrece Nivelics en Staff Augmentation?",
                answer:
                  "Ofrecemos Frontend y Backend Engineers, Mobile Developers, DevOps y Cloud Engineers, Data y ML Engineers, QA Engineers, Tech Leads, Architects, Product Managers y Scrum Masters, todos con seniority verificado.",
              },
            ]),
          ),
        }}
      />

      {/* 1. Hero — HeroSplit + HeroCalculator */}
      <HeroSplit
        heroEffect="diagonal"
        badge="Staff Augmentation Premium"
        h1={cms?.title || "Talento tech colombiano"}
        h1Accent="en 5 días hábiles"
        subtitle={
          cms?.subtitle ||
          "Desarrolladores, data engineers y diseñadores validados e integrados en tu equipo. Sin riesgos laborales, sin costos ocultos."
        }
        bullets={[
          "Candidatos presentados en máximo 5 días hábiles",
          "40% de ahorro vs. contratar en USA o Europa",
          "Garantía de reemplazo en menos de 10 días",
        ]}
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor="#10B981"
        rightPanel={<HeroCalculator type="staff" accentColor="#10B981" />}
        dataSection="staff-augmentation-hero"
        ariaLabel="Staff Augmentation Premium — talento tech colombiano bilingüe integrado en 5 días hábiles, ahorro del 40% vs USA o Europa"
      />

      {/* 2. MetricsBar */}
      <MetricsBar
        metrics={
          cms?.metrics?.length
            ? cms.metrics.map((m) => ({
                value: m.value,
                label: m.label,
                sublabel: "",
                unit: m.unit,
              }))
            : /* LEGACY FALLBACK */ [
                {
                  value: "5",
                  label: "Días hábiles",
                  sublabel: "para presentar el primer candidato",
                },
                {
                  value: "40%",
                  label: "Ahorro promedio",
                  sublabel: "vs. contratar directo en USA o Europa",
                },
                {
                  value: "10",
                  label: "Días de garantía",
                  sublabel: "reemplazo sin costo si no encaja",
                },
                {
                  value: "100%",
                  label: "Propiedad intelectual",
                  sublabel: "siempre del cliente, sin excepción",
                },
              ]
        }
      />

      {/* 3. Sub-services */}
      <CmsSubServicesGrid
        cmsItems={cmsSubItems}
        fallback={SUB_SERVICES.map((s) => ({
          icon: s.icon,
          title: s.title,
          description: s.description,
          href: s.href,
        }))}
        parentSlug="staff-augmentation"
        titleEs="Soluciones especializadas"
        titleEn="Specialised solutions"
        locale={locale}
        iconColor="green"
      />

      {/* 4. ClientLogosBar */}
      <ClientLogosBar
        title="Equipos que hemos ampliado"
        logos={[
          { name: "Two Maids", sector: "Servicios / USA" },
          { name: "Televisa / N+", sector: "Medios" },
          { name: "Grupo Bolívar", sector: "Fintech" },
          { name: "Univision", sector: "Medios" },
          { name: "AB InBev-Bavaria", sector: "CPG" },
        ]}
      />

      {/* 5. ComparisonTable */}
      <ComparisonTable
        title={uiLabel(uiLabels, "servicio.staffaug_why_title", locale)}
        alternativeLabel="Contratar directo en USA/Europa"
        nivelicsLabel="Nivelics Staff Augmentation"
        rows={[
          {
            criterion: "Tiempo hasta primer candidato",
            alternative: "4–8 semanas",
            nivelics: "5 días hábiles",
          },
          {
            criterion: "Costo mensual (perfil senior)",
            alternative: "$12,000–$18,000 USD",
            nivelics: "Hasta 40% menos",
          },
          {
            criterion: "Riesgo de contratación",
            alternative: "Alto — costo de despido, beneficios",
            nivelics: "Cero — sin relación laboral directa",
          },
          {
            criterion: "Garantía de reemplazo",
            alternative: "No existe",
            nivelics: "Sin costo, en menos de 10 días",
          },
          {
            criterion: "Propiedad intelectual",
            alternative: "Puede ser ambigua",
            nivelics: "100% del cliente, siempre",
          },
          {
            criterion: "Perfiles validados",
            alternative: "Proceso interno del cliente",
            nivelics: "100% validados por Nivelics",
          },
          {
            criterion: "Bilingüe español/inglés",
            alternative: "Depende del mercado",
            nivelics: "Sí, todos los perfiles",
          },
          {
            criterion: "Delivery Manager incluido",
            alternative: "No",
            nivelics: "Sí, sin costo adicional",
          },
        ]}
      />

      {/* 6. Guarantees */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Lo que garantizamos por escrito</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Candidatos en 5 días hábiles",
                description:
                  "Presentamos perfiles validados en máximo 5 días. Si no los tenemos, te lo decimos antes.",
              },
              {
                title: "Reemplazo en 10 días sin costo",
                description:
                  "Si el perfil no funciona por cualquier razón, lo reemplazamos en menos de 10 días hábiles sin cargo adicional.",
              },
              {
                title: "Propiedad intelectual 100% del cliente",
                description:
                  "Todo el código, diseños y entregables son exclusivamente tuyos. Sin letra pequeña.",
              },
              {
                title: "Integración en 6 días hábiles",
                description:
                  "El perfil puede estar operativo en tu equipo en menos de una semana de aceptar la propuesta.",
              },
            ].map((g) => (
              <div
                key={g.title}
                className="rounded-xl border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.04)] p-5"
              >
                <h3 className="text-sm font-semibold text-text-100">{g.title}</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-text-70">{g.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits from CMS (renders only when admin has populated benefits) */}
      <CmsServicioBenefits
        benefits={cms?.benefits}
        accentColor="#10B981"
        titleEs="Beneficios del enfoque Staff Augmentation"
        titleEn="Benefits of the Staff Augmentation approach"
        locale={locale}
      />

      {/* 7. ProcessTimeline */}
      <ProcessTimeline
        title="Cómo funciona el proceso"
        accentColor="#10B981"
        steps={[
          {
            number: "01",
            title: "Brief de perfil",
            description: "Nos cuentas qué necesitas: stack, nivel, dedicación, zona horaria.",
            duration: "30 minutos",
            deliverable: "Perfil de búsqueda definido",
          },
          {
            number: "02",
            title: "Selección y validación",
            description: "Filtramos, entrevistamos técnicamente y validamos el match cultural.",
            duration: "3-4 días",
            deliverable: "Shortlist de 2-3 candidatos",
          },
          {
            number: "03",
            title: "Entrevista con el cliente",
            description: "Presentamos los perfiles y coordinas tu propio proceso de entrevista.",
            duration: "Día 5",
            deliverable: "Candidato seleccionado",
          },
          {
            number: "04",
            title: "Onboarding e integración",
            description: "Coordinamos el acceso, herramientas y primeros días con tu equipo.",
            duration: "Día 6-10",
            deliverable: "Perfil activo en tu equipo",
          },
          {
            number: "05",
            title: "Seguimiento continuo",
            description: "Delivery Manager asignado para asegurar que todo funcione bien.",
            duration: "Mensual",
            deliverable: "Check-in y ajustes",
          },
        ]}
      />

      {/* Process from CMS (renders only when admin has populated processSteps) */}
      <CmsServicioProcess
        steps={cms?.processSteps}
        accentColor="#10B981"
        titleEs="Cómo lo entregamos"
        titleEn="How we deliver"
        locale={locale}
      />

      {/* 8. CaseStudyCard */}
      <CaseStudyCard
        client="Two Maids"
        sector="Servicios / Tecnología"
        country="USA"
        countryFlag="🇺🇸"
        result="Escalamiento del equipo técnico en menos de 10 días"
        metric="40% de ahorro vs. contratar localmente en USA"
        service="Staff Augmentation"
        url="/casos-de-exito/two-maids"
      />

      {/* 9. FAQAccordion */}
      <FAQAccordion
        title={uiLabel(uiLabels, "servicio.staffaug_faqs_title", locale)}
        schemaEnabled
        faqs={
          cms?.faqs?.length
            ? cms.faqs
            : /* LEGACY FALLBACK */ [
                {
                  question: "¿Cuál es el modelo de contratación?",
                  answer:
                    "Mensual por recurso asignado. El mínimo recomendado es 3 meses para que el perfil genere valor real, pero ofrecemos flexibilidad mensual con preaviso de 5 días hábiles. Sin costos ocultos, sin prestaciones, sin riesgos laborales.",
                },
                {
                  question: "¿Los perfiles trabajan en nuestra zona horaria?",
                  answer:
                    "Sí. Nuestros ingenieros en Colombia tienen overlap total con EST (New York) y PST (California), y trabajan en los horarios que tu equipo necesite. Para clientes en Europa coordinamos horarios adaptados.",
                },
                {
                  question: "¿Cómo garantizan la calidad técnica de los perfiles?",
                  answer:
                    "Todo candidato pasa por: prueba técnica en el stack específico, entrevista con nuestro CTO o lead técnico, validación de inglés (si aplica) y verificación de referencias. Solo presentamos perfiles que nosotros contrataríamos para nuestros propios proyectos.",
                },
                {
                  question: "¿Qué pasa si el perfil no funciona?",
                  answer:
                    "Lo reemplazamos en menos de 10 días hábiles sin costo adicional. Sin preguntas, sin burocracia. Esta garantía está en el contrato.",
                },
                {
                  question: "¿Pueden escalar varios perfiles a la vez?",
                  answer:
                    "Sí. Hemos escalado equipos de hasta 15 personas simultáneamente para clientes con necesidades urgentes. Contamos con bench activo y red de talentos validados para escalar rápido cuando se necesita.",
                },
              ]
        }
      />

      {/* 10. InlineContactForm */}
      <InlineContactForm
        title="¿Qué perfil necesitas?"
        subtitle="Cuéntanos el stack y el nivel. En 5 días tienes candidatos."
        serviceDefault="staffing"
      />
    </PageWrapper>
  );
}
