import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import {
  HeroSection,
  ServicesGrid,
  MetricsSection,
  TestimonialsSection,
  ImpactSection,
  ClientLogosSection,
  IndustriesSection,
} from "@/components/sections";
import { CTABanner } from "@/components/shared";
import { getOrganizationSchema } from "@/lib/schema/organization";
import { getWebSiteSchema } from "@/lib/schema/website";
import { getFAQSchema, HOME_FAQ } from "@/lib/schema/faq";

export const metadata: Metadata = {
  title: "Transformación Digital IA · Cloud · Staffing | Nivelics Colombia",
  description:
    "Empresa colombiana de IA aplicada, Cloud (AWS/GCP) y Staff Augmentation premium para LATAM y USA. Más de 13 años, certificada Great Place to Work.",
  alternates: {
    canonical: "https://www.nivelics.com",
    languages: {
      es: "https://www.nivelics.com",
      en: "https://www.nivelics.com/en",
      "x-default": "https://www.nivelics.com",
    },
  },
};

export default function HomePage() {
  const orgSchema = getOrganizationSchema();
  const webSiteSchema = getWebSiteSchema();
  const faqSchema = getFAQSchema(HOME_FAQ);

  return (
    <PageWrapper className="pt-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HeroSection />
      <ImpactSection />
      <ClientLogosSection />
      <ServicesGrid />
      <IndustriesSection />
      <TestimonialsSection />
      <CTABanner />
    </PageWrapper>
  );
}
