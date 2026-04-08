import type { Metadata } from "next";
import { Award, Building2, Globe } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner } from "@/components/shared";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
  title: "Reconocimientos y Certificaciones | Nivelics",
  description:
    "Reconocimientos y certificaciones de Nivelics: Great Place to Work, miembro ANDI, presencia USA a través de Nivelics LLC.",
  alternates: {
    canonical: "https://www.nivelics.com/nosotros/certificaciones",
    languages: {
      es: "https://www.nivelics.com/nosotros/certificaciones",
      en: "https://www.nivelics.com/en/about/certifications",
      "x-default": "https://www.nivelics.com/nosotros/certificaciones",
    },
  },
};

const CERTIFICATIONS = [
  {
    icon: Award,
    title: "Great Place to Work Colombia 2022",
    description:
      "Nivelics fue certificada como Great Place to Work en Colombia en 2022, reconociendo nuestra cultura organizacional basada en la confianza, el respeto y el desarrollo profesional de nuestro equipo. Esta certificación refleja el compromiso con crear un entorno de trabajo donde el talento tech pueda crecer y entregar su mejor trabajo.",
  },
  {
    icon: Building2,
    title: "Miembro ANDI",
    description:
      "Somos miembros activos de la Asociación Nacional de Empresarios de Colombia (ANDI), la agremiación empresarial más importante del país. Esta membresía nos conecta con el ecosistema empresarial colombiano y nos permite participar en iniciativas de transformación digital a nivel nacional.",
  },
  {
    icon: Globe,
    title: "Nivelics LLC — Presencia USA",
    description:
      "A través de Nivelics LLC, nuestra entidad en Estados Unidos con sede en Miami, Florida, atendemos clientes en el mercado norteamericano. Esta presencia nos permite operar como nearshore partner para empresas de USA y Canadá, combinando la calidad del talento latinoamericano con la cercanía geográfica y cultural.",
  },
];

export default function CertificacionesPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Nosotros", url: "/nosotros" },
    { name: "Certificaciones", url: "/nosotros/certificaciones" },
  ]);

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h1 className="max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
            Reconocimientos y Certificaciones
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Nuestro trabajo y cultura han sido reconocidos por organizaciones líderes. Estos
            respaldos validan nuestro compromiso con la excelencia, el talento y la expansión
            internacional.
          </p>
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <div className="grid gap-8">
            {CERTIFICATIONS.map((cert) => {
              const Icon = cert.icon;
              return (
                <div key={cert.title} className="glass glow-hover rounded-xl p-8 md:p-10">
                  <div className="flex items-start gap-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon size={28} className="text-primary" aria-hidden="true" />
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
