import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Cloud,
  Users,
  Code2,
  MessageCircle,
  Check,
  Layers,
  BarChart2,
  Zap,
  Globe,
  TrendingUp,
  PlayCircle,
  HeartPulse,
  ShoppingBag,
  Truck,
  Factory,
  ChevronRight,
} from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { GeoIcon, type IconColor } from "@/lib/icons/geometric";

function hexToIconColor(hex: string): IconColor {
  const h = hex.toLowerCase();
  if (h.includes("d4ff") || h.includes("06b6d4") || h.includes("3b82f6")) return "cyan";
  if (h.includes("8b5cf6") || h.includes("a78bfa")) return "violet";
  if (h.includes("10b981") || h.includes("4ade80")) return "green";
  if (h.includes("fbbf24") || h.includes("f59e0b")) return "amber";
  if (h.includes("ef4444") || h.includes("f87171")) return "red";
  return "cyan";
}
import { MetricsBar } from "@/components/sections/metrics-bar";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { getOrganizationSchema } from "@/lib/schema/organization";
import { getWebSiteSchema } from "@/lib/schema/website";
import { getFAQSchema } from "@/lib/schema/faq";
import { AmericaMapWrapper } from "@/components/sections/america-map-wrapper";
import { ProductosHomeStrip } from "@/components/sections/home/ProductosHomeStrip";
import { getAllProductos, mapProducto } from "@/lib/cms/productos";
import { ClientLogosMarquee } from "@/components/sections/client-logos-marquee";
import { ProcessSteps } from "@/components/sections/process-steps";
import { HeroGraph } from "@/components/ui/hero-graph";
import { getLocale } from "next-intl/server";
import { getHomeContent, getAllCasosExito, getHubServicios } from "@/lib/cms";
import { mapHomeContent, mapServicio, mapCasoExito } from "@/lib/cms";
import type { Locale } from "@/lib/cms";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const homeRaw = await getHomeContent();
  const home = homeRaw ? mapHomeContent(homeRaw as Record<string, unknown>, locale) : null;

  return {
    title: home?.heroTitle
      ? `${home.heroTitle} | Nivelics Colombia`
      : "Transformación Digital IA · Cloud · Staffing | Nivelics Colombia",
    description:
      home?.heroSubtitle ||
      "Empresa colombiana de transformación digital B2B. IA aplicada, Cloud (AWS, GCP, Azure) y Staff Augmentation premium para LATAM y USA. Desde 2012.",
    alternates: {
      canonical: "https://www.nivelics.com",
      languages: {
        es: "https://www.nivelics.com",
        en: "https://www.nivelics.com/en",
        "x-default": "https://www.nivelics.com",
      },
    },
    other: { "link-llms": "/llms.txt" },
  };
}

// LEGACY FALLBACK
const HOME_FAQS = [
  {
    question: "¿Qué es Nivelics y qué servicios ofrece?",
    answer:
      "Nivelics es una empresa colombiana de transformación digital fundada en 2012 con sede en Bogotá y Miami. Ofrecemos tres líneas de servicio integradas: IA aplicada (agentes, automatización, RAG), Cloud con gobierno real (AWS, GCP, Azure, FinOps) y Staff Augmentation premium (talento tech bilingüe integrado en 5 días hábiles). Operamos en 7+ países de LATAM y USA.",
  },
  {
    question: "¿En cuánto tiempo puede Nivelics integrar un perfil tech?",
    answer:
      "Presentamos los primeros candidatos en máximo 5 días hábiles. La integración completa al equipo del cliente tarda entre 6 y 10 días hábiles. Ofrecemos garantía de reemplazo sin costo en menos de 10 días si el perfil no cumple las expectativas.",
  },
  {
    question: "¿Cuánto cuesta trabajar con Nivelics?",
    answer:
      "Los precios varían según el servicio. Staff Augmentation tiene un modelo mensual por recurso, con un ahorro promedio del 40% vs. contratar en USA o Europa. Cloud y FinOps tienen modelos de fee fijo más success fee sobre el ahorro logrado. IA aplicada varía según la complejidad del agente. El diagnóstico inicial siempre es gratuito y sin compromiso.",
  },
  {
    question: "¿En qué países opera Nivelics?",
    answer:
      "Nivelics tiene sede principal en Bogotá, Colombia y oficina en Miami, Florida (Nivelics LLC). Hemos entregado proyectos en Colombia, USA, México, El Salvador, Panamá, Ecuador, Perú y Argentina.",
  },
  {
    question: "¿Qué diferencia a Nivelics de otras consultoras tech?",
    answer:
      "Tres cosas: primero, integramos los tres pilares (IA, Cloud y Staffing) en un solo aliado. Segundo, velocidad real: 5 días para candidatos, 8 semanas para un agente IA en producción. Tercero, resultados en contrato: nuestros SLAs y métricas de entrega están escritos, no prometidos en presentaciones.",
  },
];

// LEGACY FALLBACK
const SERVICES = [
  {
    icon: "brain",
    badge: "I — IA",
    color: "#8B5CF6",
    title: "Agentes e IA aplicada",
    copy: "Construimos agentes autónomos integrados con tus sistemas. No demos — producción.",
    metric: "50% reducción costos operativos",
    cta: "Ver servicios de IA →",
    url: "/servicios/inteligencia-artificial",
  },
  {
    icon: "cloud",
    badge: "C — Cloud",
    color: "#3B82F6",
    title: "Cloud con gobierno y FinOps",
    copy: "Migramos y operamos en AWS, GCP y Azure. FinOps desde el día uno.",
    metric: "40% ahorro promedio en gasto cloud",
    cta: "Ver servicios Cloud →",
    url: "/servicios/cloud",
  },
  {
    icon: "users",
    badge: "S — Staffing",
    color: "#10B981",
    title: "Talento tech en 5 días",
    copy: "Perfiles bilingües validados, integrados en tu equipo sin riesgos laborales.",
    metric: "40% ahorro vs. contratar en USA",
    cta: "Ver Staff Augmentation →",
    url: "/servicios/staff-augmentation",
  },
  {
    icon: "code2",
    badge: "Dev",
    color: "#06B6D4",
    title: "Del concepto a producción",
    copy: "Apps, plataformas y e-commerce con arquitectura moderna y demos quincenales.",
    metric: "100% del código es tuyo",
    cta: "Ver Desarrollo Digital →",
    url: "/servicios/desarrollo-digital",
  },
];

// LEGACY FALLBACK
const CASES = [
  {
    client: "Televisa / N+",
    sector: "Medios y Entretenimiento",
    country: "México",
    flag: "🇲🇽",
    result: "Plataforma de streaming N+ desde cero",
    metric: "Millones de usuarios activos",
    service: "Desarrollo Digital",
    href: "/casos-de-exito/televisa",
  },
  {
    client: "Two Maids",
    sector: "Servicios / USA",
    country: "USA",
    flag: "🇺🇸",
    result: "Escalamiento técnico del equipo",
    metric: "40% ahorro vs. contratar localmente",
    service: "Staff Augmentation",
    href: "/casos-de-exito/two-maids",
  },
  {
    client: "Grupo Bolívar",
    sector: "Fintech / Seguros",
    country: "Colombia",
    flag: "🇨🇴",
    result: "Transformación digital de canales",
    metric: "3 productos digitales lanzados",
    service: "Dev + Cloud + IA",
    href: "/casos-de-exito/grupo-bolivar",
  },
  {
    client: "AB InBev-Bavaria",
    sector: "CPG / Retail",
    country: "El Salvador",
    flag: "🇸🇻",
    result: "Plataforma digital para distribuidores",
    metric: "Operación en múltiples países",
    service: "Desarrollo Digital",
    href: "/casos-de-exito/ab-inbev",
  },
  {
    client: "Crónica",
    sector: "Medios digitales",
    country: "Colombia",
    flag: "🇨🇴",
    result: "Plataforma de noticias de alto tráfico",
    metric: "Infraestructura cloud escalable",
    service: "Cloud + Dev",
    href: "/casos-de-exito/cronica",
  },
  {
    client: "Pulzo",
    sector: "Medios digitales",
    country: "Colombia",
    flag: "🇨🇴",
    result: "Portal de noticias líder en Colombia",
    metric: "Millones de visitas mensuales",
    service: "Dev + Cloud",
    href: "/casos-de-exito/pulzo",
  },
  {
    client: "Univision",
    sector: "Medios / Broadcasting",
    country: "USA",
    flag: "🇺🇸",
    result: "Plataformas digitales de contenido",
    metric: "Audiencia hispana en USA",
    service: "Desarrollo Digital",
    href: "/casos-de-exito/univision",
  },
];

const INDUSTRIES = [
  {
    name: "Fintech",
    desc: "Banca digital, pagos y regulación",
    icon: "trending-up",
    url: "/industrias/fintech",
  },
  {
    name: "Medios y Entretenimiento",
    desc: "Plataformas de contenido y streaming",
    icon: "play-circle",
    url: "/industrias/medios-entretenimiento",
  },
  {
    name: "Salud",
    desc: "HealthTech con compliance regulatorio",
    icon: "heart-pulse",
    url: "/industrias/salud",
  },
  {
    name: "Retail y E-commerce",
    desc: "Omnicanalidad y última milla digital",
    icon: "shopping-bag",
    url: "/industrias/retail-ecommerce",
  },
  {
    name: "Logística",
    desc: "Supply chain y trazabilidad en tiempo real",
    icon: "truck",
    url: "/industrias/logistica",
  },
  {
    name: "Manufactura",
    desc: "Industria 4.0 y automatización de planta",
    icon: "factory",
    url: "/industrias/manufactura",
  },
];

export default async function HomePage() {
  const locale = (await getLocale()) as Locale;
  const homeRaw = await getHomeContent();
  const home = homeRaw ? mapHomeContent(homeRaw as Record<string, unknown>, locale) : null;

  const productosRaw = await getAllProductos();
  const productos = productosRaw.map((p) => mapProducto(p, locale));

  // Use DB FAQs if available, otherwise legacy fallback
  const faqsToShow = home?.faqs.length ? home.faqs : HOME_FAQS;

  // Use DB metrics if available, otherwise legacy fallback
  const metricsToShow = home?.metrics.length
    ? home.metrics.map((m) => ({ value: m.value, label: m.unit, sublabel: m.label }))
    : [
        { value: "13+", label: "Años", sublabel: "Fundados en 2012" },
        { value: "7+", label: "Países", sublabel: "Colombia, USA, México y más" },
        { value: "40%", label: "Ahorro", sublabel: "vs. contratar en USA o Europa" },
        { value: "50+", label: "Proyectos", sublabel: "entregados en LATAM y USA" },
      ];

  const orgSchema = getOrganizationSchema();
  const webSiteSchema = getWebSiteSchema();
  const faqSchema = getFAQSchema(faqsToShow);

  return (
    <PageWrapper className="pt-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ═══ 1. HERO ═══ */}
      <section
        className="relative overflow-hidden pt-20 pb-14 md:pt-24 md:pb-16 min-h-[520px] lg:min-h-[600px]"
        style={{ background: "var(--grad-hero)" }}
        data-section="hero"
      >
        <div className="grid-pattern absolute inset-0" />
        <div aria-hidden="true" className="dot-grid" />
        <HeroGraph />
        <div className="absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-primary/5 blur-[100px]" />
        <div className="relative z-10 mx-auto max-w-[1280px] px-6 text-center md:px-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            {home?.heroBadge || "IA · Cloud · Staffing Premium"}
          </span>
          <h1 className="mt-6 text-4xl font-bold text-text-100 md:text-6xl">
            {home?.heroTitle || "Transforma más rápido."}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-text-70">
            {home?.heroSubtitle ||
              "Empresa colombiana de transformación digital B2B. IA aplicada, Cloud (AWS, GCP, Azure) y Staff Augmentation premium para empresas en LATAM y USA. Desde 2012."}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="cta" size="lg">
              <Link href="/contacto">
                {home?.heroCtaPrimary || "Agenda tu diagnóstico"} <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a
                href="https://wa.me/573103926621?text=Hola%2C%20quiero%20información%20sobre%20Nivelics"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} /> {home?.heroCtaSecondary || "Hablar por WhatsApp"}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ 1.5 LOGO BAR CLIENTES ═══ */}
      <ClientLogosMarquee />

      {/* ═══ 2. MARCO I+C+S ═══ */}
      <section
        className="py-10 md:py-14"
        data-section="servicios-principales"
        aria-label="Servicios principales de Nivelics: IA, Cloud, Staff Augmentation y Desarrollo Digital"
      >
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100 md:text-4xl">
            {home?.servicesSectionTitle || "IA + Cloud + Staffing — los tres pilares integrados"}
          </h2>
          <p className="mt-3 max-w-2xl text-text-70">
            La mayoría ataca estos retos por separado. Nosotros los conectamos en un solo aliado.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => {
              return (
                <Link
                  key={s.url}
                  href={s.url}
                  className="group glass glow-hover rounded-xl p-5 block cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-1"
                  style={{ borderLeft: `3px solid ${s.color}` }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <GeoIcon name={s.icon} size={18} color={hexToIconColor(s.color)} />
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: s.color }}
                    >
                      {s.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-text-100 group-hover:text-primary transition-colors">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] text-text-70 leading-snug">{s.copy}</p>
                  <p className="mt-3 font-mono text-sm font-bold text-primary">{s.metric}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    {s.cta}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 3. MÉTRICAS ═══ */}
      <MetricsBar metrics={metricsToShow} />

      {/* ═══ 4. CASOS DE ÉXITO (grid 7 casos) ═══ */}
      <section
        className="bg-bg-surface py-10 md:py-14"
        data-section="casos-de-exito"
        aria-label="Casos de éxito de Nivelics"
      >
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100 md:text-4xl">
            {home?.casesSectionTitle || "Resultados reales en 7 países"}
          </h2>
          <p className="mt-3 max-w-2xl text-text-70">
            Empresas en medios, fintech, retail y servicios que eligieron Nivelics para transformar
            su tecnología.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CASES.map((c) => (
              <Link
                key={c.client}
                href={c.href}
                className="group flex flex-col justify-between rounded-xl bg-[rgba(255,255,255,0.03)] border border-white/[0.08] p-5 min-h-[160px] transition-all duration-200 ease-out hover:border-white/20 hover:bg-white/[0.06] hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-text-40">
                    <span>
                      {c.flag} {c.country}
                    </span>
                    <span>{c.sector}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-white group-hover:text-primary transition-colors">
                    {c.client}
                  </h3>
                  <p className="mt-1 text-[13px] text-white/60 line-clamp-1">{c.result}</p>
                  <p className="mt-1 text-[13px] font-semibold text-primary">{c.metric}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="rounded-full border border-primary/20 bg-primary/[0.08] px-2.5 py-0.5 text-[10px] text-primary/70">
                    {c.service}
                  </span>
                  <span className="text-xs text-white/30 group-hover:text-primary transition-colors">
                    Ver <ArrowRight size={12} className="inline" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-[13px] text-text-40 mb-3">7 empresas. Resultados reales.</p>
            <Link
              href="/casos-de-exito"
              className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
            >
              Ver todos los casos <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 5b. PRODUCTOS SAAS STRIP ═══ */}
      <ProductosHomeStrip productos={productos} locale={locale} />

      {/* ═══ 6. MAPA AMÉRICA ═══ */}
      <section
        className="py-10 md:py-14"
        data-section="presencia-geografica"
        data-countries="Colombia,USA,México,El Salvador,Panamá,Ecuador,Perú,Argentina"
        aria-label="Nivelics tiene proyectos activos en 7 países"
      >
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <AmericaMapWrapper />
              <ul className="sr-only" aria-label="Países con proyectos activos">
                <li>Colombia — sede principal (Bogotá)</li>
                <li>USA — Miami, Florida</li>
                <li>México — Ciudad de México (Televisa/N+)</li>
                <li>El Salvador (AB InBev-Bavaria)</li>
                <li>Panamá</li>
                <li>Ecuador</li>
                <li>Perú</li>
                <li>Argentina</li>
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-text-100 md:text-4xl">
                13 años. 7 países. Un solo aliado.
              </h2>
              <p className="mt-3 text-[15px] text-white/50">
                Proyectos activos en Colombia, USA, México, El Salvador, Panamá, Ecuador, Perú y
                Argentina.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-primary/15 bg-white/[0.03] p-5 text-center">
                  <data
                    value="13"
                    aria-label="13 años de experiencia"
                    className="font-mono text-4xl font-bold text-primary"
                  >
                    13+
                  </data>
                  <p className="mt-1 text-xs uppercase tracking-wider text-white/50">Años</p>
                  <p className="text-[11px] text-white/35">Fundados en 2012</p>
                </div>
                <div className="rounded-xl border border-primary/15 bg-white/[0.03] p-5 text-center">
                  <data
                    value="7"
                    aria-label="Proyectos en 7 países"
                    className="font-mono text-4xl font-bold text-primary"
                  >
                    7+
                  </data>
                  <p className="mt-1 text-xs uppercase tracking-wider text-white/50">Países</p>
                  <p className="text-[11px] text-white/35">LATAM y USA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 7. INDUSTRIAS ═══ */}
      <section
        className="bg-bg-surface py-10 md:py-14"
        data-section="industrias"
        aria-label="Industrias que Nivelics atiende"
      >
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100 md:text-4xl">
            Experiencia en los sectores más exigentes
          </h2>
          <p className="mt-3 max-w-2xl text-text-70">
            13 años de proyectos en fintech, medios, salud, retail, logística y manufactura.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((ind) => {
              return (
                <Link
                  key={ind.url}
                  href={ind.url}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 transition-all duration-200 ease-out hover:-translate-y-1 hover:bg-white/[0.06] hover:border-white/15 group"
                >
                  <span className="shrink-0">
                    <GeoIcon name={ind.icon} size={18} color="amber" />
                  </span>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                      {ind.name}
                    </span>
                    <p className="text-[12px] text-text-40">{ind.desc}</p>
                  </div>
                  <ChevronRight
                    size={14}
                    className="shrink-0 text-text-40 group-hover:text-primary transition-colors"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 8. ¿POR QUÉ NIVELICS? ═══ */}
      <section
        className="py-10 md:py-14"
        data-section="diferenciadores"
        aria-label="Por qué elegir Nivelics — diferenciadores principales"
      >
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100 md:text-4xl">¿Por qué Nivelics?</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: "layers",
                color: "#06B6D4",
                title: "Los 3 pilares en un solo aliado",
                copy: "No somos una agencia de diseño, ni una consultora de infraestructura, ni una bolsa de empleo. Somos los tres — integrados.",
              },
              {
                icon: "bar-chart2",
                color: "#8B5CF6",
                title: "Resultados, no presentaciones",
                copy: "Cada proyecto tiene KPIs definidos antes de empezar. Si no se mide, no existe.",
              },
              {
                icon: "zap",
                color: "#F59E0B",
                title: "Candidatos en 5 días. Agentes en 8 semanas.",
                copy: "El tiempo de integración que prometemos está en el contrato — no en el pitch.",
              },
              {
                icon: "globe",
                color: "#10B981",
                title: "LATAM que opera como global",
                copy: "Sede en Bogotá y Miami. Equipos bilingües. Proyectos en 7 países. Great Place to Work 2022.",
              },
            ].map((d) => (
              <div
                key={d.title}
                className="rounded-xl p-5 bg-white/[0.02]"
                style={{ borderLeft: `3px solid ${d.color}` }}
              >
                <span className="mb-3 inline-block">
                  <GeoIcon name={d.icon} size={18} color={hexToIconColor(d.color)} />
                </span>
                <h3 className="text-sm font-semibold text-text-100">{d.title}</h3>
                <p className="mt-1.5 text-[13px] text-text-70 leading-relaxed">{d.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8.5 PROCESO EN 3 PASOS ═══ */}
      {home?.processSteps?.length ? (
        <ProcessSteps
          title={home.processSectionTitle || "Cómo trabajamos"}
          subtitle={
            home.processSectionSubtitle ||
            "Sin RFPs, sin presentaciones de 60 slides. Solo resultados."
          }
          steps={home.processSteps}
        />
      ) : null}

      {/* ═══ 9. FAQ ═══ */}
      <FAQAccordion title="Preguntas frecuentes" faqs={faqsToShow} schemaEnabled />

      {/* ═══ 10. CTA FINAL ═══ */}
      <section className="relative overflow-hidden py-14 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-5" />
        <div className="relative mx-auto max-w-[800px] px-6 text-center md:px-20">
          <h2 className="text-3xl font-bold text-text-100 md:text-4xl">
            {home?.finalCtaTitle || "¿Listo para transformar más rápido?"}
          </h2>
          <p className="mt-4 text-lg text-text-70">
            {home?.finalCtaCopy ||
              "Diagnóstico gratuito en 30 minutos. Sin RFP, sin presentaciones largas. Solo cuéntanos tu reto."}
          </p>
          <div className="mt-6 flex flex-col items-center gap-2">
            {[
              "Respondemos en menos de 24 horas",
              "Sin compromiso — el diagnóstico es gratuito",
              "Hablamos español e inglés",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <Check size={16} className="text-staffing shrink-0" />
                <span className="text-sm text-text-70">{t}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="cta" size="lg">
              <Link href="/contacto">
                Agenda tu diagnóstico <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="https://wa.me/573103926621" target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} /> Hablar por WhatsApp
              </a>
            </Button>
          </div>
          <p className="mt-4 text-xs text-text-40">
            Respondemos en menos de 24 horas. Sin ventas agresivas.
          </p>
        </div>
      </section>
    </PageWrapper>
  );
}
