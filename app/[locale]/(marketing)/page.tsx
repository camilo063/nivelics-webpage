import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle, Check, ChevronRight } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { GeoIcon, type IconColor } from "@/lib/icons/geometric";
import { MetricsBar } from "@/components/sections/metrics-bar";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { getOrganizationSchema } from "@/lib/schema/organization";
import { getWebSiteSchema } from "@/lib/schema/website";
import { getFAQSchema } from "@/lib/schema/faq";
import { AmericaMapWrapper } from "@/components/sections/america-map-wrapper";
import { ProductosHomeStrip } from "@/components/sections/home/ProductosHomeStrip";
import { getAllProductosHub, mapProductoCard } from "@/lib/cms/productos";
import { ClientLogosMarquee } from "@/components/sections/client-logos-marquee";
import { ProcessSteps } from "@/components/sections/process-steps";
import { HeroGraph } from "@/components/ui/hero-graph";
import { Reveal } from "@/components/effects/reveal";
import { TiltCard } from "@/components/effects/tilt-card";
import { ParallaxLayer } from "@/components/effects/parallax-layer";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getAllUiLabels } from "@/lib/cms/ui-labels";
import {
  getHomeContent,
  getAllCasosExito,
  getHubServicios,
  getAllIndustrias,
  mapHomeContent,
  mapServicio,
  mapCasoExito,
  mapIndustria,
  uiLabel,
} from "@/lib/cms";
import type { Locale } from "@/lib/cms";

export const revalidate = 3600;

// ─── Helper utilities ──────────────────────────────────

function hexToIconColor(hex: string | null | undefined): IconColor {
  if (!hex) return "cyan";
  const h = hex.toLowerCase();
  if (h.includes("d4ff") || h.includes("06b6d4") || h.includes("3b82f6")) return "cyan";
  if (h.includes("8b5cf6") || h.includes("a78bfa")) return "violet";
  if (h.includes("10b981") || h.includes("4ade80")) return "green";
  if (h.includes("fbbf24") || h.includes("f59e0b")) return "amber";
  if (h.includes("ef4444") || h.includes("f87171")) return "red";
  return "cyan";
}

const ACCENT_COLORS: Record<string, string> = {
  ia: "#8B5CF6",
  cloud: "#3B82F6",
  staffing: "#10B981",
  dev: "#06B6D4",
  finops: "#F59E0B",
};

function accentColorToHex(accent: string | null | undefined): string {
  if (!accent) return "#06B6D4";
  return ACCENT_COLORS[accent] ?? "#06B6D4";
}

const SERVICE_ICON_MAP: Record<string, string> = {
  ia: "brain",
  cloud: "cloud",
  staffing: "users",
  dev: "code2",
  finops: "bar-chart2",
};

const COUNTRY_FLAGS: Record<string, string> = {
  Colombia: "🇨🇴",
  México: "🇲🇽",
  Mexico: "🇲🇽",
  USA: "🇺🇸",
  "United States": "🇺🇸",
  "El Salvador": "🇸🇻",
  Panamá: "🇵🇦",
  Ecuador: "🇪🇨",
  Perú: "🇵🇪",
  Argentina: "🇦🇷",
};

function countryFlag(country: string | null | undefined): string {
  if (!country) return "";
  return COUNTRY_FLAGS[country] ?? "🌎";
}

function badgeKey(slug: string | null | undefined): string | null {
  if (!slug) return null;
  if (slug.includes("inteligencia-artificial")) return "home.badge_ia";
  if (slug.includes("cloud")) return "home.badge_cloud";
  if (slug.includes("staff-augmentation")) return "home.badge_staffing";
  if (slug.includes("desarrollo-digital")) return "home.badge_dev";
  return null;
}

// ─── Metadata ──────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const [homeRaw, uiLabels] = await Promise.all([getHomeContent(), getAllUiLabels()]);
  const home = homeRaw ? mapHomeContent(homeRaw as Record<string, unknown>, locale) : null;

  const defaultTitle = uiLabel(uiLabels, "seo.home_default_title", locale);
  const defaultDescription = uiLabel(uiLabels, "seo.home_default_description", locale);

  const brandSuffix = uiLabel(uiLabels, "seo.home_brand_suffix", locale);

  return {
    title: home?.heroTitle ? `${home.heroTitle}${brandSuffix}` : defaultTitle,
    description: home?.heroSubtitle || defaultDescription,
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

// ─── Home page ─────────────────────────────────────────

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;

  // Fetch everything from DB in parallel
  const [homeRaw, productosRaw, casosRaw, hubsRaw, industriasRaw, uiLabels] = await Promise.all([
    getHomeContent(),
    getAllProductosHub(),
    getAllCasosExito(),
    getHubServicios(),
    getAllIndustrias(),
    getAllUiLabels(),
  ]);

  const home = homeRaw ? mapHomeContent(homeRaw as Record<string, unknown>, locale) : null;
  if (!home) {
    // Defensive: DB not configured — render minimal page instead of crashing
    return (
      <PageWrapper className="pt-0">
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-text-70">Content unavailable.</p>
        </div>
      </PageWrapper>
    );
  }

  const productos = productosRaw.map((p) => mapProductoCard(p, locale));
  const casosAll = casosRaw.map((c) => mapCasoExito(c as Record<string, unknown>, locale));
  const casos = casosAll.filter((c) => c.featured).length
    ? casosAll.filter((c) => c.featured).slice(0, 7)
    : casosAll.slice(0, 7);
  const hubs = hubsRaw
    .filter((s) => s.slugEs !== "servicios")
    .map((s) => mapServicio(s as Record<string, unknown>, locale));
  const industrias = industriasRaw
    .map((i) => mapIndustria(i as Record<string, unknown>, locale))
    .slice(0, 6);

  const metricsToShow = home.metrics.map((m) => ({
    value: m.value,
    label: m.unit,
    sublabel: m.label,
  }));

  const orgSchema = getOrganizationSchema();
  const webSiteSchema = getWebSiteSchema();
  const faqSchema = getFAQSchema(
    home.faqs.map((f) => ({ question: f.question, answer: f.answer })),
  );

  // UI strings from the `ui_labels` table (editable from /admin/ui-labels).
  const uiViewAll = uiLabel(uiLabels, "ui.view", locale);
  const uiViewAllCases = home.casesSectionCta || uiLabel(uiLabels, "ui.see_all_cases", locale);

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
        <ParallaxLayer
          speed={0.25}
          className="absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-primary/5 blur-[100px]"
        />
        <div className="relative z-10 mx-auto max-w-[1280px] px-6 text-center md:px-20">
          {home.heroBadge ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              {home.heroBadge}
            </span>
          ) : null}
          <h1 className="mt-6 text-4xl font-bold text-text-100 md:text-6xl">{home.heroTitle}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-text-70">{home.heroSubtitle}</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {home.heroCtaPrimary ? (
              <Button asChild variant="cta" size="lg">
                <Link href={home.heroCtaPrimaryUrl || "/contacto"}>
                  {home.heroCtaPrimary} <ArrowRight size={18} />
                </Link>
              </Button>
            ) : null}
            {home.heroCtaSecondary ? (
              <Button asChild variant="outline" size="lg">
                <a href={home.heroCtaSecondaryUrl || "#"} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={18} /> {home.heroCtaSecondary}
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      {/* ═══ 1.5 LOGO BAR CLIENTES ═══ */}
      <ClientLogosMarquee title={home.trustBarTitle} />

      {/* ═══ 2. MARCO I+C+S ═══ */}
      {hubs.length > 0 ? (
        <section
          className="py-10 md:py-14"
          data-section="servicios-principales"
          aria-label={home.servicesSectionTitle}
        >
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <Reveal>
              <h2 className="text-3xl font-bold text-text-100 md:text-4xl">
                {home.servicesSectionTitle}
              </h2>
              {home.pillarsSubtitle ? (
                <p className="mt-3 max-w-2xl text-text-70">{home.pillarsSubtitle}</p>
              ) : null}
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {hubs.map((s, i) => {
                const color = accentColorToHex(s.accentColor);
                const icon = s.icon || SERVICE_ICON_MAP[s.accentColor] || "layers";
                const metric = s.metrics[0]?.value
                  ? `${s.metrics[0].value} ${s.metrics[0].label}`
                  : "";
                return (
                  <Reveal key={s.slug} delay={i * 80}>
                    <TiltCard>
                      <Link
                        href={`/servicios/${s.slug}`}
                        className="group glass border-anim rounded-xl p-5 block h-full cursor-pointer"
                        style={{ borderLeft: `3px solid ${color}` }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <GeoIcon name={icon} size={18} color={hexToIconColor(color)} />
                          <span
                            className="text-[10px] font-semibold uppercase tracking-wider"
                            style={{ color }}
                          >
                            {(() => {
                              const k = badgeKey(s.slug);
                              return k ? uiLabel(uiLabels, k, locale) : "";
                            })()}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold text-text-100 group-hover:text-primary transition-colors">
                          {s.title}
                        </h3>
                        <p className="mt-1.5 text-[13px] text-text-70 leading-snug">{s.subtitle}</p>
                        {metric ? (
                          <p className="mt-3 font-mono text-sm font-bold text-primary">{metric}</p>
                        ) : null}
                      </Link>
                    </TiltCard>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* ═══ 3. MÉTRICAS ═══ */}
      {metricsToShow.length > 0 ? <MetricsBar metrics={metricsToShow} /> : null}

      {/* ═══ 4. CASOS DE ÉXITO ═══ */}
      {casos.length > 0 ? (
        <section
          className="bg-bg-surface py-10 md:py-14"
          data-section="casos-de-exito"
          aria-label={home.casesSectionTitle}
        >
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <Reveal>
              <h2 className="text-3xl font-bold text-text-100 md:text-4xl">
                {home.casesSectionTitle}
              </h2>
              {home.casesSectionSubtitle ? (
                <p className="mt-3 max-w-2xl text-text-70">{home.casesSectionSubtitle}</p>
              ) : null}
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {casos.map((c, i) => {
                const flag = countryFlag(c.clientCountry);
                const firstMetric = c.metrics[0];
                const serviceLabel = c.servicesUsed?.[0] ?? "";
                const resultLabel = c.title;
                return (
                  <Reveal key={c.slug} delay={(i % 3) * 70}>
                    <TiltCard>
                      <Link
                        href={`/casos-de-exito/${c.slug}`}
                        className="group flex h-full flex-col justify-between rounded-xl bg-[rgba(255,255,255,0.03)] border border-white/[0.08] p-5 min-h-[160px] transition-colors duration-200 ease-out hover:border-white/20 hover:bg-white/[0.06]"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-text-40">
                            <span>
                              {flag} {c.clientCountry}
                            </span>
                            <span>{c.clientSector}</span>
                          </div>
                          <h3 className="mt-2 text-lg font-bold text-white group-hover:text-primary transition-colors">
                            {c.clientName}
                          </h3>
                          <p className="mt-1 text-[13px] text-white/60 line-clamp-1">
                            {resultLabel}
                          </p>
                          {firstMetric ? (
                            <p className="mt-1 text-[13px] font-semibold text-primary">
                              {firstMetric.value} {firstMetric.label}
                            </p>
                          ) : null}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          {serviceLabel ? (
                            <span className="rounded-full border border-primary/20 bg-primary/[0.08] px-2.5 py-0.5 text-[10px] text-primary/70">
                              {serviceLabel}
                            </span>
                          ) : (
                            <span />
                          )}
                          <span className="text-xs text-white/30 group-hover:text-primary transition-colors">
                            {uiViewAll} <ArrowRight size={12} className="inline" />
                          </span>
                        </div>
                      </Link>
                    </TiltCard>
                  </Reveal>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              {home.casesSectionFooter ? (
                <p className="text-[13px] text-text-40 mb-3">{home.casesSectionFooter}</p>
              ) : null}
              <Link
                href="/casos-de-exito"
                className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
              >
                {uiViewAllCases} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* ═══ 5b. PRODUCTOS SAAS STRIP ═══ */}
      <ProductosHomeStrip
        productos={productos}
        locale={locale}
        title={home.productsStripTitle}
        cta={home.productsStripCta}
      />

      {/* ═══ 6. MAPA AMÉRICA ═══ */}
      {home.mapTitle ? (
        <section
          className="py-10 md:py-14"
          data-section="presencia-geografica"
          data-countries="Colombia,USA,México,El Salvador,Panamá,Ecuador,Perú,Argentina"
          aria-label={home.mapTitle}
        >
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div>
                <AmericaMapWrapper />
                <ul className="sr-only" aria-label={home.mapTitle}>
                  <li>Colombia</li>
                  <li>USA</li>
                  <li>México</li>
                  <li>El Salvador</li>
                  <li>Panamá</li>
                  <li>Ecuador</li>
                  <li>Perú</li>
                  <li>Argentina</li>
                </ul>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-text-100 md:text-4xl">{home.mapTitle}</h2>
                {home.mapSubtitle ? (
                  <p className="mt-3 text-[15px] text-white/50">{home.mapSubtitle}</p>
                ) : null}
                {home.mapMetrics.length > 0 ? (
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {home.mapMetrics.map((m, i) => (
                      <Reveal key={m.label} delay={i * 70} className="h-full">
                        <div className="h-full rounded-xl border border-primary/15 bg-white/[0.03] p-5 text-center">
                          <data
                            value={m.value}
                            className="font-mono text-4xl font-bold text-primary"
                          >
                            {m.value}
                          </data>
                          <p className="mt-1 text-xs uppercase tracking-wider text-white/50">
                            {m.label}
                          </p>
                          {m.sublabel ? (
                            <p className="text-[11px] text-white/35">{m.sublabel}</p>
                          ) : null}
                        </div>
                      </Reveal>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ═══ 7. INDUSTRIAS ═══ */}
      {industrias.length > 0 ? (
        <section
          className="bg-bg-surface py-10 md:py-14"
          data-section="industrias"
          aria-label={home.industriasSectionTitle}
        >
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <Reveal>
              <h2 className="text-3xl font-bold text-text-100 md:text-4xl">
                {home.industriasSectionTitle}
              </h2>
              {home.industriasSectionSubtitle ? (
                <p className="mt-3 max-w-2xl text-text-70">{home.industriasSectionSubtitle}</p>
              ) : null}
            </Reveal>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {industrias.map((ind, i) => (
                <Reveal key={ind.slug} delay={(i % 3) * 60}>
                  <Link
                    href={`/industrias/${ind.slug}`}
                    className="flex h-full items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 transition-all duration-200 ease-out hover:-translate-y-1 hover:bg-white/[0.06] hover:border-white/15 group"
                  >
                    <span className="shrink-0">
                      <GeoIcon name={ind.icon || "trending-up"} size={18} color="amber" />
                    </span>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                        {ind.name}
                      </span>
                      {ind.heroSubtitle ? (
                        <p className="text-[12px] text-text-40 line-clamp-1">{ind.heroSubtitle}</p>
                      ) : null}
                    </div>
                    <ChevronRight
                      size={14}
                      className="shrink-0 text-text-40 group-hover:text-primary transition-colors"
                    />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ═══ 8. ¿POR QUÉ NIVELICS? ═══ */}
      {home.whyUsTitle && home.whyUsItems.length > 0 ? (
        <section
          className="py-10 md:py-14"
          data-section="diferenciadores"
          aria-label={home.whyUsTitle}
        >
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <Reveal>
              <h2 className="text-3xl font-bold text-text-100 md:text-4xl">{home.whyUsTitle}</h2>
              {home.whyUsSubtitle ? (
                <p className="mt-3 max-w-2xl text-text-70">{home.whyUsSubtitle}</p>
              ) : null}
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {home.whyUsItems.map((d, i) => (
                <Reveal key={d.title} delay={(i % 2) * 80}>
                  <TiltCard>
                    <div
                      className="h-full rounded-xl p-5 bg-white/[0.02]"
                      style={{ borderLeft: `3px solid ${d.color}` }}
                    >
                      <span className="mb-3 inline-block">
                        <GeoIcon name={d.icon} size={18} color={hexToIconColor(d.color)} />
                      </span>
                      <h3 className="text-sm font-semibold text-text-100">{d.title}</h3>
                      <p className="mt-1.5 text-[13px] text-text-70 leading-relaxed">{d.copy}</p>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ═══ 8.5 PROCESO EN 3 PASOS ═══ */}
      {home.processSteps.length > 0 ? (
        <ProcessSteps
          title={home.processSectionTitle}
          subtitle={home.processSectionSubtitle}
          steps={home.processSteps}
        />
      ) : null}

      {/* ═══ 9. FAQ ═══ */}
      {home.faqs.length > 0 ? (
        <FAQAccordion
          title={home.faqsTitle || uiLabel(uiLabels, "ui.faqs_title", locale)}
          faqs={home.faqs}
          schemaEnabled
        />
      ) : null}

      {/* ═══ 10. CTA FINAL ═══ */}
      {home.finalCtaTitle ? (
        <section className="relative overflow-hidden py-14 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-5" />
          <div className="relative mx-auto max-w-[800px] px-6 text-center md:px-20">
            <Reveal>
              <h2 className="text-3xl font-bold text-text-100 md:text-4xl">{home.finalCtaTitle}</h2>
              {home.finalCtaCopy ? (
                <p className="mt-4 text-lg text-text-70">{home.finalCtaCopy}</p>
              ) : null}
              {home.finalCtaBullets.length > 0 ? (
                <div className="mt-6 flex flex-col items-center gap-2">
                  {home.finalCtaBullets.map((t) => (
                    <div key={t} className="flex items-center gap-2">
                      <Check size={16} className="text-staffing shrink-0" />
                      <span className="text-sm text-text-70">{t}</span>
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                {home.finalCtaPrimary ? (
                  <Button asChild variant="cta" size="lg">
                    <Link href={home.finalCtaPrimaryUrl || "/contacto"}>
                      {home.finalCtaPrimary} <ArrowRight size={18} />
                    </Link>
                  </Button>
                ) : null}
                {home.finalCtaSecondary ? (
                  <Button asChild variant="outline" size="lg">
                    <a
                      href={home.finalCtaSecondaryUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle size={18} /> {home.finalCtaSecondary}
                    </a>
                  </Button>
                ) : null}
              </div>
              {home.finalCtaFinePrint ? (
                <p className="mt-4 text-xs text-text-40">{home.finalCtaFinePrint}</p>
              ) : null}
            </Reveal>
          </div>
        </section>
      ) : null}
    </PageWrapper>
  );
}
