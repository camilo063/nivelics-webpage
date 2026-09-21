import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner } from "@/components/shared";
import { getPersonSchema, TEAM_MEMBERS } from "@/lib/schema/person";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getTeamMembers, mapTeamMember } from "@/lib/cms";
import type { Locale } from "@/lib/cms";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return buildPageMetadata({
    locale: isEn ? "en" : "es",
    href: "/nosotros/equipo",
    title: isEn ? "Leadership Team" : "Equipo Directivo",
    description: isEn
      ? "Meet the Nivelics leadership team: leaders with experience in B2B digital transformation."
      : "Conoce al equipo directivo de Nivelics: liderazgo con experiencia en transformación digital B2B.",
  });
}

const LABELS = {
  es: {
    heroTitle: "El equipo que hace posible la transformación",
    heroSubtitle:
      "Liderazgo con experiencia en transformación digital, desarrollo de productos y expansión de mercados B2B en Latinoamérica y Estados Unidos.",
    gridTitle: "Equipo directivo",
    ctaTitle: "¿Quieres conocer al equipo?",
    ctaDescription: "Agenda una reunión y conversemos sobre cómo podemos ayudarte.",
  },
  en: {
    heroTitle: "The team behind the transformation",
    heroSubtitle:
      "Leadership with experience in digital transformation, product development and B2B market expansion across Latin America and the United States.",
    gridTitle: "Leadership team",
    ctaTitle: "Want to meet the team?",
    ctaDescription: "Book a meeting and let's talk about how we can help you.",
  },
};

export default async function EquipoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const t = isEn ? LABELS.en : LABELS.es;
  const dbMembers = await getTeamMembers();
  const mappedMembers = dbMembers.length
    ? dbMembers.map((m) => mapTeamMember(m as Record<string, unknown>, locale))
    : null;

  // Use DB members or fall back to TEAM_MEMBERS from schema
  const membersToShow =
    mappedMembers && mappedMembers.length > 0
      ? mappedMembers.map((m) => ({ name: m.name, jobTitle: m.role, description: m.bio }))
      : TEAM_MEMBERS;

  const teamSchemas = membersToShow.map((m) => getPersonSchema(m));

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchemas) }}
      />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h1 className="max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">{t.heroTitle}</h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">{t.heroSubtitle}</p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          {/* H2 real: sin él la página saltaba de H1 a los H3 de cada perfil. */}
          <h2 className="text-3xl font-bold text-text-100">{t.gridTitle}</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {membersToShow.map((member) => (
              <div key={member.name} className="glass glow-hover rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-text-100">{member.name}</h3>
                    <p className="mt-1 text-sm font-medium text-primary">{member.jobTitle}</p>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <ExternalLink size={20} className="text-primary" aria-hidden="true" />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-text-70">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner title={t.ctaTitle} description={t.ctaDescription} />
    </PageWrapper>
  );
}
