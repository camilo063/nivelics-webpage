// CMS-connected: 2026-05-07 — sub-services, benefits, processSteps and CTAs read from DB with hardcoded fallbacks
// Bilingüe con el patrón de cloud/ciberseguridad-ethical-hacking (constantes _ES/_EN + isEn):
// el copy fijo estaba solo en español y /en lo servía así.
import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { getServiceSchema } from "@/lib/schema/service";
import { HeroSplit } from "@/components/sections/hero-split";
import { HeroSelector } from "@/components/sections/hero-selector";
import { MetricsBar } from "@/components/sections/metrics-bar";
import { ClientLogosBar } from "@/components/sections/client-logos-bar";
import { TechStackGrid } from "@/components/sections/tech-stack-grid";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { IndustryGrid } from "@/components/sections/industry-grid";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { InlineContactForm } from "@/components/sections/inline-contact-form";
import {
  CmsServicioBenefits,
  CmsServicioProcess,
  CmsSubServicesGrid,
  resolveServicioCtas,
} from "@/components/sections/cms-servicio-sections";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getServicioData, getSubserviciosData } from "@/lib/cms/get-servicio-data";
import { getAllUiLabels } from "@/lib/cms/ui-labels";
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
  const cms = await getServicioData("desarrollo-digital", locale);
  // El layout aplica la plantilla "%s | Nivelics" — nunca repetir el sufijo aquí.
  return buildPageMetadata({
    locale,
    href: "/servicios/desarrollo-digital",
    title:
      cms?.seoTitle ||
      (isEn
        ? "Software and App Development | Digital Platforms"
        : "Desarrollo de Software y Apps | Plataformas Digitales"),
    description:
      cms?.seoDescription ||
      (isEn
        ? "Development of digital products, web and mobile applications with agile methodologies and modern architecture."
        : "Desarrollo de productos digitales, aplicaciones web y móviles con metodologías ágiles y arquitectura moderna."),
  });
}

const SUB_SERVICES_ES = [
  {
    icon: "bot",
    title: "Sitios Web Agentic-First",
    description:
      "Sitios navegables por personas Y por IA, agentes y LLMs. Multi-idioma, Schema.org completo, Core Web Vitals ≥95 y llms.txt.",
    href: "/servicios/desarrollo-digital/sitios-web-agentic",
  },
  {
    icon: "smartphone",
    title: "Apps Móviles",
    description:
      "Apps nativas y cross-platform con React Native, Flutter, Swift y Kotlin. De la idea al App Store.",
    href: "/servicios/desarrollo-digital/apps-moviles",
  },
  {
    icon: "globe",
    title: "Plataformas Web",
    description:
      "Plataformas web empresariales con React, Next.js y Node.js. Arquitectura moderna y escalable.",
    href: "/servicios/desarrollo-digital/plataformas-web",
  },
  {
    icon: "shopping-cart",
    title: "E-commerce",
    description:
      "Tiendas digitales B2B y B2C con catálogo, pricing dinámico, pasarelas de pago e integración ERP.",
    href: "/servicios/desarrollo-digital/ecommerce",
  },
];

const SUB_SERVICES_EN = [
  {
    icon: "bot",
    title: "Agentic-First Websites",
    description:
      "Sites navigable by people AND by AI, agents and LLMs. Multi-language, full Schema.org, Core Web Vitals ≥95 and llms.txt.",
    href: "/servicios/desarrollo-digital/sitios-web-agentic",
  },
  {
    icon: "smartphone",
    title: "Mobile Apps",
    description:
      "Native and cross-platform apps with React Native, Flutter, Swift and Kotlin. From idea to the App Store.",
    href: "/servicios/desarrollo-digital/apps-moviles",
  },
  {
    icon: "globe",
    title: "Web Platforms",
    description:
      "Enterprise web platforms with React, Next.js and Node.js. Modern, scalable architecture.",
    href: "/servicios/desarrollo-digital/plataformas-web",
  },
  {
    icon: "shopping-cart",
    title: "E-commerce",
    description:
      "B2B and B2C digital stores with catalogue, dynamic pricing, payment gateways and ERP integration.",
    href: "/servicios/desarrollo-digital/ecommerce",
  },
];

const HERO_OPTIONS_ES = [
  {
    icon: "🤖",
    label: "Sitio Agentic-First",
    url: "/servicios/desarrollo-digital/sitios-web-agentic",
    description: "Indexable por IA, LLMs y agentes. Multi-idioma.",
  },
  {
    icon: "📱",
    label: "App móvil",
    url: "/servicios/desarrollo-digital/apps-moviles",
    description: "iOS, Android, Flutter o React Native",
  },
  {
    icon: "🛒",
    label: "E-commerce",
    url: "/servicios/desarrollo-digital/ecommerce",
    description: "Tienda propia sin comisiones de plataforma",
  },
  {
    icon: "🌐",
    label: "Plataforma web",
    url: "/servicios/desarrollo-digital/plataformas-web",
    description: "App web empresarial escalable",
  },
];

const HERO_OPTIONS_EN = [
  {
    icon: "🤖",
    label: "Agentic-First site",
    url: "/servicios/desarrollo-digital/sitios-web-agentic",
    description: "Indexable by AI, LLMs and agents. Multi-language.",
  },
  {
    icon: "📱",
    label: "Mobile app",
    url: "/servicios/desarrollo-digital/apps-moviles",
    description: "iOS, Android, Flutter or React Native",
  },
  {
    icon: "🛒",
    label: "E-commerce",
    url: "/servicios/desarrollo-digital/ecommerce",
    description: "Your own store, no platform commissions",
  },
  {
    icon: "🌐",
    label: "Web platform",
    url: "/servicios/desarrollo-digital/plataformas-web",
    description: "Scalable enterprise web app",
  },
];

const TECH_STACK_ES = [
  { name: "Frontend", items: ["React", "Next.js", "Vue.js", "TypeScript"] },
  { name: "Mobile", items: ["React Native", "Flutter", "Swift", "Kotlin"] },
  { name: "Backend", items: ["Node.js", "Python", "Go", "NestJS"] },
  { name: "Cloud", items: ["AWS", "GCP", "Vercel", "Docker", "Kubernetes"] },
  { name: "E-commerce", items: ["Shopify", "WooCommerce", "Plataformas propias"] },
  { name: "Bases de datos", items: ["PostgreSQL", "MongoDB", "Redis", "Supabase"] },
];

const TECH_STACK_EN = [
  { name: "Frontend", items: ["React", "Next.js", "Vue.js", "TypeScript"] },
  { name: "Mobile", items: ["React Native", "Flutter", "Swift", "Kotlin"] },
  { name: "Backend", items: ["Node.js", "Python", "Go", "NestJS"] },
  { name: "Cloud", items: ["AWS", "GCP", "Vercel", "Docker", "Kubernetes"] },
  { name: "E-commerce", items: ["Shopify", "WooCommerce", "In-house platforms"] },
  { name: "Databases", items: ["PostgreSQL", "MongoDB", "Redis", "Supabase"] },
];

const PROCESS_ES = [
  {
    number: "01",
    title: "Discovery",
    description: "Entendemos el negocio, definimos el alcance y validamos viabilidad técnica.",
    duration: "Semana 1",
    deliverable: "Brief técnico + propuesta",
  },
  {
    number: "02",
    title: "Arquitectura",
    description: "Diseñamos la arquitectura técnica y el plan de sprints.",
    duration: "Semana 2",
    deliverable: "Arquitectura aprobada",
  },
  {
    number: "03",
    title: "Sprints de desarrollo",
    description: "Iteraciones de 2 semanas con demo al cliente al final de cada sprint.",
    duration: "Semanas 3-N",
    deliverable: "Demo quincenal",
  },
  {
    number: "04",
    title: "QA y launch",
    description: "Testing completo, correcciones y lanzamiento a producción.",
    duration: "Última semana",
    deliverable: "Producto en producción",
  },
  {
    number: "05",
    title: "Soporte post-launch",
    description: "Mantenimiento, monitoreo y evolución del producto.",
    duration: "Ongoing",
    deliverable: "SLA y roadmap",
  },
];

const PROCESS_EN = [
  {
    number: "01",
    title: "Discovery",
    description: "We learn the business, define the scope and validate technical feasibility.",
    duration: "Week 1",
    deliverable: "Technical brief + proposal",
  },
  {
    number: "02",
    title: "Architecture",
    description: "We design the technical architecture and the sprint plan.",
    duration: "Week 2",
    deliverable: "Approved architecture",
  },
  {
    number: "03",
    title: "Development sprints",
    description: "Two-week iterations with a client demo at the end of every sprint.",
    duration: "Weeks 3-N",
    deliverable: "Demo every two weeks",
  },
  {
    number: "04",
    title: "QA and launch",
    description: "Full testing, fixes and release to production.",
    duration: "Final week",
    deliverable: "Product in production",
  },
  {
    number: "05",
    title: "Post-launch support",
    description: "Maintenance, monitoring and evolution of the product.",
    duration: "Ongoing",
    deliverable: "SLA and roadmap",
  },
];

const INDUSTRIES_ES = [
  {
    name: "Medios y Entretenimiento",
    description: "Plataformas de contenido y streaming",
    url: "/industrias/medios-entretenimiento",
  },
  {
    name: "Retail y E-commerce",
    description: "Tiendas digitales y omnicanalidad",
    url: "/industrias/retail-ecommerce",
  },
  {
    name: "Fintech",
    description: "Banca digital, pagos y regulación",
    url: "/industrias/fintech",
  },
  {
    name: "Salud",
    description: "HealthTech con cumplimiento regulatorio",
    url: "/industrias/salud",
  },
  {
    name: "Logística",
    description: "Supply chain y trazabilidad",
    url: "/industrias/logistica",
  },
  {
    name: "Manufactura",
    description: "Industria 4.0 y automatización",
    url: "/industrias/manufactura",
  },
];

const INDUSTRIES_EN = [
  {
    name: "Media and Entertainment",
    description: "Content and streaming platforms",
    url: "/industrias/medios-entretenimiento",
  },
  {
    name: "Retail and E-commerce",
    description: "Digital stores and omnichannel",
    url: "/industrias/retail-ecommerce",
  },
  {
    name: "Fintech",
    description: "Digital banking, payments and regulation",
    url: "/industrias/fintech",
  },
  {
    name: "Healthcare",
    description: "HealthTech with regulatory compliance",
    url: "/industrias/salud",
  },
  {
    name: "Logistics",
    description: "Supply chain and traceability",
    url: "/industrias/logistica",
  },
  {
    name: "Manufacturing",
    description: "Industry 4.0 and automation",
    url: "/industrias/manufactura",
  },
];

const FAQ_ES = [
  {
    question: "¿Qué tecnologías usa Nivelics para desarrollo de software?",
    answer:
      "Usamos React, Next.js y Node.js para aplicaciones web, React Native y Flutter para apps móviles, y arquitecturas serverless y de microservicios con APIs RESTful y GraphQL. Elegimos la stack según las necesidades del proyecto.",
  },
  {
    question: "¿Cuánto tiempo toma desarrollar un MVP?",
    answer:
      "Un MVP funcional puede estar listo en 6-10 semanas usando metodología lean y sprints ágiles. Esto incluye product discovery, diseño UX, desarrollo, QA y despliegue en producción.",
  },
  {
    question: "¿Nivelics desarrolla aplicaciones móviles nativas?",
    answer:
      "Sí, desarrollamos apps móviles nativas para iOS (Swift) y Android (Kotlin), así como aplicaciones cross-platform con React Native y Flutter. Recomendamos el enfoque óptimo según el presupuesto, timeline y requerimientos técnicos del proyecto.",
  },
  {
    question: "¿Qué pasa con la propiedad del código?",
    answer:
      "El código es 100% del cliente, siempre. Entregamos el repositorio completo con documentación. Sin vendor lock-in.",
  },
  {
    question: "¿Ofrecen mantenimiento post-lanzamiento?",
    answer:
      "Sí. Ofrecemos planes de soporte continuo (MRR) que incluyen monitoreo, corrección de bugs, actualizaciones de seguridad y evolución del producto.",
  },
];

const FAQ_EN = [
  {
    question: "Which technologies does Nivelics use for software development?",
    answer:
      "We use React, Next.js and Node.js for web applications, React Native and Flutter for mobile apps, and serverless and microservice architectures with RESTful and GraphQL APIs. We pick the stack according to what the project needs.",
  },
  {
    question: "How long does it take to build an MVP?",
    answer:
      "A working MVP can be ready in 6-10 weeks using a lean methodology and agile sprints. That covers product discovery, UX design, development, QA and deployment to production.",
  },
  {
    question: "Does Nivelics build native mobile applications?",
    answer:
      "Yes. We build native mobile apps for iOS (Swift) and Android (Kotlin), as well as cross-platform applications with React Native and Flutter. We recommend the best approach based on the project's budget, timeline and technical requirements.",
  },
  {
    question: "What happens with code ownership?",
    answer:
      "The code is 100% the client's, always. We hand over the full repository with documentation. No vendor lock-in.",
  },
  {
    question: "Do you offer post-launch maintenance?",
    answer:
      "Yes. We offer ongoing support plans (MRR) covering monitoring, bug fixing, security updates and evolution of the product.",
  },
];

export default async function DesarrolloDigitalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const [cms, uiLabels] = await Promise.all([
    getServicioData("desarrollo-digital", locale),
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
      text: isEn ? "Tell us about your project" : "Cuéntanos tu proyecto",
      url: "/contacto",
    },
    fallbackSecondary: {
      text: isEn ? "See success stories" : "Ver casos de éxito",
      url: "/casos-de-exito",
    },
  });
  const serviceSchema = getServiceSchema({
    locale,
    name: isEn ? "Digital Development" : "Desarrollo Digital",
    description: isEn
      ? "Development of digital products, web and mobile applications with agile methodologies."
      : "Desarrollo de productos digitales, aplicaciones web y móviles con metodologías ágiles.",
    url: "/servicios/desarrollo-digital",
    serviceType: "Software Development",
  });

  return (
    <PageWrapper>
      {/* JSON-LD schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero */}
      <HeroSplit
        heroEffect="diagonal"
        badge={isEn ? "Digital Development" : "Desarrollo Digital"}
        h1={cms?.title || (isEn ? "From concept" : "Del concepto")}
        h1Accent={isEn ? "to production" : "a producción"}
        subtitle={
          cms?.subtitle ||
          (isEn
            ? "We design and build mobile apps, web platforms and e-commerce with modern architecture and a release every 2 weeks."
            : "Diseñamos y construimos apps móviles, plataformas web y e-commerce con arquitectura moderna y entregas cada 2 semanas.")
        }
        bullets={
          isEn
            ? [
                "A demo every two weeks — you always know where we are",
                "The code is 100% yours from the first sprint",
                "QA built in — not a final step, part of the process",
              ]
            : [
                "Demo quincenal — siempre sabes en qué estamos",
                "Código 100% tuyo desde el primer sprint",
                "QA integrado — no es un paso final, es parte del proceso",
              ]
        }
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor="#06B6D4"
        rightPanel={
          <HeroSelector
            title={isEn ? "What are you building?" : "¿Qué estás construyendo?"}
            accentColor="#06B6D4"
            options={isEn ? HERO_OPTIONS_EN : HERO_OPTIONS_ES}
          />
        }
        dataSection="desarrollo-digital-hero"
        ariaLabel={
          isEn
            ? "Digital Development — from concept to production: mobile apps, web platforms and e-commerce with a release every 2 weeks"
            : "Desarrollo Digital — del concepto a producción, apps móviles, plataformas web y e-commerce con entregas cada 2 semanas"
        }
      />

      {/* Metrics */}
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
                  { value: "14+", label: "Years of experience", sublabel: "since 2012" },
                  { value: "7", label: "Countries", sublabel: "Colombia, USA, Mexico and more" },
                  { value: "100%", label: "Code ownership", sublabel: "always the client's" },
                ]
              : [
                  { value: "14+", label: "Años de experiencia", sublabel: "desde 2012" },
                  { value: "7", label: "Países", sublabel: "Colombia, USA, México y más" },
                  {
                    value: "100%",
                    label: "Propiedad del código",
                    sublabel: "siempre del cliente",
                  },
                ]
        }
      />

      {/* Sub-services */}
      <CmsSubServicesGrid
        cmsItems={cmsSubItems}
        fallback={(isEn ? SUB_SERVICES_EN : SUB_SERVICES_ES).map((s) => ({
          icon: s.icon,
          title: s.title,
          description: s.description,
          href: s.href,
        }))}
        parentSlug="desarrollo-digital"
        titleEs="Soluciones especializadas"
        titleEn="Specialised solutions"
        locale={locale}
        iconColor="cyan"
      />

      {/* Client logos */}
      <ClientLogosBar
        title={isEn ? "Products we have built for" : "Productos que construimos para"}
        logos={
          isEn
            ? [
                { name: "Televisa / N+", sector: "Media" },
                { name: "Grupo Bolívar", sector: "Fintech" },
                { name: "Pulzo", sector: "Digital media" },
                { name: "Crónica", sector: "Media" },
                { name: "AB InBev-Bavaria", sector: "CPG" },
              ]
            : [
                { name: "Televisa / N+", sector: "Medios" },
                { name: "Grupo Bolívar", sector: "Fintech" },
                { name: "Pulzo", sector: "Medios digitales" },
                { name: "Crónica", sector: "Medios" },
                { name: "AB InBev-Bavaria", sector: "CPG" },
              ]
        }
      />

      {/* Tech stack */}
      <TechStackGrid
        title={isEn ? "Technology stack" : "Stack tecnológico"}
        categories={isEn ? TECH_STACK_EN : TECH_STACK_ES}
      />

      {/* Benefits from CMS (renders only when admin has populated benefits) */}
      <CmsServicioBenefits
        benefits={cms?.benefits}
        accentColor="#06B6D4"
        titleEs="Beneficios del enfoque Desarrollo Digital"
        titleEn="Benefits of the Digital Development approach"
        locale={locale}
      />

      {/* Process */}
      <ProcessTimeline
        title={uiLabel(uiLabels, "servicio.dev_process_title", locale)}
        accentColor="#06B6D4"
        steps={isEn ? PROCESS_EN : PROCESS_ES}
      />

      {/* Process from CMS (renders only when admin has populated processSteps) */}
      <CmsServicioProcess
        steps={cms?.processSteps}
        accentColor="#06B6D4"
        titleEs="Cómo lo entregamos"
        titleEn="How we deliver"
        locale={locale}
      />

      {/* Case study */}
      <CaseStudyCard
        client="Televisa / N+"
        sector={isEn ? "Media and Entertainment" : "Medios y Entretenimiento"}
        country={isEn ? "Mexico" : "México"}
        countryFlag="🇲🇽"
        result={
          isEn
            ? "N+ streaming platform built from scratch"
            : "Plataforma de streaming N+ construida desde cero"
        }
        metric={isEn ? "Millions of active users" : "Millones de usuarios activos"}
        service={isEn ? "Digital Development" : "Desarrollo Digital"}
        url="/casos-de-exito/televisa"
      />

      {/* Industries */}
      <IndustryGrid
        title={isEn ? "Industries where we deliver" : "Industrias donde entregamos"}
        industries={isEn ? INDUSTRIES_EN : INDUSTRIES_ES}
      />

      {/* FAQ */}
      <FAQAccordion
        title={uiLabel(uiLabels, "servicio.dev_faqs_title", locale)}
        schemaEnabled
        faqs={cms?.faqs?.length ? cms.faqs : /* LEGACY FALLBACK */ isEn ? FAQ_EN : FAQ_ES}
      />

      {/* Contact form */}
      <InlineContactForm
        title={
          isEn ? "Do you have a digital project in mind?" : "¿Tienes un proyecto digital en mente?"
        }
        subtitle={
          isEn
            ? "Tell us your idea and we will reply within 24 hours with an initial proposal."
            : "Cuéntanos tu idea y te respondemos en menos de 24 horas con una propuesta inicial."
        }
        serviceDefault="desarrollo"
      />
    </PageWrapper>
  );
}
