import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { GeoIconBox } from "@/lib/icons/geometric";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { CTABanner } from "@/components/shared";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/lib/cms";

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

  return buildPageMetadata({
    locale,
    href: "/precios",
    title: isEn
      ? "Pricing | SaaS Plans, Hourly Rates and Projects"
      : "Precios | Planes SaaS, Tarifas por Hora y Proyectos",
    description: isEn
      ? "Transparent pricing: SaaS products from $99 USD/month, staff augmentation from $25 USD/h, digital development projects from $15,000 USD and FinOps with success fee."
      : "Precios transparentes: productos SaaS desde $99 USD/mes, staff augmentation desde $25 USD/h, proyectos de desarrollo desde $15,000 USD y FinOps con success fee.",
  });
}

type PriceCard = {
  icon: string;
  name: string;
  price: string;
  detail: string;
  href: string;
};

const SAAS_ES: PriceCard[] = [
  {
    icon: "layout",
    name: "PAYWL — Motor de paywall",
    price: "$450 – $1,900 USD/mes",
    detail:
      "Plan Business desde $450/mes y Enterprise hasta $1,900/mes. Piloto gratuito de 90 días para medios elegibles.",
    href: "/productos/paywl",
  },
  {
    icon: "target",
    name: "Niveleads — Lead scoring B2B",
    price: "$99 – $249 USD/mes",
    detail:
      "Starter desde $99/mes (hasta 500 leads) y Growth $249/mes (leads ilimitados). Plan Enterprise a medida.",
    href: "/productos/niveleads",
  },
  {
    icon: "users",
    name: "Hirely — Reclutamiento con IA",
    price: "Acceso anticipado gratuito",
    detail:
      "Demo sin costo durante el acceso anticipado. Pricing se define en el lanzamiento oficial.",
    href: "/productos/hirely",
  },
];

const SAAS_EN: PriceCard[] = [
  {
    icon: "layout",
    name: "PAYWL — Paywall engine",
    price: "$450 – $1,900 USD/month",
    detail:
      "Business plan from $450/month and Enterprise up to $1,900/month. Free 90-day pilot for eligible media.",
    href: "/en/products/paywl",
  },
  {
    icon: "target",
    name: "Niveleads — B2B lead scoring",
    price: "$99 – $249 USD/month",
    detail:
      "Starter from $99/month (up to 500 leads) and Growth $249/month (unlimited leads). Custom Enterprise plan.",
    href: "/en/products/niveleads",
  },
  {
    icon: "users",
    name: "Hirely — AI recruiting",
    price: "Free early access",
    detail: "Free demo during early access. Pricing to be defined at official launch.",
    href: "/en/products/hirely",
  },
];

const SERVICES_ES: PriceCard[] = [
  {
    icon: "users",
    name: "Staff Augmentation",
    price: "$25 – $85 USD/hora",
    detail:
      "Tarifa por perfil según seniority: desde $25/h (Junior) hasta $85/h (Principal/Architect). Integración al equipo en 5 días hábiles. Sin comisión de éxito.",
    href: "/servicios/staff-augmentation",
  },
  {
    icon: "cpu",
    name: "Inteligencia Artificial y Agentes",
    price: "Implementación + MRR",
    detail:
      "Fee de implementación inicial más mensualidad de operación y mantenimiento. Diagnóstico inicial sin costo.",
    href: "/servicios/inteligencia-artificial",
  },
  {
    icon: "cloud",
    name: "Cloud / FinOps",
    price: "Success fee 20–30% del ahorro",
    detail:
      "Discovery con fee fijo y success fee sobre los ahorros generados el primer año (ahorro típico del 30–40% de la factura cloud).",
    href: "/servicios/cloud/finops",
  },
  {
    icon: "code",
    name: "Desarrollo Digital",
    price: "Proyectos desde $15,000 USD",
    detail:
      "Apps, plataformas web y e-commerce a la medida. Sprints semanales con entregables medibles.",
    href: "/servicios/desarrollo-digital",
  },
];

const SERVICES_EN: PriceCard[] = [
  {
    icon: "users",
    name: "Staff Augmentation",
    price: "$25 – $85 USD/hour",
    detail:
      "Per-profile rate by seniority: from $25/h (Junior) to $85/h (Principal/Architect). Embedded in your team within 5 business days. No success fee.",
    href: "/en/services/staff-augmentation",
  },
  {
    icon: "cpu",
    name: "Artificial Intelligence & Agents",
    price: "Implementation + MRR",
    detail:
      "Initial implementation fee plus monthly operations and maintenance. Free initial diagnostic.",
    href: "/en/services/artificial-intelligence",
  },
  {
    icon: "cloud",
    name: "Cloud / FinOps",
    price: "Success fee: 20–30% of savings",
    detail:
      "Fixed-fee discovery and a success fee on first-year savings (typical savings: 30–40% of the cloud bill).",
    href: "/en/services/cloud/finops",
  },
  {
    icon: "code",
    name: "Digital Development",
    price: "Projects from $15,000 USD",
    detail:
      "Custom apps, web platforms and e-commerce. Weekly sprints with measurable deliverables.",
    href: "/en/services/digital-development",
  },
];

const FAQ_ES = [
  {
    question: "¿Por qué publican los precios si cada proyecto es distinto?",
    answer:
      "Porque la transparencia acorta la conversación. Los rangos publicados son reales: cubren el 90% de los engagements. El scope exacto se define en un diagnóstico gratuito de 30 minutos, sin RFP ni presentaciones largas.",
  },
  {
    question: "¿El success fee de FinOps cómo funciona?",
    answer:
      "Pagas un fee fijo de discovery y después un porcentaje (20–30%) del ahorro que generamos en tu factura cloud durante el primer año. Si no hay ahorro, no hay success fee. El ahorro típico es del 30–40%.",
  },
  {
    question: "¿Qué incluye la tarifa por hora de Staff Augmentation?",
    answer:
      "Talento senior de LATAM evaluado técnicamente, integración al equipo en 5 días hábiles, reemplazo garantizado si el perfil no encaja y gestión administrativa completa. Sin costos ocultos ni comisión de éxito.",
  },
  {
    question: "¿Trabajan con empresas fuera de Colombia?",
    answer:
      "Sí. Operamos en 7+ países de LATAM y USA desde Bogotá y Miami, con contratos en USD y equipos alineados a husos horarios de América.",
  },
];

const FAQ_EN = [
  {
    question: "Why publish prices if every project is different?",
    answer:
      "Because transparency shortens the conversation. The published ranges are real: they cover 90% of engagements. Exact scope is defined in a free 30-minute diagnostic — no RFP, no long decks.",
  },
  {
    question: "How does the FinOps success fee work?",
    answer:
      "You pay a fixed discovery fee and then a percentage (20–30%) of the savings we generate on your cloud bill during the first year. No savings, no success fee. Typical savings are 30–40%.",
  },
  {
    question: "What does the Staff Augmentation hourly rate include?",
    answer:
      "Technically vetted senior LATAM talent, onboarding within 5 business days, guaranteed replacement if the profile is not a fit, and full administrative management. No hidden costs or success fees.",
  },
  {
    question: "Do you work with companies outside Colombia?",
    answer:
      "Yes. We operate in 7+ countries across LATAM and the US from Bogotá and Miami, with USD contracts and teams aligned to Americas time zones.",
  },
];

function getOfferCatalogSchema(isEn: boolean) {
  const BASE = "https://www.nivelics.com";
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: isEn ? "Nivelics — Services and SaaS pricing" : "Nivelics — Precios de servicios y SaaS",
    url: `${BASE}${isEn ? "/en/pricing" : "/precios"}`,
    provider: { "@id": `${BASE}/#organization` },
    itemListElement: [
      {
        "@type": "Offer",
        name: "PAYWL",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          minPrice: 450,
          maxPrice: 1900,
          priceCurrency: "USD",
          unitText: isEn ? "per month" : "por mes",
        },
        url: `${BASE}${isEn ? "/en/products/paywl" : "/productos/paywl"}`,
      },
      {
        "@type": "Offer",
        name: "Niveleads",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          minPrice: 99,
          maxPrice: 249,
          priceCurrency: "USD",
          unitText: isEn ? "per month" : "por mes",
        },
        url: `${BASE}${isEn ? "/en/products/niveleads" : "/productos/niveleads"}`,
      },
      {
        "@type": "Offer",
        name: "Staff Augmentation",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          minPrice: 25,
          maxPrice: 85,
          priceCurrency: "USD",
          unitText: isEn ? "per hour" : "por hora",
        },
        url: `${BASE}${isEn ? "/en/services/staff-augmentation" : "/servicios/staff-augmentation"}`,
      },
      {
        "@type": "Offer",
        name: isEn
          ? "Digital Development (custom projects)"
          : "Desarrollo Digital (proyectos a la medida)",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          minPrice: 15000,
          priceCurrency: "USD",
        },
        url: `${BASE}${isEn ? "/en/services/digital-development" : "/servicios/desarrollo-digital"}`,
      },
    ],
  };
}

export default async function PreciosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";

  const saas = isEn ? SAAS_EN : SAAS_ES;
  const services = isEn ? SERVICES_EN : SERVICES_ES;
  const faqs = isEn ? FAQ_EN : FAQ_ES;

  const breadcrumb = getBreadcrumbSchema([
    { name: isEn ? "Home" : "Inicio", url: isEn ? "/en" : "/" },
    { name: isEn ? "Pricing" : "Precios", url: isEn ? "/en/pricing" : "/precios" },
  ]);
  const offerCatalog = getOfferCatalogSchema(isEn);

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalog) }}
      />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h1 className="max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
            {isEn
              ? "Transparent pricing, measurable outcomes"
              : "Precios transparentes, resultados medibles"}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            {isEn
              ? "Real ranges we work with, published upfront. Exact scope is defined in a free 30-minute diagnostic — no RFP, no long decks."
              : "Los rangos reales con los que trabajamos, publicados de entrada. El scope exacto se define en un diagnóstico gratuito de 30 minutos — sin RFP, sin presentaciones largas."}
          </p>
        </div>
      </section>

      {/* Productos SaaS */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            {isEn ? "SaaS products" : "Productos SaaS"}
          </h2>
          <p className="mt-2 max-w-2xl text-text-70">
            {isEn
              ? "Fixed monthly subscription. Start whenever you want, cancel whenever you want."
              : "Suscripción mensual de precio fijo. Empieza cuando quieras, cancela cuando quieras."}
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {saas.map((card) => (
              <div key={card.name} className="glass glow-hover rounded-xl p-8">
                <GeoIconBox name={card.icon} size={20} color="cyan" />
                <h3 className="mt-4 text-lg font-semibold text-text-100">{card.name}</h3>
                <p className="mt-2 text-2xl font-bold text-primary">{card.price}</p>
                <p className="mt-3 text-sm text-text-70">{card.detail}</p>
                <a
                  href={card.href}
                  className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
                >
                  {isEn ? "View product" : "Ver producto"} &rarr;
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">{isEn ? "Services" : "Servicios"}</h2>
          <p className="mt-2 max-w-2xl text-text-70">
            {isEn
              ? "Custom pricing based on scope and team, within these published ranges."
              : "Pricing a la medida según scope y equipo, dentro de estos rangos publicados."}
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {services.map((card) => (
              <div key={card.name} className="glass glow-hover rounded-xl p-8">
                <div className="flex items-start gap-4">
                  <GeoIconBox name={card.icon} size={20} color="cyan" />
                  <div>
                    <h3 className="text-lg font-semibold text-text-100">{card.name}</h3>
                    <p className="mt-1 text-xl font-bold text-primary">{card.price}</p>
                    <p className="mt-3 text-sm text-text-70">{card.detail}</p>
                    <a
                      href={card.href}
                      className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                    >
                      {isEn ? "Learn more" : "Conocer más"} &rarr;
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQAccordion
        title={isEn ? "Pricing FAQs" : "Preguntas frecuentes sobre precios"}
        faqs={faqs}
        schemaEnabled
      />

      <CTABanner
        title={
          isEn ? "Get an exact quote in 30 minutes" : "Obtén una cotización exacta en 30 minutos"
        }
        description={
          isEn
            ? "Free diagnostic with a senior engineer. We reply within one business day."
            : "Diagnóstico gratuito con un ingeniero senior. Respondemos en un día hábil."
        }
        buttonText={isEn ? "Book a call" : "Agenda una llamada"}
        buttonHref={isEn ? "/en/contact" : "/contacto"}
        locale={locale}
      />
    </PageWrapper>
  );
}
