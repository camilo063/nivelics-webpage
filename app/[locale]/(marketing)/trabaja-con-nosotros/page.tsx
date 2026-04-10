import type { Metadata } from "next";
import { Heart, Zap, Eye, MessageCircle } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner } from "@/components/shared";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { ApplyForm } from "./apply-form";
import { getLocale } from "next-intl/server";
import { getPageGeneral, mapPageGeneral } from "@/lib/cms";
import type { Locale } from "@/lib/cms";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const raw = await getPageGeneral("careers");
  const page = raw ? mapPageGeneral(raw as Record<string, unknown>, locale) : null;

  return {
    title: page?.seoTitle || "Trabaja con Nivelics | Únete al Equipo",
    description:
      page?.seoDescription ||
      "Únete al equipo de Nivelics. Cultura directa, humana y ambiciosa. Posiciones en desarrollo, cloud, IA y más.",
    alternates: {
      canonical: "https://www.nivelics.com/trabaja-con-nosotros",
      languages: {
        es: "https://www.nivelics.com/trabaja-con-nosotros",
        en: "https://www.nivelics.com/en/careers",
        "x-default": "https://www.nivelics.com/trabaja-con-nosotros",
      },
    },
  };
}

// LEGACY FALLBACK
const CULTURE_VALUES = [
  {
    icon: MessageCircle,
    title: "Directo",
    description:
      "Comunicación clara y sin rodeos. Decimos lo que pensamos con respeto y esperamos lo mismo de vuelta.",
  },
  {
    icon: Heart,
    title: "Humano",
    description:
      "Las personas primero. Entendemos que detrás de cada línea de código hay alguien con vida, metas y contexto.",
  },
  {
    icon: Zap,
    title: "Ambicioso",
    description:
      "Buscamos impacto real. No nos conformamos con cumplir: queremos superar expectativas y crecer juntos.",
  },
  {
    icon: Eye,
    title: "Honesto",
    description:
      "Transparencia en todo: desde el estado del proyecto hasta las oportunidades de crecimiento dentro del equipo.",
  },
];

export default async function TrabajaConNosotrosPage() {
  const locale = (await getLocale()) as Locale;
  const raw = await getPageGeneral("careers");
  const page = raw ? mapPageGeneral(raw as Record<string, unknown>, locale) : null;

  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: page?.title || "Trabaja con Nosotros", url: "/trabaja-con-nosotros" },
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
            {page?.title || "Trabaja con Nivelics"}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Somos un equipo de ingenieros y estrategas apasionados por la tecnología y el impacto
            real en empresas B2B. Si buscas un lugar donde crecer profesionalmente, trabajar con
            tecnologías de punta y ser parte de proyectos que importan, este es tu lugar.
          </p>
        </div>
      </section>

      {/* Cultura */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Nuestra cultura</h2>
          <p className="mt-4 max-w-2xl text-text-70">
            Cuatro pilares que definen cómo trabajamos y cómo nos relacionamos.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CULTURE_VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="glass glow-hover rounded-xl p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon size={24} className="text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-100">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-70">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Posiciones Abiertas */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Posiciones abiertas</h2>
          <div className="mt-8 glass rounded-xl p-8">
            <p className="text-text-70 leading-relaxed">
              Estamos siempre en búsqueda de talento excepcional en desarrollo de software, cloud,
              inteligencia artificial, DevOps, QA y gestión de proyectos. Si no ves una posición
              específica publicada, no dejes que eso te detenga: envíanos tu perfil y te
              contactaremos cuando haya una oportunidad que se ajuste a tus habilidades.
            </p>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold text-text-100">Aplica aquí</h2>
            <p className="mt-4 text-text-70">
              Completa el formulario y revisaremos tu perfil. Te contactaremos si hay una
              oportunidad que se ajuste.
            </p>
            <div className="mt-8 glass rounded-xl p-8">
              <ApplyForm />
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
