import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { GeoIconBox } from "@/lib/icons/geometric";
import { CTABanner } from "@/components/shared";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getCertificacionesPublic, pickLocale } from "@/lib/cms";
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
    href: "/nosotros/certificaciones",
    title: isEn ? "Awards and Certifications" : "Reconocimientos y Certificaciones",
    description: isEn
      ? "Nivelics awards and certifications: Great Place to Work, ANDI member, US presence through Nivelics LLC."
      : "Reconocimientos y certificaciones de Nivelics: Great Place to Work, miembro ANDI, presencia USA a través de Nivelics LLC.",
  });
}

const LABELS = {
  es: {
    h1: "Reconocimientos y Certificaciones",
    intro:
      "Nuestro trabajo y cultura han sido reconocidos por organizaciones líderes. Estos respaldos validan nuestro compromiso con la excelencia, el talento y la expansión internacional.",
  },
  en: {
    h1: "Awards and Certifications",
    intro:
      "Our work and culture have been recognized by leading organizations. These endorsements validate our commitment to excellence, talent and international growth.",
  },
} as const;

// LEGACY FALLBACK (ES)
const CERTIFICATIONS_ES = [
  {
    icon: "award",
    title: "Great Place to Work Colombia 2022",
    description:
      "Nivelics fue certificada como Great Place to Work en Colombia en 2022, reconociendo nuestra cultura organizacional basada en la confianza, el respeto y el desarrollo profesional de nuestro equipo. Esta certificación refleja el compromiso con crear un entorno de trabajo donde el talento tech pueda crecer y entregar su mejor trabajo.",
  },
  {
    icon: "building2",
    title: "Miembro ANDI",
    description:
      "Somos miembros activos de la Asociación Nacional de Empresarios de Colombia (ANDI), la agremiación empresarial más importante del país. Esta membresía nos conecta con el ecosistema empresarial colombiano y nos permite participar en iniciativas de transformación digital a nivel nacional.",
  },
  {
    icon: "globe",
    title: "Nivelics LLC — Presencia USA",
    description:
      "A través de Nivelics LLC, nuestra entidad en Estados Unidos con sede en Miami, Florida, atendemos clientes en el mercado norteamericano. Esta presencia nos permite operar como nearshore partner para empresas de USA y Canadá, combinando la calidad del talento latinoamericano con la cercanía geográfica y cultural.",
  },
];

// LEGACY FALLBACK (EN) — espejo exacto de CERTIFICATIONS_ES.
const CERTIFICATIONS_EN = [
  {
    icon: "award",
    title: "Great Place to Work Colombia 2022",
    description:
      "Nivelics was certified as a Great Place to Work in Colombia in 2022, recognizing an organizational culture built on trust, respect and the professional growth of our team. The certification reflects our commitment to creating a workplace where tech talent can grow and do its best work.",
  },
  {
    icon: "building2",
    title: "ANDI Member",
    description:
      "We are active members of ANDI (Asociación Nacional de Empresarios de Colombia), the country's most important business association. This membership connects us with the Colombian business ecosystem and lets us take part in national digital transformation initiatives.",
  },
  {
    icon: "globe",
    title: "Nivelics LLC — US Presence",
    description:
      "Through Nivelics LLC, our United States entity based in Miami, Florida, we serve clients in the North American market. This presence lets us operate as a nearshore partner for companies in the USA and Canada, combining the quality of Latin American talent with geographic and cultural proximity.",
  },
];

export default async function CertificacionesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const dbCerts = await getCertificacionesPublic();

  // Map DB certificaciones to display format
  const dbMapped = dbCerts.length
    ? dbCerts.map((c) => {
        const data = c as Record<string, unknown>;
        const title = pickLocale(locale, data.nameEs as string, data.nameEn as string);
        const description = pickLocale(
          locale,
          data.descriptionEs as string,
          data.descriptionEn as string,
        );
        return { title, description };
      })
    : null;

  const isEn = locale === "en";
  const t = LABELS[isEn ? "en" : "es"];
  const fallbackCerts = isEn ? CERTIFICATIONS_EN : CERTIFICATIONS_ES;

  // Use DB data or fall back to the hardcoded list of the served language
  const useDbData = dbMapped && dbMapped.length > 0;

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h1 className="max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">{t.h1}</h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">{t.intro}</p>
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <div className="grid gap-8">
            {useDbData
              ? dbMapped.map((cert) => (
                  <div key={cert.title} className="glass glow-hover rounded-xl p-8 md:p-10">
                    <div className="flex items-start gap-6">
                      <div className="shrink-0">
                        <GeoIconBox name="hex-check" size={26} color="cyan" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-text-100">{cert.title}</h2>
                        <p className="mt-3 text-text-70 leading-relaxed">{cert.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              : fallbackCerts.map((cert) => {
                  return (
                    <div key={cert.title} className="glass glow-hover rounded-xl p-8 md:p-10">
                      <div className="flex items-start gap-6">
                        <div className="shrink-0">
                          <GeoIconBox name={cert.icon} size={26} color="cyan" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-text-100">{cert.title}</h2>
                          <p className="mt-3 text-text-70 leading-relaxed">{cert.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </section>

      <CTABanner />
    </PageWrapper>
  );
}
