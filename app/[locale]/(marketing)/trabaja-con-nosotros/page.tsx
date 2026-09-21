import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { GeoIconBox } from "@/lib/icons/geometric";
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
        ? "Join the Nivelics team: a direct, human and ambitious culture. Send us your CV and we will get in touch when an opening that fits your profile comes up."
        : "Únete al equipo de Nivelics: cultura directa, humana y ambiciosa. Envíanos tu hoja de vida y te contactamos cuando surja una oportunidad que encaje."),
  });
}

// LEGACY FALLBACK
const CULTURE_VALUES_ES = [
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

const CULTURE_VALUES_EN = [
  {
    icon: "message-circle",
    title: "Direct",
    description:
      "Clear communication, no beating around the bush. We say what we think, with respect, and we expect the same back.",
  },
  {
    icon: "heart",
    title: "Human",
    description:
      "People first. We understand that behind every line of code there is someone with a life, goals and context.",
  },
  {
    icon: "zap",
    title: "Ambitious",
    description:
      "We look for real impact. Meeting the brief is not enough: we want to exceed expectations and grow together.",
  },
  {
    icon: "eye",
    title: "Honest",
    description:
      "Transparency across the board, from the status of a project to the growth opportunities inside the team.",
  },
];

const LABELS = {
  es: {
    heroTitle: "Trabaja con Nivelics",
    heroSubtitle:
      "Somos un equipo de ingenieros y estrategas apasionados por la tecnología y el impacto real en empresas B2B. Si buscas un lugar donde crecer profesionalmente, trabajar con tecnologías de punta y ser parte de proyectos que importan, este es tu lugar.",
    cultureTitle: "Nuestra cultura",
    cultureSubtitle: "Cuatro pilares que definen cómo trabajamos y cómo nos relacionamos.",
    openTitle: "Posiciones abiertas",
    openBody:
      "Estamos siempre en búsqueda de talento excepcional en desarrollo de software, cloud, inteligencia artificial, DevOps, QA y gestión de proyectos. No publicamos un listado de vacantes: si tu perfil encaja con alguna de esas áreas, envíanos tu hoja de vida y te contactaremos cuando haya una oportunidad que se ajuste a tus habilidades.",
    applyTitle: "Aplica aquí",
    applySubtitle:
      "Completa el formulario y revisaremos tu perfil. Te contactaremos si hay una oportunidad que se ajuste.",
    breadcrumbHome: "Inicio",
    breadcrumbCurrent: "Trabaja con Nosotros",
  },
  en: {
    heroTitle: "Careers at Nivelics",
    heroSubtitle:
      "We are a team of engineers and strategists driven by technology and by real impact on B2B companies. If you are looking for a place to grow professionally, work with leading-edge technology and be part of projects that matter, this is it.",
    cultureTitle: "Our culture",
    cultureSubtitle: "Four pillars that define how we work and how we treat each other.",
    openTitle: "Open roles",
    openBody:
      "We are always looking for exceptional talent in software development, cloud, artificial intelligence, DevOps, QA and project management. We do not publish a list of vacancies: if your profile fits any of those areas, send us your CV and we will get in touch when an opportunity matching your skills comes up.",
    applyTitle: "Apply here",
    applySubtitle:
      "Fill in the form and we will review your profile. We will reach out if there is an opportunity that fits.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Careers",
  },
};

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
  const isEn = locale === "en";
  const t = isEn ? LABELS.en : LABELS.es;
  const cultureValues = isEn ? CULTURE_VALUES_EN : CULTURE_VALUES_ES;

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h1 className="max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
            {page?.title || t.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">{t.heroSubtitle}</p>
        </div>
      </section>

      {/* Cultura */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">{t.cultureTitle}</h2>
          <p className="mt-4 max-w-2xl text-text-70">{t.cultureSubtitle}</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cultureValues.map((value) => {
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
          <h2 className="text-3xl font-bold text-text-100">{t.openTitle}</h2>
          <div className="mt-8 glass rounded-xl p-8">
            <p className="text-text-70 leading-relaxed">{t.openBody}</p>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold text-text-100">{t.applyTitle}</h2>
            <p className="mt-4 text-text-70">{t.applySubtitle}</p>
            <div className="mt-8 glass rounded-xl p-8">
              <ApplyForm />
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
