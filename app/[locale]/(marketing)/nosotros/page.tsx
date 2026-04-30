import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { GeoIconBox } from "@/lib/icons/geometric";
import { PageWrapper } from "@/components/layout";
import { MetricCard, CTABanner } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { METRICS, SITE } from "@/lib/constants";
import { getOrganizationSchema } from "@/lib/schema/organization";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getPersonSchema, TEAM_MEMBERS } from "@/lib/schema/person";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getTeamMembers, mapTeamMember } from "@/lib/cms";
import type { Locale } from "@/lib/cms";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Quiénes Somos | Nivelics — 13 años en transformación digital LATAM",
  description:
    "Conoce a Nivelics: empresa colombiana de transformación digital B2B fundada en 2012 con sede en Bogotá y Miami.",
  alternates: {
    canonical: "https://www.nivelics.com/nosotros",
    languages: {
      es: "https://www.nivelics.com/nosotros",
      en: "https://www.nivelics.com/en/about",
      "x-default": "https://www.nivelics.com/nosotros",
    },
  },
};

const VALUES = [
  {
    icon: "target",
    title: "Impacto Medible",
    description: "Cada proyecto tiene KPIs claros. Si no se puede medir, no se puede mejorar.",
  },
  {
    icon: "heart",
    title: "Partnerships, no Proveedores",
    description: "Nos involucramos en el resultado de negocio, no solo en la entrega técnica.",
  },
  {
    icon: "calendar",
    title: "Compromiso con la Entrega",
    description: "Deadlines son sagrados. Planeamos con buffer y comunicamos con transparencia.",
  },
];

export default async function NosotrosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const dbMembers = await getTeamMembers();
  const mappedMembers = dbMembers.length
    ? dbMembers.map((m) => mapTeamMember(m as Record<string, unknown>, locale))
    : null;

  // Use DB members or fall back to TEAM_MEMBERS
  const membersToShow =
    mappedMembers && mappedMembers.length > 0
      ? mappedMembers.map((m) => ({ name: m.name, jobTitle: m.role, description: m.bio }))
      : TEAM_MEMBERS;

  const orgSchema = getOrganizationSchema();
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Nosotros", url: "/nosotros" },
  ]);
  const teamSchemas = membersToShow.map((m) => getPersonSchema(m));

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
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
            Desde {SITE.founded}, impulsando la{" "}
            <span className="text-primary">transformación digital</span> de empresas B2B
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Nivelics nació en Bogotá con la misión de cerrar la brecha tecnológica entre
            Latinoamérica y los mercados más competitivos del mundo. Hoy operamos desde Colombia y
            Miami, sirviendo clientes en toda la región.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {SITE.locations.map((loc) => (
              <div
                key={loc}
                className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-text-70"
              >
                <MapPin size={14} className="text-primary" aria-hidden="true" />
                {loc}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {METRICS.map((m) => (
              <MetricCard key={m.label} value={m.value} suffix={m.suffix} label={m.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Equipo Directivo</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {membersToShow.map((member) => (
              <div key={member.name} className="glass glow-hover rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-100">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-primary">{member.jobTitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-text-70">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Nuestros Valores</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="glass glow-hover rounded-xl p-6">
                <div className="mb-4">
                  <GeoIconBox name={v.icon} size={22} color="cyan" />
                </div>
                <h3 className="text-lg font-semibold text-text-100">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-70">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subpages */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Conoce más sobre Nivelics</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Historia", href: "/nosotros/historia", desc: "Timeline 2012–2026" },
              { label: "Equipo Directivo", href: "/nosotros/equipo", desc: "Nuestros líderes" },
              {
                label: "Metodología",
                href: "/nosotros/metodologia",
                desc: "Framework ágil Nivelics",
              },
              {
                label: "Certificaciones",
                href: "/nosotros/certificaciones",
                desc: "GPTW y reconocimientos",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="glass glow-hover rounded-xl p-6 block group"
              >
                <h3 className="font-semibold text-text-100 group-hover:text-primary transition-colors">
                  {item.label}
                </h3>
                <p className="mt-1 text-sm text-text-70">{item.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Ver más <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </PageWrapper>
  );
}
