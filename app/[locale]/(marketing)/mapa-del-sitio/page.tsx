// Mapa del sitio en HTML (/mapa-del-sitio · /en/sitemap).
// El XML lo leen los buscadores, pero esta versión la leen las personas y los agentes que
// navegan el sitio: una sola página con todas las rutas, enlazada desde el 404 y el footer.
import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { SitemapMap } from "@/components/sections/sitemap-map";
import { getSitemapSections } from "@/lib/seo/sitemap-sections";
import { getWebPageSchema } from "@/lib/schema/webpage";
import { JsonLd } from "@/components/shared/json-ld";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/lib/cms/types";

export const revalidate = 86400;

const COPY = {
  es: {
    seoTitle: "Mapa del sitio",
    seoDescription:
      "Todas las páginas de Nivelics en un solo lugar: servicios, industrias, productos, casos de éxito, blog y contacto.",
    h1: "Mapa del sitio",
    intro:
      "Todas las páginas públicas de Nivelics, agrupadas por sección. Si buscas algo puntual, también puedes escribirnos.",
  },
  en: {
    seoTitle: "Sitemap",
    seoDescription:
      "Every Nivelics page in one place: services, industries, products, success stories, blog and contact.",
    h1: "Sitemap",
    intro:
      "Every public Nivelics page, grouped by section. If you are looking for something specific, you can also write to us.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const copy = COPY[locale];
  return buildPageMetadata({
    locale,
    href: "/mapa-del-sitio",
    title: copy.seoTitle,
    description: copy.seoDescription,
  });
}

export default async function MapaDelSitioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const copy = COPY[locale];
  const sections = await getSitemapSections();

  // ItemList de todas las rutas: le da a un agente la estructura completa del sitio
  // en un solo documento, sin tener que rastrear enlace por enlace.
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: copy.h1,
    itemListElement: sections.flatMap((section, s) =>
      section.links.map((link, i) => ({
        "@type": "ListItem",
        position: s * 100 + i + 1,
        name: isEn ? link.labelEn : link.label,
        url: `https://www.nivelics.com${isEn ? link.hrefEn : link.href}`,
      })),
    ),
  };

  return (
    <PageWrapper webPage={false}>
      <JsonLd
        data={getWebPageSchema({
          url: "/mapa-del-sitio",
          locale,
          type: "CollectionPage",
          name: copy.h1,
          description: copy.seoDescription,
        })}
      />
      <JsonLd data={itemList} />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h1 className="text-4xl font-bold text-text-100 md:text-5xl">{copy.h1}</h1>
          <p className="mt-4 max-w-2xl text-lg text-text-70">{copy.intro}</p>
          <div className="mt-12">
            <SitemapMap sections={sections} locale={isEn ? "en" : "es"} />
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
