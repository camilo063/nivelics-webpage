import type { Metadata } from "next";
import { MessageCircle, Mail, Clock, HelpCircle } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { GeoIconBox } from "@/lib/icons/geometric";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getFAQSchema } from "@/lib/schema/faq";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getPageGeneral, mapPageGeneral } from "@/lib/cms";
import { getSiteConfigPublic } from "@/lib/cms/queries";
import { waDisplay, waUrl } from "@/lib/utils/whatsapp";
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
  const raw = await getPageGeneral("support");
  const page = raw ? mapPageGeneral(raw as Record<string, unknown>, locale) : null;

  return {
    title: page?.seoTitle || "Soporte y Contacto Técnico | Nivelics",
    description:
      page?.seoDescription ||
      "Soporte técnico Nivelics. Contacto por WhatsApp y email. Horario de atención: Lunes a Viernes 8:00 - 18:00 (GMT-5).",
    alternates: {
      canonical: "https://www.nivelics.com/soporte",
      languages: {
        es: "https://www.nivelics.com/soporte",
        en: "https://www.nivelics.com/en/support",
        "x-default": "https://www.nivelics.com/soporte",
      },
    },
  };
}

// LEGACY FALLBACK
const FAQ_ITEMS = [
  {
    question: "¿Cuál es el tiempo de respuesta del soporte técnico?",
    answer:
      "Nuestro equipo responde solicitudes de soporte en un máximo de 4 horas hábiles. Para incidentes críticos, el tiempo de respuesta es inferior a 1 hora dentro del horario de atención.",
  },
  {
    question: "¿Cómo reporto un incidente o bug en producción?",
    answer:
      "Puedes reportar incidentes a través de WhatsApp al +57 310-3926621 o enviando un email a contacto@nivelics.com con el asunto 'Incidente - [Nombre del proyecto]'. Incluye una descripción del problema, pasos para reproducirlo y capturas de pantalla si es posible.",
  },
  {
    question: "¿Ofrecen soporte fuera del horario de atención?",
    answer:
      "El soporte estándar está disponible de lunes a viernes de 8:00 a 18:00 (GMT-5). Para clientes con contratos de soporte extendido, ofrecemos atención 24/7 para incidentes críticos. Consulta con tu Delivery Manager los detalles de tu plan.",
  },
];

// LEGACY FALLBACK
const buildChannels = (phoneWhatsapp?: string | null) => [
  {
    icon: "message-circle",
    title: "WhatsApp",
    description: "Respuesta rápida para consultas y soporte.",
    contact: waDisplay(phoneWhatsapp),
    href: waUrl(phoneWhatsapp),
    linkText: "Enviar mensaje",
  },
  {
    icon: "mail",
    title: "Email",
    description: "Para solicitudes formales y documentación.",
    contact: "contacto@nivelics.com",
    href: "mailto:contacto@nivelics.com",
    linkText: "Enviar email",
  },
];

export default async function SoportePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const raw = await getPageGeneral("support");
  const page = raw ? mapPageGeneral(raw as Record<string, unknown>, locale) : null;
  const config = await getSiteConfigPublic().catch(() => null);
  const channels = buildChannels(config?.phoneWhatsapp);

  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: page?.title || "Soporte", url: "/soporte" },
  ]);
  const faqSchema = getFAQSchema(FAQ_ITEMS);

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h1 className="max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
            {page?.title || "Soporte y Contacto Técnico"}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Estamos aquí para ayudarte. Nuestro equipo de soporte técnico atiende tus consultas,
            incidentes y solicitudes de forma ágil y profesional.
          </p>
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
                <h2 className="text-xl font-semibold text-text-100">Horario de atención</h2>
                <p className="mt-2 text-text-70">
                  Lunes a Viernes: <strong className="text-text-100">8:00 - 18:00</strong> (GMT-5,
                  hora Colombia)
                </p>
                <p className="mt-1 text-sm text-text-40">
                  Fuera de este horario, los mensajes serán atendidos al siguiente día hábil.
                </p>
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
            <h2 className="text-3xl font-bold text-text-100">Preguntas frecuentes</h2>
          </div>
          <div className="space-y-6">
            {FAQ_ITEMS.map((item) => (
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
