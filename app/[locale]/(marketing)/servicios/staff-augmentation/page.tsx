// CMS-connected: 2026-05-07 — sub-services, benefits, processSteps and CTAs read from DB with hardcoded fallbacks
// Bilingüe con el patrón de cloud/ciberseguridad-ethical-hacking (constantes _ES/_EN + isEn):
// el copy fijo estaba solo en español y /en lo servía así.
//
// Cifras: el respaldo duro de esta página ya no afirma «40% de ahorro». No hay soporte para
// ese número y la BD lo cambió por «Costo predecible frente a contratar en USA»; aquí se usa
// el mismo texto para que respaldo y CMS no se contradigan. Los plazos que sí se conservan
// (5 días hábiles al primer candidato, 10 días de garantía de reemplazo, 100% de la propiedad
// intelectual) son compromisos de servicio que están en el contrato, no resultados medidos.
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
import { getLocale, setRequestLocale } from "next-intl/server";
import { getServicioData, getSubserviciosData } from "@/lib/cms/get-servicio-data";
import { getAllUiLabels } from "@/lib/cms/ui-labels";
import { getSiteConfigPublic } from "@/lib/cms/queries";
import { waUrl } from "@/lib/utils/whatsapp";
import { uiLabel } from "@/lib/cms/ui-labels-helper";
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
  const cms = await getServicioData("staff-augmentation", locale);
  // La plantilla del layout añade « | Nivelics»: el título completo debe quedar bajo 65.
  return buildPageMetadata({
    locale,
    href: "/servicios/staff-augmentation",
    title:
      cms?.seoTitle ||
      (isEn
        ? "Staff Augmentation Colombia | LATAM Tech Talent"
        : "Staff Augmentation Colombia | Talento Tech LATAM"),
    description:
      cms?.seoDescription ||
      (isEn
        ? "On-demand engineering teams with vetted senior talent. Onboarding in 6 business days. Predictable cost compared with hiring in the USA or Europe."
        : "Equipos de ingeniería on-demand con talento senior verificado. Integración en 6 días hábiles. Costo predecible frente a contratar en USA o Europa."),
  });
}

const SUB_SERVICES_ES = [
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

const SUB_SERVICES_EN = [
  {
    icon: "code2",
    title: "Software Development",
    description:
      "Senior backend, frontend and full-stack engineers with React, Node.js, Python, Java and Go.",
    href: "/servicios/staff-augmentation/desarrollo-software",
  },
  {
    icon: "brain",
    title: "Data & AI",
    description:
      "Data Scientists, Data Engineers and ML Engineers for advanced analytics and machine learning.",
    href: "/servicios/staff-augmentation/datos-ia",
  },
  {
    icon: "cloud",
    title: "DevOps & Cloud",
    description: "Cloud Architects and DevOps Engineers certified on AWS, GCP and Azure.",
    href: "/servicios/staff-augmentation/devops-cloud",
  },
  {
    icon: "palette",
    title: "UX/UI Design",
    description:
      "Senior product designers experienced in design systems, research and prototyping.",
    href: "/servicios/staff-augmentation/diseno-ux-ui",
  },
  {
    icon: "shield-check",
    title: "QA & Cybersecurity",
    description:
      "QA Engineers, SDETs and cybersecurity specialists. Quality assured in every sprint.",
    href: "/servicios/staff-augmentation/qa-seguridad",
  },
];

const LOGOS_ES = [
  { name: "Two Maids", sector: "Servicios / USA" },
  { name: "Televisa / N+", sector: "Medios" },
  { name: "Grupo Bolívar", sector: "Fintech" },
  { name: "Univision", sector: "Medios" },
  { name: "AB InBev-Bavaria", sector: "CPG" },
];

const LOGOS_EN = [
  { name: "Two Maids", sector: "Services / USA" },
  { name: "Televisa / N+", sector: "Media" },
  { name: "Grupo Bolívar", sector: "Fintech" },
  { name: "Univision", sector: "Media" },
  { name: "AB InBev-Bavaria", sector: "CPG" },
];

const COMPARISON_ROWS_ES = [
  {
    criterion: "Tiempo hasta primer candidato",
    alternative: "4–8 semanas",
    nivelics: "5 días hábiles",
  },
  {
    criterion: "Costo mensual (perfil senior)",
    alternative: "Salario local + prestaciones + overhead de contratación",
    nivelics: "Tarifa mensual única y predecible",
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
];

const COMPARISON_ROWS_EN = [
  {
    criterion: "Time to first candidate",
    alternative: "4–8 weeks",
    nivelics: "5 business days",
  },
  {
    criterion: "Monthly cost (senior profile)",
    alternative: "Local salary + benefits + hiring overhead",
    nivelics: "A single, predictable monthly rate",
  },
  {
    criterion: "Hiring risk",
    alternative: "High — severance cost, benefits",
    nivelics: "Zero — no direct employment relationship",
  },
  {
    criterion: "Replacement guarantee",
    alternative: "Does not exist",
    nivelics: "Free of charge, in under 10 days",
  },
  {
    criterion: "Intellectual property",
    alternative: "Can be ambiguous",
    nivelics: "100% the client's, always",
  },
  {
    criterion: "Vetted profiles",
    alternative: "The client's own internal process",
    nivelics: "100% vetted by Nivelics",
  },
  {
    criterion: "Bilingual Spanish/English",
    alternative: "Depends on the market",
    nivelics: "Yes, every profile",
  },
  {
    criterion: "Delivery Manager included",
    alternative: "No",
    nivelics: "Yes, at no extra cost",
  },
];

// Compromisos que están por escrito en el contrato, no resultados medidos.
const GUARANTEES_ES = [
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
];

const GUARANTEES_EN = [
  {
    title: "Candidates in 5 business days",
    description:
      "We present vetted profiles within 5 days at most. If we do not have them, we tell you beforehand.",
  },
  {
    title: "Replacement in 10 days at no cost",
    description:
      "If the profile does not work out for any reason, we replace them in under 10 business days at no extra charge.",
  },
  {
    title: "Intellectual property 100% the client's",
    description: "All the code, designs and deliverables are exclusively yours. No small print.",
  },
  {
    title: "Onboarding in 6 business days",
    description:
      "The profile can be up and running in your team less than a week after you accept the proposal.",
  },
];

const PROCESS_ES = [
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
];

const PROCESS_EN = [
  {
    number: "01",
    title: "Profile brief",
    description: "You tell us what you need: stack, seniority, dedication, time zone.",
    duration: "30 minutes",
    deliverable: "Search profile defined",
  },
  {
    number: "02",
    title: "Sourcing and vetting",
    description: "We screen, run the technical interview and validate the cultural match.",
    duration: "3-4 days",
    deliverable: "Shortlist of 2-3 candidates",
  },
  {
    number: "03",
    title: "Interview with the client",
    description: "We present the profiles and you run your own interview process.",
    duration: "Day 5",
    deliverable: "Candidate selected",
  },
  {
    number: "04",
    title: "Onboarding and integration",
    description: "We coordinate access, tooling and the first days with your team.",
    duration: "Day 6-10",
    deliverable: "Profile active in your team",
  },
  {
    number: "05",
    title: "Ongoing follow-up",
    description: "An assigned Delivery Manager makes sure everything keeps working.",
    duration: "Monthly",
    deliverable: "Check-in and adjustments",
  },
];

const FAQ_ES = [
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
];

const FAQ_EN = [
  {
    question: "What is the engagement model?",
    answer:
      "Monthly per assigned resource. The recommended minimum is 3 months for the profile to generate real value, but we offer monthly flexibility with 5 business days' notice. No hidden costs, no benefits, no employment risk.",
  },
  {
    question: "Do the profiles work in our time zone?",
    answer:
      "Yes. Our engineers in Colombia have full overlap with EST (New York) and PST (California), and work whatever hours your team needs. For clients in Europe we arrange adapted schedules.",
  },
  {
    question: "How do you guarantee the technical quality of the profiles?",
    answer:
      "Every candidate goes through: a technical test on the specific stack, an interview with our CTO or tech lead, English validation (where it applies) and reference checks. We only present profiles we would hire for our own projects.",
  },
  {
    question: "What happens if the profile does not work out?",
    answer:
      "We replace them in under 10 business days at no extra cost. No questions, no bureaucracy. This guarantee is in the contract.",
  },
  {
    question: "Can you scale several profiles at once?",
    answer:
      "Yes. We have scaled teams of up to 15 people simultaneously for clients with urgent needs. We keep an active bench and a network of vetted talent to scale quickly when it is needed.",
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
  const isEn = locale === "en";
  const [cms, uiLabels, config] = await Promise.all([
    getServicioData("staff-augmentation", locale),
    getAllUiLabels(),
    getSiteConfigPublic().catch(() => null),
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
      url: waUrl(config?.phoneWhatsapp),
    },
  });
  const serviceSchema = getServiceSchema({
    locale,
    name: "Staff Augmentation Premium",
    description: isEn
      ? "Senior bilingual Colombian tech talent. Onboarding in 6 business days. Predictable cost compared with hiring in the USA or Europe."
      : "Talento tech colombiano bilingüe senior. Integración en 6 días hábiles. Costo predecible frente a contratar en USA o Europa.",
    url: "/servicios/staff-augmentation",
    serviceType: "Staff Augmentation",
  });

  return (
    <PageWrapper className="pt-16">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* 1. Hero — HeroSplit + HeroCalculator */}
      <HeroSplit
        heroEffect="diagonal"
        badge="Staff Augmentation Premium"
        // El H1 se arma como `h1 + h1Accent`. `cms.title` es «Talento tech en 5 días» /
        // «Tech talent in 5 days»: HeroSplit recorta la cola que el acento ya dice, así que
        // sale «Talento tech en 5 días hábiles» / «Tech talent in 5 business days».
        h1={cms?.title || (isEn ? "Colombian tech talent" : "Talento tech colombiano")}
        h1Accent={isEn ? "in 5 business days" : "en 5 días hábiles"}
        subtitle={
          cms?.subtitle ||
          (isEn
            ? "Developers, data engineers and designers, vetted and embedded in your team. No employment risk, no hidden costs."
            : "Desarrolladores, data engineers y diseñadores validados e integrados en tu equipo. Sin riesgos laborales, sin costos ocultos.")
        }
        bullets={
          isEn
            ? [
                "Candidates presented within 5 business days at most",
                "Predictable cost compared with hiring in the USA or Europe",
                "Replacement guarantee in under 10 days",
              ]
            : [
                "Candidatos presentados en máximo 5 días hábiles",
                "Costo predecible frente a contratar en USA o Europa",
                "Garantía de reemplazo en menos de 10 días",
              ]
        }
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor="#10B981"
        rightPanel={<HeroCalculator type="staff" accentColor="#10B981" />}
        dataSection="staff-augmentation-hero"
        ariaLabel={
          isEn
            ? "Staff Augmentation Premium — bilingual Colombian tech talent onboarded in 5 business days, at a predictable cost compared with the USA or Europe"
            : "Staff Augmentation Premium — talento tech colombiano bilingüe integrado en 5 días hábiles, con costo predecible frente a USA o Europa"
        }
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
            : /* LEGACY FALLBACK */ isEn
              ? [
                  {
                    value: "5",
                    label: "Business days",
                    sublabel: "to present the first candidate",
                  },
                  {
                    value: "10",
                    label: "Days of guarantee",
                    sublabel: "free replacement if it is not the right fit",
                  },
                  {
                    value: "100%",
                    label: "Intellectual property",
                    sublabel: "always the client's, no exceptions",
                  },
                ]
              : [
                  {
                    value: "5",
                    label: "Días hábiles",
                    sublabel: "para presentar el primer candidato",
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
        fallback={(isEn ? SUB_SERVICES_EN : SUB_SERVICES_ES).map((s) => ({
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
        title={isEn ? "Teams we have scaled" : "Equipos que hemos ampliado"}
        logos={isEn ? LOGOS_EN : LOGOS_ES}
      />

      {/* 5. ComparisonTable */}
      <ComparisonTable
        title={uiLabel(uiLabels, "servicio.staffaug_why_title", locale)}
        alternativeLabel={
          isEn ? "Hiring directly in the USA/Europe" : "Contratar directo en USA/Europa"
        }
        nivelicsLabel="Nivelics Staff Augmentation"
        criterionLabel={isEn ? "Criterion" : undefined}
        rows={isEn ? COMPARISON_ROWS_EN : COMPARISON_ROWS_ES}
      />

      {/* 6. Guarantees */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            {isEn ? "What we guarantee in writing" : "Lo que garantizamos por escrito"}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(isEn ? GUARANTEES_EN : GUARANTEES_ES).map((g) => (
              <div
                key={g.title}
                className="rounded-xl border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.04)] p-5"
              >
                <h3 className="text-sm font-semibold text-text-100">{g.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-text-70">{g.description}</p>
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
        title={isEn ? "How the process works" : "Cómo funciona el proceso"}
        accentColor="#10B981"
        steps={isEn ? PROCESS_EN : PROCESS_ES}
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
        sector={isEn ? "Services / Technology" : "Servicios / Tecnología"}
        country="USA"
        countryFlag="🇺🇸"
        result={
          isEn
            ? "Technical team scaled in under 10 days"
            : "Escalamiento del equipo técnico en menos de 10 días"
        }
        metric={
          isEn
            ? "Predictable cost compared with hiring locally in the USA"
            : "Costo predecible frente a contratar localmente en USA"
        }
        service="Staff Augmentation"
        url="/casos-de-exito/two-maids"
      />

      {/* 9. FAQAccordion */}
      <FAQAccordion
        title={uiLabel(uiLabels, "servicio.staffaug_faqs_title", locale)}
        schemaEnabled
        faqs={cms?.faqs?.length ? cms.faqs : /* LEGACY FALLBACK */ isEn ? FAQ_EN : FAQ_ES}
      />

      {/* 10. InlineContactForm */}
      <InlineContactForm
        title={isEn ? "What profile do you need?" : "¿Qué perfil necesitas?"}
        subtitle={
          isEn
            ? "Tell us the stack and the seniority. In 5 days you have candidates."
            : "Cuéntanos el stack y el nivel. En 5 días tienes candidatos."
        }
        serviceDefault="staffing"
      />
    </PageWrapper>
  );
}
