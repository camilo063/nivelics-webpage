import type { Metadata } from "next";
import Link from "next/link";
import { PageWrapper } from "@/components/layout";
import { IndustriasHubExtras } from "@/components/sections/industrias-hub-extras";
import { HeroEffect } from "@/components/ui/hero-effect";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getLocale } from "next-intl/server";
import { getAllIndustrias, getHomeContent } from "@/lib/cms/queries";
import { mapIndustria } from "@/lib/cms/mappers";
import type { Locale } from "@/lib/cms/types";
import { IndustriaIcon, SECTOR_COLORS, DEFAULT_SECTOR_COLOR } from "@/lib/utils/industria-icon";

const HUB_FALLBACK = {
  titleEs: "Tecnología que entiende tu industria",
  titleEn: "Technology that understands your industry",
  subtitleEs:
    "Cada sector tiene sus propias reglas, regulación y comportamientos de usuario. Traemos el expertise de dominio para que no gastes los primeros 3 meses explicándonos tu negocio.",
  subtitleEn:
    "Every sector has its own rules, regulations and user behaviors. We bring the domain expertise so you don't waste the first 3 months explaining your business.",
  statEs: "13 años entregando tecnología en los sectores más exigentes de LATAM y USA",
  statEn: "13 years delivering technology in the most demanding sectors in LATAM and USA",
};

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Industrias | IA, Cloud y Staffing por sector — Nivelics",
    description:
      "Experiencia comprobada en fintech, medios, salud, retail, logística y manufactura. 13 años entregando tecnología en los sectores más exigentes de LATAM y USA.",
    alternates: {
      canonical: "https://www.nivelics.com/industrias",
      languages: {
        es: "https://www.nivelics.com/industrias",
        en: "https://www.nivelics.com/en/industries",
        "x-default": "https://www.nivelics.com/industrias",
      },
    },
  };
}

export default async function IndustriasHubPage() {
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const [raw, home] = await Promise.all([getAllIndustrias(), getHomeContent()]);
  const industrias = raw.map((r, i) => ({
    ...mapIndustria(r as Record<string, unknown>, locale),
    _rawIcon: (r as Record<string, unknown>).icon as string | null,
    _sortKey: i,
  }));

  const hubTitle = isEn
    ? home?.industriasHubTitleEn || HUB_FALLBACK.titleEn
    : home?.industriasHubTitleEs || HUB_FALLBACK.titleEs;
  const hubSubtitle = isEn
    ? home?.industriasHubSubtitleEn || HUB_FALLBACK.subtitleEn
    : home?.industriasHubSubtitleEs || HUB_FALLBACK.subtitleEs;
  const hubStat = isEn
    ? home?.industriasHubStatEn || HUB_FALLBACK.statEn
    : home?.industriasHubStatEs || HUB_FALLBACK.statEs;

  const breadcrumb = getBreadcrumbSchema([
    { name: isEn ? "Home" : "Inicio", url: "/" },
    { name: isEn ? "Industries" : "Industrias", url: "/industrias" },
  ]);

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* Hero con grid perspectiva animado (Canvas) */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <HeroEffect kind="grid" opacity={0.85} />

        <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-20">
          <h1 className="max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">{hubTitle}</h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">{hubSubtitle}</p>
          {hubStat && <p className="mt-4 max-w-2xl text-sm font-medium text-primary">{hubStat}</p>}
        </div>
      </section>

      <section className="pb-14">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {industrias.map((ind) => {
              const colors = SECTOR_COLORS[ind.slug] ?? DEFAULT_SECTOR_COLOR;
              return (
                <Link
                  key={ind.slug}
                  href={`/industrias/${ind.slug}`}
                  className={`group flex flex-col gap-4 rounded-2xl border ${colors.border} bg-white/[0.02] p-6 transition-all duration-200 ease-out ${colors.hoverBorder} hover:-translate-y-1 hover:bg-white/[0.04]`}
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${colors.iconBg}`}
                  >
                    <IndustriaIcon name={ind._rawIcon} className={`h-5 w-5 ${colors.iconColor}`} />
                  </div>

                  <div>
                    <h2 className={`mb-1 text-base font-semibold ${colors.labelColor}`}>
                      {ind.name}
                    </h2>
                    <p className="line-clamp-3 text-sm leading-relaxed text-white/55">
                      {ind.heroSubtitle || ind.heroTitle}
                    </p>
                  </div>

                  <span
                    className={`mt-auto text-xs font-medium ${colors.iconColor} opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
                  >
                    {isEn ? "View sector →" : "Ver sector →"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <IndustriasHubExtras
        locale={locale}
        positioningTitle={
          isEn ? home?.industriasSectionTitleEn || "" : home?.industriasSectionTitleEs || ""
        }
        positioningCopy={
          isEn ? home?.industriasSectionSubtitleEn || "" : home?.industriasSectionSubtitleEs || ""
        }
        stats={
          Array.isArray(home?.industriasSectionMetrics) && home.industriasSectionMetrics.length > 0
            ? home.industriasSectionMetrics.map((m) => ({
                value: m.value,
                label: isEn ? m.labelEn : m.labelEs,
              }))
            : undefined
        }
      />
    </PageWrapper>
  );
}
