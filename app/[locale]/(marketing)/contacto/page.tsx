import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getPageGeneral, mapPageGeneral } from "@/lib/cms";
import { getContactoSitio } from "@/lib/cms/contacto";
import type { Locale } from "@/lib/cms";
import { JsonLd } from "@/components/shared/json-ld";
import { getLocalBusinessSchema } from "@/lib/schema/local-business";
import { PageWrapper } from "@/components/layout";
import { Mail, MapPin, Phone } from "lucide-react";
import { getWebPageSchema } from "@/lib/schema/webpage";
import { contactLabels } from "./labels";
import { ContactForm } from "./contact-page-client";

export const revalidate = 86400;

const CONTACTO_ES = "https://www.nivelics.com/contacto";
const CONTACTO_EN = "https://www.nivelics.com/en/contact";
const DEFAULT_OG_IMAGE = "https://www.nivelics.com/og/nivelics-home.jpg";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const raw = await getPageGeneral("contact");
  const page = raw ? mapPageGeneral(raw as Record<string, unknown>, locale) : null;

  // Canonical points to the current locale's URL (not always ES) so Google
  // treats `/contacto?from=cloud/finops` and `/contacto` as the same page
  // without collapsing EN and ES into a single entry.
  const canonical = locale === "en" ? CONTACTO_EN : CONTACTO_ES;

  const isEn = locale === "en";
  const title = page?.seoTitle || (isEn ? "Contact" : "Contacto");
  const description =
    page?.seoDescription ||
    (isEn
      ? "Tell us about your project or technology challenge and we'll get back to you within 24 hours."
      : "Cuéntanos sobre tu proyecto o desafío tecnológico y te contactamos en menos de 24 horas.");

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: CONTACTO_ES,
        en: CONTACTO_EN,
        "x-default": CONTACTO_ES,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: locale === "en" ? "en_US" : "es_CO",
      alternateLocale: locale === "en" ? ["es_CO"] : ["en_US"],
      siteName: "Nivelics",
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function ContactoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const raw = await getPageGeneral("contact");
  const page = raw ? mapPageGeneral(raw as Record<string, unknown>, locale) : null;
  // Correo, WhatsApp y sedes: site_config (Admin → Configuración). Los mismos
  // valores alimentan el LocalBusiness de abajo, así que no pueden contradecirse.
  const contacto = await getContactoSitio();

  const t = contactLabels(locale);

  return (
    // La WebPage de esta ruta se emite como ContactPage (mismo @id): no hay dos.
    <PageWrapper webPage={false}>
      <JsonLd data={getLocalBusinessSchema(locale, contacto)} />
      <JsonLd
        data={getWebPageSchema({
          url: "/contacto",
          locale,
          type: "ContactPage",
          name: page?.title || t.title,
          description: page?.seoDescription || t.subtitle,
          aboutId: "https://www.nivelics.com/#localbusiness",
        })}
      />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Info — se rendea en el servidor. Antes toda la página vivía dentro de un
                <Suspense fallback={null}> por culpa de useSearchParams en el formulario, así
                que el HTML llegaba sin H1 ni texto: invisible para Google y para los
                rastreadores de IA, justo en la página de conversión. */}
            <div>
              <h1 className="text-4xl font-bold text-text-100 md:text-5xl">
                {page?.title || t.title}
              </h1>
              <p className="mt-4 text-lg text-text-70">{page?.seoDescription || t.subtitle}</p>

              <h2 className="mt-12 text-2xl font-bold text-text-100">{t.channels}</h2>
              <div className="mt-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Mail size={20} className="text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-100">Email</h3>
                    <a
                      href={contacto.emailHref}
                      className="text-sm text-text-70 hover:text-primary"
                    >
                      {contacto.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Phone size={20} className="text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-100">WhatsApp</h3>
                    <a
                      href={contacto.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-text-70 hover:text-primary"
                    >
                      {contacto.whatsappDisplay}
                    </a>
                  </div>
                </div>

                {[contacto.addressBogota, contacto.addressMiami].map((loc) => (
                  <div key={loc} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin size={20} className="text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-medium text-text-100">{t.office}</h3>
                      <p className="text-sm text-text-70">{loc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* El formulario lee ?from= con useSearchParams, así que va en cliente. */}
            <Suspense fallback={<div className="glass min-h-[520px] rounded-xl p-8" />}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
