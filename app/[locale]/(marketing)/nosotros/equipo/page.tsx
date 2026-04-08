import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner } from "@/components/shared";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getPersonSchema, TEAM_MEMBERS } from "@/lib/schema/person";

export const metadata: Metadata = {
  title: "Equipo Directivo | Nivelics",
  description:
    "Conoce al equipo directivo de Nivelics: liderazgo con experiencia en transformación digital B2B.",
  alternates: {
    canonical: "https://www.nivelics.com/nosotros/equipo",
    languages: {
      es: "https://www.nivelics.com/nosotros/equipo",
      en: "https://www.nivelics.com/en/about/team",
      "x-default": "https://www.nivelics.com/nosotros/equipo",
    },
  },
};

export default function EquipoPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Nosotros", url: "/nosotros" },
    { name: "Equipo", url: "/nosotros/equipo" },
  ]);
  const teamSchemas = TEAM_MEMBERS.map((m) => getPersonSchema(m));

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchemas) }}
      />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h1 className="max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
            El equipo que hace posible la transformación
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Liderazgo con experiencia en transformación digital, desarrollo de productos y expansión
            de mercados B2B en Latinoamérica y Estados Unidos.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_MEMBERS.map((member) => (
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

      <CTABanner
        title="¿Quieres conocer al equipo?"
        description="Agenda una reunión y conversemos sobre cómo podemos ayudarte."
      />
    </PageWrapper>
  );
}
