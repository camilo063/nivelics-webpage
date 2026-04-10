import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { ServicesGrid } from "@/components/sections";
import { CTABanner } from "@/components/shared";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getLocale } from "next-intl/server";
import { getHubServiciosData } from "@/lib/cms/get-servicio-data";
import type { Locale } from "@/lib/cms/types";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Servicios de Transformación Digital | IA · Cloud · Staffing",
  description:
    "Descubre nuestras soluciones de Inteligencia Artificial, Cloud, Staff Augmentation y Desarrollo Digital.",
  alternates: {
    canonical: "https://www.nivelics.com/servicios",
    languages: {
      es: "https://www.nivelics.com/servicios",
      en: "https://www.nivelics.com/en/services",
      "x-default": "https://www.nivelics.com/servicios",
    },
  },
};

export default async function ServiciosPage() {
  const locale = (await getLocale()) as Locale;
  // Pre-fetch hub services data for potential future use
  const _hubServicios = await getHubServiciosData(locale);
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "/servicios" },
  ]);

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h1 className="text-4xl font-bold text-text-100 md:text-5xl">Nuestros Servicios</h1>
          <p className="mt-4 max-w-2xl text-lg text-text-70">
            Marco estratégico I+C+S: combinamos Inteligencia Artificial, Cloud y Staffing Premium
            para impulsar tu transformación digital.
          </p>
        </div>
      </section>
      <ServicesGrid />
      <CTABanner />
    </PageWrapper>
  );
}
