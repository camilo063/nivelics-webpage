"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deriveFromPath } from "@/lib/utils/from-service";

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
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Error al enviar el formulario");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
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
          <h2 className="mt-6 text-2xl font-bold text-text-100">Mensaje enviado</h2>
          <p className="mt-2 text-text-70">Te contactaremos en menos de 24 horas.</p>
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
          <div>
            <label htmlFor="inline-name" className="block text-sm font-medium text-text-100 mb-1">
              Nombre
            </label>
            <input
              id="inline-name"
              name="name"
              required
              className="w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label
              htmlFor="inline-company"
              className="block text-sm font-medium text-text-100 mb-1"
            >
              Empresa
            </label>
            <input
              id="inline-company"
              name="company"
              required
              className="w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none"
              placeholder="Tu empresa"
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
              placeholder="tu@empresa.com"
            />
          </div>
          <div>
            <label
              htmlFor="inline-service"
              className="block text-sm font-medium text-text-100 mb-1"
            >
              Servicio
            </label>
            <select
              id="inline-service"
              name="service"
              defaultValue={serviceDefault}
              className="w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 focus:border-primary focus:outline-none"
            >
              <option value="">Seleccionar</option>
              <option value="ia">Inteligencia Artificial</option>
              <option value="cloud">Cloud / FinOps</option>
              <option value="staffing">Staff Augmentation</option>
              <option value="desarrollo">Desarrollo Digital</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="inline-message"
              className="block text-sm font-medium text-text-100 mb-1"
            >
              Mensaje
            </label>
            <textarea
              id="inline-message"
              name="message"
              rows={3}
              required
              className="w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none resize-none"
              placeholder="Cuéntanos sobre tu proyecto..."
            />
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
              {isSubmitting ? "Enviando..." : "Enviar mensaje"}
            </Button>
            <p className="mt-3 text-[12px] text-text-40">
              Respondemos en menos de 24 horas. Sin compromiso.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
