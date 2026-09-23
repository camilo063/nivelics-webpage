// CMS-connected: 2026-05-07 — benefits, processSteps and CTAs read from DB with hardcoded fallbacks
// Bilingüe con el patrón de cloud/ciberseguridad-ethical-hacking (constantes _ES/_EN + isEn):
// el copy fijo estaba solo en español y /en lo servía así.
import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { CTABanner } from "@/components/shared";
import { ComparisonTable } from "@/components/shared/comparison-table";
import { BenefitCard } from "@/components/shared/benefit-card";
import { GeoIconBox } from "@/lib/icons/geometric";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { HeroSplit } from "@/components/sections/hero-split";
import { HeroSelector } from "@/components/sections/hero-selector";
import { MetricsBar } from "@/components/sections/metrics-bar";
import { StickyMobileCta } from "@/components/ui/sticky-mobile-cta";
import {
  CmsServicioBenefits,
  CmsServicioProcess,
  resolveServicioCtas,
} from "@/components/sections/cms-servicio-sections";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getServicioData } from "@/lib/cms/get-servicio-data";
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
  const cms = await getServicioData("apps-moviles", locale);
  // El layout aplica la plantilla "%s | Nivelics" — nunca repetir el sufijo aquí.
  return buildPageMetadata({
    locale,
    href: "/servicios/desarrollo-digital/apps-moviles",
    title:
      cms?.seoTitle ||
      (isEn
        ? "Mobile App Development | iOS, Android and React Native"
        : "Desarrollo de Apps Móviles | iOS, Android y React Native"),
    description:
      cms?.seoDescription ||
      (isEn
        ? "Native and cross-platform apps with React Native, Flutter, Swift and Kotlin. From idea to the App Store."
        : "Apps nativas y cross-platform con React Native, Flutter, Swift y Kotlin. De la idea al App Store."),
  });
}

const BENEFITS_ES = [
  {
    icon: "smartphone",
    title: "iOS y Android nativo",
    description:
      "Desarrollo nativo con Swift y Kotlin para apps que aprovechan al máximo las capacidades de cada plataforma.",
  },
  {
    icon: "repeat",
    title: "Cross-platform con React Native/Flutter",
    description:
      "Una sola base de código para iOS y Android con React Native o Flutter, reduciendo tiempos y costos de desarrollo.",
  },
  {
    icon: "monitor-smartphone",
    title: "UX mobile-first",
    description:
      "Diseño centrado en la experiencia móvil con gestos nativos, animaciones fluidas y rendimiento optimizado.",
  },
];

const BENEFITS_EN = [
  {
    icon: "smartphone",
    title: "Native iOS and Android",
    description:
      "Native development with Swift and Kotlin for apps that make the most of each platform's capabilities.",
  },
  {
    icon: "repeat",
    title: "Cross-platform with React Native/Flutter",
    description:
      "A single codebase for iOS and Android with React Native or Flutter, cutting development time and cost.",
  },
  {
    icon: "monitor-smartphone",
    title: "Mobile-first UX",
    description:
      "Design centred on the mobile experience with native gestures, fluid animations and optimised performance.",
  },
];

const HERO_OPTIONS_ES = [
  {
    icon: "🍎",
    label: "iOS nativo",
    url: "/servicios/desarrollo-digital/apps-moviles",
    description: "Swift y SwiftUI para máximo rendimiento Apple",
  },
  {
    icon: "🤖",
    label: "Android nativo",
    url: "/servicios/desarrollo-digital/apps-moviles",
    description: "Kotlin y Jetpack Compose para el ecosistema Google",
  },
  {
    icon: "🦋",
    label: "Flutter cross-platform",
    url: "/servicios/desarrollo-digital/apps-moviles",
    description: "Una base de código, iOS + Android con Flutter",
  },
  {
    icon: "⚛️",
    label: "React Native",
    url: "/servicios/desarrollo-digital/apps-moviles",
    description: "JavaScript/TypeScript para iOS y Android",
  },
];

const HERO_OPTIONS_EN = [
  {
    icon: "🍎",
    label: "Native iOS",
    url: "/servicios/desarrollo-digital/apps-moviles",
    description: "Swift and SwiftUI for maximum performance on Apple",
  },
  {
    icon: "🤖",
    label: "Native Android",
    url: "/servicios/desarrollo-digital/apps-moviles",
    description: "Kotlin and Jetpack Compose for the Google ecosystem",
  },
  {
    icon: "🦋",
    label: "Flutter cross-platform",
    url: "/servicios/desarrollo-digital/apps-moviles",
    description: "One codebase, iOS + Android with Flutter",
  },
  {
    icon: "⚛️",
    label: "React Native",
    url: "/servicios/desarrollo-digital/apps-moviles",
    description: "JavaScript/TypeScript for iOS and Android",
  },
];

const COMPARISON_ROWS_ES = [
  {
    criterion: "Ingeniería nativa + cross-platform",
    alternative: "Raro — foco en diseño",
    extra: "Variable — depende del perfil",
    nivelics: "React Native, Flutter, iOS, Android nativo",
  },
  {
    criterion: "QA integrado en el proceso",
    alternative: "Casi nunca incluido",
    extra: "No — el cliente testea",
    nivelics: "Sí — en cada sprint",
  },
  {
    criterion: "Entrega en sprints medibles",
    alternative: "Poco común",
    extra: "No estructurado",
    nivelics: "Demo quincenal con cliente",
  },
  {
    criterion: "Mantenimiento post-lanzamiento",
    alternative: "Costo separado y alto",
    extra: "Sin garantía real",
    nivelics: "Incluible en modelo MRR",
  },
  {
    criterion: "Propiedad del código",
    alternative: "Depende del contrato",
    extra: "Ambigua sin contrato claro",
    nivelics: "100% del cliente — siempre",
  },
  {
    criterion: "Integración backend + API",
    alternative: "Fuera de alcance generalmente",
    extra: "Limitada",
    nivelics: "Full-stack incluido",
  },
  {
    criterion: "Delivery Manager asignado",
    alternative: "No",
    extra: "No",
    nivelics: "Sí — punto de contacto único",
  },
];

const COMPARISON_ROWS_EN = [
  {
    criterion: "Native + cross-platform engineering",
    alternative: "Rare — design is the focus",
    extra: "Varies — depends on the individual",
    nivelics: "React Native, Flutter, native iOS, Android",
  },
  {
    criterion: "QA built into the process",
    alternative: "Almost never included",
    extra: "No — the client tests",
    nivelics: "Yes — in every sprint",
  },
  {
    criterion: "Delivery in measurable sprints",
    alternative: "Uncommon",
    extra: "Not structured",
    nivelics: "Client demo every two weeks",
  },
  {
    criterion: "Post-launch maintenance",
    alternative: "Separate and expensive",
    extra: "No real guarantee",
    nivelics: "Can be included in the MRR model",
  },
  {
    criterion: "Code ownership",
    alternative: "Depends on the contract",
    extra: "Ambiguous without a clear contract",
    nivelics: "100% the client's — always",
  },
  {
    criterion: "Backend + API integration",
    alternative: "Usually out of scope",
    extra: "Limited",
    nivelics: "Full-stack included",
  },
  {
    criterion: "Assigned Delivery Manager",
    alternative: "No",
    extra: "No",
    nivelics: "Yes — a single point of contact",
  },
];

// Señales cualitativas del servicio: reemplazan la banda numérica de respaldo.
// El conteo de apps entregadas y el rating promedio en stores que vivían en esta
// banda no tenían respaldo verificable, así que el mismo mensaje va en cualitativo.
const HIGHLIGHTS_ES = [
  "Experiencia entregando apps nativas y cross-platform",
  "Sprints de 2 semanas con demo al cliente",
  "Propiedad del código 100% del cliente",
  "QA integrado en cada sprint, no al final",
];

const HIGHLIGHTS_EN = [
  "Experience delivering native and cross-platform apps",
  "Two-week sprints with a client demo",
  "Code ownership 100% the client's",
  "QA built into every sprint, not left to the end",
];

export default async function AppsMovilesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const cms = await getServicioData("apps-moviles", locale);
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
    name: isEn ? "Mobile App Development" : "Desarrollo de Apps Móviles",
    description: isEn
      ? "Native and cross-platform apps with React Native, Flutter, Swift and Kotlin. From idea to the App Store."
      : "Apps nativas y cross-platform con React Native, Flutter, Swift y Kotlin. De la idea al App Store.",
    url: "/servicios/desarrollo-digital/apps-moviles",
    serviceType: "Mobile App Development",
  });
  const breadcrumb = getBreadcrumbSchema(
    locale,
    isEn
      ? [
          { name: "Home", url: "/" },
          { name: "Services", url: "/servicios" },
          { name: "Digital Development", url: "/servicios/desarrollo-digital" },
          { name: "Mobile Apps", url: "/servicios/desarrollo-digital/apps-moviles" },
        ]
      : [
          { name: "Inicio", url: "/" },
          { name: "Servicios", url: "/servicios" },
          { name: "Desarrollo Digital", url: "/servicios/desarrollo-digital" },
          { name: "Apps Móviles", url: "/servicios/desarrollo-digital/apps-moviles" },
        ],
  );

  const benefits = isEn ? BENEFITS_EN : BENEFITS_ES;

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
        badge={isEn ? "Digital Development · Mobile" : "Desarrollo Digital · Mobile"}
        h1={cms?.title || (isEn ? "Your mobile app," : "Tu app móvil,")}
        h1Accent={isEn ? "from concept to the store" : "del concepto al store"}
        subtitle={
          cms?.subtitle ||
          (isEn
            ? "iOS, Android, Flutter and React Native. We build native and cross-platform apps with a release every two weeks, QA built in and code that is 100% yours from the first sprint."
            : "iOS, Android, Flutter y React Native. Construimos apps nativas y cross-platform con entregas quincenales, QA integrado y código 100% tuyo desde el primer sprint.")
        }
        bullets={
          isEn
            ? [
                "A demo every 2 weeks — you always see real progress",
                "100% code ownership — yours from day one",
                "QA built into every sprint — not left to the end of the project",
              ]
            : [
                "Demo cada 2 semanas — siempre ves avance real",
                "100% propiedad del código — tuyo desde el día uno",
                "QA integrado en cada sprint — no al final del proyecto",
              ]
        }
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor="#06B6D4"
        rightPanel={
          <HeroSelector
            title={isEn ? "What kind of app do you need?" : "¿Qué tipo de app necesitas?"}
            accentColor="#06B6D4"
            options={isEn ? HERO_OPTIONS_EN : HERO_OPTIONS_ES}
          />
        }
        dataSection="apps-moviles-hero"
        ariaLabel={
          isEn
            ? "Mobile app development — from concept to the store, iOS, Android, Flutter and React Native"
            : "Desarrollo de apps móviles — del concepto al store, iOS, Android, Flutter y React Native"
        }
      />

      {/* Métricas del CMS si las hay; si no, señales cualitativas (ver HIGHLIGHTS_*). */}
      {cms?.metrics?.length ? (
        <MetricsBar
          metrics={cms.metrics.map((m) => ({
            value: m.value,
            label: m.label,
            sublabel: "",
            unit: m.unit,
          }))}
        />
      ) : (
        <section
          aria-labelledby="apps-moviles-highlights-title"
          className="border-y border-white/[0.06] py-10 md:py-12"
        >
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <h2
              id="apps-moviles-highlights-title"
              className="text-xs font-semibold uppercase tracking-[0.12em] text-text-40"
            >
              {isEn ? "What it includes" : "Lo que incluye"}
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(isEn ? HIGHLIGHTS_EN : HIGHLIGHTS_ES).map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <GeoIconBox name="dia-check" size={16} color="cyan" />
                  <span className="text-sm font-medium leading-snug text-text-100">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            {isEn ? "Key benefits" : "Beneficios clave"}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {benefits.map((b) => (
              <BenefitCard
                key={b.title}
                title={b.title}
                description={b.description}
                icon={b.icon}
                accentColor="#fbbf24"
              />
            ))}
          </div>
        </div>
      </section>

      <CmsServicioBenefits
        benefits={cms?.benefits}
        accentColor="#06B6D4"
        titleEs="Por qué Apps Móviles con Nivelics"
        titleEn="Why Mobile Apps with Nivelics"
        locale={locale}
      />
      <CmsServicioProcess
        steps={cms?.processSteps}
        accentColor="#06B6D4"
        titleEs="Cómo lo construimos"
        titleEn="How we build it"
        locale={locale}
      />

      {/* Comparison Table */}
      <ComparisonTable
        title={
          isEn ? "Why build your app with Nivelics?" : "¿Por qué desarrollar tu app con Nivelics?"
        }
        alternativeLabel={isEn ? "Design agency" : "Agencia de diseño"}
        extraLabel="Freelancers"
        nivelicsLabel="Nivelics"
        criterionLabel={isEn ? "Criterion" : undefined}
        rows={isEn ? COMPARISON_ROWS_EN : COMPARISON_ROWS_ES}
      />

      <CTABanner />

      <StickyMobileCta
        text={isEn ? "Tell us about your project →" : "Cuéntanos tu proyecto →"}
        url="/contacto"
        accentColor="#06B6D4"
      />
    </PageWrapper>
  );
}
