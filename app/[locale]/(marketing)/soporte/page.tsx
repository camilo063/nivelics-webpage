import type { Metadata } from "next";
import { Clock, HelpCircle } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { GeoIconBox } from "@/lib/icons/geometric";
import { getFAQSchema } from "@/lib/schema/faq";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getPageGeneral, mapPageGeneral } from "@/lib/cms";
import { getContactoSitio } from "@/lib/cms/contacto";
import type { ContactoSitio } from "@/lib/cms/contacto-shared";
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
  const raw = await getPageGeneral("support");
  const page = raw ? mapPageGeneral(raw as Record<string, unknown>, locale) : null;

  return buildPageMetadata({
    locale,
    href: "/soporte",
    title:
      page?.seoTitle || (isEn ? "Support and Technical Contact" : "Soporte y Contacto Técnico"),
    description:
      page?.seoDescription ||
      (isEn
        ? "Nivelics technical support for B2B clients: report incidents over WhatsApp or email and get an answer within four business hours, Monday to Friday."
        : "Soporte técnico de Nivelics para clientes B2B: reporta incidentes por WhatsApp o email y recibe respuesta en máximo 4 horas hábiles, de lunes a viernes."),
  });
}

// LEGACY FALLBACK — el FAQPage de esta ruta se emite desde aquí, así que las preguntas
// también tienen que viajar al idioma de la página.
//
// El correo y el WhatsApp que aparecen dentro de las respuestas se interpolan desde
// site_config (Admin → Configuración): son los mismos que muestran las tarjetas de
// canales y los del JSON-LD, y antes estaban escritos a mano en cada idioma.
const faqItemsEs = (c: ContactoSitio) => [
  {
    question: "¿Cuál es el tiempo de respuesta del soporte técnico?",
    answer:
      "Nuestro equipo responde solicitudes de soporte en un máximo de 4 horas hábiles. Para incidentes críticos, el tiempo de respuesta es inferior a 1 hora dentro del horario de atención.",
  },
  {
    question: "¿Cómo reporto un incidente o bug en producción?",
    answer: `Puedes reportar incidentes a través de WhatsApp al ${c.whatsappDisplay} o enviando un email a ${c.email} con el asunto 'Incidente - [Nombre del proyecto]'. Incluye una descripción del problema, pasos para reproducirlo y capturas de pantalla si es posible.`,
  },
  {
    question: "¿Ofrecen soporte fuera del horario de atención?",
    answer:
      "El soporte estándar está disponible de lunes a viernes de 8:00 a 18:00 (GMT-5). Para clientes con contratos de soporte extendido, ofrecemos atención 24/7 para incidentes críticos. Consulta con tu Delivery Manager los detalles de tu plan.",
  },
];

const faqItemsEn = (c: ContactoSitio) => [
  {
    question: "What is the technical support response time?",
    answer:
      "Our team answers support requests within a maximum of 4 business hours. For critical incidents, response time is under 1 hour during business hours.",
  },
  {
    question: "How do I report an incident or a production bug?",
    answer: `You can report incidents over WhatsApp at ${c.whatsappDisplay} or by emailing ${c.email} with the subject 'Incident - [Project name]'. Include a description of the problem, the steps to reproduce it and screenshots if possible.`,
  },
  {
    question: "Do you offer support outside business hours?",
    answer:
      "Standard support is available Monday to Friday, 8:00 to 18:00 (GMT-5). For clients with an extended support contract, we offer 24/7 coverage for critical incidents. Check the details of your plan with your Delivery Manager.",
  },
];

// LEGACY FALLBACK
const buildChannels = (c: ContactoSitio, isEn: boolean) => [
  {
    icon: "message-circle",
    title: "WhatsApp",
    description: isEn
      ? "Fast answers for questions and support."
      : "Respuesta rápida para consultas y soporte.",
    contact: c.whatsappDisplay,
    href: c.whatsappUrl,
    linkText: isEn ? "Send a message" : "Enviar mensaje",
  },
  {
    icon: "mail",
    title: "Email",
    description: isEn
      ? "For formal requests and documentation."
      : "Para solicitudes formales y documentación.",
    contact: c.email,
    href: c.emailHref,
    linkText: isEn ? "Send an email" : "Enviar email",
  },
];

const LABELS = {
  es: {
    heroTitle: "Soporte y Contacto Técnico",
    heroSubtitle:
      "Estamos aquí para ayudarte. Nuestro equipo de soporte técnico atiende tus consultas, incidentes y solicitudes de forma ágil y profesional.",
    hoursTitle: "Horario de atención",
    hoursDays: "Lunes a Viernes:",
    hoursZone: "(GMT-5, hora Colombia)",
    hoursNote: "Fuera de este horario, los mensajes serán atendidos al siguiente día hábil.",
    faqTitle: "Preguntas frecuentes",
    breadcrumbHome: "Inicio",
    breadcrumbCurrent: "Soporte",
  },
  en: {
    heroTitle: "Support & Technical Contact",
    heroSubtitle:
      "We are here to help. Our technical support team handles your questions, incidents and requests quickly and professionally.",
    hoursTitle: "Business hours",
    hoursDays: "Monday to Friday:",
    hoursZone: "(GMT-5, Colombia time)",
    hoursNote: "Outside these hours, messages are answered on the next business day.",
    faqTitle: "Frequently asked questions",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Support",
  },
};

export default async function SoportePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const raw = await getPageGeneral("support");
  const page = raw ? mapPageGeneral(raw as Record<string, unknown>, locale) : null;
  // Correo y WhatsApp: site_config (Admin → Configuración), la misma fuente que usan
  // el pie, /contacto y los datos estructurados.
  const contacto = await getContactoSitio();
  const isEn = locale === "en";
  const t = isEn ? LABELS.en : LABELS.es;
  const channels = buildChannels(contacto, isEn);
  const faqItems = isEn ? faqItemsEn(contacto) : faqItemsEs(contacto);

  const faqSchema = getFAQSchema(faqItems);

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h1 className="max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
            {page?.title || t.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">{t.heroSubtitle}</p>
        </div>
      </section>

      {/* Canales de contacto */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <div className="grid gap-6 md:grid-cols-2">
            {channels.map((channel) => {
              const iconName = channel.icon;
              return (
                <div key={channel.title} className="glass glow-hover rounded-xl p-8">
                  <div className="flex items-start gap-4">
                    <GeoIconBox name={iconName} size={20} color="cyan" />
                    <div>
                      <h2 className="text-xl font-semibold text-text-100">{channel.title}</h2>
                      <p className="mt-1 text-sm text-text-70">{channel.description}</p>
                      <p className="mt-3 font-medium text-text-100">{channel.contact}</p>
                      <a
                        href={channel.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
                      >
                        {channel.linkText} &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Horario */}
          <div className="mt-8 glass rounded-xl p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Clock size={24} className="text-primary" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-100">{t.hoursTitle}</h2>
                <p className="mt-2 text-text-70">
                  {t.hoursDays} <strong className="text-text-100">8:00 - 18:00</strong>{" "}
                  {t.hoursZone}
                </p>
                <p className="mt-1 text-sm text-text-40">{t.hoursNote}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle size={28} className="text-primary" aria-hidden="true" />
            <h2 className="text-3xl font-bold text-text-100">{t.faqTitle}</h2>
          </div>
          <div className="space-y-6">
            {faqItems.map((item) => (
              <div key={item.question} className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-100">{item.question}</h3>
                <p className="mt-3 text-text-70 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
