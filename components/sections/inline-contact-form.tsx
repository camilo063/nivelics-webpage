"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deriveFromPath } from "@/lib/utils/from-service";
import { HoneypotFields } from "@/components/security/honeypot-fields";

// Textos propios del formulario. Antes estaban solo en español y el formulario salía así
// en todas las páginas /en que lo usan.
const LABELS = {
  es: {
    sent: "Mensaje enviado",
    sentBody: "Te contactaremos en menos de 24 horas.",
    name: "Nombre",
    namePh: "Tu nombre",
    company: "Empresa",
    companyPh: "Tu empresa",
    emailPh: "tu@empresa.com",
    service: "Servicio",
    select: "Seleccionar",
    ia: "Inteligencia Artificial",
    development: "Desarrollo Digital",
    security: "Ciberseguridad / Ethical Hacking",
    message: "Mensaje",
    messagePh: "Cuéntanos sobre tu proyecto...",
    minChars: "Mínimo 10 caracteres.",
    sending: "Enviando...",
    send: "Enviar mensaje",
    trust: "Respondemos en menos de 24 horas. Sin compromiso.",
    genericError: "Error al enviar el formulario",
    unexpected: "Error inesperado",
  },
  en: {
    sent: "Message sent",
    sentBody: "We will get back to you within 24 hours.",
    name: "Name",
    namePh: "Your name",
    company: "Company",
    companyPh: "Your company",
    emailPh: "you@company.com",
    service: "Service",
    select: "Select",
    ia: "Artificial Intelligence",
    development: "Digital Development",
    security: "Cybersecurity / Ethical Hacking",
    message: "Message",
    messagePh: "Tell us about your project...",
    minChars: "At least 10 characters.",
    sending: "Sending...",
    send: "Send message",
    trust: "We reply within 24 hours. No commitment.",
    genericError: "The form could not be sent",
    unexpected: "Unexpected error",
  },
};

interface InlineContactFormProps {
  title: string;
  subtitle: string;
  serviceDefault?: string;
  accentColor?: string;
}

export function InlineContactForm({
  title,
  subtitle,
  serviceDefault = "",
  accentColor = "#00D4FF",
}: InlineContactFormProps) {
  const t = LABELS[useLocale() === "en" ? "en" : "es"];
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formTs] = useState<number>(() => Date.now());

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const fromService =
        typeof window !== "undefined" ? deriveFromPath(window.location.pathname) : "";
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          service: data.service || serviceDefault,
          referrerUrl: typeof window !== "undefined" ? window.location.href : undefined,
          fromService: fromService || undefined,
          _ts: Number(data._ts) || formTs,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
          details?: Record<string, string[] | undefined>;
        };
        // La ruta devuelve `details` con el error de cada campo y aquí se tiraba,
        // así que un mensaje de 9 caracteres se reportaba como «Datos inválidos»
        // y no había forma de saber qué corregir.
        const porCampo = Object.values(body.details ?? {})
          .flatMap((msgs) => msgs ?? [])
          .join(" · ");
        throw new Error(porCampo || body.error || t.genericError);
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.unexpected);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[800px] px-6 md:px-20 text-center">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-primary/10">
            <Send size={28} className="text-primary" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-text-100">{t.sent}</h2>
          <p className="mt-2 text-text-70">{t.sentBody}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[800px] px-6 md:px-20">
        <h2 className="text-2xl font-bold text-text-100 md:text-3xl">{title}</h2>
        <p className="mt-2 text-text-70">{subtitle}</p>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
          <HoneypotFields />
          <div>
            <label htmlFor="inline-name" className="block text-sm font-medium text-text-100 mb-1">
              {t.name}
            </label>
            <input
              id="inline-name"
              name="name"
              required
              className="w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none"
              placeholder={t.namePh}
            />
          </div>
          <div>
            <label
              htmlFor="inline-company"
              className="block text-sm font-medium text-text-100 mb-1"
            >
              {t.company}
            </label>
            <input
              id="inline-company"
              name="company"
              required
              className="w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none"
              placeholder={t.companyPh}
            />
          </div>
          <div>
            <label htmlFor="inline-email" className="block text-sm font-medium text-text-100 mb-1">
              Email
            </label>
            <input
              id="inline-email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none"
              placeholder={t.emailPh}
            />
          </div>
          <div>
            <label
              htmlFor="inline-service"
              className="block text-sm font-medium text-text-100 mb-1"
            >
              {t.service}
            </label>
            <select
              id="inline-service"
              name="service"
              defaultValue={serviceDefault}
              className="w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 focus:border-primary focus:outline-none"
            >
              <option value="">{t.select}</option>
              <option value="ia">{t.ia}</option>
              <option value="cloud">Cloud / FinOps</option>
              <option value="staffing">Staff Augmentation</option>
              <option value="desarrollo">{t.development}</option>
              <option value="ciberseguridad">{t.security}</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="inline-message"
              className="block text-sm font-medium text-text-100 mb-1"
            >
              {t.message}
            </label>
            <textarea
              id="inline-message"
              name="message"
              rows={3}
              required
              minLength={10}
              className="w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none resize-none"
              placeholder={t.messagePh}
            />
            <p className="mt-1 text-xs text-text-40">{t.minChars}</p>
          </div>
          {error && (
            <div className="sm:col-span-2">
              <p
                className="rounded-lg border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-400"
                role="alert"
              >
                {error}
              </p>
            </div>
          )}
          <div className="sm:col-span-2">
            <Button
              type="submit"
              variant="cta"
              size="lg"
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? t.sending : t.send}
            </Button>
            <p className="mt-3 text-xs text-text-40">{t.trust}</p>
          </div>
        </form>
      </div>
    </section>
  );
}
