import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getPageGeneral, mapPageGeneral } from "@/lib/cms";
import { getContactoSitio } from "@/lib/cms/contacto";
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
  const raw = await getPageGeneral("privacy");
  const page = raw ? mapPageGeneral(raw as Record<string, unknown>, locale) : null;

  return buildPageMetadata({
    locale,
    href: "/privacidad",
    title: page?.seoTitle || (isEn ? "Privacy Policy" : "Política de Privacidad"),
    description:
      page?.seoDescription ||
      (isEn
        ? "Nivelics SAS privacy policy. Information about the processing of personal data."
        : "Política de privacidad de Nivelics SAS. Información sobre el tratamiento de datos personales."),
  });
}

/**
 * Texto legal de respaldo (se usa cuando `pages_general` no trae contenido).
 * La versión EN es una traducción completa, no un resumen: conserva los nombres
 * propios de las normas colombianas con una glosa corta en inglés la primera vez.
 */
const POLICY = {
  es: {
    title: "Política de Privacidad",
    effective: "Fecha de vigencia: Abril 2026",
    intro:
      'En Nivelics SAS (en adelante "Nivelics"), con domicilio en Bogotá, Colombia, nos comprometemos a proteger la privacidad y los datos personales de nuestros usuarios, clientes y visitantes. Esta política describe cómo recopilamos, usamos, almacenamos y protegemos su información personal.',
    s1: {
      title: "1. Datos que recopilamos",
      lead: "Podemos recopilar los siguientes tipos de datos personales:",
      items: [
        {
          term: "Datos de identificación:",
          text: "nombre completo, email, número de teléfono, empresa y cargo.",
        },
        {
          term: "Datos de navegación:",
          text: "dirección IP, tipo de navegador, páginas visitadas, tiempo de permanencia y datos de cookies.",
        },
        {
          term: "Datos de formularios:",
          text: "información proporcionada voluntariamente a través de formularios de contacto, solicitudes de empleo o suscripciones.",
        },
        {
          term: "Datos profesionales:",
          text: "perfil de LinkedIn, experiencia laboral y rol de interés (en caso de aplicaciones laborales).",
        },
      ],
    },
    s2: {
      title: "2. Uso de la información",
      lead: "Utilizamos los datos recopilados para:",
      items: [
        "Responder a solicitudes de contacto y brindar soporte.",
        "Enviar información sobre nuestros servicios, novedades y contenido relevante (solo con consentimiento previo).",
        "Evaluar candidatos para posiciones laborales.",
        "Mejorar la experiencia de navegación en nuestro sitio web.",
        "Cumplir con obligaciones legales y regulatorias aplicables en Colombia.",
        "Realizar análisis estadísticos anónimos para mejorar nuestros servicios.",
      ],
    },
    s3: {
      title: "3. Cookies",
      lead: "Nuestro sitio web utiliza cookies para mejorar la experiencia del usuario. Las cookies son pequeños archivos de texto que se almacenan en su dispositivo. Utilizamos los siguientes tipos de cookies:",
      items: [
        {
          term: "Cookies esenciales:",
          text: "necesarias para el funcionamiento básico del sitio web.",
        },
        {
          term: "Cookies de análisis:",
          text: "nos ayudan a entender cómo los visitantes interactúan con el sitio (Google Analytics).",
        },
        {
          term: "Cookies de preferencias:",
          text: "recuerdan sus preferencias de idioma y tema.",
        },
      ],
      note: "Puede configurar su navegador para rechazar cookies o recibir una notificación cuando se envíe una cookie. Sin embargo, algunas funcionalidades del sitio pueden no estar disponibles si las cookies están deshabilitadas.",
    },
    s4: {
      title: "4. Derechos del usuario",
      lead: "De conformidad con la Ley 1581 de 2012 y el Decreto 1377 de 2013 de Colombia, usted tiene los siguientes derechos sobre sus datos personales:",
      items: [
        { term: "Acceso:", text: "conocer qué datos personales tenemos sobre usted." },
        {
          term: "Rectificación:",
          text: "solicitar la corrección de datos inexactos o incompletos.",
        },
        {
          term: "Supresión:",
          text: "solicitar la eliminación de sus datos cuando no sean necesarios para la finalidad para la cual fueron recopilados.",
        },
        {
          term: "Revocación:",
          text: "revocar el consentimiento otorgado para el tratamiento de sus datos.",
        },
      ],
      note: "Para ejercer cualquiera de estos derechos, puede contactarnos a través de los canales indicados en la sección de contacto.",
    },
    s5: {
      title: "5. Contacto",
      lead: "Si tiene preguntas sobre esta política de privacidad o desea ejercer sus derechos, puede contactarnos:",
      controllerTerm: "Responsable del tratamiento:",
      controllerValue: "Nivelics SAS",
      locationTerm: "Ubicación:",
      locationValue: "Bogotá, Colombia",
      emailTerm: "Email:",
      whatsappTerm: "WhatsApp:",
      note: "Esta política puede ser actualizada periódicamente. Cualquier cambio será publicado en esta página con la fecha de vigencia actualizada.",
    },
  },
  en: {
    title: "Privacy Policy",
    effective: "Effective date: April 2026",
    intro:
      'At Nivelics SAS (hereinafter "Nivelics"), domiciled in Bogotá, Colombia, we are committed to protecting the privacy and the personal data of our users, clients and visitors. This policy describes how we collect, use, store and protect your personal information.',
    s1: {
      title: "1. Data we collect",
      lead: "We may collect the following types of personal data:",
      items: [
        {
          term: "Identification data:",
          text: "full name, email, phone number, company and job title.",
        },
        {
          term: "Browsing data:",
          text: "IP address, browser type, pages visited, time spent on the site and cookie data.",
        },
        {
          term: "Form data:",
          text: "information provided voluntarily through contact forms, job applications or subscriptions.",
        },
        {
          term: "Professional data:",
          text: "LinkedIn profile, work experience and role of interest (in the case of job applications).",
        },
      ],
    },
    s2: {
      title: "2. Use of the information",
      lead: "We use the data we collect to:",
      items: [
        "Respond to contact requests and provide support.",
        "Send information about our services, news and relevant content (only with prior consent).",
        "Assess candidates for job openings.",
        "Improve the browsing experience on our website.",
        "Comply with the legal and regulatory obligations applicable in Colombia.",
        "Run anonymous statistical analysis to improve our services.",
      ],
    },
    s3: {
      title: "3. Cookies",
      lead: "Our website uses cookies to improve the user experience. Cookies are small text files stored on your device. We use the following types of cookies:",
      items: [
        {
          term: "Essential cookies:",
          text: "required for the basic operation of the website.",
        },
        {
          term: "Analytics cookies:",
          text: "they help us understand how visitors interact with the site (Google Analytics).",
        },
        {
          term: "Preference cookies:",
          text: "they remember your language and theme settings.",
        },
      ],
      note: "You can set your browser to reject cookies or to notify you when a cookie is sent. Some features of the site may not be available if cookies are disabled.",
    },
    s4: {
      title: "4. Rights of the user",
      // Los nombres de las normas se conservan en español, con glosa en inglés.
      lead: "Under Colombia's Ley 1581 de 2012 (Law 1581 of 2012, the personal data protection statute) and Decreto 1377 de 2013 (Decree 1377 of 2013, its implementing decree), you hold the following rights over your personal data:",
      items: [
        { term: "Access:", text: "to know which personal data we hold about you." },
        {
          term: "Rectification:",
          text: "to request the correction of inaccurate or incomplete data.",
        },
        {
          term: "Deletion:",
          text: "to request the erasure of your data when it is no longer necessary for the purpose for which it was collected.",
        },
        {
          term: "Revocation:",
          text: "to withdraw the consent granted for the processing of your data.",
        },
      ],
      note: "To exercise any of these rights, you can reach us through the channels listed in the contact section.",
    },
    s5: {
      title: "5. Contact",
      lead: "If you have questions about this privacy policy or wish to exercise your rights, you can contact us:",
      controllerTerm: "Data controller:",
      controllerValue: "Nivelics SAS",
      locationTerm: "Location:",
      locationValue: "Bogotá, Colombia",
      emailTerm: "Email:",
      whatsappTerm: "WhatsApp:",
      note: "This policy may be updated from time to time. Any change will be published on this page with an updated effective date.",
    },
  },
} as const;

export default async function PrivacidadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const raw = await getPageGeneral("privacy");
  const page = raw ? mapPageGeneral(raw as Record<string, unknown>, locale) : null;
  // Los datos del responsable del tratamiento salen de site_config (Admin →
  // Configuración): el correo estaba escrito a mano y era otro (contacto@) que el
  // que publica el resto del sitio.
  const contacto = await getContactoSitio();
  const t = POLICY[locale === "en" ? "en" : "es"];

  // If DB has HTML content, render it; otherwise fall back to hardcoded
  const dbContent = page?.content as string | null;

  return (
    <PageWrapper>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[800px] px-6 md:px-20">
          <h1 className="text-4xl font-bold text-text-100 md:text-5xl">{page?.title || t.title}</h1>
          <p className="mt-4 text-sm text-text-40">{t.effective}</p>

          {dbContent ? (
            <div
              className="mt-6 prose prose-invert max-w-none text-text-70 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: dbContent }}
            />
          ) : (
            <>
              {/* LEGACY FALLBACK — el texto vive en POLICY, una versión por idioma. */}
              <p className="mt-6 text-text-70 leading-relaxed">{t.intro}</p>

              <div className="mt-12 space-y-10">
                {/* Sección 1 */}
                <div>
                  <h2 className="text-2xl font-bold text-text-100">{t.s1.title}</h2>
                  <div className="mt-4 space-y-3 text-text-70 leading-relaxed">
                    <p>{t.s1.lead}</p>
                    <ul className="list-disc space-y-2 pl-6">
                      {t.s1.items.map((item) => (
                        <li key={item.term}>
                          <strong className="text-text-100">{item.term}</strong> {item.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sección 2 */}
                <div>
                  <h2 className="text-2xl font-bold text-text-100">{t.s2.title}</h2>
                  <div className="mt-4 space-y-3 text-text-70 leading-relaxed">
                    <p>{t.s2.lead}</p>
                    <ul className="list-disc space-y-2 pl-6">
                      {t.s2.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sección 3 */}
                <div>
                  <h2 className="text-2xl font-bold text-text-100">{t.s3.title}</h2>
                  <div className="mt-4 space-y-3 text-text-70 leading-relaxed">
                    <p>{t.s3.lead}</p>
                    <ul className="list-disc space-y-2 pl-6">
                      {t.s3.items.map((item) => (
                        <li key={item.term}>
                          <strong className="text-text-100">{item.term}</strong> {item.text}
                        </li>
                      ))}
                    </ul>
                    <p>{t.s3.note}</p>
                  </div>
                </div>

                {/* Sección 4 */}
                <div>
                  <h2 className="text-2xl font-bold text-text-100">{t.s4.title}</h2>
                  <div className="mt-4 space-y-3 text-text-70 leading-relaxed">
                    <p>{t.s4.lead}</p>
                    <ul className="list-disc space-y-2 pl-6">
                      {t.s4.items.map((item) => (
                        <li key={item.term}>
                          <strong className="text-text-100">{item.term}</strong> {item.text}
                        </li>
                      ))}
                    </ul>
                    <p>{t.s4.note}</p>
                  </div>
                </div>

                {/* Sección 5 */}
                <div>
                  <h2 className="text-2xl font-bold text-text-100">{t.s5.title}</h2>
                  <div className="mt-4 space-y-3 text-text-70 leading-relaxed">
                    <p>{t.s5.lead}</p>
                    <ul className="list-disc space-y-2 pl-6">
                      <li>
                        <strong className="text-text-100">{t.s5.controllerTerm}</strong>{" "}
                        {t.s5.controllerValue}
                      </li>
                      <li>
                        <strong className="text-text-100">{t.s5.locationTerm}</strong>{" "}
                        {t.s5.locationValue}
                      </li>
                      <li>
                        <strong className="text-text-100">{t.s5.emailTerm}</strong>{" "}
                        <a href={contacto.emailHref} className="text-primary hover:underline">
                          {contacto.email}
                        </a>
                      </li>
                      <li>
                        <strong className="text-text-100">{t.s5.whatsappTerm}</strong>{" "}
                        <a
                          href={contacto.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {contacto.whatsappDisplay}
                        </a>
                      </li>
                    </ul>
                    <p>{t.s5.note}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}
