import type { Metadata } from "next";
import Link from "next/link";
import { Smartphone, Globe, ShoppingCart, Bot, ArrowRight } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { GeoIconBox } from "@/lib/icons/geometric";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getFAQSchema } from "@/lib/schema/faq";
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
import { getLocale, setRequestLocale } from "next-intl/server";
import { getServicioData } from "@/lib/cms/get-servicio-data";
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
  const cms = await getServicioData("desarrollo-digital", locale);
  return {
    title: cms?.seoTitle || "Desarrollo de Software y Apps | Plataformas Digitales",
    description:
      cms?.seoDescription ||
      "Desarrollo de productos digitales, aplicaciones web y móviles con metodologías ágiles y arquitectura moderna.",
    alternates: {
      canonical: "https://www.nivelics.com/servicios/desarrollo-digital",
      languages: {
        es: "https://www.nivelics.com/servicios/desarrollo-digital",
        en: "https://www.nivelics.com/en/services/digital-development",
        "x-default": "https://www.nivelics.com/servicios/desarrollo-digital",
      },
    },
  };
}

const SUB_SERVICES = [
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

export default async function DesarrolloDigitalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const [cms, uiLabels] = await Promise.all([
    getServicioData("desarrollo-digital", locale),
    getAllUiLabels(),
  ]);
  const serviceSchema = getServiceSchema({
    name: "Desarrollo Digital",
    description:
      "Desarrollo de productos digitales, aplicaciones web y móviles con metodologías ágiles.",
    url: "/servicios/desarrollo-digital",
    serviceType: "Software Development",
  });
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
    { name: "Desarrollo Digital", url: "/servicios/desarrollo-digital" },
  ]);

  return (
    <PageWrapper>
      {/* JSON-LD schemas */}
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
        heroEffect="diagonal"
        badge="Desarrollo Digital"
        h1={cms?.title || "Del concepto"}
        h1Accent="a producción"
        subtitle={
          cms?.subtitle ||
          "Diseñamos y construimos apps móviles, plataformas web y e-commerce con arquitectura moderna y entregas cada 2 semanas."
        }
        bullets={[
          "Demo quincenal — siempre sabes en qué estamos",
          "Código 100% tuyo desde el primer sprint",
          "QA integrado — no es un paso final, es parte del proceso",
        ]}
        ctaPrimary={{ text: "Cuéntanos tu proyecto", url: "/contacto" }}
        ctaSecondary={{ text: "Ver casos de éxito", url: "/casos-de-exito" }}
        accentColor="#06B6D4"
        rightPanel={
          <HeroSelector
            title="¿Qué estás construyendo?"
            accentColor="#06B6D4"
            options={[
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
            ]}
          />
        }
        dataSection="desarrollo-digital-hero"
        ariaLabel="Desarrollo Digital — del concepto a producción, apps móviles, plataformas web y e-commerce con entregas cada 2 semanas"
      />

      {/* Metrics */}
      <MetricsBar
        metrics={
          cms?.metrics?.length
            ? cms.metrics.map((m) => ({ value: m.value, label: m.label, sublabel: "" }))
            : /* LEGACY FALLBACK */ [
                { value: "50+", label: "Proyectos entregados", sublabel: "en LATAM y USA" },
                { value: "13+", label: "Años de experiencia", sublabel: "desde 2012" },
                { value: "7", label: "Países", sublabel: "Colombia, USA, México y más" },
                { value: "100%", label: "Propiedad del código", sublabel: "siempre del cliente" },
              ]
        }
      />

      {/* Sub-services */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Soluciones especializadas</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SUB_SERVICES.map((s) => {
              const iconName = s.icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="glass glow-hover rounded-xl p-6 block group cursor-pointer"
                >
                  <GeoIconBox name={iconName} size={20} color="amber" />
                  <h3 className="text-lg font-semibold text-text-100 group-hover:text-primary transition-colors">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-70">{s.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Conocer más <ArrowRight size={14} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Client logos */}
      <ClientLogosBar
        title="Productos que construimos para"
        logos={[
          { name: "Televisa / N+", sector: "Medios" },
          { name: "Grupo Bolívar", sector: "Fintech" },
          { name: "Pulzo", sector: "Medios digitales" },
          { name: "Crónica", sector: "Medios" },
          { name: "AB InBev-Bavaria", sector: "CPG" },
        ]}
      />

      {/* Tech stack */}
      <TechStackGrid
        title="Stack tecnológico"
        categories={[
          { name: "Frontend", items: ["React", "Next.js", "Vue.js", "TypeScript"] },
          { name: "Mobile", items: ["React Native", "Flutter", "Swift", "Kotlin"] },
          { name: "Backend", items: ["Node.js", "Python", "Go", "NestJS"] },
          { name: "Cloud", items: ["AWS", "GCP", "Vercel", "Docker", "Kubernetes"] },
          { name: "E-commerce", items: ["Shopify", "WooCommerce", "Plataformas propias"] },
          { name: "Bases de datos", items: ["PostgreSQL", "MongoDB", "Redis", "Supabase"] },
        ]}
      />

      {/* Process */}
      <ProcessTimeline
        title={uiLabel(uiLabels, "servicio.dev_process_title", locale)}
        accentColor="#06B6D4"
        steps={[
          {
            number: "01",
            title: "Discovery",
            description:
              "Entendemos el negocio, definimos el alcance y validamos viabilidad técnica.",
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
        ]}
      />

      {/* Case study */}
      <CaseStudyCard
        client="Televisa / N+"
        sector="Medios y Entretenimiento"
        country="México"
        countryFlag="🇲🇽"
        result="Plataforma de streaming N+ construida desde cero"
        metric="Millones de usuarios activos"
        service="Desarrollo Digital"
        url="/casos-de-exito/televisa"
      />

      {/* Industries */}
      <IndustryGrid
        title="Industrias donde entregamos"
        industries={[
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
        ]}
      />

      {/* FAQ */}
      <FAQAccordion
        title={uiLabel(uiLabels, "servicio.dev_faqs_title", locale)}
        schemaEnabled
        faqs={
          cms?.faqs?.length
            ? cms.faqs
            : /* LEGACY FALLBACK */ [
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
              ]
        }
      />

      {/* Contact form */}
      <InlineContactForm
        title="¿Tienes un proyecto digital en mente?"
        subtitle="Cuéntanos tu idea y te respondemos en menos de 24 horas con una propuesta inicial."
        serviceDefault="desarrollo"
      />
    </PageWrapper>
  );
}
