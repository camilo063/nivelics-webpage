"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { deriveFromPath } from "@/lib/utils/from-service";
import { waDisplay, waUrl } from "@/lib/utils/whatsapp";

// Textos propios de la página de contacto. Antes estaban solo en español y /en/contact
// salía así (etiquetas, opciones, validaciones y mensajes de envío).
const LABELS = {
  es: {
    nameMin: "El nombre debe tener al menos 2 caracteres",
    emailInvalid: "Email inválido",
    companyRequired: "La empresa es requerida",
    serviceRequired: "Selecciona un servicio",
    messageMin: "El mensaje debe tener al menos 10 caracteres",
    submitError: "Error al enviar el formulario",
    unexpectedError: "Error inesperado",
    title: "Hablemos",
    subtitle:
      "Cuéntanos sobre tu proyecto o desafío tecnológico y te contactamos en menos de 24 horas.",
    channels: "Canales de contacto",
    office: "Oficina",
    sent: "Mensaje enviado",
    sentBody: "Te contactaremos en menos de 24 horas.",
    formAria: "Formulario de contacto Nivelics",
    name: "Nombre completo",
    namePh: "Tu nombre",
    email: "Email corporativo",
    emailPh: "tu@empresa.com",
    company: "Empresa",
    companyPh: "Nombre de tu empresa",
    service: "Servicio de interés",
    selectService: "Seleccionar servicio",
    ia: "Inteligencia Artificial",
    development: "Desarrollo Digital",
    security: "Ciberseguridad / Ethical Hacking",
    other: "Otro",
    message: "Mensaje",
    messagePh: "Cuéntanos sobre tu proyecto o desafío...",
    submitAria: "Enviar solicitud de contacto",
    sending: "Enviando...",
    submit: "Solicitar diagnóstico gratuito",
  },
  en: {
    nameMin: "Name must be at least 2 characters",
    emailInvalid: "Invalid email",
    companyRequired: "Company is required",
    serviceRequired: "Select a service",
    messageMin: "Message must be at least 10 characters",
    submitError: "The form could not be sent",
    unexpectedError: "Unexpected error",
    title: "Let's talk",
    subtitle:
      "Tell us about your project or technology challenge and we'll get back to you within 24 hours.",
    channels: "Contact channels",
    office: "Office",
    sent: "Message sent",
    sentBody: "We'll get back to you within 24 hours.",
    formAria: "Nivelics contact form",
    name: "Full name",
    namePh: "Your name",
    email: "Work email",
    emailPh: "you@company.com",
    company: "Company",
    companyPh: "Your company name",
    service: "Service of interest",
    selectService: "Select a service",
    ia: "Artificial Intelligence",
    development: "Digital Development",
    security: "Cybersecurity / Ethical Hacking",
    other: "Other",
    message: "Message",
    messagePh: "Tell us about your project or challenge...",
    submitAria: "Send contact request",
    sending: "Sending...",
    submit: "Request a free assessment",
  },
} as const;

type Labels = (typeof LABELS)[keyof typeof LABELS];

function makeSchema(t: Labels) {
  return z.object({
    name: z.string().min(2, t.nameMin),
    email: z.string().email(t.emailInvalid),
    company: z.string().min(1, t.companyRequired),
    service: z.string().min(1, t.serviceRequired),
    message: z.string().min(10, t.messageMin),
  });
}

type ContactFormData = z.infer<ReturnType<typeof makeSchema>>;

interface ContactPageClientProps {
  seoTitle?: string;
  seoDescription?: string;
  pageTitle?: string;
  pageSubtitle?: string;
  /** `site_config.phone_whatsapp` — se administra en Admin → Configuración. */
  phoneWhatsapp?: string | null;
}

export function ContactPageClient({
  pageTitle,
  pageSubtitle,
  phoneWhatsapp,
}: ContactPageClientProps) {
  const t = LABELS[useLocale() === "en" ? "en" : "es"];
  const contactSchema = useMemo(() => makeSchema(t), [t]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [fromService, setFromService] = useState<string>("");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [formTs] = useState<number>(() => Date.now());

  // Resolve origin on mount: explicit ?from=... wins; fallback to
  // document.referrer pathname (same-origin only) so CTAs that haven't been
  // updated with an explicit param still contribute attribution.
  useEffect(() => {
    const fromParam = searchParams.get("from");
    if (fromParam) {
      setFromService(fromParam);
      return;
    }
    if (typeof document === "undefined" || !document.referrer) return;
    try {
      const ref = new URL(document.referrer);
      if (ref.origin === window.location.origin) {
        const derived = deriveFromPath(ref.pathname);
        if (derived) setFromService(derived);
      }
    } catch {
      // Invalid referrer URL — ignore, fromService stays empty.
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          referrerUrl: typeof window !== "undefined" ? window.location.href : undefined,
          fromService: fromService || undefined,
          website: honeypotRef.current?.value ?? "",
          _ts: formTs,
        }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? t.submitError);
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.unexpectedError);
    }
  }

  return (
    <PageWrapper>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Info */}
            <div>
              <h1 className="text-4xl font-bold text-text-100 md:text-5xl">
                {pageTitle || t.title}
              </h1>
              <p className="mt-4 text-lg text-text-70">{pageSubtitle || t.subtitle}</p>

              <h2 className="mt-12 text-2xl font-bold text-text-100">{t.channels}</h2>
              <div className="mt-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Mail size={20} className="text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-100">Email</h3>
                    <a
                      href={`mailto:${SITE.email}`}
                      className="text-sm text-text-70 hover:text-primary"
                    >
                      {SITE.email}
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
                      href={waUrl(phoneWhatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-text-70 hover:text-primary"
                    >
                      {waDisplay(phoneWhatsapp)}
                    </a>
                  </div>
                </div>

                {SITE.locations.map((loc) => (
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

            {/* Form */}
            <div className="glass rounded-xl p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Send size={32} className="text-primary" aria-hidden="true" />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-text-100">{t.sent}</h2>
                  <p className="mt-2 text-text-70">{t.sentBody}</p>
                </div>
              ) : (
                <form
                  id="contact-form"
                  data-purpose="lead-capture"
                  aria-label={t.formAria}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      top: "auto",
                      width: 1,
                      height: 1,
                      overflow: "hidden",
                      opacity: 0,
                    }}
                  >
                    <label>
                      Website
                      <input
                        ref={honeypotRef}
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        defaultValue=""
                      />
                    </label>
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-100">
                      {t.name}
                    </label>
                    <input
                      id="name"
                      autoComplete="name"
                      data-field="contact-name"
                      {...register("name")}
                      className="mt-1 w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder={t.namePh}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-400" role="alert">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-100">
                      {t.email}
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      data-field="contact-email"
                      {...register("email")}
                      className="mt-1 w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder={t.emailPh}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-400" role="alert">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-text-100">
                      {t.company}
                    </label>
                    <input
                      id="company"
                      autoComplete="organization"
                      data-field="contact-company"
                      {...register("company")}
                      className="mt-1 w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder={t.companyPh}
                    />
                    {errors.company && (
                      <p className="mt-1 text-xs text-red-400" role="alert">
                        {errors.company.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-text-100">
                      {t.service}
                    </label>
                    <select
                      id="service"
                      data-field="service-interest"
                      {...register("service")}
                      className="mt-1 w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="">{t.selectService}</option>
                      <option value="ia">{t.ia}</option>
                      <option value="cloud">Cloud / FinOps</option>
                      <option value="staffing">Staff Augmentation</option>
                      <option value="desarrollo">{t.development}</option>
                      <option value="ciberseguridad">{t.security}</option>
                      <option value="otro">{t.other}</option>
                    </select>
                    {errors.service && (
                      <p className="mt-1 text-xs text-red-400" role="alert">
                        {errors.service.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-text-100">
                      {t.message}
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      data-field="contact-message"
                      {...register("message")}
                      className="mt-1 w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                      placeholder={t.messagePh}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-400" role="alert">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {error && (
                    <p
                      className="rounded-lg border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-400"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    variant="cta"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                    aria-label={t.submitAria}
                  >
                    {isSubmitting ? t.sending : t.submit}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
