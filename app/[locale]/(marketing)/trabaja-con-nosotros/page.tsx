import type { Metadata } from "next";
import { Heart, Zap, Eye, MessageCircle } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { GeoIconBox } from "@/lib/icons/geometric";
import { CTABanner } from "@/components/shared";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { ApplyForm } from "./apply-form";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getPageGeneral, mapPageGeneral } from "@/lib/cms";
import type { Locale } from "@/lib/cms";

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
  const raw = await getPageGeneral("careers");
  const page = raw ? mapPageGeneral(raw as Record<string, unknown>, locale) : null;

  return buildPageMetadata({
    locale,
    href: "/trabaja-con-nosotros",
    title:
      page?.seoTitle ||
      (isEn ? "Work at Nivelics | Join the Team" : "Trabaja con Nivelics | Únete al Equipo"),
    description:
      page?.seoDescription ||
      (isEn
        ? "Join the Nivelics team. A direct, human and ambitious culture. Openings in development, cloud, AI and more."
        : "Únete al equipo de Nivelics. Cultura directa, humana y ambiciosa. Posiciones en desarrollo, cloud, IA y más."),
  });
}

// LEGACY FALLBACK
const CULTURE_VALUES = [
  {
    icon: "message-circle",
    title: "Directo",
    description:
      "Comunicación clara y sin rodeos. Decimos lo que pensamos con respeto y esperamos lo mismo de vuelta.",
  },
  {
    icon: "heart",
    title: "Humano",
    description:
      "Las personas primero. Entendemos que detrás de cada línea de código hay alguien con vida, metas y contexto.",
  },
  {
    icon: "zap",
    title: "Ambicioso",
    description:
      "Buscamos impacto real. No nos conformamos con cumplir: queremos superar expectativas y crecer juntos.",
  },
  {
    icon: "eye",
    title: "Honesto",
    description:
      "Transparencia en todo: desde el estado del proyecto hasta las oportunidades de crecimiento dentro del equipo.",
  },
];

export default async function TrabajaConNosotrosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
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
              const iconName = value.icon;
              return (
                <div key={value.title} className="glass glow-hover rounded-xl p-6">
                  <GeoIconBox name={iconName} size={20} color="cyan" />
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
